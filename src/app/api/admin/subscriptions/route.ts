import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subs = await prisma.subscription.findMany({
    include: { store: { select: { name: true, url: true, user: { select: { email: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(subs.map(s => ({
    id: s.id, storeName: s.store?.name || "—", storeUrl: s.store?.url || "",
    plan: s.plan, status: s.status, stripeId: s.stripeId || "—",
    currentPeriodEnd: s.currentPeriodEnd, userEmail: s.store?.user?.email || "—",
  })));
}
