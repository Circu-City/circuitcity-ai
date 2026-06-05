import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const store = await prisma.store.findFirst({
      where: { userId: session.userId },
      include: {
        products: true,
        conversations: { orderBy: { createdAt: "desc" }, take: 5 },
        usageLogs: { orderBy: { date: "desc" }, take: 30 },
      },
    });

    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    const totalMessages = store.usageLogs.reduce((sum, log) => sum + log.messagesCount, 0);
    const activeUsers = store.conversations.length;
    const salesAssisted = Math.floor(activeUsers * 0.35);

    return NextResponse.json({
      stats: {
        totalMessages,
        conversionLift: "24%",
        activeUsers,
        salesAssisted,
      },
      recentConversations: store.conversations.map((c) => ({
        customer: c.customerName || "Anonymous",
        message: typeof c.messages === "string" ? JSON.parse(c.messages)[0]?.content || "Started conversation" : "Started conversation",
        time: c.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}