
'use server';
import { BotMessage } from "@/components/botMessage";
import { getSession } from "@/lib/getSession";
// import onGetUiState from "@/lib/chat/onGetUiState";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";

import { Loader2 } from "lucide-react";

async function submitMessage(input: string) {
  "use server";

  const aiState = getMutableAIState();
  const spinnerStream = createStreamableUI(<Loader2  className="animate-spin"/>);
  const messageStream = createStreamableUI(null);
  const userTest = createStreamableUI(
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
    maxTokens: 10,
    temperature: 0.7,
    messages: [...history],
  });

  let textContent = "";

  for await (const chunk of result.textStream) {
    textContent += chunk;

    messageStream.update(
     <BotMessage role="assistant" content={textContent} />
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
  userTest.done();
  return {
    id: aiState.get().chatId,
    spinner: spinnerStream.value,
    display: messageStream.value,
    userText: userTest.value,
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
  chatId: string[] | string ;
  messages: Message[] | null;
};

export type UIState = {
  id: string;
  display: React.ReactNode;
  spinner?: React.ReactNode;
  userText?: React.ReactNode;
}[];
export interface Chat extends Record<string, any> {
  id: string;
  title: string;
  createdAt: Date;
  userId: string;
  path: string;
  messages: Message[];
  sharePath?: string;
}

export const AI = createAI<AIState, UIState>({
  initialUIState: [],
  initialAIState: {
    chatId: new Date().toISOString(),
    messages: [],
  },
  // onSetAIState: async({state})=>{
  //   const session = getSession();
  // },
  actions: {
    submitMessage,
  },
});
