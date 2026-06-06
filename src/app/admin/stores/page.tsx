"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Store, ArrowLeft, Search, ExternalLink, MessageSquare } from "lucide-react";

export default function AdminStoresPage() {
  const router = useRouter();
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rawResponse, setRawResponse] = useState("");

  const loadStores = () => {
    setLoading(true);
    fetch("/api/admin/stores", { credentials: "include" })
      .then(async r => {
        const text = await r.text();
        setRawResponse("Status: " + r.status + " | " + text.substring(0, 100));
        if (!r.ok) return [];
        try { return JSON.parse(text); } catch { return []; }
      })
      .then(data => {
        if (Array.isArray(data)) setStores(data);
        else if (data?.stores) setStores(data.stores);
        setLoading(false);
      })
      .catch(e => { setRawResponse("Error: " + String(e)); setLoading(false); });
  };

  useEffect(() => { loadStores(); }, []);

  const filtered = stores.filter((s: any) =>
    !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.url?.toLowerCase().includes(search.toLowerCase()) || s.owner?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark-navy text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin")} className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
          <span className="font-bold">Manage Stores</span>
        </div>
        <Link href="/dashboard" className="text-sm text-lemon-green hover:underline">App Dashboard</Link>
      </div>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-dark-navy">All Stores ({stores.length})</h1>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stores..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-64" /></div>
        </div>
        {rawResponse && !loading && stores.length === 0 && <div className="mb-4 p-4 bg-yellow-50 rounded-xl text-sm text-yellow-800">{rawResponse}</div>}
        {loading ? <div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full" /></div> : stores.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200"><Store className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-bold text-gray-500 mb-2">No Stores Found</h3><p className="text-gray-400">No stores in the database yet.</p><button onClick={loadStores} className="mt-4 text-lemon-green font-semibold hover:underline">Retry</button></div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 border-b border-gray-100"><th className="text-left px-4 py-3 text-gray-500 font-medium">Store</th><th className="text-left px-4 py-3 text-gray-500 font-medium">Owner</th><th className="text-left px-4 py-3 text-gray-500 font-medium">Plan</th><th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th><th className="text-left px-4 py-3 text-gray-500 font-medium">Actions</th></tr></thead>
              <tbody>
                {filtered.map((store: any) => (
                  <tr key={store.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3"><div className="font-medium text-dark-navy">{store.name || "(no name)"}</div><div className="text-xs text-gray-400">{store.url || "(no url)"}</div></td>
                    <td className="px-4 py-3 text-gray-600">{store.owner || "—"}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">{store.plan || "free"}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${store.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{store.status || "pending"}</span></td>
                    <td className="px-4 py-3"><div className="flex gap-2">{store.url && <a href={store.url} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><ExternalLink className="w-4 h-4" /></a>}<Link href={`/dashboard/conversations?store=${store.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"><MessageSquare className="w-4 h-4" /></Link></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
