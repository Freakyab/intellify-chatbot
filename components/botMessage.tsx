// "use client";
import { Bot, User2 } from "lucide-react";
import Markdown from "./markdown";

export const BotMessage = ({
  role,
  content,
  token,
}: {
  role: string;
  content: string;
  token?: React.ReactNode;
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
        {role !== "user" && <div className="absolute top-2 right-0 text-[#E76F51] rounded-md border text-xs font-semibold p-1 px-3 shadow-md m-2 border-[#E76F51]">Token: {token}</div>}
      </div>
  );
};
