"use client";
import { useActions, useUIState } from "ai/rsc";
import { useEffect, useState } from "react";
import { AI } from "@/app/(chat)/[id]/action";
import { Loader2, Send, SidebarIcon } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setChatName } from "@/app/action/chat";
import useScreenSize from "@/lib/useScreenHeight";
import Sidenav from "./sidenav";

export default function Chat({
  chatId,
  userId,
}: {
  chatId: string;
  userId?: string;
}) {
  const [input, setInput] = useState("");
  const [update, setUpdate] = useState(false); // Initialize update to false
  const [messages, setMessages] = useUIState<typeof AI>();
  const [isFirstEntry, setIsFirstEntry] = useState(false);
  const { submitMessage } = useActions();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const screenSize = useScreenSize();
  const [isMobileView, setIsMobileView] = useState(screenSize.width < 768);

  useEffect(() => {
    setIsMobileView(screenSize.width < 768);
  }, [screenSize.width]);

  useEffect(() => {
    if (!userId) {
      toast.info("Your chat will not be saved, please login to save your chat");
    }
  }, [userId, chatId]);

  useEffect(() => {
    if (isFirstEntry) {
      setUpdate(true); // Trigger an update to Sidenav
      setIsFirstEntry(false); // Mark the first entry as completed
    }
  }, [chatId, isFirstEntry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) {
      return;
    }

    setLoading(true);
    try {
      if (messages.length % 5 === 0 && userId) {
        const getName = await fetch("/api/completion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });
        const { reply } = await getName.json();
        if (reply && userId) {
          setUpdate(true); // Trigger an update to Sidenav
          await setChatName(chatId, userId, reply);
          setUpdate(false); // Reset update state after setting the chat name
        }
      }
      const responseMessage = await submitMessage(input);
      setMessages([...messages, responseMessage]);

      if (isFirstEntry) {
        setIsFirstEntry(false); // Ensure the first entry is marked as handled
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    setInput("");
  };

  return (
    <main className="flex w-full ">
      {userId && (
        <Sidenav
          updating={update}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isMobileView={isMobileView}
        />
      )}
      <div
        className={`flex flex-col top-10 absolute md:right-0 ${
          userId
            ? isMobileView
            ? ""
              : ` w-[calc(100vw-27%)] `
            : "w-full top-10 absolute"
        } p-2`}>
        <form
          className="w-full flex flex-row gap-2 items-center "
          onSubmit={handleSubmit}>
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-full shadow-md border-[#E76F51] border  md:hidden">
            {!isOpen && <SidebarIcon className="p-3 h-10 w-10" />}
          </button>
          <input
            value={input}
            disabled={loading}
            onChange={(event) => {
              setInput(event.target.value);
              if (isFirstEntry) {
                setIsFirstEntry(false); // Mark the first entry as completed
              } else {
                setIsFirstEntry(true); // Mark the first entry as completed
              }
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
