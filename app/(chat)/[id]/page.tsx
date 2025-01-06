"use client";
import { Input } from "@/components/ui/input";
import { BookPlus, Bot, Loader2, Send, User2 } from "lucide-react";
import React, { useCallback, useEffect } from "react";
import { useChat } from "ai/react";
import { getSession } from "@/lib/session";
import { generateTitle, getChat, saveTitle } from "@/app/actions/chat";
import Markdown from "@/components/ui/markdown";
import { addToken } from "@/app/actions/user";
import { useToast } from "@/hooks/use-toast";
import Sidenav from "@/components/sidenav";
import { UseModelSettings } from "@/components/modelSettingContext";

type SessionDetails = {
  user: {
    id: string;
    email: string;
    name: string;
  };
};

function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { toast } = useToast();
  const [token, setToken] = React.useState<number>(0);
  const [session, setSession] = React.useState<SessionDetails | null>(null);
  const [initialMessages, setInitialMessages] = React.useState<any[]>([]);
  const { formData } = UseModelSettings();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    body: {
      chatId: params.id,
      userId: session?.user.id,
      timeStamp: new Date().toISOString(),
      formData: formData,
    },
    api: "/api/chat/",
    streamProtocol: "text",
    initialMessages: initialMessages,
    onFinish: async (message) => {
      const data = JSON.parse(message.content);
      const usage = data.usage;
      const text = data.text;
      const error = data.error;
      if (error) {
        toast({ title: "Error", description: error });
        return;
      }
      setMessages([
        ...messages,
        {
          id: new Date().toISOString(),
          content: input,
          role: "user",
        },
        {
          id: message.id,
          content: text,
          role: "assistant",
        },
      ]);
      if (session?.user.id) {
        await addToken({
          userId: session?.user.id,
          modelType: "gemini api",
          totalToken: token + usage.totalTokens,
          limitation: 20,
          apiKey: "123456",
        });
      }

      setToken(token + usage.totalTokens);
    },
    onError(error) {
      toast({ title: "Error", description: error.message });
    },
  });
  const [chatContainerRef, setChatContainerRef] =
    React.useState<HTMLDivElement | null>(null);

  const fetchSessionAndChat = useCallback(async () => {
    try {
      const session = await getSession();
      setSession(session as SessionDetails);
      if (session && session.user.id && params.id) {
        const response = await getChat({
          chatId: params.id,
          userId: session.user.id,
        });

        if (response.data) {
          setInitialMessages(response.data);
          setToken(response.totalToken);
        } else {
          setInitialMessages([]);
        }
      }
    } catch (error: any) {
      console.error("Error fetching session or chat:", error.message);
      toast({ title: "Error", description: error.message });
    }
  }, [params.id, setSession, setInitialMessages, setMessages]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading && !input) return;
    handleSubmit();
    try {
      if (messages.length == 0 || messages.length % 4 == 0) {
        // if (messages.length > 0) {
        const response = await generateTitle({ messages });
        if (response.status === "error") {
          throw new Error(response.message);
        } else {
          if (response && session?.user.id) {
            console.log(response, "response");
            const titleSavingResponse = await saveTitle({
              title: response as string,
              chatId: params.id,
              userId: session?.user.id,
            });

            if (titleSavingResponse.status === "error") {
              throw new Error(titleSavingResponse.message);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: error as string });
    }
  };

  useEffect(() => {
    fetchSessionAndChat();
  }, [fetchSessionAndChat]);

  useEffect(() => {
    if (chatContainerRef) {
      chatContainerRef.scrollTop = chatContainerRef.scrollHeight;
    }
  }, [messages]);

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-primary/5 to-primary/10 p-6">
      <div className="flex w-full gap-6">
        {/* Main Chat Area */}
        <div className="flex w-3/4 flex-col gap-4">
          {/* Messages Container */}
          <div
            ref={setChatContainerRef}
            className="flex h-[80vh] flex-col gap-6 overflow-auto rounded-xl bg-white p-6 shadow-lg">
            {messages.map((m, index) => (
              <div key={m.id}>
                {m.role == "user" ? (
                  <div className="flex items-start justify-end gap-4">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-none bg-[#f0faf9] p-4 font-mono text-sm leading-relaxed text-gray-800 shadow-lg">
                      {m.content}
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0faf9]">
                      <User2 className={`text-primary`} size={24} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="text-primary" size={24} />
                    </div>
                    <div className="max-w-[80%] rounded-2xl rounded-tl-none bg-primary/10 p-4 font-mono text-sm leading-relaxed text-gray-800 shadow-lg">
                      <Markdown
                        text={m.content}
                        role={m.role}
                        lastMessage={messages.length - 1 === index}
                      />
                    </div>
                  </div>
                )}
                {isLoading && index == messages.length - 1 && (
                  <div className="flex items-start animate-bounce gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="text-primary" size={24} />
                    </div>
                    <div className="max-w-[80%] rounded-2xl rounded-tl-none bg-primary/10 p-4 font-mono text-sm shadow-lg">
                      <div className="animate-pulse bg-gray-200 h-5 w-1/2 rounded-full" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form
            className="rounded-xl bg-white shadow-lg"
            onSubmit={handleFormSubmit}>
            <div className="p-4">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="w-full border-none bg-gray-50/50 px-4 py-3 text-base focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>
            <div className="flex items-center justify-between border-t bg-gray-50/50 px-4 py-3">
              <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-600 shadow-lg transition-all hover:bg-primary/5">
                <BookPlus className="h-4 w-4 text-primary" />
                <span>Improve response</span>
              </button>
              {!isLoading ? (
                <button
                  type="submit"
                  className="rounded-full bg-primary p-3 text-white shadow-lg transition-all hover:bg-primary/90">
                  <Send className="h-4 w-4" />
                </button>
              ) : (
                <div className="rounded-full bg-primary p-3 text-white shadow-lg transition-all hover:bg-primary/90">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </div>
          </form>
        </div>

        <Sidenav
          messages={messages}
          chatId={params.id}
          token={token}
          setToken={setToken}
        />
      </div>
    </div>
  );
}

export default Page;
