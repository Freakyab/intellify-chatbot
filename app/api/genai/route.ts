import { StreamingTextResponse, GoogleGenerativeAIStream } from "ai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request, res: Response) {
    const reqBody = await req.json();
    const { prompt } = reqBody.data;

    const genai = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

    const model = genai.getGenerativeModel({ model: 'gemini-pro' })

    const streamingResponse = await model.generateContentStream(prompt);

    return new StreamingTextResponse(GoogleGenerativeAIStream(streamingResponse));

    // return new StreamingTextResponse("Hello, World!");
}