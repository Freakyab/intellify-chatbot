"use client";
import Sidenav from "@/components/sidenav";
import AllTutorial from "@/components/trial/allTutorial";
import { Input } from "@/components/ui/input";
import Markdown from "@/components/ui/markdown";
import { Message, useChat } from "ai/react";
import { BookPlus, Bot, Loader2, Send, User2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import React from "react";
import { useToast } from "@/hooks/use-toast";

function Home() {
  const [chatContainerRef, setChatContainerRef] =
    React.useState<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const [actions, setActions] = React.useState(0);
  const [token, setToken] = React.useState<number>(0);
  const [initialMessages, setInitialMessages] = React.useState<Message[]>([]);
  const [timeStamp, setTimeStamp] = React.useState<string>(
    new Date().toISOString()
  );

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
  } = useChat({
    body: {
      chatId: "222222222222222222222222",
      userId: "222222222222222222222222",
      timeStamp,
      formData: {
        user: false,
        freeTokenLimit: token,
      },
    },
    api: "/api/chat/",
    streamProtocol: "text",
    initialMessages,
    onFinish: async (message) => {
      try {
        const data = JSON.parse(message.content);
        const usage = data.usage;

        const text = data.text;
        const error = data.error;
        if (error) {
          toast({ title: "Error", description: error });
          return;
        }

        const userMessage: Message = {
          id: timeStamp,
          content: input,
          role: "user",
          data: {
            token: usage.promptTokens,
          },
        };

        const assistantMessage: Message = {
          id: new Date().toISOString(),
          content: text,
          role: "assistant",
          data: {
            token: usage.completionTokens,
          },
        };

        const updatedMessages = [...messages, userMessage, assistantMessage];
        setMessages(updatedMessages);
        setToken((prev) => prev + usage.totalTokens);

        // localStorage.setItem("messages", JSON.stringify([]));
        if (typeof localStorage !== 'undefined')
          localStorage.setItem("messages", JSON.stringify(updatedMessages));
      } catch (err) {
        toast({ title: "Error", description: "Failed to process response." });
      }
    },
    onError(error) {
      toast({ title: "Error", description: error.message });
    },
  });

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input) return;

    // if (token >= 10_000 && actions === -1) {
    //   setActions(4);
    // }

    handleSubmit();
    setTimeStamp(new Date().toISOString());
  }

  React.useEffect(() => {
    if (chatContainerRef) {
      chatContainerRef.scrollTop = chatContainerRef.scrollHeight;
    }
  }, [messages]);

  React.useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const localMessages = localStorage.getItem("messages");
      const parsedMessages = localMessages
        ? (JSON.parse(localMessages) as Message[])
        : [];

      const today = new Date();
      const todaysMessages = parsedMessages.filter((m) => {
        const messageDate = new Date(m.id);
        return (
          today.getDate() === messageDate.getDate() &&
          today.getMonth() === messageDate.getMonth() &&
          today.getFullYear() === messageDate.getFullYear()
        );
      });

      const todayTokenUsage = todaysMessages.reduce((acc, curr) => {
        const token =
          curr.data && typeof curr.data === "object" && "token" in curr.data
            ? curr.data.token
            : 0;
        return acc + (typeof token === "number" ? token : 0);
      }, 0);

      setToken(todayTokenUsage);
      setInitialMessages(parsedMessages);
      if (parsedMessages.length == 0) {
        setActions(1);
      }
      if (todayTokenUsage >= 10_000) {
        setActions(4);
      }
    }
  }, []);
  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-primary/5 to-primary/10 p-6">
      {<AllTutorial action={actions} setAction={setActions} />}
      <div className="flex w-full gap-6 h-full">
        <div className="flex w-3/4 flex-col gap-4 ">
          <div
            ref={setChatContainerRef}
            className={`flex h-[80vh] flex-col gap-6 overflow-auto bg-white p-6 shadow-lg rounded-x
            `}>
            {messages.length == 0 && actions === -1 && (
              <div className="flex items-center justify-center w-full h-full">
                <Alert className="bg-white shadow-lg h-fit" role="status">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Welcome to the AI Chat Interface</AlertTitle>
                  <AlertDescription>
                    <div>
                      -You have daily
                      <span className="font-semibold text-primary mx-1">
                        10,000
                      </span>
                      tokens to interact with the AI. Use them wisely!
                    </div>
                    <div>
                      -Login to save your chat history and access to
                      <span className="font-semibold text-primary mx-1">
                        Settings.
                      </span>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}
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
          chatId={""}
          token={token}
          setToken={setToken}
        />
      </div>
    </div>
  );
}

export default Home;
