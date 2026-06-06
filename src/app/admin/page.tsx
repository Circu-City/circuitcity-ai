"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Store, CreditCard, MessageSquare, DollarSign, TrendingUp, ArrowRight, BarChart3, Settings, Headphones, FileText } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include" })
      .then(async r => { if (!r.ok) throw new Error("Unauthorized"); return r.json(); })
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => { setError("Unauthorized"); setLoading(false); });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/login");
    router.refresh();
  };

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center max-w-md">
        <h2 className="text-2xl font-bold text-dark-navy mb-2">Not Authorized</h2>
        <p className="text-gray-500 mb-6">You need admin privileges to access this area.</p>
        <Link href="/login" className="bg-lemon-gradient text-dark-navy font-bold px-6 py-2 rounded-xl">Go to Login</Link>
      </div>
    </div>
  );

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-dark-navy text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-lemon-green font-bold text-lg">CircuCity AI</Link>
            <span className="text-sm hidden sm:inline">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{stats?.admin?.email}</span>
            <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-dark-navy">Admin Dashboard</h1>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1"><Users className="w-4 h-4" /><span className="text-xs">Users</span></div>
            <div className="text-2xl font-bold text-dark-navy">{stats?.users || 0}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1"><Store className="w-4 h-4" /><span className="text-xs">Stores</span></div>
            <div className="text-2xl font-bold text-dark-navy">{stats?.stores || 0}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1"><CreditCard className="w-4 h-4" /><span className="text-xs">Active Subs</span></div>
            <div className="text-2xl font-bold text-dark-navy">{stats?.activeSubs || 0}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1"><MessageSquare className="w-4 h-4" /><span className="text-xs">Conversations</span></div>
            <div className="text-2xl font-bold text-dark-navy">{stats?.conversations || 0}</div>
          </div>
          <div className="bg-white rounded-xl border border-lemon-green/30 p-4 bg-lemon-green/5">
            <div className="flex items-center gap-2 text-gray-500 mb-1"><DollarSign className="w-4 h-4" /><span className="text-xs">Revenue/mo</span></div>
            <div className="text-2xl font-bold text-lemon-green">{((stats?.revenue || 0) / 100).toLocaleString()} kr</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/users" className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-lemon-green transition-colors group">
            <Users className="w-8 h-8 text-lemon-green mb-3" />
            <h3 className="font-bold text-dark-navy group-hover:text-lemon-green">Manage Users</h3>
            <p className="text-sm text-gray-500 mt-1">View, edit roles, and delete users</p>
          </Link>
          <Link href="/admin/stores" className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-lemon-green transition-colors group">
            <Store className="w-8 h-8 text-lemon-green mb-3" />
            <h3 className="font-bold text-dark-navy group-hover:text-lemon-green">Manage Stores</h3>
            <p className="text-sm text-gray-500 mt-1">Store details, status, conversations</p>
          </Link>
          <Link href="/admin/support" className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-lemon-green transition-colors group">
            <Headphones className="w-8 h-8 text-lemon-green mb-3" />
            <h3 className="font-bold text-dark-navy group-hover:text-lemon-green">Support Tickets</h3>
            <p className="text-sm text-gray-500 mt-1">View and respond to escalated tickets</p>
          </Link>
          <Link href="/admin/billing" className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-lemon-green transition-colors group">
            <CreditCard className="w-8 h-8 text-lemon-green mb-3" />
            <h3 className="font-bold text-dark-navy group-hover:text-lemon-green">Billing &amp; Subscriptions</h3>
            <p className="text-sm text-gray-500 mt-1">Manage plans, statuses, payments</p>
          </Link>
          <Link href="/admin/analytics" className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-lemon-green transition-colors group">
            <BarChart3 className="w-8 h-8 text-lemon-green mb-3" />
            <h3 className="font-bold text-dark-navy group-hover:text-lemon-green">Analytics</h3>
            <p className="text-sm text-gray-500 mt-1">Usage trends, revenue breakdown</p>
          </Link>
          <Link href="/admin/subscriptions" className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-lemon-green transition-colors group">
            <TrendingUp className="w-8 h-8 text-lemon-green mb-3" />
            <h3 className="font-bold text-dark-navy group-hover:text-lemon-green">Subscriptions</h3>
            <p className="text-sm text-gray-500 mt-1">View all subscriptions</p>
          </Link>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-dark-navy">Recent Users</h3>
            <Link href="/admin/users" className="text-sm text-lemon-green hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b border-gray-100"><th className="py-2">Name</th><th className="py-2">Email</th><th className="py-2">Role</th><th className="py-2">Joined</th></tr></thead>
              <tbody>
                {(stats?.recentUsers || []).map((u: any) => (
                  <tr key={u.id} className="border-b border-gray-50">
                    <td className="py-2 font-medium text-dark-navy">{u.name || "—"}</td>
                    <td className="py-2 text-gray-500">{u.email}</td>
                    <td className="py-2"><span className={`px-2 py-0.5 rounded text-xs font-medium ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>{u.role}</span></td>
                    <td className="py-2 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
