import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("⚠️  STRIPE_SECRET_KEY is not set. Stripe features will not work.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

export const STRIPE_PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_STARTER || "",
  growth: process.env.STRIPE_PRICE_GROWTH || "",
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE || "",
};

export function getPriceIdForPlan(plan: string): string {
  const normalized = plan.toLowerCase();
  if (normalized.includes("growth")) return STRIPE_PRICE_IDS.growth;
  if (normalized.includes("enterprise")) return STRIPE_PRICE_IDS.enterprise;
  return STRIPE_PRICE_IDS.starter;
}

export async function createCheckoutSession({
  userId,
  storeId,
  priceId,
  customerEmail,
}: {
  userId: string;
  storeId: string;
  priceId: string;
  customerEmail?: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?tab=billing&success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?tab=billing`,
    metadata: {
      userId,
      storeId,
    },
    customer_email: customerEmail,
    subscription_data: {
      metadata: {
        userId,
        storeId,
      },
    },
  });

  return session;
}

export async function createBillingPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?tab=billing`,
  });
  return session;
}

export async function reportUsageToStripe(subscriptionItemId: string, quantity: number, timestamp?: Date) {
  if (!stripe || !subscriptionItemId) return;

  try {
    await (stripe.subscriptionItems as any).createUsageRecord(subscriptionItemId, {
      quantity,
      timestamp: timestamp ? Math.floor(timestamp.getTime() / 1000) : undefined,
      action: "increment",
    });
  } catch (error) {
    console.error("Failed to report usage to Stripe:", error);
  }
}
