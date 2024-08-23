'use server';
import db from '@/db';
import { Prisma } from '@prisma/client';

export async function setChatName(chatId: string, userId: string, chatTitle: string) {
    try {
        if (userId.length == 0) return { error: "Invalid user id" };
        const document = await db.chats.update({
            where: {
                chatId_userId: {
                    chatId,
                    userId,
                }
            },
            data: {
                chatName: chatTitle
            }
        })
        return document;

    } catch (err) {
        console.error(err);
    }
}

export async function getChatData(userId: string) {
    try {
        if (userId.length === 0) return { messages: [], error: "Invalid Id" };

        // Fetch chats and sort them by 'createdAt' in descending order
        const documents = await db.chats.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc' // Ensure you have a 'createdAt' field or adjust according to your schema
            }
        });

        if (documents.length > 0) {
            return { chats: documents };
        } else {
            return { error: "No documents found" };
        }
    } catch (err) {
        console.error(err);
        return { error: "An error occurred" };
    }
}


export async function getData({ chatId, userId }: { chatId: string, userId: string | null | undefined }) {
    try {
        if (!userId) return { messages: [] }
        else if (!/^\d+$/.test(chatId) || chatId.length < 16) {
            return { error: "Invalid chat ID format" };
        }
        const document = await db.chats.findUnique(
            {
                where: {
                    chatId_userId: {
                        chatId,
                        userId
                    }
                }
            }
        )
        if (document) {
            const messages = document.messages;
            return { messages: messages, error: "" }
        }
        else {
            const newDoc = await db.chats.create({
                data: {
                    chatId,
                    userId,
                    messages: [],
                    chatName: ""
                }
            })
            return { messages: newDoc.messages, error: "" }
        }
    } catch (err) {
        console.error(err);
        return { messages: [], error: err }
    }
}

export async function setData({ chatId, userId, messages }: { chatId: string, userId: string, messages: Prisma.InputJsonValue[] }) {
    try {

        if (!/^\d+$/.test(chatId) || chatId.length < 16) {
            return { error: "Invalid chat ID format" };
        }
        const updateDoc = await db.chats.update({
            where: {
                chatId_userId: {
                    chatId, userId
                }
            },
            data: {
                messages
            }
        })
        return updateDoc;
    } catch (err) {
        console.error(err);
        return null;
    }
}


export async function getUnnameChats({ id }: { id: string }) {
    try {
        const document = await db.chats.findFirst({
            where: {
                userId: id,
                chatName: ""

            }
        })
        return document;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function getUser(email: string, password: string) {
    try {
        const user = await db.accounts.findFirst({
            where: {
                email,
                password
            }
        })
        return user;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function createUser(name: string, password: string, email: string) {
    try {
        const user = await db.accounts.create({
            data: {
                name,
                password,
                email
            }
        })
        return user;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function checkAccount(email: string) {
    try {
        const user = await db.accounts.findFirst({
            where: {
                email
            }
        })
        if (user) return true;
        return false;
    } catch (err) {
        return false;
    }
}

export async function setPicture(id: string, picture: string) {
    try {
        const user = await db.accounts.update({
            where: {
                id
            },
            data: {
                picture
            }
        })
        return user;
    } catch (err) {
        console.error(err);
        return null;
    }
}