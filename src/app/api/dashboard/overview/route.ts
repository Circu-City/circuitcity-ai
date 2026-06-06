import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [stores, usageLogs, conversationsData] = await Promise.all([
      prisma.store.findMany({ where: { userId: session.userId }, include: { subscription: true, apiKeys: { take: 1 } } }),
      prisma.usageLog.findMany({ where: { store: { userId: session.userId } }, orderBy: { date: "desc" }, take: 30 }),
      prisma.conversation.findMany({ where: { store: { userId: session.userId } }, orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

    const store = stores[0];
    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    const totalMessages = usageLogs.reduce((sum, log) => sum + log.messagesCount, 0);
    const activeUsers = conversationsData.length;
    const salesAssisted = Math.floor(activeUsers * 0.35);

    return NextResponse.json({
      stats: { totalMessages, conversionLift: "24%", activeUsers, salesAssisted },
      stores: stores.map(s => ({
        id: s.id, name: s.name, url: s.url, status: s.status, apiKey: s.apiKey,
        phone: null, address: null,
        apiKeys: s.apiKeys?.map(k => ({ id: k.id, key: k.key, name: k.name })),
        embedCode: s.embedCode,
      })),
      recentConversations: conversationsData.map((c: any) => ({
        customer: c.customerName || "Anonymous",
        message: typeof c.messages === "string" ? JSON.parse(c.messages)[0]?.content || "Started conversation" : "Started conversation",
        time: c.createdAt.toISOString(),
      })) || [],
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}