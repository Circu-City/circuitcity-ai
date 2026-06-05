import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { message } = await req.json();
  if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });

  const ticket = await prisma.conversation.findUnique({ where: { id } });
  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const messages = Array.isArray(ticket.messages) ? [...ticket.messages as any[]] : [];
  messages.push({ role: "assistant", content: message, time: new Date().toISOString() });

  await prisma.conversation.update({ where: { id }, data: { messages, status: "active" } });

  return NextResponse.json({ success: true });
}
