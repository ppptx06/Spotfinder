import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, userType } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Заполните все обязательные поля" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже зарегистрирован" },
        { status: 409 }
      );
    }

    const type = userType || "STUDENT";

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash: password,
        userType: type,
        isVerified: type === "STUDENT" && email.includes(".edu"),
        ...(type === "ADMIN"
          ? {
              adminProfile: {
                create: {
                  accessLevel: "MODERATOR",
                },
              },
            }
          : {}),
      },
      include: { adminProfile: true },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        isVerified: user.isVerified,
        isAdmin: user.userType === "ADMIN",
      },
      success: true,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Ошибка регистрации" }, { status: 500 });
  }
}
