"use client";
import React, { useState } from "react";
import markdownit from "markdown-it";
import dompurify from "dompurify";
import { TypewriterEffect } from "./typewriter-effect"

function Markdown({
  text,
  role,
  lastMessage,
}: {
  text: string;
  role: string;
  lastMessage?: boolean;
}) {
  const [isComplete, setIsComplete] = useState(role === "user" || !lastMessage);

  const md = markdownit();
  const htmlContent = md.render(text);
  const sanitizedContent = dompurify.sanitize(htmlContent);

  // Function to mark typing as complete
  const handleTypingComplete = () => {
    setIsComplete(true);
  };

  return (
    <div className="w-[90%]">
      {/* Conditionally render Markdown or TypewriterEffect */}
      {isComplete ? (
        // Render sanitized Markdown content when typing is complete
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          className="mt-4"></div>
      ) : (
        // Render the Typewriter effect until complete
        <TypewriterEffect
          words={[{ text }]}
          onComplete={handleTypingComplete}
        />
      )}
    </div>
  );
}

export default Markdown;