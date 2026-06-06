"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, ExternalLink, Copy, Store } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard-layout";
import { apiFetch } from "@/lib/api-client";

export default function DashboardStoresPage() {
  const router = useRouter();
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchStores = () => {
    fetch("/api/dashboard/overview", { ...{ credentials: "include" }, credentials: "include" })
      .then(r => r.json())
      .then(d => {
        const s = d.stores || [];
        setStores(s);
        setLoading(false);
      })
      .catch(() => { setLoading(false); toast.error("Failed to load stores"); });
  };

  useEffect(() => { fetchStores(); }, []);

  const addStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) { toast.error("Name and URL required"); return; }
    setAdding(true);
    try {
      const res = await fetch("/api/onboarding/store", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url, industry: "", platform: "custom" }),
      });
      if (res.ok) { toast.success("Store added!"); setName(""); setUrl(""); fetchStores(); }
      else toast.error("Failed to add store");
    } catch { toast.error("Failed to add store"); }
    finally { setAdding(false); }
  };

  const handleGenerateKey = async (storeId: string) => {
    try {
      const res = await fetch("/api/dashboard/widget", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ storeId }) });
      const data = await res.json();
      if (data.apiKey) {
        navigator.clipboard.writeText(data.apiKey);
        toast.success("API key copied!");
        fetchStores();
      }
    } catch { toast.error("Failed to generate key"); }
  };

  if (loading) return <DashboardLayout><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full mx-auto mt-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-2xl font-bold text-dark-navy">Stores</h1><p className="text-gray-500">Manage your connected stores</p></div>
          <form onSubmit={addStore} className="flex gap-3">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Store Name" required className="px-4 py-2 border border-gray-200 rounded-xl text-sm" />
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://mystore.com" required className="px-4 py-2 border border-gray-200 rounded-xl text-sm" />
            <button type="submit" disabled={adding} className="bg-lemon-gradient text-dark-navy font-bold px-5 py-2 rounded-xl text-sm hover:opacity-90 flex items-center gap-2">{adding ? "Adding..." : <><Plus className="w-4 h-4" /> Add Store</>}</button>
          </form>
        </div>
        {stores.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200"><Store className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-bold text-gray-500 mb-2">No stores yet</h3></div>
        ) : (
          <div className="grid gap-4">
            {stores.map((store: any) => (
              <div key={store.id} className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-lemon-green/10 flex items-center justify-center"><Store className="w-6 h-6 text-lemon-green" /></div>
                  <div><h3 className="font-bold text-dark-navy">{store.name}</h3><p className="text-sm text-gray-500">{store.url}</p></div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">{store.status || "active"}</span>
                </div>
                <div className="flex items-center gap-2">
                  {store.apiKey ? (
                    <>
                      <span className="text-xs text-gray-400 font-mono bg-gray-50 px-3 py-1 rounded-lg">{store.apiKey.substring(0, 20)}...</span>
                      <button onClick={() => { navigator.clipboard.writeText(store.apiKey); toast.success("Copied!"); }} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"><Copy className="w-4 h-4" /></button>
                    </>
                  ) : (
                    <button onClick={() => handleGenerateKey(store.id)} className="text-xs text-lemon-green font-semibold hover:underline">Generate API Key</button>
                  )}
                  {store.url && <a href={store.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"><ExternalLink className="w-4 h-4" /></a>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
