"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store, ArrowLeft, Shield, Search, ExternalLink, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function AdminStoresPage() {
  const router = useRouter();
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/stores", { credentials: "include" })
      .then(async r => { if (r.status === 401) { router.push("/login"); return []; } return r.json(); })
      .then(data => { setStores(data || []); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [router]);

  const filtered = stores.filter(s => !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.url?.toLowerCase().includes(search.toLowerCase()) || s.owner?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark-navy text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin")} className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
          <div className="w-9 h-9 bg-lemon-gradient rounded-xl flex items-center justify-center"><Store className="text-dark-navy w-5 h-5" /></div>
          <span className="font-bold">Manage Stores</span>
        </div>
        <Link href="/dashboard" className="text-sm text-lemon-green hover:underline">App Dashboard</Link>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-navy">All Stores</h1>
            <p className="text-gray-500">{stores.length} stores total</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stores..." className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-64" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b border-gray-100"><th className="text-left px-4 py-3 text-gray-500 font-medium">Store</th><th className="text-left px-4 py-3 text-gray-500 font-medium">Owner</th><th className="text-left px-4 py-3 text-gray-500 font-medium">Plan</th><th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th><th className="text-left px-4 py-3 text-gray-500 font-medium">Chats</th><th className="text-left px-4 py-3 text-gray-500 font-medium">Actions</th></tr></thead>
            <tbody>
              {filtered.map(store => (
                <tr key={store.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3"><div className="font-medium text-dark-navy">{store.name}</div><div className="text-xs text-gray-400">{store.url}</div></td>
                  <td className="px-4 py-3 text-gray-600">{store.owner}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${store.plan === 'growth' ? 'bg-purple-100 text-purple-600' : store.plan === 'enterprise' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>{store.plan}</span></td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${store.status === 'active' ? 'bg-green-100 text-green-700' : store.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{store.status}</span></td>
                  <td className="px-4 py-3 text-gray-600">{store.conversations}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <a href={store.url} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400" title="Visit"><ExternalLink className="w-4 h-4" /></a>
                      <Link href={`/dashboard/conversations?store=${store.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400" title="Conversations"><MessageSquare className="w-4 h-4" /></Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">{search ? "No stores match your search" : "No stores yet"}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
