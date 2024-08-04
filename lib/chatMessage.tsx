import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getSession, getMessage, createEntry } from "./getSession";

export function getMessages() {
  const { id } = useParams();

  const [sessionDetails, setSessionDetails] = useState<any>(null);
  const [message, setMessages] = useState<any>(null);

  useEffect(() => {
    const fetchDetails = async () => {
        console.log("running")
      const details = await getSession();
      console.log(details)
      if (details.isUser) {
        setSessionDetails(details);
        if (details.session != null) {
          const { data,error } = await getMessage(id, details.session);
          console.log(error,"error")
          if (!data || data.length === 0) setMessages(data);
          else {
            const { data } = await createEntry(id, details.session);
            setMessages(data)
          }
        }
      }
    };
    fetchDetails();
  }, [id]);

  return {
    id,
    message,
  };
}
