"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "sonner";
import { BarChart3, MessageSquare, ShoppingBag, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ conversations: 0, messages: 0, stores: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/overview", { credentials: "include" }).then(r => r.json()).catch(() => null),
      fetch("/api/dashboard/analytics", { credentials: "include" }).then(r => r.json()).catch(() => null),
    ]).then(([overview, analytics]) => {
      setStats({
        conversations: analytics?.conversations || 0,
        messages: analytics?.messages || 0,
        stores: overview?.stores?.length || 0,
      });
      setLoading(false);
    }).catch(e => {
      setError(String(e));
      setLoading(false);
    });
  }, []);

  if (loading) return <DashboardLayout><div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full" /></div></DashboardLayout>;
  if (error) return <DashboardLayout><div className="bg-yellow-50 p-6 rounded-xl text-sm text-yellow-800">{error}</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-dark-navy mb-2">Analytics</h1>
        <p className="text-gray-500 mb-8">Track your chatbot performance.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: MessageSquare, label: "Conversations", value: stats.conversations },
            { icon: TrendingUp, label: "Messages", value: stats.messages },
            { icon: ShoppingBag, label: "Stores", value: stats.stores },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="w-10 h-10 rounded-xl bg-lemon-green/10 flex items-center justify-center mb-3"><s.icon className="w-5 h-5 text-lemon-green" /></div>
              <p className="text-3xl font-bold text-dark-navy">{s.value.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
