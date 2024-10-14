"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/getSession";
import { signOut } from "next-auth/react";
import Image from "next/image";

function Navbar() {
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

  // Updated the session function to fetch user data
  const fetchSession = useCallback(async () => {
    const session = await getSession();
    if (session?.user) {
      const { name, email, id, image } = session.user;
      setUser({ name: name ?? "", email: email ?? "", id: id ?? "", picture: image ?? "" });
    }
  }, []); // Removed `user` from dependencies

  useEffect(() => {
    fetchSession(); // Fetch session on component mount
  }, []); // Empty dependency array ensures this runs only once

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  return (
    <nav className="fixed w-screen top-0 z-40 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-3xl font-bold text-gray-900">RAG</span>
          </div>
          <div className={`${user.name ? "hidden" : ""} md:flex items-center space-x-6 text-gray-900`}>
            {user.name ? (
              <div className="flex items-center space-x-4">
                {user.picture && (
                  <Image
                    src={user.picture}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full shadow-md"
                  />
                )}
                <p className="text-lg font-medium text-[#E76F51] capitalize">
                  {user.name}
                </p>
                <div className="hidden md:block h-6 border-r border-gray-300"></div>
                <p className="hover:text-[#264653] cursor-pointer transition-colors duration-300" onClick={() => router.push("/")}>
                  Create new
                </p>
                <div className="hidden md:block h-6 border-r border-gray-300"></div>
                <p
                  className="hover:text-red-600 cursor-pointer transition-colors duration-300"
                  onClick={handleLogout}>
                  Logout
                </p>
              </div>
            ) : (
              <p
                className="text-lg font-medium hover:text-blue-600 cursor-pointer transition-colors duration-300"
                onClick={handleLogin}>
                Login
              </p>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
