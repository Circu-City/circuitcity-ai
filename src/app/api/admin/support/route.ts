import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const tickets = await prisma.conversation.findMany({
      where: { escalated: true },
      include: { store: { select: { name: true } }, user: { select: { name: true, email: true } } },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });
    return NextResponse.json(tickets.map(t => ({
      id: t.id, storeName: t.store?.name || "—", customer: t.customerName || "Visitor",
      email: t.email || t.user?.email || "—", status: t.status,
      messages: Array.isArray(t.messages) ? (t.messages as any[]).length : 0,
      createdAt: t.createdAt, updatedAt: t.updatedAt,
    })));
  } catch (e: any) { return NextResponse.json({ error: "Failed to load tickets" }, { status: 500 }); }
}
