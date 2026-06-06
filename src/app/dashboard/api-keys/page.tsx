"use client";

import { useState, useEffect } from "react";
import { Key, Copy, Trash2, Plus, Zap } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard-layout";

export default function ApiKeysPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("starter");
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/overview", { credentials: "include" }).then(r => r.json()),
      fetch("/api/billing/status", { credentials: "include" }).then(r => r.json()),
    ]).then(([overview, billing]) => {
      setStores(overview.stores || []);
      setPlan(billing.plan || "starter");
      setLoading(false);
    }).catch(() => { setLoading(false); });
  }, []);

  const generateKey = async (storeId: string) => {
    setGeneratingFor(storeId);
    try {
      const res = await fetch("/api/dashboard/widget", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId }),
      });
      const data = await res.json();
      if (res.ok && data.apiKey) {
        toast.success("Key generated!");
        window.location.reload();
      } else {
        toast.error(data.error || "Key generation failed");
      }
    } catch {
      toast.error("Key generation failed");
    } finally {
      setGeneratingFor(null);
    }
  };

  const revokeKey = async (keyId: string) => {
    if (!confirm("Revoke this API key? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/api-keys?id=${keyId}`, { method: "DELETE", credentials: "include" });
      if (res.ok) { toast.success("Key revoked"); window.location.reload(); }
      else { const d = await res.json(); toast.error(d.error || "Failed"); }
    } catch { toast.error("Failed"); }
  };

  const isFree = plan === "starter";

  if (loading) return <DashboardLayout><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full mx-auto mt-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-2xl font-bold text-dark-navy">API Keys</h1><p className="text-gray-500">Manage API keys for your stores</p></div>
        </div>

        {isFree && stores.length > 0 && (
          <div className="mb-6 p-4 bg-lemon-green/5 border border-lemon-green/30 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-lemon-green" />
              <div><p className="text-sm font-semibold text-dark-navy">Starter Plan</p><p className="text-xs text-gray-500">Each store includes one default API key. Upgrade to generate additional keys.</p></div>
            </div>
            <Link href="/dashboard/billing" className="bg-lemon-gradient text-dark-navy font-bold px-4 py-2 rounded-lg text-sm hover:opacity-90 whitespace-nowrap">Upgrade</Link>
          </div>
        )}

        {stores.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200"><Key className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-bold text-gray-500 mb-2">No stores yet</h3></div>
        ) : (
          <div className="space-y-8">
            {stores.map((store: any) => {
              const keys = store.apiKeys || (store.apiKey ? [{ id: store.id, key: store.apiKey, name: "Default" }] : []);
              return (
                <div key={store.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="p-6 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <div><h3 className="font-bold text-dark-navy">{store.name}</h3><p className="text-sm text-gray-500">{store.url}</p></div>
                    {!isFree && (
                      <button onClick={() => generateKey(store.id)} disabled={generatingFor === store.id}
                        className="bg-lemon-gradient text-dark-navy font-bold px-4 py-1.5 rounded-lg text-sm hover:opacity-90 flex items-center gap-1 disabled:opacity-50">
                        <Plus className="w-3 h-3" /> {generatingFor === store.id ? "Generating..." : "Generate Key"}
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-gray-100">
                    {keys.length === 0 ? <p className="p-6 text-sm text-gray-400">No keys yet.</p> : keys.map((k: any) => (
                      <div key={k.id || k.key} className="p-4 flex items-center justify-between">
                        <div><code className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{k.key}</code></div>
                        <div className="flex gap-2">
                          <button onClick={() => { navigator.clipboard.writeText(k.key); toast.success("Copied!"); }} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"><Copy className="w-4 h-4" /></button>
                          <button onClick={() => revokeKey(k.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {store.embedCode && <div className="p-4 bg-dark-navy text-white text-xs font-mono overflow-x-auto">{store.embedCode} <button onClick={() => { navigator.clipboard.writeText(store.embedCode); toast.success("Copied!"); }} className="ml-2 text-lemon-green hover:underline">Copy</button></div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
