import { BotMessage } from "@/components/botMessage";
import { google } from "@ai-sdk/google";
import { generateId, streamText } from "ai";
import {
  createAI,
  createStreamableUI,
  getAIState,
  getMutableAIState,
} from "ai/rsc";
import { Prisma } from "@prisma/client";
import { setData } from "@/app/action/chat";
import { Loader2 } from "lucide-react";

async function submitMessage(input: string) {
  "use server";
  try {
    const aiState = getMutableAIState();
    const messageStream = createStreamableUI(null);
    const tokenTotalStream = {
      tokenInputStream: 0,
      tokenOutputStream: 0,
      tokenStream: 0,
    };

    const userText = createStreamableUI(
      <BotMessage role="user" content={input} />
    );
    const spinnerStream = createStreamableUI(
      <Loader2 className="animate-spin" />
    );

    const userMessage = {
      id: generateId(),
      role: "user",
      content: input,
    };

    // Update AI state with the user's message
    const currentState = aiState.get();
    aiState.update({
      ...currentState,
      messages: [...currentState.messages, userMessage],
    });

    // Get the last 10 messages from aiState
    const historyMessageArray = aiState.get().messages || [];

    // Filter the history message to remove unwanted fields (e.g., id and token)
    const historyMessage = historyMessageArray.map(
      ({ id, token, ...rest }: { id: string; token: string }) => rest
    );

    console.log("historyMessageArray",historyMessageArray)
    console.log("historyMessage",historyMessage)

    // Fetch the summarized history from the API
    const historyRes = await fetch(`${process.env.NEXT_URL}/api/summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ history: historyMessage }),
    }).then((data) => data.json());
    console.log(historyRes)

    // Ensure historyRes is an array; if not, fallback to original messages
    // const messagesForAI = Array.isArray(historyRes) && historyRes.length > 0
    //   ? historyRes
    //   : historyMessageArray;

    // if (!Array.isArray(messagesForAI)) {
    //   throw new Error("messagesForAI is not an array");
    // }

    // Stream the AI response
    const result = await streamText({
      model: google("models/gemini-1.5-flash-latest"),
      temperature: 0.7,
      system: `
        You are a general-purpose chatbot which assists users in their queries.
        Also, you will consider the history of the conversation to provide better responses.`,
      messages: [...historyMessage], // Ensure this is always an array 
      onFinish({ usage }) {
        tokenTotalStream.tokenInputStream = usage.promptTokens;
        tokenTotalStream.tokenOutputStream = usage.completionTokens;
        tokenTotalStream.tokenStream = usage.totalTokens;
      },
    });

    let textContent = "";
    for await (const chunk of result.textStream) {
      textContent += chunk;
    }

    const assistantMessage = {
      id: generateId(),
      role: "assistant",
      content: textContent,
      token: tokenTotalStream,
    };

    // Update message stream and AI state with the assistant's message
    messageStream.update(
      <BotMessage
        role="assistant"
        lastMessage={true}
        content={textContent}
        token={tokenTotalStream.tokenStream}
      />
    );

    const currentState2 = aiState.get();
    aiState.update({
      ...currentState2,
      messages: [...currentState2.messages, assistantMessage],
    });

    // Finalize UI rendering
    messageStream.done();
    userText.done();
    spinnerStream.done();

    return {
      display: messageStream.value,
      userText: userText.value,
      spinner: spinnerStream.value,
    };
  } catch (error) {
    console.error("Error in submitMessage:", error);
    return {
      display: <div>Error processing your request</div>,
      userText: null,
      spinner: null,
    };
  }
}


export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  id?: string;
  name?: string;
  display?: {
    name: string;
    props: React.ReactNode;
  };
  token?: string;
};

export type AIState = {
  chatId: string;
  messages: Prisma.JsonValue[] | Prisma.InputJsonValue[];
  userId: string;
};

export type UIState = {
  id: string;
  display: React.ReactNode;
  spinner?: React.ReactNode;
  userText?: React.ReactNode;
}[];

export interface Chat extends Record<string, any> {
  id: string;
  chatId: string;
  created_at: Date;
  message: never[] | Message[] | Prisma.JsonValue[];
  userId: string;
}

export const AI = createAI<AIState, UIState>({
  initialUIState: [],
  initialAIState: {
    chatId: "",
    messages: [],
    userId: "",
  },
  actions: {
    submitMessage,
  },
  onGetUIState: async () => {
    "use server";
    try {
      const aiState = getAIState();
      if (aiState) {
        return getUIStateFromAIState(aiState);
      } else {
        throw new Error("AI state is undefined or null");
      }
    } catch (error) {
      console.error("Error in onGetUIState:", error);
      return [
        {
          id: "error",
          display: <div>Error retrieving AI state</div>,
        },
      ];
    }
  },
  onSetAIState: async ({ state }) => {
    "use server";
    try {
      const { chatId, userId, messages } = state;

      // Validate chatId and userId
      if (
        !chatId ||
        chatId === "null" ||
        chatId === "undefined" ||
        !userId ||
        userId === "null" ||
        userId === "undefined"
      ) {
        console.error("chatId or userId is missing or invalid");
        return;
      }

      const filteredMessages = messages.filter((message) => message !== null);

      // Ensure there's at least one valid message
      if (filteredMessages.length === 0) {
        console.error("No valid messages to update");
        return;
      }

      // Save data
      await setData({
        chatId,
        messages: filteredMessages,
        userId,
      });
    } catch (error) {
      console.error("Error in onSetAIState:", error);
    }
  },
});

const getUIStateFromAIState = (aiState: any) => {
  if (!aiState || !aiState.messages) {
    return [{ id: "error", display: <div>Error retrieving AI state</div> }];
  }

  return aiState.messages.map((item: Chat, index: number) => ({
    id: `${aiState.id}`,
    display:
      item.role !== "assistant" ? (
        <BotMessage role="user" content={item.content} />
      ) : (
        <BotMessage
          lastMessage={index === aiState.messages.length - 1}
          role="assistant"
          content={item.content}
          token={item?.token?.tokenStream ?? 0} // Fallback if tokenStream is missing
        />
      ),
  }));
};
