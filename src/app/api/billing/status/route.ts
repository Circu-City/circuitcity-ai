import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const store = await prisma.store.findFirst({ where: { userId: session.userId } });
    if (!store) return NextResponse.json({ plan: "starter", status: "none", messagesUsed: 0 });

    const sub = await prisma.subscription.findFirst({ where: { storeId: store.id } });
    const rawPlan = sub?.plan || "starter";
    const plan = rawPlan === "growth" ? "pro" : rawPlan;

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const messagesUsed = await prisma.usageLog.aggregate({
      where: { storeId: store.id, date: { gte: monthStart } },
      _sum: { messagesCount: true },
    });

    return NextResponse.json({
      plan,
      status: sub?.status || "active",
      currentPeriodEnd: sub?.currentPeriodEnd || null,
      messagesUsed: messagesUsed._sum.messagesCount || 0,
    });
  } catch {
    return NextResponse.json({ plan: "starter", status: "none", messagesUsed: 0 });
  }
}
