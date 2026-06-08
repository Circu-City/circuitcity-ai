import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const ticket = await prisma.conversation.findUnique({
      where: { id },
      include: { store: { select: { name: true } }, user: { select: { name: true, email: true } } },
    });

    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

    return NextResponse.json({
      id: ticket.id, storeName: ticket.store?.name || "—",
      customerName: ticket.customerName || "Visitor",
      email: ticket.email || ticket.user?.email || "—",
      messages: Array.isArray(ticket.messages) ? ticket.messages : [],
      status: ticket.status, escalated: ticket.escalated,
      createdAt: ticket.createdAt,
    });
  } catch (e: any) {
    console.error("Admin support detail error:", e.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { status } = await req.json();
    const ticket = await prisma.conversation.findUnique({ where: { id } });
    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

    await prisma.conversation.update({
      where: { id },
      data: { status, escalated: false },
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Admin support update error:", e.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
