"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useRouter, useParams } from "next/navigation";

function Navbar() {
  const [userSession, setUserSession] = useState<Session | null>();
  const [user, setUser] = useState({ id: "", email: "", auth: false });
  const router = useRouter();
  const { id } = useParams();
  useEffect(() => {
    const fetchDetails = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      } else if (session) {
        if (session?.user.aud === "authenticated") {
          setUser({
            id: session?.user.id as string,
            email: session?.user.email as string,
            auth: true,
          });
        }
        console.log("Session fetched successfully", session);
        setUserSession(session);
      }
    };

    fetchDetails();
  }, [id]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
      return;
    }
    setUserSession(null);
    setUser({ id: "", email: "", auth: false });
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-10 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <span className="text-2xl text-gray-900 font-semibold">RAG</span>
          <div className="flex space-x-4 text-gray-900">
            {userSession ? (
              <div className="flex gap-6 capitalize text-lg">
                <p className="text-[#E76F51]">{user?.email.split("@")[0]}</p>
                <p
                  className="hover:underline cursor-pointer"
                  onClick={() => router.push("/home")}>
                  Home
                </p>
                <p
                  className="hover:underline cursor-pointer"
                  onClick={handleLogout}>
                  Logout
                </p>
              </div>
            ) : (
              <p
                className="hover:underline cursor-pointer"
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
