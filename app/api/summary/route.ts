import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { history } = await req.json();
        const genai = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

        const model = genai.getGenerativeModel({ model: 'gemini-pro' });

        const newPrompt = `
        History: ${JSON.stringify(history)}
            this is an history array summarize short in user and assistance role and with content
        `;

        const streamingResponse = await model.generateContentStream(newPrompt);
        const res = await streamingResponse.response;
        const reply = res.text();
        return NextResponse.json({ reply }, { status: 200 });
    } catch (err) {
        console.error("Error generating response:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
