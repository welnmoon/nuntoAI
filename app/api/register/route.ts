import { prisma } from "@/prisma/prisma-client";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body) {
      throw new Error("No body");
    }
    const { fullName, email, password } = body;

    if (!fullName || !email || !password) {
      throw new Error("All fields are required");
    }

    const isExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isExists) {
      throw new Error("Пользователь уже зарегистрирован!");
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name: fullName,
        fullName,
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });

    if (!newUser) {
      throw new Error("User creation failed");
    }

    return NextResponse.json({
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
