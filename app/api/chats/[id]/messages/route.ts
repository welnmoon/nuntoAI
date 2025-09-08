import { prisma } from "@/prisma/prisma-client";
import { MessageRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "Nunto AI",
  },
});

function heuristicTitleFromText(text: string): string {
  try {
    const firstLine = text.split(/\r?\n/)[0] || text;
    // Уберем markdown и лишние пробелы
    const cleaned = firstLine
      .replace(/[#*_`>\[\]\(\)!]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    // Обрежем до 60 символов по словам
    const limit = 60;
    let result =
      cleaned.length <= limit ? cleaned : cleaned.slice(0, limit + 1);
    if (result.length > limit) {
      const lastSpace = result.lastIndexOf(" ");
      if (lastSpace > 20) result = result.slice(0, lastSpace);
      else result = result.slice(0, limit);
    }
    // Удалим кавычки и завершающую пунктуацию
    result = result.replace(/^"|"$/g, "").replace(/[\.:;,!\-\s]+$/g, "");
    // С заглавной буквы
    if (result) result = result[0].toUpperCase() + result.slice(1);
    return result || "Новый чат";
  } catch {
    return "Новый чат";
  }
}

async function suggestTitleWithAI(text: string): Promise<string | null> {
  if (!process.env.OPENROUTER_API_KEY) return null;
  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o",
      temperature: 0.2,
      max_tokens: 32,
      messages: [
        {
          role: "system",
          content:
            "Ты придумываешь короткие и информативные заголовки чатов на русском. 3–7 слов, без кавычек и точки в конце. Верни только заголовок. Если не понятна тема, верни 'Давай поговорим'.",
        },
        {
          role: "user",
          content: `Сформулируй заголовок по теме беседы: ${text}`,
        },
      ],
    });
    const raw = completion.choices?.[0]?.message?.content?.trim() || "";
    if (!raw) return null;
    // Санитизация
    const cleaned = raw
      .replace(/^"|"$/g, "")
      .replace(/[\n\r]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/[\.:;,!\-\s]+$/g, "");
    const limited = cleaned.length > 60 ? cleaned.slice(0, 60) : cleaned;
    return limited || null;
  } catch (e) {
    console.error("Title suggestion error:", e);
    return null;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id?: string | string[] }> }
) {
  try {
    const resolved = (await params) ?? {};
    const rawId = Array.isArray(resolved.id) ? resolved.id[0] : resolved.id;
    const chatId = Number(rawId);
    if (!chatId || isNaN(chatId)) {
      return NextResponse.json({ error: "Invalid chat id." }, { status: 400 });
    }

    const session = await getServerSession();
    const userId = session?.user?.id ? Number(session.user.id) : null;

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { userId: true, id: true },
    });
    if (!chat) {
      return NextResponse.json({ error: "Chat not found." }, { status: 404 });
    }
    if (chat.userId && userId && chat.userId !== userId) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { content, role } = await request.json();
    if (
      !content ||
      typeof content !== "string" ||
      !role ||
      !(role === "USER" || role === "ASSISTANT")
    ) {
      return NextResponse.json(
        { error: "Invalid message content or role." },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content,
        role: role as MessageRole,
        chatId,
      },
    });

    // Обновляем updatedAt у чата, чтобы в списке чатов он поднимался наверх
    try {
      await prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
      });
    } catch (e) {
      // Не критично для основного потока, просто логируем
      console.warn("Failed to bump chat updatedAt:", e);
    }

    // Автогенерация названия чата по первому пользовательскому сообщению
    // 1) Только для USER-сообщения
    // 2) Только если это первое USER-сообщение в чате
    // 3) Только если у чата все еще дефолтное название "Новый чат ..."
    try {
      if (role === "USER") {
        const userMsgsCount = await prisma.message.count({
          where: { chatId, role: MessageRole.USER },
        });
        if (userMsgsCount === 1) {
          const chatRecord = await prisma.chat.findUnique({
            where: { id: chatId },
            select: { title: true },
          });
          if (chatRecord?.title?.startsWith("Новый чат")) {
            const ai = await suggestTitleWithAI(content);
            const candidate = ai || heuristicTitleFromText(content);
            const safe =
              candidate && candidate.length >= 2 ? candidate : "Новый чат";
            await prisma.chat.update({
              where: { id: chatId },
              data: { title: safe },
            });
          }
        }
      }
    } catch (e) {
      // Не валим основной ответ, если генерация заголовка не удалась
      console.warn("Auto-title generation failed:", e);
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error adding message to chat:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
