// app/api/public/[publicId]/route.ts
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { publicId: string } }
) {
  const chat = await prisma.chat.findUnique({
    where: { publicId: params.publicId },
    select: {
      id: true,
      title: true,
      visibility: true,
      messages: {
        orderBy: { id: "asc" },
        select: { id: true, role: true, content: true, createdAt: true },
      },
    },
  });

  if (!chat || chat.visibility !== "SHARED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(chat);
}
