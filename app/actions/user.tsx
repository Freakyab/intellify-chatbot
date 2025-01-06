"use server";
export const fetchUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    if (!email || !password) {
      throw new Error("Invalid credentials");
    }
    const response = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const responseJson = await response.json();
    if (responseJson.status === "error") {
      throw new Error(responseJson.message);
    }
    if (responseJson.data === null) {
      throw new Error("User not found");
    }
    return responseJson;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createUser = async ({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}) => {
  try {
    if (!email || !password || !username) {
      throw new Error("Invalid credentials");
    }

    const response = await fetch("http://localhost:8000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        username,
      }),
    });
    const responseJson = await response.json();
    if (responseJson.status === "error") {
      throw new Error(responseJson.message);
    }
    if (responseJson.data === null) {
      throw new Error("User not found");
    }
    return responseJson;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getTotalToken = async ({ userId }: { userId: string }) => {
  try {
    const response = await fetch(
      `http://localhost:8000/billing/getDetails/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseJson = await response.json();
    if (responseJson.status === "error") {
      throw new Error(responseJson.message);
    }
    return responseJson;
  } catch (error: any) {
    return error.message;
  }
};

export const addToken = async ({
  userId,
  modelType,
  totalToken,
  limitation,
  apiKey,
}: {
  userId: string;
  modelType: string;
  totalToken: number;
  limitation: number;
  apiKey: string;

}) => {
  try {
    const response = await fetch("http://localhost:8000/billing/addOrUpdateDoc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        modelType,
        totalToken,
        limitation,
        apiKey,
      }),
    });
    const responseJson = await response.json();
    if (responseJson.status === "error") {
      throw new Error(responseJson.message);
    }
    return responseJson;
  } catch (error: any) {
    return error.message;
  }
};
