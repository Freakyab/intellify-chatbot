"use client";

import { useActions, useUIState } from "ai/rsc";
import { useCallback, useEffect, useState } from "react";
import { AI } from "@/app/(chat)/[id]/action";
import { Loader2, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitMessage } = useActions();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const [userSession, setUserSession] = useState<Session | null>(null);
  const [user, setUser] = useState({ id: "", email: "", auth: false });

  useEffect(() => {
    const fetchDetails = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        // toast.error("Error fetching session");
      } else if (session) {
        if (session?.user.aud === "authenticated") {
          setUser({
            id: session?.user.id as string,
            email: session?.user.email as string,
            auth: true,
          });
        }
        console.log("Session fetched successfully");
        setUserSession(session);
      } else {
        // toast.info("Your chat will not be saved, please login to save your chat");
      }
    };

    fetchDetails();
  }, []);
  const getDoc = useCallback(async () => {
    try {
      console.log("Fetching document");
      // const { chatId, messages } = state
      const { data, error } = await supabase
        .from("chats")
        .select("chat")
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) {
        console.error("Error fetching or creating document:", error);
      }

      if (!data || data.length === 0) {
        console.log("Document does not exist, creating a new one");

        // Document does not exist, create a new one
        const { error: insertError } = await supabase
          .from("chats")
          .insert([{ id, user_id: user.id, chat: [] }]);

        if (insertError) {
          throw insertError;
        }
        console.log("Document created successfully");
      } else {
        console.log("Document fetched successfully", data[0].chat);
        setMessages(data?.[0]?.chat || []);
      }
    } catch (error) {
      console.error("Error fetching or creating document:", error);
    }
  }, [id, user.id]);

  const getDocUpdate = useCallback(async () => {
    if (messages.length > 0) {
      try {
        // console.log("Updating document");

        // const { data, error } = await supabase
        //   .from("chats")
        //   .update({ chat: messages })
        //   .eq("id", id)
        //   .eq("user_id", user.id);

        // console.log(data, "data");
        // if (error) {
        //   throw error;
        // }
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
  }, [messages, id, user.id]);

  useEffect(() => {
    if (user.auth && user.id && id) {
      getDoc();
    }
  }, [user.auth, user.id, id, getDoc]);

  useEffect(() => {
    getDocUpdate();
  }, [messages, getDocUpdate]);

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
          {/* <Send className="p-3 h-10 w-10 stroke-stone-500" /> */}
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
