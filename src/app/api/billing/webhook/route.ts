import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Missing config" }, { status: 400 });
  }

  try {
    const Stripe = require("stripe");
    const stripe = new Stripe(stripeKey);
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { storeId, plan } = session.metadata || {};
        if (!storeId || !plan) break;

        const sub = await prisma.subscription.findFirst({ where: { storeId } });
        if (sub) {
          await prisma.subscription.update({
            where: { id: sub.id },
            data: { plan, status: "active", stripeSubscriptionId: session.subscription, currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
          });
        } else {
          await prisma.subscription.create({
            data: { storeId, plan, status: "active", stripeSubscriptionId: session.subscription, currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object;
        const existing = await prisma.subscription.findFirst({ where: { stripeSubscriptionId: sub.id } });
        const product = sub.items?.data?.[0]?.price?.product;
        const productName: string = typeof product === "string" ? "" : product?.name || "";

        let plan = "starter";
        if (productName.includes("Growth") || sub.items?.data?.[0]?.price?.unit_amount === 4900) plan = "pro";
        else if (productName.includes("Enterprise") || sub.items?.data?.[0]?.price?.unit_amount === 19900) plan = "enterprise";

        if (existing) {
          await prisma.subscription.update({
            where: { id: existing.id },
            data: { plan, status: sub.status, currentPeriodEnd: new Date(sub.current_period_end * 1000) },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: "cancelled", plan: "starter" },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
