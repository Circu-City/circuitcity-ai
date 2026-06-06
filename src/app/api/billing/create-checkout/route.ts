import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { plan } = await req.json();
    const validPlans = ["free", "starter", "growth", "enterprise"];
    if (!plan || !validPlans.includes(plan)) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    let store = await prisma.store.findFirst({ where: { userId: session.userId } });
    if (!store) {
      store = await prisma.store.create({
        data: { userId: session.userId, name: "My Store", status: "active", apiKey: "cc_live_" + Math.random().toString(36).substring(2, 18) },
      });
    }

    const sub = await prisma.subscription.findFirst({ where: { storeId: store.id } });
    if (sub) {
      await prisma.subscription.update({ where: { id: sub.id }, data: { plan: plan as any, status: "active" } });
    } else {
      await prisma.subscription.create({ data: { storeId: store.id, plan: plan as any, status: "active" } });
    }

    return NextResponse.json({ success: true, plan, message: "Subscription updated" });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Checkout failed" }, { status: 500 });
  }
}
