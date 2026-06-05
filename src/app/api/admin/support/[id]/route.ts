import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const ticket = await prisma.conversation.findUnique({
    where: { id },
    include: { store: { select: { name: true } }, user: { select: { email: true, name: true } } },
  });

  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: ticket.id, storeName: ticket.store?.name || "—",
    customerName: ticket.customerName || "Visitor",
    email: ticket.email || ticket.user?.email || "—",
    messages: ticket.messages, status: ticket.status,
    escalated: ticket.escalated, createdAt: ticket.createdAt,
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();
  await prisma.conversation.update({ where: { id }, data: { status: status || "closed", escalated: false } });
  return NextResponse.json({ success: true });
}
