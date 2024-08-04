"use server";

import { BotMessage } from "@/components/botMessage";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { createStreamableUI, getMutableAIState } from "ai/rsc";
import { Loader2 } from "lucide-react";
import { Message } from "postcss";

export async function submitMessage(input: string) {
  
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

