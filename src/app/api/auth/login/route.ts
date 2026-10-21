import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email и пароль обязательны" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { adminProfile: true },
    });

    if (!user || user.passwordHash !== password) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        isVerified: user.isVerified,
        isAdmin: user.userType === "ADMIN",
        accessLevel: user.adminProfile?.accessLevel || null,
      },
      success: true,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Ошибка авторизации" }, { status: 500 });
  }
}
