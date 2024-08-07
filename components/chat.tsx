"use client";

import { useActions, useUIState } from "ai/rsc";
import {  useState } from "react";
import { AI } from "@/app/(chat)/[id]/action";
import { Loader2, Send } from "lucide-react";
import { useParams } from "next/navigation";

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitMessage } = useActions();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  if (!id) return;

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <form
        className="w-full flex flex-row gap-2 items-center h-full"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try {
            const responseMessage = await submitMessage(input);
              setMessages([...messages,responseMessage]);
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
          className="border rounded-md border-[#E76F51] outline-none w-full px-4 py-2 text-right focus:placeholder-transparent placeholder:text-[#0842A099] text-[#0842a0]
          disabled:bg-transparent"
        />
        <button
          type="submit"
          className="rounded-full shadow-md border flex flex-row">
          {loading ? (
            <Loader2 className="p-3 h-10 w-10 stroke-stone-500 animate-spin" />
          ) : (
            <Send className="p-3 h-10 w-10 stroke-stone-500" />
          )}
        </button>
      </form>
      <div className="w-full h-full flex flex-col-reverse">
        {messages.map((message,index) => (
          <div
            key={index}
            id="chatbox"
            className="flex flex-col w-full text-left mt-4 gap-4 whitespace-pre-wrap">
            {message.display}
            {message.userText}
          </div>
        ))}
      </div>
    </main>
  );
}
