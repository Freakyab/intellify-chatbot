import Image from "next/image";
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function Tutorial2({ setAction }: { setAction: (action: number) => void }) {
  return (
    <div className="absolute inset-0 w-screen h-screen ">
    <div className="w-[74%] h-screen bg-gradient-to-bl from-black/60 to-black/40 backdrop-blur-sm flex justify-center items-center">
      <Card className="flex flex-col z-50 w-full max-w-2xl border-none shadow-2xl bg-white/95 dark:bg-gray-900/95">
        <CardContent className="flex flex-col gap-6 p-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Chat History & Billing
            </h1>
            <p className="text-sm text-muted-foreground">
              Step 2 of 3
            </p>
          </div>
          
          <div className="flex gap-6 items-start">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20"></div>
              <Image 
                src="/chat.png" 
                alt="chat" 
                width={80}
                height={80}
                className="relative  rounded-lg object-cover border shadow-md"
              />
            </div>
            
            <div className="space-y-4 flex-1">
              <p className="text-sm leading-relaxed text-muted-foreground">
                On the right side, you can view your chat history and billing details. 
                You can also adjust the model settings by hovering over the icon next to the billing details.
              </p>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Chat History
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Billing Details
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 group">
            <Button 
              variant="ghost" 
              onClick={() => setAction(1)}
              className="text-sm"
            >
              Previous
            </Button>
            <Button 
              onClick={() => setAction(3)}
              className="gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 duration-300" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
  );
}

export default Tutorial2;
