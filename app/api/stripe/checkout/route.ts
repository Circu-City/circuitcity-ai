import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/db";
import { createCheckoutSession, getPriceIdForPlan, stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { plan } = await request.json();

    if (!plan) {
      return NextResponse.json({ error: "Plan is required" }, { status: 400 });
    }

    const priceId = getPriceIdForPlan(plan);
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan or price not configured" }, { status: 400 });
    }

    // Get user's store
    const store = await prisma.store.findFirst({
      where: { userId: session.id },
      include: { subscriptions: { take: 1 } },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Get or create Stripe customer
    let customerId = store.subscriptions[0]?.stripeId;

    if (!customerId) {
      const user = await prisma.user.findUnique({ where: { id: session.id } });
      const customer = await stripe.customers.create({
        email: user?.email,
        metadata: { userId: session.id, storeId: store.id },
      });
      customerId = customer.id;
    }

    const checkoutSession = await createCheckoutSession({
      userId: session.id,
      storeId: store.id,
      priceId,
      customerEmail: session.email,
    });

    return NextResponse.json({ success: true, url: checkoutSession.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: error.message || "Failed to create checkout session" }, { status: 500 });
  }
}
