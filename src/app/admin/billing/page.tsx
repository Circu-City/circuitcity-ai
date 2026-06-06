"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CreditCard, BarChart3, DollarSign, BadgeCheck, Clock, XCircle, ArrowUpDown, Search } from "lucide-react";
import { toast } from "sonner";

const planColors: Record<string, string> = { starter: "bg-gray-100 text-gray-700", pro: "bg-blue-100 text-blue-700", enterprise: "bg-purple-100 text-purple-700" };
const statusColors: Record<string, string> = { active: "bg-green-100 text-green-700", inactive: "bg-red-100 text-red-700", past_due: "bg-yellow-100 text-yellow-700", cancelled: "bg-red-100 text-red-700" };

export default function AdminBillingPage() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPlan, setEditPlan] = useState("");
  const [editStatus, setEditStatus] = useState("");

  useEffect(() => {
    fetch("/api/admin/subscriptions", { credentials: "include" })
      .then(async r => { if (!r.ok) throw r; return r.json(); })
      .then(d => { setSubs(d); setLoading(false); })
      .catch(() => { toast.error("Session expired"); setLoading(false); });
  }, []);

  const saveEdit = async (id: string) => {
    try {
      const r = await fetch("/api/admin/subscriptions", {
        method: "PUT", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, plan: editPlan, status: editStatus }),
      });
      const data = await r.json();
      if (data.success) { toast.success("Updated"); setEditingId(null); window.location.reload(); }
      else toast.error(data.error || "Failed");
    } catch { toast.error("Failed to update subscription"); }
  };

  const startEdit = (sub: any) => {
    setEditingId(sub.id);
    setEditPlan(sub.plan);
    setEditStatus(sub.status);
  };

  const filtered = subs.filter(s => {
    const t = `${s.storeName} ${s.userEmail}`.toLowerCase();
    return t.includes(search.toLowerCase());
  });

  const totalRevenue = subs
    .filter(s => s.status === "active" && s.plan !== "starter")
    .reduce((t, s) => t + (s.plan === "pro" ? 4900 : 19900), 0);

  const activeCount = subs.filter(s => s.status === "active").length;

  if (loading) return <div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full mx-auto mt-20" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark-navy text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin" className="p-2 hover:bg-white/10 rounded-lg"><CreditCard className="w-5 h-5" /></Link>
          <h1 className="text-xl font-bold">Billing &amp; Subscriptions</h1>
          <div className="ml-auto flex gap-4">
            <Link href="/admin/stores" className="text-sm text-gray-400 hover:text-white">Stores</Link>
            <Link href="/admin/analytics" className="text-sm text-gray-400 hover:text-white">Analytics</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-1"><BadgeCheck className="w-4 h-4 text-green-500" /><span className="text-xs text-gray-500">Active Subscriptions</span></div>
            <div className="text-2xl font-bold text-dark-navy">{activeCount}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-yellow-500" /><span className="text-xs text-gray-500">Monthly Revenue</span></div>
            <div className="text-2xl font-bold text-dark-navy">{(totalRevenue / 100).toLocaleString()} kr</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-1"><CreditCard className="w-4 h-4 text-blue-500" /><span className="text-xs text-gray-500">Total</span></div>
            <div className="text-2xl font-bold text-dark-navy">{subs.length}</div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by store or email..." className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-sm" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="py-3 px-4">Store</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Stripe ID</th>
                  <th className="py-3 px-4">Renews</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub: any) => (
                  <tr key={sub.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-dark-navy">{sub.storeName}</div>
                      {sub.storeUrl && <span className="text-xs text-gray-400">{sub.storeUrl}</span>}
                    </td>
                    <td className="py-3 px-4 text-gray-500">{sub.userEmail}</td>
                    <td className="py-3 px-4">
                      {editingId === sub.id ? (
                        <select value={editPlan} onChange={e => setEditPlan(e.target.value)} className="px-2 py-1 border rounded text-xs">
                          <option value="starter">Starter</option><option value="pro">Growth</option><option value="enterprise">Enterprise</option>
                        </select>
                      ) : <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${planColors[sub.plan] || ""}`}>{sub.plan}</span>}
                    </td>
                    <td className="py-3 px-4">
                      {editingId === sub.id ? (
                        <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="px-2 py-1 border rounded text-xs">
                          <option value="active">Active</option><option value="inactive">Inactive</option><option value="past_due">Past Due</option><option value="cancelled">Cancelled</option>
                        </select>
                      ) : <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[sub.status] || ""}`}>{sub.status}</span>}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-400 font-mono">{sub.stripeId}</td>
                    <td className="py-3 px-4 text-xs text-gray-500">{sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : "—"}</td>
                    <td className="py-3 px-4">
                      {editingId === sub.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => saveEdit(sub.id)} className="text-xs bg-lemon-green text-dark-navy px-2 py-1 rounded font-bold">Save</button>
                          <button onClick={() => setEditingId(null)} className="text-xs border px-2 py-1 rounded">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(sub)} className="text-xs text-lemon-green hover:underline">Edit</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="text-center py-12 text-gray-400">No subscriptions found</p>}
        </div>
      </div>
    </div>
  );
}
