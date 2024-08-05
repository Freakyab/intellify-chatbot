import React from "react";
import { AI } from "./action";
import Chat from "@/components/chat";

function Page() {
  return (
    <AI
      initialAIState={{
        chatId: "",
        messages: [],
        userId: "",
      }}>
      <Chat />
    </AI>
  );
}

export default Page;
