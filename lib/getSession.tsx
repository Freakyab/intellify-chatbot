"use client";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

import React, { useEffect, useState } from "react";
const getSession = async () => {
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

  return {
    user
  }
};

export default getSession;
