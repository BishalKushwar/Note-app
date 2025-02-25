import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI_API_KEY);

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    // Use the Gemini model to generate a recommendation
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(
      `Provide a concise recommendation or improvement suggestion for the following note:\n\n${content}`
    );

    const recommendation = result.response.text().trim() || "No recommendation available.";
    return NextResponse.json({ recommendation });
  } catch (error) {
    console.error("Error generating AI recommendation:", error);
    return NextResponse.json({ error: "Failed to generate recommendation" }, { status: 500 });
  }
}