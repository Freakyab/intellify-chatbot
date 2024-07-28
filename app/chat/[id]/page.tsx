"use client";
import React, { useState, useEffect } from "react";
import { useChat } from "ai/react";
import { Bot, Loader2, Send, User2 } from "lucide-react";
import Markdown from "../../components/markdown";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { Session } from "@supabase/supabase-js";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      api: "../api/genai",
    });
  const { id } = useParams();

  type ChatMessage = {
    id: string;
    role: string;
    content: string;
  };
  type ChatType = ChatMessage[];

  const [userSession, setUserSession] = useState<Session>();
  const [user, setUser] = useState({ id: "", email: "", auth: false });
  const [chatData, setChatData] = useState<ChatType>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      } else if (session) {
        if (session?.user.aud === "authenticated") {
          setUser({
            id: session?.user.id as string,
            email: session?.user.email as string,
            auth: true,
          });
        }
        console.log("Session fetched successfully", session);
        setUserSession(session);
      }
    };

    fetchDetails();
  }, []);

  const getDoc = async () => {
    try {
      console.log("Fetching document");
      //   message: 'JSON object requested, multiple (or no) rows returned'}
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
        console.log("Document fetched successfully");
        setChatData(data?.[0]?.chat || []);
      }
    } catch (error) {
      console.error("Error fetching or creating document:", error);
    }
  };
  const getDocUpdate = async () => {
    if (messages.length > 0) {
      try {
        console.log("Updating document");

        // Filter out messages that are already in chatData
        const newMessages = messages.filter(
          (msg) => !chatData.some((existingMsg) => existingMsg.id === msg.id)
        );

        // Update chatData with new messages
        const updatedChatData = [...chatData, ...newMessages];
        setChatData(updatedChatData);
        console.log(updatedChatData, "updatedChatData");

        // const {data: supabaseData, error: chatDataError} = await supabase
        // .from("chats")
        // // .update({ chat: updatedChatData })
        // .select("chat")
        // .eq("id", id)
        // .eq("user_id", user.id);

        // console.log(supabaseData, "Existing chat data");

        const { data, error } = await supabase
          .from("chats")
          .update({ chat: updatedChatData })
          .eq("id", id)
          .eq("user_id", user.id);

        console.log(data, "data");
        if (error) {
          throw error;
        }
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
  };

  useEffect(() => {
    console.log(user);
    if (user.auth && user.id && id) {
      getDoc();
    }
  }, [userSession, user, id]);

  useEffect(() => {
    if (messages.length > 0) {
      getDocUpdate();
    }
  }, [messages]);

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
          className="border-b border-dashed outline-none w-full px-4 py-2 text-right focus:placeholder-transparent placeholder:text-[#0842A099] text-[#0842a0]
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
          
        {chatData.map((message, index) => (
          <div
            key={index}
            className={`px-4 pt-3 shadow-md rounded-md h-fit ml-10 relative ${
              message.role === "user" ? "bg-stone-300" : ""
            }`}>
            <Markdown text={message.content} />
            {message.role === "user" ? (
              //  make first letter capital
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
      </div>
    );
  }
}
