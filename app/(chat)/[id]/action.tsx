import { BotMessage } from "@/components/botMessage";
import { google } from "@ai-sdk/google";
import { supabaseClient } from "@/lib/supabase";
import { streamText } from "ai";
import {
  createAI,
  createStreamableUI,
  getAIState,
  getMutableAIState,
} from "ai/rsc";
import { Loader2 } from "lucide-react";

// async function setId(id: string, userId: string) {
//   "use server";
//   const aiState = getMutableAIState();


//   aiState.update({
//     ...aiState.get(),
//     chatId: id,
//     userId: userId,
//     messages: serverMessages,
//   });
//   console.log("AI messages:", aiState.get().messages);
// }

async function submitMessage(input: string) {
  "use server";
  const aiState = getMutableAIState();
  const spinnerStream = createStreamableUI(
    <Loader2 className="animate-spin" />
  );
  const messageStream = createStreamableUI(null);
  const tokenStream = createStreamableUI();
  const userText = createStreamableUI(
    <BotMessage role="user" content={input} />
  );

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: Date.now().toString(),
        role: "user",
        content: input,
      },
    ],
  });

  const history = aiState.get().messages.map((message: Message) => ({
    role: message.role,
    content: message.content,
  }));

  console.log("Message history:", history);

  const result = await streamText({
    model: google("models/gemini-pro"),
    maxTokens: 100,
    temperature: 0.7,
    messages: [...history],
    onFinish({ usage }) {
      tokenStream.update(usage.totalTokens);
    },
  });

  let textContent = "";

  for await (const chunk of result.textStream) {
    textContent += chunk;

    messageStream.update(
      <BotMessage
        role="assistant"
        content={textContent}
        token={tokenStream.value}
      />
    );

    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: textContent,
        },
      ],
    });
  }

  spinnerStream.done(null);
  messageStream.done();
  userText.done();
  tokenStream.done();

  return {
    id: aiState.get().chatId,
    spinner: spinnerStream.value,
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
  chatId: string[] | string;
  messages: Message[] | null;
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
  created_at: Date;
  chat: Message[];
  user_id: string;
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
    // setId,
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
      console.log("State:", state);
      // Validate chatId and userId
      if (!chatId || !userId || messages?.length === 0) {
        console.error("chatId or userId is missing or invalid");
        return;
      }

      const { data, error } = await supabaseClient
        .from("chats")
        .select("chat")
        .eq("id", chatId)
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching chat data:", error);
        return;
      }

      if (data?.length === 0) {
        const { error: insertError } = await supabaseClient
          .from("chats")
          .insert({ id: chatId, user_id: userId, chat: messages });

        if (insertError) {
          console.error("Error inserting new chat:", insertError);
        }
      } else {
        const { error: updateError } = await supabaseClient
          .from("chats")
          .update({ chat: messages })
          .eq("id", chatId)
          .eq("user_id", userId);

        if (updateError) {
          console.error("Error updating chat:", updateError);
        }
      }
    } catch (error) {
      console.error("Error in onSetAIState:", error);
    }
  },
});

const getUIStateFromAIState = (aiState: any) => {
  console.log("AI State:", aiState);
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
