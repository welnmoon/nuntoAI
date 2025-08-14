import { prisma } from "@/prisma/prisma-client";
import { MessageRole } from "@prisma/client";
import { getServerSession } from "next-auth";
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
    console.log("[API/openai] POST request body message:", message);
    if (!message || typeof message !== "string") {
      console.log("[API/openai] Invalid or missing message");
      return NextResponse.json(
        { error: "Invalid or missing message." },
        { status: 400 }
      );
    }

    const userId = Number((await getServerSession())?.user.id);

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o",
      messages: [{ role: "user", content: message }],
      max_tokens: 1000,
    });
    console.log("[API/openai] OpenAI API response:", JSON.stringify(completion));

    // Гарантированно получаем строку сообщения ассистента
    const assistantMessage = completion.choices && completion.choices[0] && completion.choices[0].message && completion.choices[0].message.content;
    console.log("[API/openai] assistantMessage:", assistantMessage);
    if (!assistantMessage || typeof assistantMessage !== "string") {
      console.log("[API/openai] No valid response from OpenAI API.");
      return NextResponse.json(
        { error: "No valid response from OpenAI API." },
        { status: 500 }
      );
    }

    const title = message.slice(0, 50) || "New Chat";
    console.log("[API/openai] Chat title:", title);

    if (userId) {
      await prisma.chat.create({
        data: {
          title,
          userId,
          messages: {
            create: [
              {
                role: MessageRole.USER,
                content: message,
              },
              {
                role: MessageRole.ASSISTANT,
                content: assistantMessage,
              },
            ],
          },
        },
      });
      console.log("[API/openai] Messages written to DB");
    }

    console.log("[API/openai] Ответ возвращён на фронт", { reply: assistantMessage });
    return NextResponse.json({
      reply: assistantMessage,
    });
  } catch (error) {
    console.error("❌ OpenAI API error:", error);
    return NextResponse.json(
      { error: "Something went wrong on the server." },
      { status: 500 }
    );
  }
}
