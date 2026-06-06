"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "sonner";
import { Check, CreditCard, Zap, Store, MessageSquare } from "lucide-react";

const plans = [
  { id: "starter", name: "Starter", price: "$0", priceCents: 0, features: ["1,000 messages/mo", "1 store", "Basic AI", "Community support"], limits: { messages: 1000, stores: 1 } },
  { id: "pro", name: "Growth", price: "$49", priceCents: 4900, features: ["10,000 messages/mo", "3 stores", "Advanced AI", "Priority support", "Enhanced analytics"], limits: { messages: 10000, stores: 3 } },
  { id: "enterprise", name: "Enterprise", price: "$199", priceCents: 19900, features: ["Unlimited messages", "Unlimited stores", "Dedicated manager", "Custom LLM", "Enterprise support"], limits: { messages: 999999, stores: 999 } },
];

export default function BillingPage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState("starter");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState({ messages: 0, stores: 0, nextRenewal: "", status: "", plan: "starter" });

  const fetchBilling = () => {
    Promise.all([
      fetch("/api/billing/status", { credentials: "include" }).then(r => r.json()).catch(() => ({})),
      fetch("/api/dashboard/overview", { credentials: "include" }).then(r => r.json()).catch(() => ({})),
    ]).then(([billing, overview]) => {
      setCurrentPlan(billing.plan || "starter");
      const stores = overview?.stores?.length || 0;
      setUsage({
        messages: billing.messagesUsed || 0,
        stores,
        nextRenewal: billing.currentPeriodEnd ? new Date(billing.currentPeriodEnd).toLocaleDateString() : "—",
        status: billing.status || "active",
        plan: billing.plan || "starter",
      });
    }).catch(() => {});
  };

  useEffect(() => { fetchBilling(); }, []);

  const currentLimits = plans.find(p => p.id === currentPlan)?.limits || { messages: 1000, stores: 1 };

  const handleUpgrade = async (planId: string) => {
    if (planId === currentPlan) return;
    setLoading(true);
    try {
      const res = await fetch("/api/billing/create-checkout", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else if (data.success) { toast.success(`Upgraded to ${plans.find(p => p.id === planId)?.name}!`); setCurrentPlan(planId); fetchBilling(); }
      else toast.error(data.error || "Upgrade failed");
    } catch { toast.error("Upgrade failed"); }
    finally { setLoading(false); }
  };

  const handleCancel = async () => {
    if (!confirm("Cancel your subscription? Access will continue until the billing period ends.")) return;
    setLoading(true);
    try {
      await fetch("/api/billing/cancel", { method: "POST", credentials: "include" });
      toast.success("Subscription cancelled");
      fetchBilling();
    } catch { toast.error("Failed to cancel"); }
    finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-dark-navy">Billing</h1><p className="text-gray-500">Manage your subscription and billing.</p></div>

        {/* Current Plan Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-dark-navy">Current Plan</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-bold text-dark-navy">{plans.find(p => p.id === currentPlan)?.name}</span>
                <span className="text-lg font-medium text-gray-500">{plans.find(p => p.id === currentPlan)?.price}/mo</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${usage.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{usage.status}</span>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <p className="text-xs">Next renewal</p>
              <p className="font-medium text-dark-navy">{usage.nextRenewal}</p>
            </div>
          </div>

          {/* Usage Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-lemon-green" /><span className="text-sm font-medium text-dark-navy">Messages</span></div>
                <span className="text-sm font-bold text-dark-navy">{usage.messages.toLocaleString()} / {currentLimits.messages.toLocaleString()}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-lemon-green rounded-full transition-all" style={{ width: `${Math.min((usage.messages / currentLimits.messages) * 100, 100)}%` }} />
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><Store className="w-4 h-4 text-lemon-green" /><span className="text-sm font-medium text-dark-navy">Stores</span></div>
                <span className="text-sm font-bold text-dark-navy">{usage.stores} / {currentLimits.stores}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-lemon-green rounded-full transition-all" style={{ width: `${Math.min((usage.stores / currentLimits.stores) * 100, 100)}%` }} />
              </div>
            </div>
          </div>

          {usage.status === "active" && currentPlan !== "starter" && (
            <button onClick={handleCancel} className="text-sm text-red-500 hover:text-red-700 font-medium mt-2">Cancel Subscription</button>
          )}
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className={`relative p-6 rounded-2xl border-2 ${currentPlan === plan.id ? "border-lemon-green bg-lemon-green/5" : "border-gray-200 bg-white"}`}>
              {currentPlan === plan.id && <div className="absolute -top-3 left-4 bg-lemon-gradient text-dark-navy text-xs font-bold px-3 py-1 rounded-full">Current</div>}
              <h3 className="text-lg font-bold text-dark-navy mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-dark-navy mb-4">{plan.price}<span className="text-sm font-normal text-gray-500">/mo</span></div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => <li key={i} className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-lemon-green" />{f}</li>)}
              </ul>
              <button onClick={() => handleUpgrade(plan.id)} disabled={loading || currentPlan === plan.id}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  currentPlan === plan.id ? "border border-gray-200 text-gray-400 bg-gray-50 cursor-default" : plan.id === "pro" ? "bg-dark-navy text-white hover:bg-dark-navy/90" : plan.id === "enterprise" ? "bg-lemon-gradient text-dark-navy hover:opacity-90 shadow-lemon" : "border border-gray-200 bg-white text-dark-navy hover:bg-gray-50"}`}>
                {currentPlan === plan.id ? "Current Plan" : plan.priceCents === 0 ? "Get Started" : "Upgrade"}
              </button>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="bg-dark-navy rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Need Enterprise Features?</h3>
          <p className="text-gray-400 mb-4">Custom integrations, dedicated support, and unlimited everything.</p>
          <a href="mailto:sales@circucity.se" className="inline-block bg-lemon-gradient text-dark-navy font-bold px-6 py-3 rounded-xl hover:opacity-90 shadow-lemon">Contact Sales</a>
        </div>
      </div>
    </DashboardLayout>
  );
}
