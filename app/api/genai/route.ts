import { StreamingTextResponse, GoogleGenerativeAIStream } from "ai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request, res: Response) {
    const reqBody = await req.json();
    const { prompt, history } = reqBody.data;

    const genai = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

    const model = genai.getGenerativeModel({ model: 'gemini-pro' })

    // const botHistory = history
    //     .map((item: any) => item.content).join("\n");

    // const newPrompt = botHistory.length > 0 ?
    //     `The chat history is ${botHistory} and current prompt is ${prompt} so answer 
    // by finding important data and if relative to new prompt than consider answer rederence from chat history.
    // else answer from scratch.
    // ` : prompt;


    const streamingResponse = await model.generateContentStream(prompt);
    return new StreamingTextResponse(GoogleGenerativeAIStream(streamingResponse));

}

// import { createGoogleGenerativeAI } from '@ai-sdk/google';
// import { streamText, StreamData } from 'ai';

// const google = createGoogleGenerativeAI({
//     apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
// });

// export const maxDuration = 30;

// export async function POST(req: Request) {
//     try {
//         const { data: { prompt, history } } = await req.json();
        
//         let messages = history.map((item: any) => item.content);
//         messages.push(prompt);
//         console.log(messages);

//         const data = new StreamData();

//         const result = await streamText({
//             model: google('models/gemini-pro'),
//             messages: history,
//             onFinish: ({ usage, text, warnings }) => {
//                 console.log({ usage, text, warnings });
//                 data.append(text);
//                 data.close();
//             },
//         });

//         result.on('data', (chunk : any) => {
//             data.append(chunk);
//         });

//         result.on('end', () => {
//             data.close();
//         });

//         result.on('error', (err) => {
//             console.error('Stream error:', err);
//             data.close();
//         });

//         return data.toDataStreamResponse();
//     } catch (e) {
//         console.log(e);
//         return new Response("Error", { status: 500 });
//     }
// }
