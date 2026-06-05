import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/db";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, storeId } = session.metadata || {};

        if (userId && storeId && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

          const periodEnd = subscription.items.data[0]?.current_period_end;
          await prisma.subscription.upsert({
            where: { stripeId: subscription.id },
            update: {
              status: subscription.status as any,
              currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : undefined,
              stripePriceId: subscription.items.data[0]?.price.id,
            },
            create: {
              storeId,
              stripeId: subscription.id,
              stripePriceId: subscription.items.data[0]?.price.id,
              status: subscription.status as any,
              plan: getPlanFromPriceId(subscription.items.data[0]?.price.id),
              currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : undefined,
            },
          });
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const periodEnd = subscription.items.data[0]?.current_period_end;
        await prisma.subscription.updateMany({
          where: { stripeId: subscription.id },
          data: {
            status: subscription.status as any,
            currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : undefined,
            stripePriceId: subscription.items.data[0]?.price.id,
            plan: getPlanFromPriceId(subscription.items.data[0]?.price.id),
          },
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

function getPlanFromPriceId(priceId: string | undefined): "free" | "starter" | "pro" | "enterprise" {
  const priceMap: Record<string, "free" | "starter" | "pro" | "enterprise"> = {
    [process.env.STRIPE_PRICE_GROWTH || ""]: "enterprise",
    [process.env.STRIPE_PRICE_ENTERPRISE || ""]: "enterprise",
  };
  return priceMap[priceId || ""] || "starter";
}
