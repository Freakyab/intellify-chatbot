import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

function Tutorial1({ setAction }: { setAction: (action: number) => void }) {
  return (
    <AlertDialog open={true} onOpenChange={(open) => console.log(open)}>
      <AlertDialogContent className="max-w-lg border-none shadow-2xl bg-white/95 dark:bg-gray-900/95">
        <AlertDialogHeader className="space-y-6">
          <div className="space-y-2">
            <AlertDialogTitle className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              Welcome to the world of AI
            </AlertDialogTitle>
            <p className="text-sm text-muted-foreground">Step 1 of 3</p>
          </div>

          <AlertDialogDescription className="text-base">
            <div className="flex gap-4 items-start">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20"></div>
                <Image
                  src="/happy.png"
                  alt="ai"
                  width={80}
                  height={80}
                  className="relative rounded-lg object-cover border shadow-md"
                />
              </div>
              <p className="leading-relaxed text-sm text-foreground">
                This is website to use your API key to get the data. Here is the
                tour to use the website.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setAction(2)} className="gap-2">
            Continue
            <ArrowRight className="w-4 h-4" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Tutorial1;
