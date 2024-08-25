"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  LogOutIcon,
  ShieldBan,
  ShieldCheckIcon,
  SidebarClose,
  SidebarIcon,
  SquarePen,
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
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    setLoading(true);
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
      // setLoading(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "An error occurred");
    }
    setLoading(false);
  };

  const handleDropdownToggle = (index: number) => {
    console.log(index);
    if (index === dropdownIndex) {
      setDropdownIndex(null);
    } else {
      setDropdownIndex((prevIndex) => (prevIndex === index ? null : index));
    }
  };

  useEffect(() => {
    session();
  }, []);

  return (
    <aside
      style={{ zIndex: 5 }}
      className={`fixed border-2 top-[4.0rem] md:top-[5rem] py-4 w-full md:w-1/4 left-0 transform transition-transform duration-300
        ${
          isOpen
            ? "translate-x-0 shadow-xl bg-white bg-opacity-90 backdrop-blur-md"
            : "-translate-x-full bg-transparent"
        } 
        md:translate-x-1 md:w-1/3 md:flex md:flex-col md:justify-center border-r border-gray-200 rounded-r-md`}>
      <div className="h-full flex-col md:w-full">
        {isMobileView && (
          <div className="flex justify-between items-center m-2">
            <button
              className="rounded-full shadow-md border-[#E76F51] border p-3"
              onClick={() => router.push("/")}>
              <SquarePen className="h-6 w-6" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full shadow-md border-[#E76F51] border p-3">
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
              <div className="flex flex-col flex-grow max-h-[90%] md:max-h-full overflow-y-auto scroll-auto scroll-p-1">
                <div className="flex flex-col py-2">
                  {Object.entries(groupedChats).map(
                    ([section, chats]) =>
                      chats.length > 0 && (
                        <div key={section}>
                          <p className="uppercase text-gray-400 text-xs mb-2">
                            {section}
                          </p>
                          {chats.map((chat, index) => (
                            <div
                              key={chat.chatId}
                              className={`flex items-center relative justify-between w-full bg-white p-4 rounded-lg shadow mb-2 transition-all hover:shadow-lg ${
                                chat.important
                                  ? "border-l-4 border-[#E76F51]"
                                  : ""
                              }`}>
                              {chat.chatId === id && (
                                <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 rounded-t-lg" />
                              )}
                              <div
                                className="flex-grow cursor-pointer"
                                onClick={() => {
                                  router.push(`/${chat.chatId}`);
                                  setIsOpen(false);
                                }}>
                                <p className="font-semibold text-gray-800">
                                  {chat.chatName || "Untitled Chat"}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  Last updated:{" "}
                                  {
                                    new Date(chat.updatedAt)
                                      .toLocaleString()
                                      .split(",")[0]
                                  }
                                </p>
                              </div>
                              <div className="relative" ref={dropdownRef}>
                                <button
                                  className="text-gray-500 hover:text-gray-800 focus:outline-none rotate-90"
                                  onClick={() =>
                                    handleDropdownToggle(parseInt(chat.chatId))
                                  }>
                                  ...
                                </button>
                                {dropdownIndex === parseInt(chat.chatId) && (
                                  <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <div className="py-1">
                                      <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                        onClick={(e) => {
                                          e.stopPropagation(); // Ensure event does not bubble up
                                          handleMarkImportant({
                                            chatId: chat.chatId,
                                            important: !chat.important,
                                          });
                                        }}>
                                        {chat.important ? (
                                          <>
                                            <ShieldBan className="mr-2 h-5 w-5 text-red-500" />
                                            <span>Remove from Important</span>
                                          </>
                                        ) : (
                                          <>
                                            <ShieldCheckIcon className="mr-2 h-5 w-5 text-green-500" />
                                            <span>Mark as Important</span>
                                          </>
                                        )}
                                      </button>
                                      <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                        onClick={() =>
                                          handleDelete(chat.chatId)
                                        }>
                                        <Trash2 className="mr-2 h-5 w-5 text-red-500" />
                                        <span>Delete Chat</span>
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
            {isMobileView && user.name && (
              <div className="flex gap-3 my-3 justify-evenly bg-[#E76F51] text-white rounded-lg p-3 cursor-pointer transition-all duration-200 shadow-md items-center">
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
