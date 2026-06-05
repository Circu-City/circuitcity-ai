import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createUser, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const user = await createUser({ name, email, password });

    // Create default store for the user
    const store = await prisma.store.create({
      data: {
        userId: user.id,
        name: `${name}'s Store`,
        status: "pending",
        embedCode: "",
      },
    });

    // Create free subscription
    await prisma.subscription.create({
      data: {
        storeId: store.id,
        plan: "free",
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
      },
    });

    // Create default embed config
    await prisma.embedConfig.create({
      data: { storeId: store.id },
    });

    await createSession(user.id, user.email, user.role);

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
      storeId: store.id,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}