import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        stores: {
          include: { subscriptions: true, conversations: { orderBy: { createdAt: "desc" }, take: 5 } },
        },
        apiKeys: true,
        notifications: { orderBy: { createdAt: "desc" }, take: 20 },
        _count: { select: { stores: true, notifications: true } },
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      stores: user.stores.map(s => ({
        id: s.id,
        name: s.name,
        url: s.url,
        status: s.status,
        apiKey: s.apiKey,
        plan: s.subscriptions?.[0]?.plan || "starter",
        subscriptionStatus: s.subscriptions?.[0]?.status || "none",
        recentConversations: s.conversations.map(c => ({
          id: c.id, customerName: c.customerName, status: c.status, createdAt: c.createdAt,
        })),
      })),
      apiKeys: user.apiKeys.map(k => ({ id: k.id, key: k.key, name: k.name, createdAt: k.createdAt })),
      notifications: user.notifications,
      counts: { stores: user._count.stores, notifications: user._count.notifications },
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
