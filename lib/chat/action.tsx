// @ts-nocheck

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  createStreamableValue,
} from "ai/rsc";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { streamText } from "ai";
import BotMessage from "@/components/botMessage";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
);

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  id?: string;
  name?: string;
  display?: {
    name: string;
    props: Record<string, any>;
  };
};

export type AIState = {
  chatId: string;
  interactions?: string[];
  messages: Message[];
};

export type UIState = {
  id: string;
  display: React.ReactNode;
  spinner?: React.ReactNode;
  attachments?: React.ReactNode;
}[];

export const sendMessage = async (content: string) => {
   'use server'
  const aiState = getMutableAIState();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: Date.now().toString(),
        role: "user",
        content: `${aiState.get().interactions.join("\n\n")}\n\n${content}`,
      },
    ],
  });

  const history = aiState.get().messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));

  //   const textStream = createStreamableValue("");
  const spinnerStream = createStreamableUI(<Loader2 />);
  const messageStream = createStreamableUI(null);
  const uiStream = createStreamableUI();

  (async () => {
    try {
      const result = await streamText({
        model: google("models/gemini-1.5-pro-latest"),
        temperature: 0,
        system: `\
        You are a chatbot which can answer questions and provide information on a variety of topics.
        You can also help users find information on the web, answer questions about the weather, and more.
        you can provide code snippets, links to resources, and more in markdown.`,
        messages: [...history],
      });

      let textContent = "";
      spinnerStream.done(null);

      for await (const delta of result.fullStream) {
        const { type } = delta;

        if (type === "text-delta") {
          const { textDelta } = delta;

          textContent += textDelta;
          messageStream.update(<BotMessage content={textContent} />);

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
      }

      uiStream.done();
      //   textStream.done();
      messageStream.done();
    } catch (e) {
      console.error(e);

      const error = new Error(
        "The AI got rate limited, please try again later."
      );
      uiStream.error(error);
      //   textStream.error(error);
      messageStream.error(error);
      aiState.done();
    }
  })();

  return {
    id: Date.now().toString(),

    display: <BotMessage content={content} />,
    spinner: <Loader2 />,
  };
};

export const AI = createAI<AIState, UIState>({
  actions: {
    sendMessage,
  },
  initialUIState: [],
  initialAIState: { chatId: Date.now(), interactions: [], messages: [] },
  unstable_onGetUIState: async() => {
    'use server';
    if (aiState) {
      const uiState = getUIStateFromAIState(aiState);
      return uiState;
    } else {
      return;
    }
  },
  unstable_onSetAIState: async ({ state }) => {
    'use server';

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) console.log(error);
    else if (session?.user.aud === "authenticated") {
      const userId = session?.user.id as string;
      const { chatId, messages } = state;
      const { data: saveData, error: saveError } = await supabase.from("chats");
      update({ chat: updatedChatData }).eq("id", id).eq("user_id", user.id);
    } else {
      return;
    }
  },
});

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter((message) => message.role === "user")
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display: 
        message.content,
    }));
};
