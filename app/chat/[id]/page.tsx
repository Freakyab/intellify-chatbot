"use client";
import React, { useState, useEffect } from "react";
import { useChat } from "ai/react";
import { Bot, Loader2, Send, User2 } from "lucide-react";
import Markdown from "../../../components/markdown";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import {  AI, Message } from "@/lib/chat/action";
import { useActions, useAIState, useUIState } from "ai/rsc";
import { useRouter } from "next/navigation";
import { useEnterSubmit } from "@/lib/use-form";

export default function Home() {
  const { id } = useParams();
  const router = useRouter();

  const [userSession, setUserSession] = useState<Session>();
  const [user, setUser] = useState({ userId: "", email: "", auth: false });
  const [chatData, setChatData] = useState<Message[]>([]);

  const [input, setInput] = useState("");
  const [messages] = useUIState();
  const [aiState] = useAIState();

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
            userId: session?.user.id as string,
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
        .eq("user_id", user.userId);
      if (error) {
        console.error("Error fetching or creating document:", error);
      }

      if (!data || data.length === 0) {
        console.log("Document does not exist, creating a new one");
        // Document does not exist, create a new one
        const { error: insertError } = await supabase
          .from("chats")
          .insert([{ id, user_id: user.userId, chat: [] }]);

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

  useEffect(() => {
    console.log(user);
    if (user.auth && user.userId && id) {
      getDoc();
    }
  }, [userSession, user, id]);

  useEffect(() => {
    const messagesLength = aiState.messages?.length;
    if (messagesLength === 2) {
      router.refresh();
    }
  }, [aiState.messages, router]);

  return (
    <AI
      initialAIState={{
        chatId: id as string,
        messages: chatData,
        interactions: [],
      }}>
      <div className="flex min-h-screen flex-col items-center p-12">
        {RenderForm()}
        {RenderMessages()}
      </div>
    </AI>
  );

  function RenderForm() {
    "use client";
    const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { submitUserMessage, describeImage } = useActions()
  const [_, setMessages] = useUIState<typeof AI>()

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])
    return (
      <form
        // onSubmit={}
        className="w-full flex flex-row gap-2 items-center h-full">
        <textarea
             ref={inputRef}
             tabIndex={0}
             onKeyDown={onKeyDown}
             autoFocus
             spellCheck={false}
             autoComplete="off"
             autoCorrect="off"
             name="message"
             rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
             // placeholder={isLoading ? "Generating..." : "ask something..."}
          // value={input}
          // disabled={isLoading}
          // onChange={handleInputChange}
          className="border-b border-dashed outline-none w-full px-4 py-2 text-right focus:placeholder-transparent placeholder:text-[#0842A099] text-[#0842a0]
          disabled:bg-transparent"
        />
        <button
          type="submit"
          className="rounded-full shadow-md border flex flex-row">
          {/* {isLoading ? (
            <Loader2
              className="p-3 h-10 w-10 stroke-stone-500 animate-spin"
              onClick={stop}
            />
          ) : (
            <Send className="p-3 h-10 w-10 stroke-stone-500" />
          )} */}
        </button>
      </form>
    );
  }

  function RenderMessages() {
    
    return (
      <div
        id="chatbox"
        className="flex flex-col-reverse w-full text-left mt-4 gap-4 whitespace-pre-wrap">
        {messages.map((message:any) => (
          <div key={message.id}>
            {message.spinner}
            {message.display}
            {message.attachments}
          </div>
        ))}
        {/* {chatData.map((message, index) => (
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
        ))} */}
      </div>
    );
  }
}
