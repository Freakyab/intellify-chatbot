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

async function submitMessage(input: string) {
  "use server";
  const aiState = getMutableAIState();
  const messageStream = createStreamableUI(null);
  let tokenStream = 0;
  const userText = createStreamableUI(
    <BotMessage role="user" content={input} />
  );
  /*
    {
     chatId: "1",  userId: "1", 
     messages: [
       { role: "user", content: "Hello" }, 
        { 
        id: generateId(),
        role: "user",
        content: input,
      },}
     ]
  }
  */
  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: generateId(),
        role: "user",
        content: input,
      },
    ],
  });

  const history = aiState.get().messages.map((message: Message) => ({
    role: message.role,
    content: message.content,
  }));

  const result = await streamText({
    model: google("models/gemini-pro"),
    maxTokens: 10,
    temperature: 0.7,
    messages: [...history],
    onFinish({ usage }) {
      tokenStream = usage.totalTokens;
    },
  });
  

  let textContent = "";
  for await (const chunk of result.textStream) {
    textContent += chunk;
  }
  messageStream.update(
    <BotMessage role="assistant" content={textContent} token={tokenStream} />
  );
  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: generateId(),
        role: "assistant",
        content: textContent,
        token: tokenStream,
      },
    ],
  });

  messageStream.done();
  userText.done();

  return {
    display: messageStream.value,
    userText: userText.value,
  };
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
    const aiState = getAIState();

    if (aiState) {
      const uiState = getUIStateFromAIState(aiState);
      return uiState;
    }
    return;
  },
  onSetAIState: async ({ state }) => {
    "use server";
    try {
      const { chatId, userId, messages } = state;
      if (
        chatId === "null" ||
        chatId === "undefined" ||
        userId === "null" ||
        userId == "undefined"
      ) {
        console.error("chatId or userId is missing or invalid");
        return;
      } else {
        await setData({
          chatId,
          messages: messages.filter((message) => message !== null),
          userId,
        });
      }
    } catch (error) {
      console.error("Error in onSetAIState:", error);
    }
  },
});

const getUIStateFromAIState = (aiState: any) => {
  return aiState.messages?.map((item: Chat, index: number) => ({
    id: `${aiState.id}`,
    display:
      item.role !== "assistant" ? (
        <BotMessage role="user" content={item.content} />
      ) : (
        <BotMessage
          role="assistant"
          content={item.content}
          token={item.token}
        />
      ),
  }));
};
