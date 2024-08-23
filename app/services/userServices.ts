import { getUser, createUser, checkAccount } from "../action/chat";

export const userService = {
  authenticate,
};

async function authenticate(email: string, password: string, name: string) {

  if (!email || !password) {
    throw new Error("All fields are required");
  }

  const isSignUp = name ? true : false;


  if (isSignUp) {
    const isUser = await checkAccount(email);
    if (isUser) {
      throw new Error("Account already exists");
    }
    else {
      const user = await createUser(name, password, email);
      if (user)
        return user;
      else {
        throw new Error("Invalid credentials");
      }
    }
  }
  else {
    const isUser = await checkAccount(email);
    if (isUser) {
      const user = await getUser(email, password);
      if (user)
        return user;
      else {
        throw new Error("Invalid credentials");
      }
    } else {
      throw new Error("Account not found");
    }

  }
}