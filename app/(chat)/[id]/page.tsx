import React from "react";
import { AI } from "./action";
import Chat from "@/components/chat";
import { getData } from "@/app/action/chat";
import { getCurrentUser } from "@/lib/getSession";
export interface ChatPageProps {
  params: { id: string };
}
async function Page({ params }: ChatPageProps) {
  try {
    const chatId = params.id;
    const session = await getCurrentUser();
    const userId = session?.user.id;

    const { messages, error } = await getData({
      chatId,
      userId,
    });

    const serverMessages = messages ? messages : [];

    if (error) {
      console.error("Error fetching chat data:", error);
      return <div className="text-red-500">Error loading page.</div>;
    }

    return (
      <AI
        initialAIState={{
          chatId: chatId as string,
          messages: serverMessages,
          userId: userId || "",
        }}>
        <Chat chatId={chatId} userId={userId} />
      </AI>
    );
  } catch (err) {
    console.error("Error in Page component:", err);
    return <div>Error loading page.</div>;
  }
}

export default Page;
