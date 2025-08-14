import { prisma } from "@/prisma/prisma-client";
import { MessageRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const chatId = Number(params.id);
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
    if (!content || typeof content !== "string" || !role || !(role === "USER" || role === "ASSISTANT")) {
      return NextResponse.json({ error: "Invalid message content or role." }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        role: role as MessageRole,
        chatId,
      },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error adding message to chat:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
