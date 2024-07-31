import { StreamingTextResponse, GoogleGenerativeAIStream } from "ai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    const reqBody = await req.json();
    const { prompt, history } = reqBody.data;

    const genai = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

    const model = genai.getGenerativeModel({ model: 'gemini-pro' });

    const botHistory = history
        .map((item: any) => item.content)
        .join("\n");

    const newPrompt = botHistory.length > 0
        ? `The chat history is: ${botHistory}. The current prompt is: ${prompt}. Please provide an answer considering the chat history and the new prompt.`
        : prompt;

    const streamingResponse = await model.generateContentStream(newPrompt);

    return new StreamingTextResponse(GoogleGenerativeAIStream(streamingResponse));
}
