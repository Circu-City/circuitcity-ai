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
    if (!plan || !PLAN_MAP[plan]) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    let store = await prisma.store.findFirst({ where: { userId: session.userId } });
    if (!store) {
      store = await prisma.store.create({
        data: { userId: session.userId, name: "My Store", status: "active",
          apiKey: "cc_live_" + Math.random().toString(36).substring(2, 18) },
      });
    }

    // Free plan — activate immediately without Stripe
    if (plan === "starter") {
      const sub = await prisma.subscription.findFirst({ where: { storeId: store.id } });
      if (sub) {
        await prisma.subscription.update({ where: { id: sub.id }, data: { plan: "starter", status: "active" } });
      } else {
        await prisma.subscription.create({ data: { storeId: store.id, plan: "starter", status: "active" } });
      }
      return NextResponse.json({ success: true, message: "Starter plan activated" });
    }

    // Paid plans — create Stripe checkout, activation via webhook only
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: "Payment system not configured" }, { status: 500 });
    }

    const Stripe = require("stripe");
    const stripe = new Stripe(stripeKey);
    const priceData = PLAN_MAP[plan];

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{
        price_data: { currency: "sek", product_data: { name: `CircuCity AI - ${priceData.name}` }, unit_amount: priceData.price, recurring: { interval: "month" } },
        quantity: 1,
      }],
      success_url: "https://chatbot.circucity.se/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://chatbot.circucity.se/dashboard/billing?canceled=true",
      metadata: { storeId: store.id, plan, userId: session.userId },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Checkout failed" }, { status: 500 });
  }
}
