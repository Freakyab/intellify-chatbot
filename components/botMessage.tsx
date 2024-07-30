"use client";
import { readStreamableValue, StreamableValue } from "ai/rsc";
import React,{useEffect,useState} from "react";

function BotMessage({
  content,
  className,
}: {
  content: string | StreamableValue<string>;
  className?: string;
}) {
    const text = useStreamableText(content)

  return <div>{text}</div>;
}

export default BotMessage;


export const useStreamableText = (
    content: string | StreamableValue<string>
  ) => {
    const [rawContent, setRawContent] = useState(
      typeof content === 'string' ? content : ''
    )
  
    useEffect(() => {
      ;(async () => {
        if (typeof content === 'object') {
          let value = ''
          for await (const delta of readStreamableValue(content)) {
            console.log(delta)
            if (typeof delta === 'string') {
              setRawContent((value = value + delta))
            }
          }
        }
      })()
    }, [content])
  
    return rawContent
  }
  