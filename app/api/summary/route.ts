import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();
        const genai = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

        const model = genai.getGenerativeModel({ model: 'gemini-pro' });

        const newMessage = messages
            .slice(0, 5)
            .map((message: {
                content: string;
            }) => message.content).join(' ');

        const newPrompt =
            `-create the title for this data using ${JSON.stringify(newMessage)} array summarize the data.
        - the output should be a string 
        - dont return markdown
        - remember the length of the title should be less than 10 characters
        
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