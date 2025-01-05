import { Message } from "ai";

export const saveChat = async ({
  backendData,
}: {
  backendData: {
    role: string;
    content: string;
    token: number;
    userId: string;
    timeStamp: string;
    chatId: string;
  }[];
}) => {
  try {
    const response = await fetch("http://localhost:8000/chat/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        backendData,
      }),
    });
    const responseJson = await response.json();
    if (responseJson.status === "error") {
      throw new Error(responseJson.message);
    }
    if (responseJson.data === null) {
      throw new Error("Chat not saved");
    }
    return responseJson;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getChat = async ({
  chatId,
  userId,
}: {
  chatId: string;
  userId: string;
}) => {
  try {
    if (!chatId) {
      throw new Error("ChatId is required");
    }
    const response = await fetch(`http://localhost:8000/chat/prev/${chatId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    });
    const responseJson = await response.json();
    // console.log("responseJson", responseJson);

    if (responseJson.status === "error") {
      throw new Error(responseJson.message);
    }
    if (responseJson.data === null) {
      throw new Error("Chat not found");
    }
    return responseJson;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getHistory = async ({ userId }: { userId: string }) => {
  try {
    const response = await fetch(
      `http://localhost:8000/chat/list/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseJson = await response.json();
    // console.log("responseJson", responseJson);

    if (responseJson.status === "error") {
      throw new Error(responseJson.message);
    }
    if (responseJson.data === null) {
      throw new Error("Chat not found");
    }
    return responseJson;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const generateTitle = async ({
  messages,
}: {
  messages : Message[],
}) => {
  try {
    const response = await fetch("/api/summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
      }),
    });
    const responseJson = await response.json();
    console.log("responseJson", responseJson);
    if (responseJson.status === "error") {
      console.log("responseJson", responseJson);
      throw new Error(responseJson.message);
    }
    if (responseJson.data === null) {
      throw new Error("Title not generated");
    }
    return responseJson.reply;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export const saveTitle = async ({
  title,
  chatId,
  userId,
  method
}: {
  title: string;
  chatId: string;
  userId: string;
  method: string;
}) => {
  try {
    const response = await fetch("http://localhost:8000/chat/title", {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        chatId,
        userId
      }),
    });
    const responseJson = await response.json();
    if (responseJson.status === "error") {
      throw new Error(responseJson.message);
    }
    if (responseJson.data === null) {
      throw new Error("Title not saved");
    }
    return responseJson;
  } catch (error: any) {
    throw new Error(error.message);
  }
}