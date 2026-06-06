import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const store = await prisma.store.findFirst({ where: { userId: session.userId } });
    if (!store) return NextResponse.json({ conversations: 0, messages: 0, monthly: [] });
    const storeIds = [store.id];
    const [totalConvs, totalMsgs] = await Promise.all([
      prisma.conversation.count({ where: { storeId: { in: storeIds } } }),
      prisma.usageLog.aggregate({ where: { storeId: { in: storeIds }, date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }, _sum: { messagesCount: true } }),
    ]);

    const monthly = await prisma.usageLog.groupBy({
      by: ["date"],
      where: { storeId: { in: storeIds }, date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      _sum: { messagesCount: true },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({
      conversations: totalConvs,
      messages: totalMsgs._sum.messagesCount || 0,
      monthly: monthly.map(d => ({ date: d.date, messages: d._sum.messagesCount || 0 })),
    });
  } catch {
    return NextResponse.json({ conversations: 0, messages: 0, monthly: [] });
  }
}
