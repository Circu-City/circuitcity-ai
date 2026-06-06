import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PLAN_MAP: Record<string, { price: number; name: string }> = {
  starter: { price: 0, name: "Starter" },
  pro: { price: 4900, name: "Growth" },
  enterprise: { price: 19900, name: "Enterprise" },
};

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { plan } = await req.json();
    const validPlans = ["starter", "pro", "enterprise"];
    if (!plan || !validPlans.includes(plan)) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    let store = await prisma.store.findFirst({ where: { userId: session.userId } });
    if (!store) store = await prisma.store.create({
      data: { userId: session.userId, name: "My Store", status: "active", apiKey: "cc_live_" + Math.random().toString(36).substring(2, 18) },
    });

    const sub = await prisma.subscription.findFirst({ where: { storeId: store.id } });
    if (sub) {
      await prisma.subscription.update({ where: { id: sub.id }, data: { plan: plan as any, status: "active" } });
    } else {
      await prisma.subscription.create({ data: { storeId: store.id, plan: plan as any, status: "active", currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } });
    }

    if (plan === "pro" || plan === "enterprise") {
      try {
        const Stripe = require("stripe");
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (stripeKey) {
          const stripe = new Stripe(stripeKey);
          const priceData = PLAN_MAP[plan];
          const stripeSession = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [{ price_data: { currency: "sek", product_data: { name: `CircuCity AI - ${priceData.name}` }, unit_amount: priceData.price, recurring: { interval: "month" } }, quantity: 1 }],
            success_url: "https://chatbot.circucity.se/dashboard/billing?success=true",
            cancel_url: "https://chatbot.circucity.se/dashboard/billing?canceled=true",
            metadata: { storeId: store.id, plan, userId: session.userId },
          });
          return NextResponse.json({ url: stripeSession.url });
        }
      } catch (e: any) { console.error("Stripe:", e.message); }
    }

    return NextResponse.json({ success: true, message: `Plan set to ${plan}` });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 });
  }
}
