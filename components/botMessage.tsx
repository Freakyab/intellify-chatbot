// "use client";
import { Bot, User2 } from "lucide-react";
import Markdown from "./markdown";

export const BotMessage = ({
  lastMessage,
  role,
  content,
  token,
}: {
  lastMessage?: boolean;
  role: string;
  content: string;
  token?: Number | undefined;
}) => {
  
  return (
    <div
      className={`px-4 pt-2 mr-3 border-2 shadow-md rounded-md h-fit ml-10 relative  ${
        role === "user" ? "bg-stone-300" : "mt-12"
      }`}
        style={{zIndex: 1}}
      >
      <Markdown text={content} role={role} lastMessage={lastMessage}/>
      {role === "user" ? (
        //  make first letter capital
        <User2
          size={30}
          className="absolute top-2  border-2  -left-10  rounded-full p-1 shadow-lg"
        />
      ) : (
        <Bot
          size={30}
          className={`absolute top-2 -left-10 rounded-full p-1 shadow-lg stroke-[#0842a0]`}
        />
      )}
      {role !== "user" && (
        <div className="absolute -top-6 right-0 bg-[#E76F51] rounded-t-md border text-xs font-semibold p-1 px-3 shadow-md text-white">
          Token: {String(token)}
        </div>
      )}
    </div>
  );
};
