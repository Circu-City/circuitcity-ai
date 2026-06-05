import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2025-01-27.acacia" as any });

export async function POST(req: NextRequest) {
    const sig = req.headers.get("stripe-signature") || "";
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
    let event;

    try {
        const body = await req.text();
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as any;
                const { storeId, plan } = session.metadata || {};
                if (storeId && plan) {
                    await prisma.subscription.upsert({
                        where: { storeId },
                        update: { plan, status: "active", stripeId: session.subscription },
                        create: { storeId, plan, status: "active", stripeId: session.subscription },
                    });
                    await prisma.store.update({ where: { id: storeId }, data: { status: "active" } });
                }
                break;
            }
            case "customer.subscription.deleted": {
                const sub = event.data.object as any;
                const dbSub = await prisma.subscription.findFirst({ where: { stripeId: sub.id } });
                if (dbSub) await prisma.subscription.update({ where: { id: dbSub.id }, data: { status: "cancelled" } });
                break;
            }
        }
        return NextResponse.json({ received: true });
    } catch (err) {
        console.error("Stripe webhook error:", err);
        return NextResponse.json({ error: "Webhook error" }, { status: 500 });
    }
}
