"use client";
import { useActions, useUIState } from "ai/rsc";
import { useEffect, useState } from "react";
import { AI } from "@/app/(chat)/[id]/action";
import { Loader2, Send } from "lucide-react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setChatName } from "@/app/action/chat";
import Sidenav from "./sidenav";

export default function Chat({
  chatId,
  userId,
}: {
  chatId: string;
  userId?: string;
}) {
  const [input, setInput] = useState("");
  const [update, setUpdate] = useState(true);
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitMessage } = useActions();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      toast.info("Your chat will not be saved, please login to save your chat");
    }
  }, [userId, chatId]);

  return (
    <main className="flex w-full " style={{ height: "calc(100vh - 4rem)" }}>
      {userId && (
        <div className="w-1/4 h-full">
          <Sidenav updating={update} />
        </div>
      )}
      <div className="flex flex-col w-full items-center  p-12">
        <form
          className="w-full flex flex-row gap-2 items-center "
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              if (messages.length % 5 == 0 && userId) {
                const getName = await fetch("/api/completion", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(input),
                });
                const { reply } = await getName.json();
                if (reply && userId) {
                  setUpdate(true);
                  await setChatName(chatId, userId, reply);
                  setUpdate(false);
                }
              }
              const responseMessage = await submitMessage(input);
              setMessages([...messages, responseMessage]);
            } catch (e) {
              console.error(e);
            }
            setLoading(false);
            setInput("");
          }}>
          <input
            value={input}
            disabled={loading}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            placeholder="Type your message here...."
            className="border rounded-full border-[#E76F51] outline-none w-full px-4 py-2  focus:placeholder-transparent placeholder:text-[#0842A099] text-[#0842a0]
          disabled:bg-transparent"
          />
          <button
            type="submit"
            className="rounded-full shadow-md flex flex-row border-[#E76F51] border ">
            {loading ? (
              <Loader2 className="p-3 h-10 w-10 stroke-stone-500 animate-spin" />
            ) : (
              <Send className="p-3 h-10 w-10 stroke-stone-500 " />
            )}
          </button>
        </form>
        <div className="flex w-full flex-col-reverse">
          {messages.map((message, index) => (
            <div
              key={index}
              id="chatbox"
              className="flex flex-col w-full text-left mt-4 gap-4 whitespace-pre-wrap">
              {message.display}
              {message.userText}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
