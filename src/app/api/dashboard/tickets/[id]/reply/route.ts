import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const store = await prisma.store.findFirst({ where: { userId: session.userId } });
    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    const { message } = await req.json();
    if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });

    const conversation = await prisma.conversation.findUnique({ where: { id: params.id } });
    if (!conversation || conversation.storeId !== store.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const messages = (Array.isArray(conversation.messages) ? conversation.messages as any[] : []);
    messages.push({ role: "user", content: message, time: new Date().toISOString() });

    await prisma.conversation.update({
      where: { id: params.id },
      data: { messages, status: "active" },
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Ticket reply error:", e.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
