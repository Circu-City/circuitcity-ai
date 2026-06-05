import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Plan } from "@prisma/client";

const PLAN_PRICES: Record<string, number> = { free: 0, starter: 0, growth: 4900, enterprise: 19900 };

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { plan } = await req.json();
    if (!plan || !(plan in PLAN_PRICES)) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    const store = await prisma.store.findFirst({ where: { userId: session.userId } });
    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    const planKey = plan as Plan;
    const sub = await prisma.subscription.findFirst({ where: { storeId: store.id } });

    // Sandbox mode - no real Stripe key needed
    if (sub) {
      await prisma.subscription.update({ where: { id: sub.id }, data: { plan: planKey } });
    } else {
      await prisma.subscription.create({ data: { storeId: store.id, plan: planKey } });
    }

    return NextResponse.json({
      sandbox: true,
      message: `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan activated!`,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed. Please try again." }, { status: 500 });
  }
}