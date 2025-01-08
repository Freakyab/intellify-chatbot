import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Sparkles } from "lucide-react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

const Complete = ({ setAction }: { setAction: (action: number) => void }) => {
  return (
    <div className="absolute w-screen h-screen">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={200}
        tweenDuration={10000} 
        initialVelocityY={10}
        gravity={0.1}
      />
      <Dialog open={true}
        onOpenChange={() => setAction(-1)}
      >
        <DialogContent className="sm:max-w-md border-none bg-white/95 dark:bg-gray-900/95 shadow-2xl">
          {/* Background Party Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none"></div>

          <DialogHeader className="text-center space-y-6 py-4">
            <div className="flex justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}>
                <Trophy className="w-16 h-16 text-yellow-500" />
              </motion.div>
            </div>

            <DialogTitle className="text-2xl font-bold tracking-tight">
              Congratulations! 🎉
            </DialogTitle>

            <div className="space-y-4 px-4">
              <p className="text-lg text-muted-foreground">
                You've reached{" "}
                <span className="font-semibold text-foreground">
                  10,000 tokens
                </span>
                !
              </p>
              <p className="text-sm text-muted-foreground">
                Thank you for being an amazing user. Keep exploring and creating
                with AI!
              </p>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => setAction(-1)}
                className="inline-flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" strokeWidth={2} />
                <span>Keep Going</span>
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Complete;
