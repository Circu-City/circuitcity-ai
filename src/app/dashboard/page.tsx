"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { MessageSquare, ShoppingBag, TrendingUp, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatNumber, formatCurrency } from "@/lib/utils";

interface DashboardData {
  stats: { totalMessages: number; conversionLift: string; activeUsers: number; salesAssisted: number };
  recentConversations: { customer: string; message: string; time: string }[];
  monthlyGrowth: number;
}

export default function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/overview", { ...{ credentials: "include" }, credentials: "include" }).then((r) => r.json()),
      fetch("/api/auth/me", { ...{ credentials: "include" }, credentials: "include" }).then((r) => r.json()),
    ])
      .then(([dashboardData, userData]) => {
        setData(dashboardData);
        setStoreName(userData.name + "'s Store");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const metrics = data ? [
    { label: "Total Messages", value: formatNumber(data.stats.totalMessages), change: "+12%", icon: MessageSquare, color: "bg-blue-500" },
    { label: "Conversion Lift", value: data.stats.conversionLift, change: "+4%", icon: TrendingUp, color: "bg-green-500" },
    { label: "Active Users", value: formatNumber(data.stats.activeUsers), change: "+8%", icon: Users, color: "bg-purple-500" },
    { label: "Sales Assisted", value: formatNumber(data.stats.salesAssisted), change: "+15%", icon: ShoppingBag, color: "bg-orange-500" },
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-navy">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back to {storeName}</p>
        </div>

        {/* Metrics Cards */}
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

        {/* Recent Conversations */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-dark-navy">Recent Conversations</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {data?.recentConversations?.length ? (
              data.recentConversations.map((conv, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-lemon-gradient/20 text-dark-navy flex items-center justify-center font-bold text-sm">
                      {conv.customer.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-navy">{conv.customer}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{conv.message}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(conv.time).toLocaleDateString()}</span>
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