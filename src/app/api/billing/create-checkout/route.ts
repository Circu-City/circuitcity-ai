import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PLAN_PRICES: Record<string, { amount: number; name: string }> = {
  starter: { amount: 0, name: "Starter" },
  growth: { amount: 4900, name: "Growth" },
  enterprise: { amount: 19900, name: "Enterprise" },
};

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { plan } = await req.json();
    if (!plan || !(plan in PLAN_PRICES)) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    let store = await prisma.store.findFirst({ where: { userId: session.userId } });
    if (!store) store = await prisma.store.create({ data: { userId: session.userId, name: "My Store", status: "pending" } });

    const sub = await prisma.subscription.findFirst({ where: { storeId: store.id } });
    if (sub) {
      await prisma.subscription.update({ where: { id: sub.id }, data: { plan: plan as any, status: "active" } });
    } else {
      await prisma.subscription.create({ data: { storeId: store.id, plan: plan as any, status: "active" } });
    }

    if (process.env.STRIPE_SECRET_KEY && plan !== "starter" && plan !== "free") {
      try {
        const Stripe = require("stripe");
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const price = PLAN_PRICES[plan];
        const stripeSession = await stripe.checkout.sessions.create({
          mode: "subscription",
          payment_method_types: ["card"],
          line_items: [{ price_data: { currency: "sek", product_data: { name: `CircuCity AI - ${price.name}` }, unit_amount: price.amount, recurring: { interval: "month" } }, quantity: 1 }],
          success_url: `https://chatbot.circucity.se/dashboard/billing?success=true`,
          cancel_url: `https://chatbot.circucity.se/dashboard/billing?canceled=true`,
          metadata: { storeId: store.id, plan, userId: session.userId },
        });
        return NextResponse.json({ url: stripeSession.url });
      } catch (e: any) {
        console.error("Stripe error:", e.message);
      }
    }

    return NextResponse.json({ success: true, message: `Plan updated to ${plan}` });
  } catch (error: any) {
    console.error("Checkout error:", error?.message || error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
