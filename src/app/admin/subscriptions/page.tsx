"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, Search } from "lucide-react";
import { toast } from "sonner";

export default function AdminSubscriptionsPage() {
  const router = useRouter();
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/subscriptions", { credentials: "include" })
      .then(r => { if (!r.ok) { toast.error("Session expired. Redirecting to login..."); setTimeout(() => router.push("/login"), 1500); return []; } return r.json(); })
      .then(data => { setSubs(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  const filtered = subs.filter(s => !search || s.storeName?.toLowerCase().includes(search.toLowerCase()) || s.userEmail?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark-navy text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin")} className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
          <div className="w-9 h-9 bg-lemon-gradient rounded-xl flex items-center justify-center"><CreditCard className="text-dark-navy w-5 h-5" /></div>
          <span className="font-bold">Manage Subscriptions</span>
        </div>
        <Link href="/dashboard" className="text-sm text-lemon-green hover:underline">App Dashboard</Link>
      </div>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-2xl font-bold text-dark-navy">Subscriptions</h1><p className="text-gray-500">{subs.length} total subscriptions</p></div>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-64" /></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b border-gray-100"><th className="text-left px-4 py-3 text-gray-500 font-medium">Store</th><th className="text-left px-4 py-3 text-gray-500 font-medium">Email</th><th className="text-left px-4 py-3 text-gray-500 font-medium">Plan</th><th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th><th className="text-left px-4 py-3 text-gray-500 font-medium">Stripe ID</th><th className="text-left px-4 py-3 text-gray-500 font-medium">Period Ends</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3"><div className="font-medium text-dark-navy">{s.storeName}</div><div className="text-xs text-gray-400">{s.storeUrl}</div></td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{s.userEmail}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.plan === 'enterprise' ? 'bg-purple-100 text-purple-600' : s.plan === 'pro' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>{s.plan}</span></td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{s.status}</span></td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono">{s.stripeId}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{s.currentPeriodEnd ? new Date(s.currentPeriodEnd).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">{search ? "No matches" : "No subscriptions"}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
