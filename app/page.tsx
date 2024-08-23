"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/getSession";
import { getUnnameChats } from "./action/chat";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  // Define generateId inside the component to avoid type issues
  const generateId = useCallback(async (): Promise<BigInt> => {
    return BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
  }, []);

  // Use useCallback to memoize the fetchId function
  const fetchId = useCallback(async () => {
    try {
      const id = await generateId();
      const session = await getCurrentUser();

      if (session && session.user && session.user.id) {
        const userId = session.user.id as string;
        const doc = await getUnnameChats({ id: userId });
        console.log(doc, "doc");
        if (doc && doc.chatId) {
          router.push(`/${doc.chatId}`);
        } else if (doc === null) {
          router.push(`/${id}`);
        }
      } else {
        router.push(`/${id}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally handle the error or redirect to a fallback page
    } finally {
      setLoading(false);
    }
  }, [router, generateId]);

  useEffect(() => {
    fetchId();
  }, [fetchId]);

  return (
    <>
      {isLoading && (
        <div className="flex justify-center items-center w-full h-screen">
          <Loader2 className="animate-spin h-10 w-10" />
        </div>
      )}
    </>
  );
}
