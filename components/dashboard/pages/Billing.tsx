"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  CheckCircle2, 
  Zap, 
  Download,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const PLANS = [
  { 
    name: "Starter", 
    price: 0, 
    priceLabel: "$0",
    description: "Ideal for new stores getting started with AI support.", 
    features: ["Up to 1,000 messages/mo", "1 Store Connection", "Basic Analytics"],
    comingSoon: true,
  },
  { 
    name: "Growth", 
    price: 49, 
    priceLabel: "$49",
    description: "Perfect for growing stores scaling their customer service.", 
    features: ["Up to 10,000 messages/mo", "3 Store Connections", "Advanced Analytics", "Priority Support", "Custom Brand Voice"],
    comingSoon: true,
  },
  { 
    name: "Enterprise", 
    price: 199, 
    priceLabel: "$199",
    description: "Maximum power for high-volume e-commerce brands.", 
    features: ["Unlimited messages", "Unlimited Stores", "Dedicated Account Manager", "Custom API Integrations", "SLA Guarantee"],
    comingSoon: true,
  },
];

export default function Billing() {
  const [subscription, setSubscription] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/client/subscription").then(r => r.json()),
      fetch("/api/client/store").then(r => r.json()),
      fetch("/api/stripe/invoices").then(r => r.json()),
      fetch("/api/stripe/payment-method").then(r => r.json()),
    ]).then(([sub, storeRes, inv, pm]) => {
      if (sub.success) setSubscription(sub.data);
      if (storeRes.success) setStore(storeRes.data);
      if (inv.success) setInvoices(inv.data || []);
      if (pm.success) setPaymentMethod(pm.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (planName: string) => {
    setCheckoutLoading(planName);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planName }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const openPortal = async (focusPaymentMethods = false) => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnUrl: window.location.href }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert("Failed to open billing portal.");
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const currentPlan = subscription?.plan || "free";
  const currentPlanMeta = PLANS.find(p => p.name.toLowerCase() === currentPlan) || PLANS[0];
  const nextRenewal = subscription?.currentPeriodEnd 
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", { 
        month: "long", 
        day: "numeric", 
        year: "numeric" 
      })
    : "N/A";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark-navy">Billing & Plans</h2>
          <p className="text-muted-foreground text-sm">Manage your subscription and payment methods.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download All Invoices
        </Button>
      </div>

      {/* Current Plan Banner */}
      <div className="p-6 bg-dark-navy text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="flex items-center gap-4 z-10">
          <div className="p-3 bg-primary rounded-xl">
            <Zap className="w-6 h-6 text-dark-navy" />
          </div>
          <div>
            <p className="text-primary font-medium text-sm">Current Plan</p>
            <h3 className="text-2xl font-bold capitalize">{currentPlan} Plan</h3>
          </div>
        </div>
        <div className="flex items-center gap-4 z-10">
          <div className="text-right hidden md:block">
            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Next Renewal</p>
            <p className="font-medium">{nextRenewal}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => openPortal()}
            disabled={portalLoading}
          >
            {portalLoading ? "Opening..." : "Manage in Stripe"}
          </Button>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan, i) => {
          const isCurrent = plan.name.toLowerCase() === currentPlan;
          return (
            <Card key={i} className={cn(
              "p-6 border-border shadow-sm relative overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-primary/50",
              isCurrent && "border-primary ring-2 ring-primary/20"
            )}>
              {isCurrent && (
                <div className="absolute top-0 right-0 bg-primary text-dark-navy text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-tighter">
                  Current Plan
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-dark-navy">{plan.name}</h3>
                <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{plan.description}</p>
              </div>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-dark-navy">
                  {plan.price === 0 ? "Free" : plan.priceLabel}
                </span>
                {plan.price > 0 && <span className="text-muted-foreground text-sm">/mo</span>}
              </div>
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-dark-navy">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Button 
                variant={isCurrent ? "outline" : "primary"} 
                className="w-full" 
                disabled={isCurrent || plan.comingSoon || checkoutLoading === plan.name}
                onClick={() => handleSubscribe(plan.name)}
              >
                {checkoutLoading === plan.name ? "Redirecting..." : 
                 isCurrent ? "Active Plan" : 
                 plan.comingSoon ? "Coming Soon" : "Switch to " + plan.name}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Payment Method */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-dark-navy" />
              <h3 className="font-bold text-dark-navy">Payment Method</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => openPortal(true)}
              disabled={portalLoading}
              className="text-xs text-primary hover:text-primary-dark"
            >
              {portalLoading ? "Opening..." : "Add Card / Update"}
            </Button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-border">
            {paymentMethod ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-dark-navy rounded flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider">
                    {paymentMethod.brand?.toUpperCase().slice(0,4) || "CARD"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-navy">
                      {paymentMethod.brand} •••• {paymentMethod.last4}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expires {paymentMethod.exp_month}/{paymentMethod.exp_year}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openPortal(true)}
                  disabled={portalLoading}
                >
                  Update
                </Button>
              </div>
            ) : subscription?.stripeId ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-dark-navy">Payment method on file</p>
                  <p className="text-xs text-muted-foreground">View details in Stripe Portal</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openPortal(true)}
                  disabled={portalLoading}
                >
                  Manage
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-3">No payment method on file</p>
                <Button 
                  onClick={() => openPortal(true)} 
                  disabled={portalLoading}
                >
                  {portalLoading ? "Opening..." : "Add Payment Method"}
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Current Plan Details */}
        <Card className="p-6 border-border shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-5 h-5 text-dark-navy" />
            <h3 className="font-bold text-dark-navy">Current Plan Details</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-border">
              <div>
                <p className="text-sm font-medium text-dark-navy">Plan</p>
                <p className="text-xs text-muted-foreground capitalize">{currentPlan}</p>
              </div>
              <span className="text-sm font-bold text-dark-navy capitalize">
                {currentPlanMeta?.priceLabel || "Free"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-border">
              <div>
                <p className="text-sm font-medium text-dark-navy">Status</p>
                <p className="text-xs text-muted-foreground">Subscription</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200 capitalize">
                {subscription?.status || "Active"}
              </Badge>
            </div>
            <Button 
              onClick={() => openPortal()} 
              disabled={portalLoading}
              className="w-full mt-2"
            >
              {portalLoading ? "Opening Portal..." : "Manage Subscription in Stripe"}
            </Button>
          </div>
        </Card>

        {/* Usage Summary */}
        <Card className="p-6 border-border shadow-sm lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-dark-navy" />
            <h3 className="font-bold text-dark-navy">Usage This Period</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-border">
              <p className="text-xs text-muted-foreground">Messages Used</p>
              <p className="text-2xl font-bold text-dark-navy mt-1">
                {store?._count ? Math.floor(Math.random() * 8500) : 0} {/* TODO: Replace with real usage from analytics */}
              </p>
              <p className="text-xs text-muted-foreground">of {currentPlanMeta?.features[0] || "N/A"}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-border">
              <p className="text-xs text-muted-foreground">Current Period</p>
              <p className="text-sm font-medium mt-1">
                {subscription?.currentPeriodEnd 
                  ? `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → ${new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                  : "N/A"}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-border flex items-center">
              <p className="text-sm text-muted-foreground">
                Usage-based billing coming soon. Current plans are fixed monthly.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Invoice History */}
      <Card className="p-6 border-border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-dark-navy" />
            <h3 className="font-bold text-dark-navy">Invoice History</h3>
          </div>
          {invoices.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => openPortal()}
            >
              View All in Portal
            </Button>
          )}
        </div>

        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="pb-3 pr-4">Invoice</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/30">
                    <td className="py-3 pr-4 font-medium text-dark-navy">{inv.number || inv.id}</td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {new Date(inv.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="py-3 pr-4 font-medium">
                      {inv.amount} {inv.currency}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge 
                        variant={inv.status === "paid" ? "primary" : "outline"}
                        className="capitalize text-xs"
                      >
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      {inv.hostedUrl && (
                        <a 
                          href={inv.hostedUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-xs mr-3"
                        >
                          View
                        </a>
                      )}
                      {inv.pdfUrl && (
                        <a 
                          href={inv.pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-xs"
                        >
                          PDF
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No invoices yet. They will appear here after your first paid subscription.
          </div>
        )}
      </Card>
    </div>
  );
}