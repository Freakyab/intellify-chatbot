"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useChat } from "ai/react";
import { Bot, Loader2, Send, User2 } from "lucide-react";
import Markdown from "../../components/markdown";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    data,
  } = useChat({
    api: "../api/genai",
  });
  const { id } = useParams();
  console.log(messages, "messages");

  type ChatMessage = {
    id: string;
    role: string;
    content: string;
  };
  type ChatType = ChatMessage[];

  const [userSession, setUserSession] = useState<Session | null>(null);
  const [user, setUser] = useState({ id: "", email: "", auth: false });
  const [chatData, setChatData] = useState<ChatType>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        toast.error("Error fetching session");
      } else if (session) {
        if (session?.user.aud === "authenticated") {
          setUser({
            id: session?.user.id as string,
            email: session?.user.email as string,
            auth: true,
          });
        }
        setUserSession(session);
      } else {
        toast.info(
          "Your chat will not be saved, please login to save your chat"
        );
      }
    };

    fetchDetails();
  }, []);

  const getDoc = useCallback(async () => {
    try {
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
      } else {
        setChatData(data?.[0]?.chat || []);
      }
    } catch (error) {
      console.error("Error fetching or creating document:", error);
    }
  }, [id, user.id]);

  const getDocUpdate = useCallback(async () => {
    if (messages.length > 0) {
      try {
        const newMessages = messages.filter(
          (msg) => !chatData.some((existingMsg) => existingMsg.id === msg.id)
        );

        if (newMessages.length === 0) return;

        const updatedChatData = [...chatData, ...newMessages];
        setChatData(updatedChatData);

        const { data, error } = await supabase
          .from("chats")
          .update({ chat: updatedChatData })
          .eq("id", id)
          .eq("user_id", user.id);

        if (error) {
          throw error;
        }
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
  }, [messages, chatData, id, user.id]);

  useEffect(() => {
    if (user.auth && user.id && id) {
      getDoc();
    }
  }, [user.auth, user.id, id, getDoc]);

  useEffect(() => {
    getDocUpdate();
  }, [messages, getDocUpdate]);

  return (
    <div className="flex min-h-screen flex-col items-center p-12">
      {RenderForm()}
      {RenderMessages()}
    </div>
  );

  function RenderForm() {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e, {
            data: {
              prompt: input,
              history: chatData,
            },
          });
        }}
        className="w-full flex flex-row gap-2 items-center h-full">
        <input
          type="text"
          placeholder={isLoading ? "Generating..." : "ask something..."}
          value={input}
          disabled={isLoading}
          onChange={handleInputChange}
          className="border rounded-md border-[#E76F51] outline-none w-full px-4 py-2 text-right focus:placeholder-transparent placeholder:text-[#0842A099] text-[#0842a0]
          disabled:bg-transparent"
        />
        <button
          type="submit"
          className="rounded-full shadow-md border flex flex-row">
          {isLoading ? (
            <Loader2
              className="p-3 h-10 w-10 stroke-stone-500 animate-spin"
              onClick={stop}
            />
          ) : (
            <Send className="p-3 h-10 w-10 stroke-stone-500" />
          )}
        </button>
      </form>
    );
  }

  function RenderMessages() {
    return (
      <div
        id="chatbox"
        className="flex flex-col-reverse w-full text-left mt-4 gap-4 whitespace-pre-wrap">
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        {chatData.map((message, index) => (
          <div
            key={index}
            className={`px-4 pt-3 shadow-md rounded-md h-fit ml-10 relative ${
              message.role === "user" ? "bg-stone-300" : ""
            }`}>
            <Markdown text={message.content} />
            {message.role === "user" ? (
              <User2 className="absolute top-2 -left-10 border rounded-full p-1 shadow-lg" />
            ) : (
              <Bot
                className={`absolute top-2 -left-10 border rounded-full p-1 shadow-lg stroke-[#0842a0] ${
                  isLoading && index === messages.length - 1
                    ? "animate-bounce"
                    : ""
                }`}
              />
            )}
          </div>
        ))}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      </div>
    );
  }
}
