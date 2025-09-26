import {
  MODELS,
  TariffSlug,
  isModelAllowedForTariff,
} from "@/constants/allowed-models";
import { MESSAGE_LENGTH_LIMIT } from "@/constants/message-limit";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/prisma/prisma-client";

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
    const { message, model } = await req.json();
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

    if (!model || typeof model !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing model." },
        { status: 400 }
      );
    }
    const exists = MODELS.has(model);
    if (!exists) {
      return NextResponse.json(
        { error: "Invalid or missing model." },
        { status: 400 }
      );
    }

    let tariffSlug: TariffSlug = "free";
    const numericUserId = Number(session.user.id);
    if (!Number.isNaN(numericUserId)) {
      const dbUser = await prisma.user.findUnique({
        where: { id: numericUserId },
        include: { tariff: true },
      });
      if (dbUser?.tariff?.slug) {
        tariffSlug = dbUser.tariff.slug as TariffSlug;
      }
    }

    if (!isModelAllowedForTariff(model, tariffSlug)) {
      return NextResponse.json(
        {
          error: "Эта модель доступна только на платном тарифе.",
        },
        { status: 403 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: model,
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
