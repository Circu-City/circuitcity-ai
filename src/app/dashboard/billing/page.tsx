"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "sonner";
import { Check } from "lucide-react";

const plans = [
  { id: "free", name: "Starter", price: "$0", features: ["1,000 messages/mo", "1 store", "Basic AI"] },
  { id: "growth", name: "Growth", price: "$49", features: ["10,000 messages/mo", "3 stores", "Advanced AI", "Priority support"] },
  { id: "enterprise", name: "Enterprise", price: "$199", features: ["Unlimited", "Dedicated manager", "Custom LLM"] },
];

export default function BillingPage() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState("free");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/billing/status", { ...{ credentials: "include" }, credentials: "include" })
      .then(r => r.json())
      .then(data => { if (data.plan) setCurrentPlan(data.plan); })
      .catch(() => {});
  }, []);

  const handleUpgrade = async (planId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.sandbox) {
        const pname = plans.find(p => p.id === planId)?.name || planId;
        toast.success(`Upgraded to ${pname} plan!`);
        setCurrentPlan(planId);
      } else {
        toast.error(data.error || "Upgrade failed");
      }
    } catch {
      toast.error("Upgrade failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getButtonLabel = (planId: string) => {
    if (currentPlan === planId) return "Current Plan";
    return "Upgrade";
  };

  const getButtonDisabled = (planId: string) => {
    if (currentPlan === planId) return true;
    if (loading) return true;
    return false;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-navy">Billing</h1>
          <p className="text-gray-500">Manage your subscription and billing details.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-dark-navy mb-4">Current Plan</h2>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-lemon-green/20 text-dark-navy font-bold text-sm">
              {plans.find(p => p.id === currentPlan)?.name} - {plans.find(p => p.id === currentPlan)?.price}/mo
            </span>
            {currentPlan !== "free" && <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Active</span>}
            {currentPlan === "free" && <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">Free Trial</span>}
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.id} className={`relative p-6 rounded-2xl border-2 ${currentPlan === plan.id ? "border-lemon-green bg-lemon-green/5" : "border-gray-200 bg-white"}`}>
              {currentPlan === plan.id && <div className="absolute -top-3 left-4 bg-lemon-gradient text-dark-navy text-xs font-bold px-3 py-1 rounded-full">Current</div>}
              <h3 className="text-lg font-bold text-dark-navy mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-dark-navy mb-4">{plan.price}<span className="text-sm font-normal text-gray-500">/mo</span></div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => <li key={i} className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-lemon-green" />{f}</li>)}
              </ul>
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={getButtonDisabled(plan.id)}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  currentPlan === plan.id
                    ? "border border-gray-200 text-gray-400 cursor-default bg-gray-50"
                    : "bg-dark-navy text-white hover:bg-dark-navy/90 hover:scale-105"
                }`}
              >
                {getButtonLabel(plan.id)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}