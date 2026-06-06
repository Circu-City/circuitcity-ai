import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const store = await prisma.store.findFirst({ where: { userId: session.userId } });
    if (!store) return NextResponse.json({ plan: "free", status: "none" });

    const sub = await prisma.subscription.findFirst({ where: { storeId: store.id } });
    const rawPlan = sub?.plan || "free";
    const plan = rawPlan === "growth" ? "pro" : rawPlan === "pro" ? "pro" : rawPlan === "starter" ? "starter" : rawPlan === "enterprise" ? "enterprise" : "free";
    return NextResponse.json({
      plan: plan,
      status: sub?.status || "active",
      currentPeriodEnd: sub?.currentPeriodEnd || null,
    });
  } catch {
    return NextResponse.json({ plan: "free", status: "none" });
  }
}
