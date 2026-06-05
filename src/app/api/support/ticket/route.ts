import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subject, message } = await req.json();
    if (!subject || !message) return NextResponse.json({ error: "Subject and message required" }, { status: 400 });

    const store = await prisma.store.findFirst({ where: { userId: session.userId } });
    const user = await prisma.user.findUnique({ where: { id: session.userId } });

    await prisma.conversation.create({
      data: {
        storeId: store?.id || "admin",
        userId: session.userId,
        sessionId: "ticket_" + Date.now(),
        customerName: user?.name || "Support Ticket",
        email: user?.email || "",
        messages: [{ role: "user" as const, content: `[${subject}] ${message}` }],
        escalated: true,
        status: "active",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Support ticket error:", error);
    return NextResponse.json({ error: "Failed to submit ticket" }, { status: 500 });
  }
}
