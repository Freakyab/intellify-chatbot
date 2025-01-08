import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare } from "lucide-react";

const Tutorial3 = ({ setAction }: { setAction: (action: number) => void }) => {
  return (
    <div className="absolute inset-0 w-screen h-screen">
      <div className="ml-auto w-[26%] h-screen bg-gradient-to-bl from-black/60 to-black/40 backdrop-blur-sm flex justify-center items-center">
        <Card className="flex flex-col z-50 w-full max-w-80 border-none shadow-2xl bg-white/95 dark:bg-gray-900/95 mx-4">
          <CardContent className="flex flex-col gap-6 p-8">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                AI Chat Interface
              </h1>
              <p className="text-sm text-muted-foreground">Step 4 of 4</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20"></div>
                <p className="relative text-sm leading-relaxed text-muted-foreground bg-background p-4 rounded-lg border shadow-sm">
                  On the left side, you'll find your chat history and message
                  input area. This is where you can interact with the AI and
                  view your conversation history.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                variant="ghost"
                onClick={() => setAction(2)}
                className="gap-2">
                Previous
              </Button>
              <Button onClick={() => setAction(-1)} className="gap-2">
                Finish Tour
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tutorial3;
