"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { hashPassword, verifyPassword, createToken, SessionUser } from "@/lib/auth";

export async function signUp(data: { email: string; password: string; name?: string }) {
  const { email, password, name } = data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Email already registered" };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, name, passwordHash },
  });

  const session: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "customer" | "admin",
    image: user.image,
  };

  const token = createToken(session);
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  // Create store + subscription automatically
  await prisma.store.create({
    data: {
      userId: user.id,
      name: name || "My Store",
      subscriptions: {
        create: { plan: "free", status: "trialing" },
      },
      embedSettings: { create: {} },
    },
  });

  return { success: true };
}

export async function signIn(data: { email: string; password: string }) {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    return { error: "Invalid credentials" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid credentials" };
  }

  const session: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "customer" | "admin",
    image: user.image,
  };

  const token = createToken(session);
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return { success: true, user: session };
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", { maxAge: 0, path: "/" });
  redirect("/");
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  const { verifyToken } = await import("@/lib/auth");
  return verifyToken(token);
}