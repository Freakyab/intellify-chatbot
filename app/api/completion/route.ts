import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const resBody = await req.json();
        console.log(resBody, "resBody")
        const genai = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

        const model = genai.getGenerativeModel({ model: 'gemini-pro' });
        const newPrompt = `create the title for this chat using ${resBody} as the first question dont return markdown remember the length of the title should be less than 10 characters`;
        const streamingResponse = await model.generateContentStream(newPrompt);

        const res = await streamingResponse.response;
        const reply = res.text();
        console.log(reply, "reply")
        return NextResponse.json({ reply }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
