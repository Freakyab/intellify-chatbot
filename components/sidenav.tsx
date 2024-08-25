"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  LogOutIcon,
  ShieldBan,
  ShieldCheckIcon,
  SidebarClose,
  SidebarIcon,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getChatData, deleteChat, markImportant } from "../app/action/chat";
import { getCurrentUser } from "@/lib/getSession";
import useScreenSize from "@/lib/useScreenHeight";
import { signOut } from "next-auth/react";
import Spinner from "./spinner";

type ChatProps = {
  chatId: string;
  userId?: string;
  messages: { id: string; role: string; content: string }[];
  chatName: string;
  createdAt: string;
  updatedAt: string;
  important: boolean;
};

function Sidenav({
  updating,
  isOpen,
  setIsOpen,
}: {
  updating: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [data, setData] = useState<ChatProps[] | any>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const screenSize = useScreenSize();
  const [isMobileView, setIsMobileView] = useState(screenSize.width < 768);
  const [drowpdown, setDropdown] = useState(-1);

  useEffect(() => {
    setIsMobileView(screenSize.width < 768);
  }, [screenSize.width]);

  const [user, setUser] = useState<{
    name: string;
    email: string;
    id: string;
    picture?: string;
  }>({
    name: "",
    email: "",
    id: "",
    picture: "",
  });
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
        console.log(chats?.map((chat: any) => chat.chatName));
        console.log(chats?.map((chat: any) => chat.important));
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

  const session = async () => {
    const session = await getCurrentUser();
    if (session?.user) {
      const { name, email, id, image } = session.user;
      if (name && email && id) {
        setUser({ name, email, id, picture: image ?? "" });
      }
    }
  };

  const groupChatsByDate = (chats: ChatProps[]) => {
    const grouped: {
      today: ChatProps[];
      last7Days: ChatProps[];
      older: ChatProps[];
      [key: string]: any[]; // Add index signature
    } = {
      today: [],
      last7Days: [],
      older: [],
    };

    chats.forEach((chat) => {
      const updatedAt = new Date(chat.updatedAt);
      const today = new Date();
      const diffInDays =
        (today.getTime() - updatedAt.getTime()) / (1000 * 3600 * 24);

      if (diffInDays < 1) {
        grouped.today.push(chat);
      } else if (diffInDays <= 7) {
        grouped.last7Days.push(chat);
      } else {
        grouped.older.push(chat);
      }
    });

    return grouped;
  };

  const groupedChats = groupChatsByDate(data);

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  const handleMarkImportant = async ({
    chatId,
    important,
  }: {
    chatId: string;
    important: boolean;
  }) => {
    try {
      if (!userId) {
        throw new Error("Invalid user id");
      }
      const { error, isSuccessful } = await markImportant({
        chatId,
        userId,
        important,
      });
      if (error) {
        throw new Error("Error marking chat as important");
      } else if (isSuccessful) {
        toast.success("Chat marked as important");
        const { chats, error } = await getChatData(userId);
        if (error) {
          throw new Error("Error fetching chat data");
        }
        setData(chats || []);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "An error occurred");
    }
  };

  useEffect(() => {
    session();
  }, []);

  return (
    <aside
      style={{ zIndex: 5 }}
      className={`fixed border-2 top-[4.0rem] md:top-10 py-4 w-full left-0 transform transition-transform duration-300
        ${
          isOpen
            ? "translate-x-0 shadow-xl bg-white bg-opacity-90 backdrop-blur-md"
            : "-translate-x-full bg-transparent"
        } 
        md:translate-x-1 md:w-1/3 md:flex md:flex-col md:justify-center md:relative border-r border-gray-200 rounded-r-md`}>
      <div className="h-full flex-col md:w-full">
        {isMobileView && (
          <div className="flex justify-between items-center rounded-full p-2 border-[#E76F51] border ">
            <p className="text-center capitalize text-[#E76F51] font-bold text-xl cursor-pointer w-full">
              Create new
            </p>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full shadow-md border-[#E76F51] border p-3 md:hidden">
              {isOpen ? (
                <SidebarClose className="h-6 w-6" />
              ) : (
                <SidebarIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
            <Spinner />
          </div>
        ) : (
          <div className={`flex flex-col relative h-[calc(100vh-8rem)] p-4`}>
            {data.length === 0 ? (
              <div className="flex justify-center items-center flex-grow text-gray-500 p-4">
                No chats found
              </div>
            ) : (
              <div className="flex flex-col flex-grow max-h-[80%] md:max-h-full overflow-y-auto scroll-auto scroll-p-1">
                <div className="flex flex-col items-center gap-4 h-full">
                  {Object.keys(groupedChats).map(
                    (group) =>
                      groupedChats[group].length > 0 && (
                        <div
                          key={group}
                          className="w-full space-y-3 text-sm h-full">
                          <h2 className="text-base px-2 font-semibold underline">
                            {group === "today"
                              ? "Today"
                              : group === "last7Days"
                              ? "Last 7 Days"
                              : "Older"}
                          </h2>
                          {groupedChats[group].map((chat, index) => (
                            <div
                              key={index}
                              className={`w-full relative 
                                 ${chat.important ? "space-y-10" : "space-y-3"}
                                `}>
                              {chat.important && (
                                <p className="absolute -top-7 bg-[#E76F51] text-white px-2 py-1 rounded-t-lg">
                                  Important
                                </p>
                              )}
                              <div
                                key={chat.chatId}
                                className={`flex relative justify-between px-1 py-2 w-full items-center  cursor-pointer ${
                                  chat.important
                                    ? "rounded-r-lg rounded-b-lg"
                                    : "rounded-lg"
                                } transition-all  duration-200 ${
                                  chat.chatId === id
                                    ? "bg-[#E76F51] text-white shadow-md"
                                    : chat.chatName.length === 0
                                    ? "border-[#3490dc] border"
                                    : "bg-white border-[#E76F51] border-2 hover:bg-gray-200"
                                }`}>
                                <p
                                  className="truncate pl-2"
                                  onClick={() =>
                                    router.push(`/${chat.chatId}`)
                                  }>
                                  {chat.chatName.length === 0
                                    ? "Unnamed"
                                    : chat.chatName}
                                </p>

                                <p
                                  onClick={() => setDropdown(index)}
                                  className="cursor-pointer p-2">
                                  ...
                                </p>
                              </div>
                              {drowpdown === index && (
                                <div
                                  className={`flex flex-col gap-2 absolute top-10 -right-10 bg-white p-2 rounded-lg shadow-md`}
                                    style={{ zIndex: 10 }}
                                  >
                                  <p
                                    className="cursor-pointer hover:bg-gray-200 p-1 rounded-lg"
                                    onClick={() => {
                                      handleMarkImportant({
                                        chatId: chat.chatId,
                                        important: !chat.important,
                                      });
                                    }}>
                                    {chat.important ? (
                                      <span className="flex items-center gap-2">
                                        <ShieldBan
                                          size={20}
                                          className="text-[#E76F51]"
                                        />
                                        Remove from important
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-2">
                                        <ShieldCheckIcon
                                          size={20}
                                          className="text-[#E76F51]"
                                        />
                                        Mark as important
                                      </span>
                                    )}
                                  </p>
                                  <p
                                    className="cursor-pointer flex items-center gap-2 hover:bg-gray-200 p-1 rounded-lg"
                                    onClick={() => {
                                      if (
                                        confirm(
                                          "Are you sure you want to delete this chat?"
                                        )
                                      ) {
                                        handleDelete(chat.chatId);
                                      }
                                    }}>
                                    <Trash2
                                      size={20}
                                      className="text-red-500"
                                    />
                                    Delete
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
            {isMobileView && user.name && (
              <div
                className="flex gap-3 my-3 justify-evenly bg-[#E76F51] text-white rounded-lg p-3 cursor-pointer transition-all duration-200 shadow-md 
              items-center">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="rounded-full shadow-md w-12 h-12"
                />
                <div className="flex flex-col w-[60%]">
                  <p className="text-lg font-semibold capitalize">
                    {user.name}
                  </p>
                  <p className="truncate text-sm">{user.email}</p>
                </div>
                <div className="flex items-center">
                  <LogOutIcon
                    className="cursor-pointer hover:text-red-600 transition-colors duration-300"
                    onClick={handleLogout}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidenav;
