import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "My GPT App",
  },
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o",
      messages: [{ role: "user", content: message }],
      max_tokens: 1000,
    });
    console.log("✅ OpenAI API response:", completion);
    if (!completion.choices || completion.choices.length === 0) {
      return NextResponse.json(
        { error: "No response from OpenAI API." },
        { status: 500 }
      );
    }

    await prisma.chat.create({
      data: {
        title: "Title",
        userId: 1,
      },
    });

    return NextResponse.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("❌ OpenAI API error:", error);
    return NextResponse.json(
      { error: "Something went wrong on the server." },
      { status: 500 }
    );
  }
}
