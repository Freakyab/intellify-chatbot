// "use client";
import { Bot, User2 } from "lucide-react";
import Markdown from "./markdown";

export const BotMessage = ({
  role,
  content,
}: {
  role: string;
  content: string;
}) => {
  return (
    <div
      className={`px-4 pt-3 shadow-md rounded-md h-fit ml-10 relative ${
        role === "user" ? "bg-stone-300" : ""
      }`}>
      <Markdown text={content} />
      {role === "user" ? (
        //  make first letter capital
        <User2 className="absolute top-2 -left-10 border rounded-full p-1 shadow-lg" />
      ) : (
        <Bot
          className={`absolute top-2 -left-10 border rounded-full p-1 shadow-lg stroke-[#0842a0]`}
        />
      )}
    </div>
  );
};
