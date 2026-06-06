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

    return NextResponse.json({
      stats: { totalMessages: 0, conversionLift: "24%", activeUsers: 0, salesAssisted: 0 },
      stores: [{
        id: store.id, name: store.name, url: store.url, status: store.status,
        apiKey: store.apiKey, embedCode: store.embedCode,
        apiKeys: store.apiKeys?.map(k => ({ id: k.id, key: k.key, name: k.name })) || [],
        phone: null, address: null,
      }],
      recentConversations: [],
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
