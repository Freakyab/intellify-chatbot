"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

function Navbar() {
  const [userSession, setUserSession] = useState<Session>();
  const [user, setUser] = useState({ id: "", email: "", auth: false });
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
  }, []);

  return (
    <nav className="sticky top-0 z-10 bg-white bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <span className="text-2xl text-gray-900 font-semibold">RAG</span>
          <div className="flex space-x-4 text-gray-900">
            {userSession ? (
              <div className="flex gap-6 capitalize text-lg">
                <p className="">{user?.email.split("@")[0]}</p>
                <p className="hover:underline cursor-pointer">Logout</p>
              </div>
            ) : (
              <p>Login</p>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
