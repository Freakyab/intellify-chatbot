import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();
        const genai = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

        const model = genai.getGenerativeModel({ model: 'gemini-pro' });

        const newPrompt = `create the title for this chat using ${messages} array 
        understand the context of the chat and generate a title that best describes the chat in less than 15 words else generate a title that best describes the first index of the chat in less than 15 words
        `;

        const streamingResponse = await model.generateContentStream(newPrompt);
        const res = await streamingResponse.response;
        const reply = res.text();
        return NextResponse.json({
            status: "success",
            reply
        }, { status: 200 });
    } catch (err) {
        console.error("Error generating response:", err);
        return NextResponse.json({
            status: "error",
            message: "Internal Server Error"
        }, { status: 500 });
    }
}