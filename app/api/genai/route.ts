import { StreamingTextResponse, GoogleGenerativeAIStream } from "ai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request, res: Response) {
    const reqBody = await req.json();
    const { prompt, history } = reqBody.data;

    const genai = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

    const model = genai.getGenerativeModel({ model: 'gemini-pro' })

    const botHistory = history
        .map((item: any) => item.content).join("\n");

    const newPrompt = botHistory.length > 0 ?
        `The chat history is ${botHistory} and current prompt is ${prompt} so answer 
    by finding important data and if relative to new prompt than consider answer rederence from chat history.
    ` : prompt;


    const streamingResponse = await model.generateContentStream(newPrompt);
    console.log(streamingResponse);
    return new StreamingTextResponse(GoogleGenerativeAIStream(streamingResponse));

}