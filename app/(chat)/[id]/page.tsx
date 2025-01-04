"use client";
import { Input } from "@/components/ui/input";
import {
  BookPlus,
  Bot,
  ChartNoAxesCombined,
  Loader2,
  Send,
  User2,
} from "lucide-react";
import React, { useCallback, useEffect } from "react";
import { useChat } from "ai/react";
import { getSession } from "@/lib/session";
import { getChat } from "@/app/actions/chat";

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
  const [token, setToken] = React.useState<number>(0);
  const [session, setSession] = React.useState<SessionDetails | null>(null);
  const [initialMessages, setInitialMessages] = React.useState<any[]>([]);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      body: {
        chatId: params.id,
        userId: session?.user.id,
        timeStamp: new Date().toISOString(),
      },
      api: "/api/chat/",
      initialMessages: initialMessages,
      onFinish(message, options) {
        setToken((prev) => prev + options.usage.totalTokens);
      },
      onError(error) {
        console.error(error);
      },
    });

  const [chatContainerRef, setChatContainerRef] =
    React.useState<HTMLDivElement | null>(null);

  const totalBill = useCallback(() => {
    const costPerToken = 0.000000075;
    return (token * costPerToken).toFixed(2);
  }, [token]);

  const fetchSessionAndChat = useCallback(async () => {
    try {
      const session = await getSession();
      setSession(session as SessionDetails);

      if (session && session.user.id && params.id) {
        const response = await getChat({
          chatId: params.id,
          userId: session.user.id,
        });
        setInitialMessages(response.data || []);
        setToken(response.totalToken);
      }
    } catch (error: any) {
      console.error("Error fetching session or chat:", error.message);
    }
  }, [params.id]);

  const getWidth = useCallback(() => {
    const width = (token / 50) * 0.001 * 100;
    if (width > 100) return 100;
    return width;
  }, [token]);

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
                      {m.content}
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
            onSubmit={(e) => {
              e.preventDefault();
              if (isLoading) return;
              handleSubmit();
            }}>
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

        {/* Sidebar */}
        <div className="w-1/4 flex flex-col gap-4 justify-center">
          {/* Add sidebar content here */}
          <div className="w-full h-2/3 border border-primary/30 rounded-xl shadow-lg bg-white"></div>
          <div className="flex flex-col rounded-xl w-full  h-fit bg-green-400/20 p-4 border border-green-400 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 text-primary rounded-full bg-white">
                  <ChartNoAxesCombined className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  User Details
                </h2>
              </div>
              <span className="px-3 py-1 text-sm font-medium text-primary bg-white rounded-full">
                Gemini API
              </span>
            </div>

            {/* Cost Section */}
            <div className="p-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">API Cost</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-semibold text-gray-900">
                    ${totalBill()}
                  </span>
                  <span className="text-sm text-gray-500">/ $50 limit</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${getWidth()}%` }}
                />
              </div>

              {/* Token Usage */}
              <div className="py-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tokens Used</span>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-sm font-semibold text-gray-900 capitalize
                    ">
                      {token.toLocaleString("en-US", {
                        notation: "compact",
                        compactDisplay: "long",
                      })}
                    </span>

                    <span className="text-sm text-gray-500">tokens</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
