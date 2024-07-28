"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const generateId = async () => {
    return BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
  };
  useEffect(() => {
    const fetchId = async () => {
      const id = await generateId();
      router.push(`/chat/${id}`);
    }
    fetchId();
  }, []);
}
