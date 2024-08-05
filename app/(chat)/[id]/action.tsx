// "use server";
import { BotMessage } from "@/components/botMessage";
// import { supabase } from "@/lib/supabase";
// import { saveData } from "@/lib/utils";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { createAI, createStreamableUI,  getMutableAIState } from "ai/rsc";
import { Loader2 } from "lucide-react";

async function setId(id: string, userId: string) {
  "use server";
  console.log(id, userId, ": id");
  const aiState = getMutableAIState();
  aiState.update({
    ...aiState.get(),
    chatId: id,
    userId: userId,
  });
  return;
}

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
  chat: JSON[];
  user_id: string;
}

export const AI = createAI<AIState, UIState>({
  initialUIState: [],
  initialAIState: {
    chatId: "",
    messages: [],
    userId: "",
  },

  onSetAIState: async ({ state }) => {
    "use server";
    try {
      const { chatId, userId, messages } = state;
      // const { data, error } = await supabase
      //   .from("chats")
      //   .select("chat")
      //   .eq("id", chatId)
      //   .eq("user_id", userId);
      // console.log(error, "first error");
      // if (!data || data.length == 0) {
      //   const { data: docs, error } = await supabase
      //     .from("chats")
      //     .insert([{ id: chatId, user_id: userId, chat: messages }]);
      //   if(docs) console.log(docs , "document");
      //   else if (error) {
      //     console.log(error, "error");
      //   }
      // }
      // await saveData(chatId, userId, messages);
    } catch (error) {
      console.log("Error in onSetAIState:", error);
    }
  },
  actions: {
    submitMessage,
    setId,
  },
});
