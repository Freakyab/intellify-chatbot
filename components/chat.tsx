"use client";

import { useActions, useUIState } from "ai/rsc";
import { useEffect, useState } from "react";
import { AI } from "@/app/(chat)/[id]/action";
import { Loader2, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitMessage } = useActions();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const { id } = useParams();
  if (!id) return;

  // useEffect(() => {
  //   const fetchDetails = async () => {
  //     const {
  //       data: { session },
  //       error,
  //     } = await supabase.auth.getSession();
  //     if (error) {
  //       console.error("Error fetching session:", error);
  //     } else if (session) {
  //       if (session?.user.aud === "authenticated") {
  //         console.log(session.user.id);
  //         setUserId(session?.user.id as string);
  //         setId(id, session?.user.id);  // Set ID here after fetching session
  //       }
  //     }
  //   };

  //   fetchDetails();
  // }, [id, userId]);

  // console.log(messages);

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <form
        className="w-full flex flex-row gap-2 items-center h-full"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try {
            const responseMessage = await submitMessage(input);
            setMessages((currentMessages) => [
              responseMessage,
              ...currentMessages,
            ]);
          } catch (e) {
            console.log(e);
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

      {messages.map((message) => (
        <div
          key={message.id}
          id="chatbox"
          className="flex flex-col-reverse w-full text-left mt-4 gap-4 whitespace-pre-wrap">
          {message.userText}
          {message.display}
        </div>
      ))}
    </main>
  );
}
