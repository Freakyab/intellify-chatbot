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
                updatedAt: 'desc'
            }
        });

        const tokens = await db.accounts.findUnique({
            where: {
                id: userId
            },
            select: {
                inputTokenUsed: true,
                outputTokenUsed: true
            }
        })

        return { chats: documents, error: "", isEmpty: false, tokens };
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

export async function setData({
  chatId,
  userId,
  messages,
}: {
  chatId: string;
  userId: string;
  messages: Prisma.InputJsonValue[];
}) {
  try {
    if (!/^\d+$/.test(chatId) || chatId.length < 16) {
      return { error: "Invalid chat ID format" };
    }

    // Calculate the cost of input tokens used and output tokens used in new messages
    const newInputTokensUsed = messages.reduce((acc, item: any) => {
      if (item.role === "assistant" && item.token?.tokenInputStream != null) {
        acc += item.token?.tokenInputStream ?? 0;
      }
      return acc;
    }, 0);

    const newOutputTokensUsed = messages.reduce((acc, item: any) => {
      if (item.role === "assistant" && item.token?.tokenOutputStream != null) {
        acc += item.token?.tokenOutputStream ?? 0;
      }
      return acc;
    }, 0);

    const existingAccount = await db.accounts.findUnique({
      where: {
        id: userId,
      },
      select: {
        inputTokenUsed: true,
        outputTokenUsed: true,
      },
    });

    if (!existingAccount) {
      return { error: "Account not found" };
    }

    // Update token usage by incrementing the existing token values
    const updatedAccount = await db.accounts.update({
      where: {
        id: userId,
      },
      data: {
        inputTokenUsed: {
          increment: parseInt(newInputTokensUsed.toString()),
        },
        outputTokenUsed: {
          increment: parseInt(newOutputTokensUsed.toString()),
        },
      },
    });

    // Update the chat document with the new messages and updated timestamp
    const updatedChat = await db.chats.update({
      where: {
        chatId_userId: {
          chatId,
          userId,
        },
      },
      data: {
        messages,
        updatedAt: new Date(),
      },
    });

    if (!updatedAccount || !updatedChat) {
      return { error: "Failed to update data" };
    }

    return updatedChat;
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

export async function markImportant({ chatId, userId, important }: { chatId: string, userId: string, important: boolean }) {
    try {
        const document = await db.chats.update({
            where: {
                chatId_userId: {
                    chatId, userId
                }
            },
            data: {
                important
            }
        })
        if (document) {
            return { isSuccessful: true, error: "" }
        } else {
            return { isSuccessful: false, error: "Failed to mark as important" }
        }
    } catch (err) {
        console.error(err);
        return { isSuccessful: false, error: err }
    }
}

export async function getTokenData({ userId, chatId }: { userId: string, chatId: string }) {
    try {
        const document = await db.chats.findUnique({
            where: {
                chatId_userId: {
                    chatId, userId
                }
            }
        });

        // Calculate the cost of input tokens used
        const InputTokensUsed = document?.messages.reduce((acc, item: any) => {
            if (item.role === "assistant" && item.token?.tokenInputStream != null) {
                acc += item.token?.tokenInputStream ?? 0;
            }
            return acc;
        }, 0);

        // Calculate the number of output tokens used
        const OutputTokensUsed = document?.messages.reduce((acc, item: any) => {
            if (item.role === "assistant" && item.token?.tokenOutputStream != null) {
                acc += item.token?.tokenOutputStream ?? 0;
            }
            return acc;
        }, 0);

        // Calculate the total tokens used
        const TotalTokensUsed = document?.messages.reduce((acc, item: any) => {
            if (item.role === "assistant" && item.token?.tokenStream != null) {
                acc += item.token?.tokenStream ?? 0;
            }
            return acc;
        }, 0);

        return { InputTokensUsed, OutputTokensUsed, TotalTokensUsed, error: "" };

    } catch (err) {
        console.error(err);
        return { InputTokensUsed: 0, OutputTokensUsed: 0, TotalTokensUsed: 0, error: err };
    }
}
