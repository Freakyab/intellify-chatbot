"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Delete, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getChatData, deleteChat } from "../app/action/chat";
import { getCurrentUser } from "@/lib/getSession";

function Sidenav({ updating }: { updating: boolean }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const session = await getCurrentUser();
      if (session) {
        const { id } = session.user;
        setUserId(id);
        const { chats, error } = await getChatData(id);
        if (error) {
          console.error("Error fetching chat data:", error);
        } else {
          setData(chats || []);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [updating]);

  const handleDelete = useCallback(
    async (chatId: string) => {
      try {
        if (!userId) {
          throw new Error("Invalid user id");
        }
        const { error, isEmpty } = await deleteChat({ chatId, userId });
        if (isEmpty && !error) {
          toast.success("Chat deleted successfully");
          router.push("/");
          return;
        } else if (error) {
          throw new Error("Error deleting chat");
        } else {
          const { chats, error } = await getChatData(userId);
          if (error) {
            throw new Error("Error fetching chat data");
          }
          const getNamedChatId = chats?.find(
            (chat) => chat.chatName !== ""
          )?.chatId;
          if (getNamedChatId) {
            router.push(`/${getNamedChatId}`);
          } else {
            router.push("/");
          }
          toast.success("Chat deleted successfully");
          setData(chats || []);
        }
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "An error occurred");
      }
    },
    [userId, router]
  );

  return (
    <div className="border border-black rounded-lg m-2 sticky">
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <React.Fragment>
          {data.length === 0 ? (
            <div className="flex justify-center items-center h-24 text-gray-500 p-2">
              No chats found
            </div>
          ) : (
            <div className="h-full py-3 bg-stone-100">
              <h1 className="text-lg text-gray-900 font-semibold p-3">
                Your Chats
              </h1>
              {data.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex justify-between p-3 m-3 rounded-lg cursor-pointer ${
                    chat.chatId === id
                      ? "border-[#E76F51] border-[1px] bg-white shadow-lg"
                      : "bg-slate-200"
                  }`}
                  onClick={() => router.push(`/${chat.chatId}`)}>
                  <p>{chat.chatName.length === 0 ? "Unnamed" : chat.chatName}</p>
                  <div className="flex gap-2">
                    <Delete
                      className="text-red-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the click event on the container
                        if (confirm("Are you sure you want to delete this chat?")) {
                          handleDelete(chat.chatId);
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
}

export default Sidenav;
