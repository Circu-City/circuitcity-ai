"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, MessageSquare, DollarSign, CreditCard, Activity } from "lucide-react";
import Link from "next/link";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics", { credentials: "include" })
      .then(async r => { if (!r.ok) throw r; return r.json(); })
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full mx-auto mt-20" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark-navy text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin" className="p-2 hover:bg-white/10 rounded-lg"><BarChart3 className="w-5 h-5" /></Link>
          <h1 className="text-xl font-bold">Analytics</h1>
          <div className="ml-auto flex gap-4">
            <Link href="/admin/stores" className="text-sm text-gray-400 hover:text-white">Stores</Link>
            <Link href="/admin/subscriptions" className="text-sm text-gray-400 hover:text-white">Subscriptions</Link>
            <Link href="/admin/billing" className="text-sm text-gray-400 hover:text-white">Billing</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center"><Users className="w-5 h-5 text-blue-600" /></div><span className="text-xs text-gray-500">Total Users</span></div>
            <div className="text-3xl font-bold text-dark-navy">{data?.users || 0}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center"><MessageSquare className="w-5 h-5 text-green-600" /></div><span className="text-xs text-gray-500">Conversations</span></div>
            <div className="text-3xl font-bold text-dark-navy">{data?.conversations || 0}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center"><CreditCard className="w-5 h-5 text-purple-600" /></div><span className="text-xs text-gray-500">Active Subs</span></div>
            <div className="text-3xl font-bold text-dark-navy">{data?.activeSubscriptions || 0}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center"><DollarSign className="w-5 h-5 text-yellow-600" /></div><span className="text-xs text-gray-500">Revenue / mo</span></div>
            <div className="text-3xl font-bold text-dark-navy">{((data?.revenue || 0) / 100).toLocaleString()} kr</div>
          </div>
        </div>

        {/* Usage Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-lemon-green" /><h3 className="font-bold text-dark-navy">Monthly Message Usage</h3></div>
          <div className="space-y-3">
            {data?.monthlyMessages?.map((m: any, i: number) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-xs text-gray-500 w-12">{m.month}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden">
                  <div className="h-full bg-lemon-gradient rounded-lg transition-all flex items-center px-2 text-xs font-bold text-dark-navy" style={{ width: `${Math.min((m.messages / (data.maxMonthly || 1)) * 100, 100)}%` }}>
                    {m.messages}
                  </div>
                </div>
              </div>
            ))}
            {(!data?.monthlyMessages || data.monthlyMessages.length === 0) && (
              <p className="text-gray-400 text-sm py-4 text-center">No usage data yet</p>
            )}
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4"><Activity className="w-5 h-5 text-lemon-green" /><h3 className="font-bold text-dark-navy">Plan Distribution</h3></div>
            <div className="space-y-3">
              {(data?.planDistribution || []).map((p: any) => (
                <div key={p.plan} className="flex items-center gap-3">
                  <span className="text-sm text-dark-navy font-medium w-20">{p.plan}</span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${p.plan === "enterprise" ? "bg-purple-500" : p.plan === "pro" ? "bg-blue-500" : "bg-gray-300"}`} style={{ width: `${(p.count / (data?.totalSubscriptions || 1)) * 100}%` }} />
                  </div>
                  <span className="text-sm font-bold text-dark-navy w-8">{p.count}</span>
                </div>
              ))}
              {(!data?.planDistribution || data.planDistribution.length === 0) && (
                <p className="text-gray-400 text-sm py-4 text-center">No subscriptions yet</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4"><DollarSign className="w-5 h-5 text-lemon-green" /><h3 className="font-bold text-dark-navy">Revenue Breakdown</h3></div>
            <div className="space-y-3">
              {(data?.revenueBreakdown || []).map((r: any) => (
                <div key={r.plan} className="flex items-center justify-between py-2">
                  <span className="text-sm text-dark-navy font-medium">{r.plan}</span>
                  <div className="text-right"><span className="text-sm font-bold text-dark-navy">{(r.revenue / 100).toLocaleString()} kr</span><span className="text-xs text-gray-400 block">{r.count} active</span></div>
                </div>
              ))}
              {(!data?.revenueBreakdown || data.revenueBreakdown.length === 0) && (
                <p className="text-gray-400 text-sm py-4 text-center">No revenue data</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
