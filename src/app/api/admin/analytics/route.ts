import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [users, stores, conversations, subscriptions, usageLogs, subData] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.conversation.count(),
      prisma.subscription.count(),
      prisma.usageLog.findMany({ orderBy: { date: "asc" } }),
      prisma.subscription.findMany({ where: { status: "active" }, select: { plan: true } }),
    ]);

    const monthlyMap: Record<string, number> = {};
    usageLogs.forEach(u => {
      const key = new Date(u.date).toLocaleString("en", { month: "short", year: "numeric" });
      monthlyMap[key] = (monthlyMap[key] || 0) + u.messagesCount;
    });

    const monthlyMessages = Object.entries(monthlyMap).slice(-12).map(([month, messages]) => ({ month, messages }));
    const maxMonthly = Math.max(...monthlyMessages.map(m => m.messages), 1);

    const planDist = subData.reduce((acc: Record<string, number>, s) => {
      acc[s.plan] = (acc[s.plan] || 0) + 1;
      return acc;
    }, {});

    const planDistribution = Object.entries(planDist).map(([plan, count]) => ({ plan, count }));

    const revenueBreakdown = Object.entries(planDist).map(([plan, count]) => {
      let price = 0;
      if (plan === "pro") price = 4900;
      if (plan === "enterprise") price = 19900;
      return { plan, count, revenue: price * count };
    });

    const activeSubscriptions = subData.length;
    const revenue = revenueBreakdown.reduce((t, r) => t + r.revenue, 0);

    return NextResponse.json({
      users, stores, conversations, totalSubscriptions: subscriptions,
      activeSubscriptions, revenue, maxMonthly, monthlyMessages,
      planDistribution, revenueBreakdown,
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
