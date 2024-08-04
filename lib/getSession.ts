"use client";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export const getSession = async () => {

    const {
        data: { session },
        error,
    } = await supabase.auth.getSession();

    let isUser = false;
    if (session) {
        isUser = true;
    }
    return { isUser, session, error };
}

export const getMessage = async (id: string | string[], session: Session) => {
    if (session?.user.aud === "authenticated") {
        const { data, error } = await supabase
            .from("chats")
            .select("chat")
            .eq("id", id)
            .eq("user_id", session?.user.id as string);
        console.log(data, "data")
        return {
            data,
            error
        }
    } else {
        return {
            error: "Not Athenticate"
        }
    }
}
export const createEntry = async (id: string | string[], session: Session) => {
    console.log(session,"session")
    if (session?.user.aud === "authenticated") {
        console.log(id,"id")
        const { data, error } = await supabase
            .from("chats")
            .insert([{ id, user_id: session?.user.id, chat: [] }]);
        console.log(error,"error2")
        return {
            data
        }
    } else {
        return {
            error: "Not Athenticate"
        }
    }
}

