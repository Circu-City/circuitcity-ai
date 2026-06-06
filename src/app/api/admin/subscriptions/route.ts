import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const subs = await prisma.subscription.findMany({
      include: { store: { select: { id: true, name: true, url: true, user: { select: { email: true } } } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(subs.map(s => ({
      id: s.id, storeId: s.store?.id, storeName: s.store?.name || "—",
      storeUrl: s.store?.url || "", plan: s.plan, status: s.status,
      stripeId: s.stripeId || "—", currentPeriodEnd: s.currentPeriodEnd,
      userEmail: s.store?.user?.email || "—",
    })));
  } catch (e: any) {
    console.error("Admin subscriptions error:", e.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, plan, status } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const validPlans = ["free", "starter", "pro", "enterprise"];
    const validStatuses = ["active", "inactive", "past_due", "cancelled"];

    if (plan && !validPlans.includes(plan)) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    if (status && !validStatuses.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

    const data: any = {};
    if (plan) data.plan = plan;
    if (status) data.status = status;

    await prisma.subscription.update({ where: { id }, data });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Admin subscriptions update error:", e.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
