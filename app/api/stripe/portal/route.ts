import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/db";
import { createBillingPortalSession, stripe } from "@/lib/stripe";

export async function POST() {
  try {
    const session = await requireAuth();

    const store = await prisma.store.findFirst({
      where: { userId: session.id },
      include: { subscriptions: { take: 1 } },
    });

    if (!store || !store.subscriptions[0]?.stripeId) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 400 });
    }

    const customerId = store.subscriptions[0].stripeId;

    const portalSession = await createBillingPortalSession(customerId);

    return NextResponse.json({ success: true, url: portalSession.url });
  } catch (error: any) {
    console.error("Stripe portal error:", error);
    return NextResponse.json({ error: error.message || "Failed to create portal session" }, { status: 500 });
  }
}
