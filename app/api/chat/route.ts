import { saveChat } from '@/app/actions/chat';
import { ModelSettingsType } from '@/app/types/types';
// import { google } from '@ai-sdk/google';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

import { generateText, Message } from 'ai';

// Define the expected message types
type CoreMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
}



export async function POST(req: Request) {

    const { messages, chatId, userId, timeStamp, formData }: {
        messages: Message[],
        chatId: string,
        userId: string,
        timeStamp: string,
        formData: ModelSettingsType
    } =
        await req.json();

    let saveFailed = false;
    const useUserSettings = formData.user;
    const DefaultSettings = {
        messageLength: useUserSettings ? formData.messageLength : 10,
        apiKey: useUserSettings ? formData.apiKey : "",
        systemMessage: useUserSettings ? formData.systemMessage : ` - you are an AI assistant
            - you are assisting a user
            - you provide maximum information to the user
            - you are polite and helpful
            - use minimum tokens to generate a response`,
        tokenLimit: useUserSettings ? formData.tokenLimit : 500,
        apiType: useUserSettings ? formData.apiType : "gemini",
        freeTokenLimit: formData.freeTokenLimit || 0
    }


    // Convert messages to the format expected by Gemini get last 10 messages
    const convertedMessages: CoreMessage[] = messages
        .filter((message) => message.content.length > 0)
        .map((message) => ({
            role: message.role === 'function' || message.role === 'data' || message.role === 'tool'
                ? 'assistant'
                : message.role,
            content: message.content
        }))
        .slice(-DefaultSettings.messageLength)
        .filter((message): message is CoreMessage =>
            message.role === 'user' ||
            message.role === 'assistant' ||
            message.role === 'system'
        );

    if (userId.length !== 24 || chatId.length !== 24) {
        return new Response(
            JSON.stringify('Invalid user or chat ID'),
            { status: 400 }
        );
    }

    const google = createGoogleGenerativeAI({
        apiKey: useUserSettings ? DefaultSettings.apiKey : process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    try {

        if (chatId == '222222222222222222222222' && userId == '222222222222222222222222') {
            const isLimitHit = DefaultSettings.freeTokenLimit >= 10_000;
            if (isLimitHit) {
                return new Response(
                    JSON.stringify('You have reached the maximum number of messages'),
                    { status: 400 }
                );
            }
        }
        const result = await generateText({
            model: google('models/gemini-1.5-flash-latest'),
            messages: convertedMessages,
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxTokens: DefaultSettings.tokenLimit,
            system: DefaultSettings.systemMessage,
        });

        const backendData = [
            {
                role: "user",
                content: messages[messages.length - 1].content,
                token: result.usage.promptTokens,
                timeStamp,
                userId,
                chatId
            },
            {
                role: "assistant",
                content: result.text,
                token: result.usage.completionTokens,
                timeStamp: new Date().toISOString(),
                userId,
                chatId
            }
        ];

        const response = await saveChat({ backendData });
        if (response.status === 'error') {
            saveFailed = true;
            throw new Error(response.message);
        }

        if (!saveFailed) {
            // string to stremable data
            // const data = sresult.text);

            const encoder = new TextEncoder();
            const stream = new ReadableStream({
                start(controller) {
                    controller.enqueue(encoder.encode(JSON.stringify({
                        text: result.text,
                        id: response._id,
                        usage: result.usage
                    })));
                    controller.close();
                }
            });
            return new Response(stream, {

                headers: {
                    'Content-Type': 'text/plain'
                },

            });

        } else {
            return new Response(
                JSON.stringify('Failed to save chat, response generation aborted'),
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error('Streaming error:', error);
        if (error.data.error.message) {
            return new Response(
                JSON.stringify(error.data.error.message),
                { status: 500 }
            );
        }
        return new Response(
            JSON.stringify(error.messages),
            { status: 500 }
        );
    }
}
