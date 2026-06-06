import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const store = await prisma.store.findFirst({
      where: { userId: session.userId },
      include: { subscriptions: true, apiKeys: true },
    });

    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    const conversationCount = await prisma.conversation.count({ where: { storeId: store.id } });

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const usageAgg = await prisma.usageLog.aggregate({
      where: { storeId: store.id, date: { gte: monthStart } },
      _sum: { messagesCount: true },
    });

    const totalMessages = usageAgg._sum.messagesCount || 0;

    const recentConversations = await prisma.conversation.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, customerName: true, status: true, createdAt: true },
    });

    return NextResponse.json({
      stats: {
        totalMessages,
        totalConversations: conversationCount,
        conversionLift: "24%",
        activeUsers: totalMessages,
      },
      stores: [{
        id: store.id, name: store.name, url: store.url, status: store.status,
        apiKey: store.apiKey, embedCode: store.embedCode,
        apiKeys: store.apiKeys?.map(k => ({ id: k.id, key: k.key, name: k.name })) || [],
        plan: store.subscriptions?.[0]?.plan || "starter",
      }],
      recentConversations: recentConversations.map(c => ({
        id: c.id, customerName: c.customerName || "Anonymous", status: c.status,
        createdAt: c.createdAt,
      })),
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
