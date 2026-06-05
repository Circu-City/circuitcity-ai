import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true, name: true, email: true },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const [users, stores, subscriptions, conversations, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.subscription.count(),
      prisma.conversation.count(),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      users,
      stores,
      subscriptions,
      conversations,
      recentUsers,
      userRole: user.role,
      admin: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
