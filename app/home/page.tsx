"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Make sure this path is correct
import { useRouter } from "next/navigation";
import { Delete, EyeIcon } from "lucide-react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error fetching session:", sessionError);
        setLoading(false);
      } else if (session) {
        const { data, error } = await supabase
          .from("chats")
          .select("*")
          .eq("user_id", session.user.id);
        if (error) {
          console.error("Error fetching chats:", error);
        } else {
          setData(data);
        }
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    toast.info("Deleting chat...", {
      autoClose: 1000,
    });
    // let docId = parseInt(id);
    const { data: deleteData, error } = await supabase
      .from("chats")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Error deleting chat");
    } else {
      toast.success("Chat deleted successfully");
      setData((prevData) => prevData.filter((chat) => chat.id !== id));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {data.length === 0 ? (
        <div
          className="flex justify-center items-center h-24 text-gray-500"
          style={{ fontSize: "1.5rem" }}>
          No chats found
        </div>
      ) : (
        <div className="w-full">
          <h1 className="text-2xl text-gray-900 font-semibold p-3">
            List of all the chats:
          </h1>
          {data.map((chat) => (
            <div
              key={chat.id}
              className="flex justify-between p-3 bg-stone-200 m-3 rounded-lg">
              <p>Id: {chat.id}</p>
              <div className="flex gap-2">
                <p onClick={() => router.push(`/chat/${chat.id}`)}>
                  <EyeIcon className="text-blue-900 cursor-pointer" />
                </p>
                <Delete
                  className="cursor-pointer text-red-900"
                  onClick={() => handleDelete(chat.id)}
                />
              </div>
            </div>
          ))}
        </div>
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

export default Home;
