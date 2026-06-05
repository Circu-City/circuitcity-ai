import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    const session = await requireAuth();

    const store = await prisma.store.findFirst({
      where: { userId: session.id },
      include: { subscriptions: { take: 1 } },
    });

    if (!store || !store.subscriptions[0]?.stripeId) {
      return NextResponse.json({ success: true, data: null });
    }

    const customerId = store.subscriptions[0].stripeId;

    // Get the customer to find default payment method
    const customer = await stripe.customers.retrieve(customerId, {
      expand: ["default_source", "invoice_settings.default_payment_method"],
    });

    if (customer.deleted) {
      return NextResponse.json({ success: true, data: null });
    }

    let paymentMethod = null;

    // Check for default payment method (modern way)
    if (customer.invoice_settings?.default_payment_method) {
      const pm = customer.invoice_settings.default_payment_method as any;
      if (pm.card) {
        paymentMethod = {
          brand: pm.card.brand,
          last4: pm.card.last4,
          exp_month: pm.card.exp_month,
          exp_year: pm.card.exp_year,
        };
      }
    } 
    // Fallback for older sources
    else if (customer.default_source && typeof customer.default_source === "object") {
      const source = customer.default_source as any;
      if (source.object === "card") {
        paymentMethod = {
          brand: source.brand,
          last4: source.last4,
          exp_month: source.exp_month,
          exp_year: source.exp_year,
        };
      }
    }

    return NextResponse.json({ success: true, data: paymentMethod });
  } catch (error: any) {
    console.error("Fetch payment method error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
