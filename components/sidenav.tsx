"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Delete, EyeIcon, Loader2 } from "lucide-react";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getChatData } from "../app/action/chat";
import { getCurrentUser } from "@/lib/getSession";

function Sidenav({ updating }: { updating: boolean }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      if (!updating) setLoading(true);
      const session = await getCurrentUser();
      if (session) {
        const { id } = session.user;
        const { chats, error } = await getChatData(id);
        console.log(chats);
        if (error) {
          console.error("Error fetching chat data:", error);
        }
        setData(chats || []);
      }
      if (!updating) setLoading(false);
    }
    fetchData();
  }, [updating]);

  return (
    <div className=" border border-black rounded-lg m-2 sticky">
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <React.Fragment>
          {data.length === 0 ? (
            <div className="flex jusify-center items-center h-24 text-gray-500 p-2">
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
                  className="flex justify-between p-3  bg-white m-3 rounded-lg h-10 line-clamp-1 cursor-pointer"
                  onClick={() => router.push(`/${chat.chatId}`)}>
                  <p>
                    {chat.chatName.length === 0 ? "Unnamed" : chat.chatName}
                  </p>
                  <div className="flex gap-2">
                    <p>{"->"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </React.Fragment>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
}

export default Sidenav;