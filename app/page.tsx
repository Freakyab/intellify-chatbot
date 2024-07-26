"use client";
import React, { useState, useEffect } from "react";
import { useChat } from "ai/react";
import { Bot, Loader2, Send, User2 } from "lucide-react";
import Markdown from "./components/markdown";
import { supabase } from "@/lib/supabase";
import { getSessionFromCookie } from "@/lib/getSession";
import { JwtPayload } from "jwt-decode";

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      api: "api/genai",
    });

  interface UserType extends JwtPayload {
    email: string;
  }

  const [session, setSession] = useState<UserType | null>(null);
  const [user, setUser] = useState({ id: "", email: "", auth: false });

  useEffect(() => {
    const newSession = getSessionFromCookie();
    if (newSession) {
      const decodedSession = newSession as UserType;
      setSession(decodedSession);
    }
  }, []);

  useEffect(() => {
    if (session?.aud === "authenticated") {
      setUser({
        id: session.sub as string,
        email: session.email as string,
        auth: true,
      });
    }
  }, [session]);
  // write the program which will generate random int8 id of supabase

    const generateId = async () => {
        const { data, error } = await supabase.rpc("generate_id");
        if (error) {
            console.error("Error generating id:", error.message);
        } else {
            console.log("Generated id:", data);
        }
    }

    useEffect(() => {
        if (user.auth) {
            generateId();
        }
    }, [user]);


  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      {/* form element */}
      {RenderForm()}
      {RenderMessages()}
      {/* rendering message */}
    </main>
  );

  function RenderForm() {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e, {
            data: {
              prompt: input,
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
          disabled:bg-transparent
          "
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
        {messages.map((message, index) => (
          <div
            key={index}
            className={`px-4 pt-3 capitalize shadow-md rounded-md h-fit ml-10 relative ${
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
      </div>
    );
  }
}
