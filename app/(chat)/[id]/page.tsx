import React from "react";
import { AI } from "./action";
import Chat from "@/components/chat";
import { supabaseClient } from "@/lib/supabase";
export interface ChatPageProps {
  params: { id: string };
  searchParams: { user: string | undefined | null };
}
async function Page({ params, searchParams }: ChatPageProps) {
  try {
    const { data, error } = await supabaseClient
      .from("chats")
      .select("id, created_at, user_id, chat")
      .eq("id", params.id)
      .eq("user_id", searchParams.user);

    if (error) {
      console.error("Error fetching chat data:", error);
      return <div>Error fetching chat data.</div>;
    }

    const serverMessages = data[0]?.chat;
    console.log(serverMessages);

    return (
      <AI
        initialAIState={{
          chatId: params.id,
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