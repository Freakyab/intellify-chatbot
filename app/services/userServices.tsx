import { fetchUser, createUser } from "../actions/user";
import { User } from "../types/types";

export const userServices = {
  authenticate,
};

async function authenticate({
  email,
  username,
  password,
}: {
  email: string;
  password: string;
  username: string;
}): Promise<{
  error: string | null;
  user: User | null;
} | null> {
  try {
    if (!email || !password) {
      throw new Error("Invalid credentials");
    }

    const isSignUp = username ? true : false;
    if (isSignUp) {
      const user = await createUser({ email, password, username });
      if (user !== null && user !== undefined) {
        return {
          user,
          error: null,
        };
      }
      throw new Error("Something went wrong");
    } else {
      const user = await fetchUser({ email, password });
      console.log(user, "user");
      if (user !== null && user !== undefined) {
        return user;
      }
      //  how to catch this error in the auth.ts file
      throw new Error("Something went wrong");
    }
  } catch (error: any) {
    return {
      user: null,
      error: error.message,
    };
  }
}
