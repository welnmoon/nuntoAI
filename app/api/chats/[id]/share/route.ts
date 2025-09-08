// app/api/chats/[id]/share/route.ts

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/prisma/prisma-client";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id?: string | string[] }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resolved = (await params) ?? {};
  const rawId = Array.isArray(resolved.id) ? resolved.id[0] : resolved.id;
  const chatId = Number(rawId);
  const body = await req.json().catch(() => ({}));
  if (typeof body.enable !== "boolean") {
    return NextResponse.json({ error: "enable must be boolean" }, { status: 400 });
  }
  const enable: boolean = body.enable;

  const chat = await prisma.chat.findUnique({ where: { id: chatId } });
  if (!chat) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (chat.userId !== Number(session.user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (enable) {
    const publicId = chat.publicId ?? crypto.randomUUID();
    const updated = await prisma.chat.update({
      where: { id: chatId },
      data: { visibility: "SHARED", publicId },
      select: { publicId: true, visibility: true },
    });
    return NextResponse.json(updated);
  } else {
    const updated = await prisma.chat.update({
      where: { id: chatId },
      data: { visibility: "PRIVATE", publicId: null },
      select: { publicId: true, visibility: true },
    });
    return NextResponse.json(updated);
  }
}
