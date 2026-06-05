"use client";

import { useState, useEffect } from "react";
import { BarChart3, MessageSquare, ShoppingBag, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import { apiFetch } from "@/lib/api-client";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({ conversations: 0, messages: 0, stores: 0, monthly: [] as any[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apifetch("/api/dashboard/overview", { ...{ credentials: "include" }, credentials: "include" }).then(r => r.json()).then(d => {
      setStats(prev => ({ ...prev, stores: d.stores?.length || 0 }));
      return apifetch("/api/dashboard/analytics", { ...{ credentials: "include" }, credentials: "include" });
    }).then(r => r.json()).then(d => {
      setStats(prev => ({ ...prev, ...d }));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full mx-auto mt-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold text-dark-navy mb-2">Analytics</h1>
        <p className="text-gray-500 mb-8">Track your chatbot performance and usage.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: MessageSquare, label: "Total Conversations", value: stats.conversations },
            { icon: TrendingUp, label: "Messages This Month", value: stats.messages },
            { icon: ShoppingBag, label: "Connected Stores", value: stats.stores },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="w-10 h-10 rounded-xl bg-lemon-green/10 flex items-center justify-center mb-3"><stat.icon className="w-5 h-5 text-lemon-green" /></div>
              <p className="text-3xl font-bold text-dark-navy">{stat.value.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-dark-navy mb-6">Messages (Last 30 Days)</h3>
          {stats.monthly.length === 0 ? <p className="text-gray-400 text-sm py-8 text-center">No data yet.</p> : (
            <div className="flex items-end gap-2 h-48">
              {stats.monthly.map((d: any, i: number) => {
                const max = Math.max(...stats.monthly.map((x: any) => x.messages || 0), 1);
                const h = Math.max(((d.messages || 0) / max) * 100, 4);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-lemon-green/20 rounded-t-sm hover:bg-lemon-green/40 transition-colors relative group" style={{ height: `${h}%` }}>
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-navy text-white text-xs px-2 py-1 rounded whitespace-nowrap">{d.messages || 0} msgs</div>
                    </div>
                    <span className="text-[10px] text-gray-400">{d.date ? new Date(d.date).getDate() : i + 1}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
