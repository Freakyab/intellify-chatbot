import React from "react";
import { AI } from "./action";
import Chat from "@/components/chat";

function Page() {
  return (
    <AI
      initialAIState={{
        chatId: "",
        messages: [],
      }}>
      <Chat />
    </AI>
  );
}

export default Page;
