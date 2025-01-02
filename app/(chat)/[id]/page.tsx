"use client";
import { Input } from "@/components/ui/input";
import {
  BookPlus,
  Bot,
  Send,
  User2,
} from "lucide-react";
import React from "react";

function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-primary/5 to-primary/10 p-6">
      <div className="flex w-full gap-6">
        {/* Main Chat Area */}
        <div className="flex w-3/4 flex-col gap-4">
          {/* Messages Container */}
          <div className="flex h-[80vh] flex-col gap-6 overflow-auto rounded-xl bg-white p-6 shadow-lg">
            {/* Bot Message */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Bot className="text-primary" size={24} />
              </div>
              <div className="max-w-[80%] rounded-2xl rounded-tl-none bg-[#f0faf9] p-4 font-mono text-sm leading-relaxed text-gray-800 shadow-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
                beatae accusantium consequuntur asperiores excepturi mollitia
                natus, aliquid ullam, adipisci necessitatibus, dignissimos
                officiis. Numquam iste sit facere ipsum molestiae tenetur autem
                hic, quidem perferendis nam. Nemo voluptatum quasi non.
              </div>
            </div>

            {/* User Message */}
            <div className="flex items-start justify-end gap-4">
              <div className="max-w-[80%] rounded-2xl rounded-tr-none bg-primary/10 p-4 font-mono text-sm leading-relaxed text-gray-800 shadow-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Inventore minus numquam earum molestiae omnis maiores facilis
                cum dolor, odio rem tempore corrupti! Magnam nobis voluptatem
                tenetur voluptas et esse. Illum recusandae libero voluptatum
                repellendus optio excepturi facere, dolore eaque, molestiae
                eligendi quidem perferendis ipsum maxime unde provident rem
                iste? Debitis!
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User2 className="text-primary" size={24} />
              </div>
            </div>
            
          </div>

          {/* Input Area */}
          <div className="rounded-xl bg-white shadow-lg">
            <div className="p-4">
              <Input
                placeholder="Type your message..."
                className="w-full border-none bg-gray-50/50 px-4 py-3 text-base focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>
            <div className="flex items-center justify-between border-t bg-gray-50/50 px-4 py-3">
              <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-gray-600 shadow-sm transition-all hover:bg-primary/5">
                <BookPlus className="h-4 w-4 text-primary" />
                <span>Improve response</span>
              </button>
              <button className="rounded-full bg-primary p-3 text-white shadow-sm transition-all hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-1/4 rounded-xl bg-white p-6 shadow-lg">
          {/* Add sidebar content here */}
        </div>
      </div>
    </div>
  );
}

export default Page;