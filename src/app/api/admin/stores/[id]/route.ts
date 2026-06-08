import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, role: true, createdAt: true } },
        subscriptions: true,
        conversations: { orderBy: { createdAt: "desc" }, take: 30 },
        apiKeys: true,
        embedConfigs: { select: { widgetColor: true, position: true, title: true, toneStyle: true } },
        _count: { select: { conversations: true, products: true } },
      },
    });

    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    return NextResponse.json({
      id: store.id, name: store.name, url: store.url, industry: store.industry,
      apiKey: store.apiKey, status: store.status, embedCode: store.embedCode,
      embedConfig: (store as any).embedConfigs?.[0] || null,
      owner: store.user ? { id: store.user.id, name: store.user.name, email: store.user.email, role: store.user.role, createdAt: store.user.createdAt } : null,
      subscription: store.subscriptions?.[0] ? {
        id: store.subscriptions[0].id, plan: store.subscriptions[0].plan,
        status: store.subscriptions[0].status, stripeId: store.subscriptions[0].stripeId,
        currentPeriodEnd: store.subscriptions[0].currentPeriodEnd,
      } : null,
      apiKeys: store.apiKeys.map(k => ({ id: k.id, key: k.key, name: k.name, createdAt: k.createdAt })),
      conversations: store.conversations.map(c => ({
        id: c.id, customerName: c.customerName, status: c.status, escalated: c.escalated,
        createdAt: c.createdAt, messageCount: Array.isArray(c.messages) ? (c.messages as any[]).length : 0,
      })),
      counts: { conversations: store._count.conversations, products: store._count.products },
      createdAt: store.createdAt,
    });
  } catch (e: any) {
    console.error("Admin store detail error:", e.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
