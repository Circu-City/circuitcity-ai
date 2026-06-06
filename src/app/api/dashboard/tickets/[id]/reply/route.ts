import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { message } = await req.json();
  if (!message?.trim()) return NextResponse.json({ error: "Message required" }, { status: 400 });

  const conv = await prisma.conversation.findUnique({ where: { id, store: { userId: session.userId } } });
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const messages = Array.isArray(conv.messages) ? [...conv.messages] : [];
  messages.push({ role: "user", content: message.trim(), time: new Date().toISOString() });

  await prisma.conversation.update({
    where: { id },
    data: { messages, escalated: true, status: "active" },
  });

  return NextResponse.json({ success: true });
}
