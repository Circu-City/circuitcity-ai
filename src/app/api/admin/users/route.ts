import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, role: true, createdAt: true } });
    return NextResponse.json({ users });
  } catch (e: any) {
    console.error("Admin users error:", e.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { userId, role } = await req.json();
    if (!userId || !role) return NextResponse.json({ error: "userId and role required" }, { status: 400 });
    if (!["customer", "admin"].includes(role)) return NextResponse.json({ error: "Invalid role" }, { status: 400 });

    await prisma.user.update({ where: { id: userId }, data: { role } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Admin users update error:", e.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Admin users delete error:", e.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
