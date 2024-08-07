import React from "react";
import { AI } from "./action";
import Chat from "@/components/chat";
import { getData } from "@/app/action/chat";
export interface ChatPageProps {
  params: { id: string };
  searchParams: { user: string | undefined | null };
}
async function Page({ params, searchParams }: ChatPageProps) {
  try {
    const { messages, error } = await getData({
      chatId: params.id,
      userId: searchParams.user,
    });

    const serverMessages = messages? messages : []

    if (error) {
      console.error("Error fetching chat data:", error);
      return <div>Error fetching chat data.</div>;
    }

    return (
      <AI
        initialAIState={{
          chatId: params.id as string,
          messages: serverMessages,
          userId: searchParams.user || "",
        }}>
        <Chat />
      </AI>
    );
  } catch (err) {
    console.error("Error in Page component:", err);
    return <div>Error loading page.</div>;
  }
}

export default Page;
