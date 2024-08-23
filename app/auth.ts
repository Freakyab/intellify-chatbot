import {
    getServerSession,
    type NextAuthOptions,
} from "next-auth";

import { userService } from "./services/userServices";
import { getUser, createUser, checkAccount, setPicture } from "./action/chat";
import Credentials from "next-auth/providers/credentials";
import { encode, decode } from "next-auth/jwt";
import GoogleProvider from 'next-auth/providers/google'


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

            async authorize(credentials) {
                try {
                    if (credentials) {
                        console.log(credentials.email, credentials.password, credentials.name, "credentials");
                        const user = await userService.authenticate(
                            credentials.email,
                            credentials.password,
                            credentials.name,
                        );
                        if (user) {
                            return user;
                        }
                    }
                    throw new Error("Invalid credentials");
                } catch (error: any) {
                    throw new Error(error.message); // This will be passed to the UI as an error message
                }
            }

        })
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
                    const password = email  + name + token.userId;
                    const isAccount = await checkAccount(email);
                    if (!isAccount) {
                        const user = await createUser(name, password, email);
                        if (user) {
                            await setPicture(user.id, picture);
                            token.userId = user.id;
                        }
                    } else {
                        const user = await getUser(email, password);
                        if (user) {
                            
                            token.userId = user.id;
                        }
                    }
                }
            }
            return token;
        },
        async session({ session, token, user }) {
            session.user.id = token.userId;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
};


export const getAuthSession = () => getServerSession(authOptions); 