import { getServerSession, type NextAuthOptions } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import { encode, decode } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { userServices } from "./services/userServices";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
      },

      async authorize(credentials, req) {
        try {
          if (credentials) {
            const response = await userServices.authenticate({
              email: credentials.email,
              password: credentials.password,
              username: credentials.name,
            });
            if (response?.user !== undefined && response?.user !== null) {
              const { user } = response;
              return { ...user, id: user._id , name: user.username, pic: user.picture};
            }
            else if (response?.error !== undefined && response?.error !== null) {
              throw new Error(response.error);
            }
          }
          return null;
        } catch (error: any) {
          throw new Error(error); // This will be passed to the UI as an error message
        }
      },
    }),
  ],
  secret: process.env.SECRET,
  jwt: {
    encode,
    decode,
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && account.type === "credentials") {
        token.userId = account.providerAccountId;
      }
      if (account && profile) {
        const email = token.email;
        const name = token.name;
        const picture = token.picture;
        if (email && name && picture) {
          const password = email + name + token.userId;

          const user = await userServices.authenticate({
            email,
            password,
            username: name,
          });

          if (user !== undefined && user !== null) {
            token.userId = user.user?._id ?? '';
            token.name = user.user?.username ?? '';
            token.pic = user.user?.picture ?? '';
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const getAuthSession = () => getServerSession(authOptions);
