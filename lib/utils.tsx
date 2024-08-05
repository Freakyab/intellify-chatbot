import { Message } from "ai";
import { supabase } from "./supabase";

export const saveData = async (
  id: string | string[],
  userId: string,
  messages: any 
) => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (session) {
    const { data, error } = await supabase
      .from("chats")
      .select("chat")
      .eq("id", id)
      .eq("user_id", userId);
    console.log(error, "first error");
    if (!data || data.length == 0) {
      const { data: docs, error } = await supabase
        .from("chats")
        .insert([{ id, user_id: userId, chat: messages }]);
      if (docs) console.log(docs, "document");
      else if (error) {
        console.log(error, "error");
      }
    }
  }
};
