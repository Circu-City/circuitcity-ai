"use client";

import { useState, useEffect } from "react";
import { Key, Copy, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard-layout";

export default function ApiKeysPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyName, setKeyName] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/overview", { ...{ credentials: "include" }, credentials: "include" })
      .then(r => r.json()).then(d => { setStores(d.stores || []); setLoading(false); })
      .catch(() => { setLoading(false); toast.error("Failed to load data"); });
  }, []);

  const generateKey = async (storeId: string) => {
    try {
      const res = await fetch("/api/dashboard/widget", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId }),
      });
      if (res.ok) { toast.success("Key generated!"); window.location.reload(); }
      else toast.error("Failed");
    } catch { toast.error("Failed"); }
  };

  const revokeKey = async (keyId: string) => {
    if (!confirm("Revoke this API key? This cannot be undone.")) return;
    try {
      await fetch(`/api/admin/api-keys?id=${keyId}`, { method: "DELETE" });
      toast.success("Key revoked");
      window.location.reload();
    } catch { toast.error("Failed"); }
  };

  if (loading) return <DashboardLayout><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full mx-auto mt-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-2xl font-bold text-dark-navy">API Keys</h1><p className="text-gray-500">Manage API keys for your stores</p></div>
        </div>
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
                    <button onClick={() => generateKey(store.id)} className="bg-lemon-gradient text-dark-navy font-bold px-4 py-1.5 rounded-lg text-sm hover:opacity-90 flex items-center gap-1"><Plus className="w-3 h-3" /> Generate Key</button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {keys.length === 0 ? <p className="p-6 text-sm text-gray-400">No keys generated yet.</p> : keys.map((k: any) => (
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
