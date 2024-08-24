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

        const documents = await db.chats.findMany({
            where: {
                userId
            },
            orderBy: {
                updatedAt: 'desc' // Ensure you have a 'createdAt' field or adjust according to your schema
            }
        });

        return { chats: documents, error: "", isEmpty: false };
    } catch (err) {
        return { chats: [], error: err, isEmpty: true };
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
                messages,
                updatedAt: new Date()
            }
        })
        return updateDoc;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function deleteChat({ chatId, userId }: { chatId: string, userId: string }) {
    try {
        if (!userId) return { error: "Invalid user id" };
        const deleteDoc = await db.chats.delete({
            where: {
                chatId_userId: {
                    chatId, userId
                }
            }
        })
        const isColloectionEmpty = await db.chats.findFirst({
            where: {
                userId
            }
        })
        return { chat: deleteDoc, isEmpty: isColloectionEmpty ? false : true };
    } catch (err) {
        console.error(err);
        return { error: err };
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

