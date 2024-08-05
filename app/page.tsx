"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
export default function Home() {
  const router = useRouter();
  const generateId = async () => {
    return BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
  };
  useEffect(() => {
    const fetchId = async () => {
      const id = await generateId();
      let userId;
      const { data } = await supabase.auth.getSession();
      if (data) {
        userId = data?.session?.user.id;
      }
      router.push(`/${id}?user=${userId}`);
    };
    fetchId();
  }, []);
}
