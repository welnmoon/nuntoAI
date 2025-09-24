import { MESSAGE_LENGTH_LIMIT } from "@/constants/message-limit";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "My GPT App",
  },
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json({ error: "Not Auth" }, { status: 401 });
  }
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing message." },
        { status: 400 }
      );
    }
    if (message.trim().length > MESSAGE_LENGTH_LIMIT) {
      return NextResponse.json(
        {
          error: `Message exceeds length limit of ${MESSAGE_LENGTH_LIMIT} characters.`,
        },
        { status: 400 }
      );
    }
    // При необходимости можно получить userId через getServerSession

    const completion = await openai.chat.completions.create({
      model: "x-ai/grok-4-fast:free",
      messages: [{ role: "user", content: message }],
      max_tokens: 512,
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const part of completion) {
            const text = part.choices[0]?.delta?.content || "";

            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/octet-stream; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("❌ OpenAI API error:", error);
    return NextResponse.json(
      { error: "Something went wrong on the server." },
      { status: 500 }
    );
  }
}
