'use server';
import db from '@/db';
import { Prisma } from '@prisma/client';
import { Message } from 'ai';

export async function getData({ chatId, userId }: { chatId: string, userId: string | null | undefined }) {
    try {
        if (!userId) return { messages: [], error: "Please login!!" }
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
                    messages: []
                }
            })
            return { messages: newDoc.messages, error: "" }
        }
    } catch (err) {
        console.error(err);
        return { messages: [], error: err }
    }
}

export async function setData({ chatId, userId, messages }: { chatId: string , userId: string, messages: Prisma.InputJsonValue[] }) {
    try {
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