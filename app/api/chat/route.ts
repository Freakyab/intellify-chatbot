import { saveChat } from '@/app/actions/chat';
import { google } from '@ai-sdk/google';
import { Message, streamText } from 'ai';

// Define the expected message types
type CoreMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export async function POST(req: Request) {

    const { messages, chatId, userId, timeStamp }: {
        messages: Message[],
        chatId: string,
        userId: string,
        timeStamp: string,
    } =
        await req.json();

    let saveFailed = false;

    // Convert messages to the format expected by Gemini get last 10 messages
    const convertedMessages: CoreMessage[] = messages
        .filter((message) => message.content.length > 0)
        .map((message) => ({
            role: message.role === 'function' || message.role === 'data' || message.role === 'tool'
                ? 'assistant'
                : message.role,
            content: message.content
        }))
        .slice(-10)
        .filter((message): message is CoreMessage =>
            message.role === 'user' ||
            message.role === 'assistant' ||
            message.role === 'system'
        );

    if (userId.length !== 24 || chatId.length !== 24) {
        return new Response(
            JSON.stringify({ error: 'Invalid user or chat ID' }),
            { status: 400 }
        );
    }

    try {
        const result = await streamText({
            model: google('models/gemini-1.5-flash-latest'),
            messages: convertedMessages,
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxTokens: 8192,

            system: `
            You are a general-purpose chatbot which assists users in their queries.
            Also, you will consider the history of the conversation to provide better responses.
            `,
            onFinish: async ({ text, usage }) => {
                const backendData = [
                    {
                        role: "user",
                        content: messages[messages.length - 1].content,
                        token: usage.promptTokens,
                        timeStamp,
                        userId,
                        chatId
                    },
                    {
                        role: "assistant",
                        content: text,
                        token: usage.completionTokens,
                        timeStamp: new Date().toISOString(),
                        userId,
                        chatId
                    }
                ];

                try {
                    const response = await saveChat({ backendData });
                    if (response.status === 'error') {
                        saveFailed = true;
                    }
                } catch (error) {
                    console.error('Failed to save chat:', error);
                    saveFailed = true;
                }
            }
        });

        if (!saveFailed) {
            return result.toDataStreamResponse();
        } else {
            return new Response(
                JSON.stringify({ error: 'Failed to save chat, response generation aborted' }),
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Streaming error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to process chat request' }),
            { status: 500 }
        );
    }
}
