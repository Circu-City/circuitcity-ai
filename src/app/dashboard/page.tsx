"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { MessageSquare, ShoppingBag, TrendingUp, Users, ArrowUpRight } from "lucide-react";

export default function DashboardOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/overview", { credentials: "include" }).then(async r => {
        if (!r.ok) throw new Error("Failed to load overview");
        return r.json();
      }),
      fetch("/api/auth/me", { credentials: "include" }).then(async r => {
        if (!r.ok) return {};
        return r.json();
      }),
    ])
      .then(([dashboardData, userData]) => {
        setData(dashboardData);
        const name = userData.name || userData.user?.name || dashboardData.stores?.[0]?.name || "My";
        setStoreName(name + "'s Store");
        setLoading(false);
      })
      .catch(e => { setError(e.message || "Failed to load dashboard"); setLoading(false); });
  }, []);

  const metrics = data ? [
    { label: "Total Messages", value: (data.stats?.totalMessages || 0).toLocaleString(), change: "+12%", icon: MessageSquare, color: "bg-blue-500" },
    { label: "Conversion Lift", value: data.stats?.conversionLift || "0%", change: "+4%", icon: TrendingUp, color: "bg-green-500" },
    { label: "Conversations", value: (data.stats?.totalConversations || 0).toLocaleString(), change: "+8%", icon: Users, color: "bg-purple-500" },
    { label: "Active Users", value: (data.stats?.activeUsers || 0).toLocaleString(), change: "+15%", icon: ShoppingBag, color: "bg-orange-500" },
  ] : [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-lemon-green border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-500 mb-2">Couldn't load dashboard</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="text-lemon-green font-semibold hover:underline">Retry</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-navy">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back to {storeName}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${metric.color} bg-opacity-10 flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 ${metric.color.replace("bg-", "text-")}`} />
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                  <ArrowUpRight className="w-4 h-4" />
                  {metric.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-dark-navy mb-1">{metric.value}</p>
              <p className="text-sm text-gray-500">{metric.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-dark-navy">Recent Conversations</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {data?.recentConversations?.length ? (
              data.recentConversations.map((conv: any, i: number) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-lemon-gradient/20 text-dark-navy flex items-center justify-center font-bold text-sm">
                      {(conv.customerName || "A").charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-navy">{conv.customerName || "Anonymous"}</p>
                      <p className="text-xs text-gray-500">{conv.status || "—"}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(conv.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-400">No conversations yet</div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
