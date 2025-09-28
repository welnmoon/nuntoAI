import { authOptions } from "@/lib/auth";
import { prisma } from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// DELETE chat by id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id?: string | string[] }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json(
      { error: "Not Auth" },
      {
        status: 401,
      }
    );
  }
  const resolved = (await params) ?? {};
  const rawId = Array.isArray(resolved.id) ? resolved.id[0] : resolved.id;
  const chatId = Number(rawId);
  const userId = Number(session.user.id);
  if (!Number.isFinite(chatId)) {
    return NextResponse.json({ error: "Invalid chat id" }, { status: 400 });
  }

  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    await prisma.chat.delete({
      where: {
        id: chatId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return new NextResponse(null, { status: 204 }); // уже удалён / не найден
    }
    console.error("Ошибка при удалении чата:", e);
    return NextResponse.json(
      { error: "Не удалось удалить чат" },
      { status: 500 }
    );
  }
}

// Change title
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id?: string | string[] }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  try {
    const { title } = await req.json();

    if (!title || title.trim().length < 2) {
      return NextResponse.json(
        { error: "Название слишком короткое" },
        { status: 400 }
      );
    }

    const resolved = (await params) ?? {};
    const rawId = Array.isArray(resolved.id) ? resolved.id[0] : resolved.id;
    const chatId = Number(rawId);
    if (!Number.isFinite(chatId)) {
      return NextResponse.json({ error: "Invalid chat id" }, { status: 400 });
    }

    const hasChat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: Number(session.user.id),
      },
    });
    if (!hasChat) {
      return NextResponse.json({ error: "Чат не найден" }, { status: 404 });
    }
    const updated = await prisma.chat.update({
      where: { id: chatId },
      data: { title: title.trim() },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (e) {
    console.error("Ошибка при обновлении чата:", e);

    return NextResponse.json(
      { error: "Не удалось обновить чат" },
      { status: 500 }
    );
  }
}