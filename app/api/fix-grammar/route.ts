
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { text, apiKey } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        if (!apiKey) {
            return NextResponse.json({ error: "API Key is required" }, { status: 401 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Fix the grammar and spelling of the following text. If it is in Hindi or Hinglish, translate it to clear, professional English. Keep the tone professional and concise. output ONLY the corrected text, no explanations.

Text: "${text}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const correctedText = response.text();

        return NextResponse.json({ correctedText: correctedText.trim() });
    } catch (error) {
        console.error("Error fixing grammar:", error);
        return NextResponse.json({ error: "Failed to process text" }, { status: 500 });
    }
}
