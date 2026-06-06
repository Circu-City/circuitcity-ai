"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Store, ExternalLink, MessageSquare, Key, Settings, Shield, BadgeCheck, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export default function AdminStoreDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch(`/api/admin/stores/${params.id}`, { credentials: "include" })
      .then(async r => { if (!r.ok) throw r; return r.json(); })
      .then(d => { setStore(d); setName(d.name); setUrl(d.url || ""); setStatus(d.status); setLoading(false); })
      .catch(() => { router.push("/admin/stores"); });
  }, [params.id, router]);

  const saveStore = async () => {
    try {
      const r = await fetch("/api/admin/stores", {
        method: "PUT", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: store.id, name, url, status }),
      });
      const data = await r.json();
      if (data.success) { toast.success("Store updated"); setEditing(false); window.location.reload(); }
      else toast.error(data.error || "Failed");
    } catch { toast.error("Failed"); }
  };

  const deleteStore = async () => {
    if (!confirm("Permanently delete this store and all related data?")) return;
    try {
      const r = await fetch(`/api/admin/stores?id=${store.id}`, { method: "DELETE", credentials: "include" });
      const data = await r.json();
      if (data.success) { toast.success("Store deleted"); router.push("/admin/stores"); }
      else toast.error(data.error || "Failed");
    } catch { toast.error("Failed to delete store"); }
  };

  const revokeKey = async (keyId: string) => {
    if (!confirm("Revoke this API key?")) return;
    try {
      const r = await fetch(`/api/admin/api-keys?id=${keyId}`, { method: "DELETE", credentials: "include" });
      const data = await r.json();
      if (data.success) { toast.success("Key revoked"); window.location.reload(); }
      else toast.error(data.error || "Failed");
    } catch { toast.error("Failed to revoke key"); }
  };

  if (loading) return <div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full mx-auto mt-20" />;
  if (!store) return <div className="text-center py-20 text-gray-500">Store not found</div>;

  const planColors: Record<string, string> = { starter: "bg-gray-100 text-gray-700", pro: "bg-blue-100 text-blue-700", enterprise: "bg-purple-100 text-purple-700" };
  const statusColors: Record<string, string> = { active: "bg-green-100 text-green-700", inactive: "bg-red-100 text-red-700", pending: "bg-yellow-100 text-yellow-700" };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark-navy text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin/stores" className="p-2 hover:bg-white/10 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-xl font-bold">{store.name || "Store Detail"}</h1>
          <Link href="/admin" className="ml-auto text-sm text-gray-400 hover:text-white">Dashboard</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Store Info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-dark-navy">{store.name}</h2>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[store.status] || ""}`}>{store.status}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${planColors[store.subscription?.plan] || ""}`}>{store.subscription?.plan || "starter"}</span>
              </div>
              {store.url && <a href={store.url} target="_blank" rel="noopener noreferrer" className="text-lemon-green hover:underline text-sm mt-1 inline-block">{store.url} <ExternalLink className="w-3 h-3 inline" /></a>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(!editing)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1"><Settings className="w-3 h-3" /> Edit</button>
              <button onClick={deleteStore} className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 flex items-center gap-1"><XCircle className="w-3 h-3" /> Delete</button>
            </div>
          </div>

          {editing && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl mb-4">
              <div><label className="text-xs text-gray-500">Name</label><input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              <div><label className="text-xs text-gray-500">URL</label><input value={url} onChange={e => setUrl(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
              <div><label className="text-xs text-gray-500">Status</label><select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="active">Active</option><option value="inactive">Inactive</option><option value="pending">Pending</option></select></div>
              <div className="col-span-3 flex gap-2"><button onClick={saveStore} className="bg-lemon-green text-dark-navy px-4 py-2 rounded-lg text-sm font-bold">Save Changes</button><button onClick={() => setEditing(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button></div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-dark-navy">{store.counts?.conversations || 0}</div><div className="text-xs text-gray-500">Conversations</div></div>
            <div className="bg-gray-50 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-dark-navy">{store.counts?.products || 0}</div><div className="text-xs text-gray-500">Products</div></div>
            <div className="bg-gray-50 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-dark-navy">{store.apiKeys?.length || 0}</div><div className="text-xs text-gray-500">API Keys</div></div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-dark-navy">{store.subscription?.currentPeriodEnd ? new Date(store.subscription.currentPeriodEnd).toLocaleDateString() : "—"}</div>
              <div className="text-xs text-gray-500">Renews</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Owner Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4"><Shield className="w-5 h-5 text-lemon-green" /><h3 className="font-bold text-dark-navy">Owner</h3></div>
            {store.owner ? (
              <div className="space-y-2">
                <Link href={`/admin/users/${store.owner.id}`} className="text-lg font-semibold text-lemon-green hover:underline">{store.owner.name || store.owner.email}</Link>
                <p className="text-gray-500 text-sm">{store.owner.email}</p>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${store.owner.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>{store.owner.role}</span>
              </div>
            ) : <p className="text-gray-400">No owner assigned</p>}
          </div>

          {/* Subscription */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4"><BadgeCheck className="w-5 h-5 text-lemon-green" /><h3 className="font-bold text-dark-navy">Subscription</h3></div>
            {store.subscription ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2"><span className={`px-2 py-0.5 rounded text-xs font-medium ${planColors[store.subscription.plan]}`}>{store.subscription.plan}</span><span className={`px-2 py-0.5 rounded text-xs font-medium ${store.subscription.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{store.subscription.status}</span></div>
                {store.subscription.stripeId && <p className="text-xs text-gray-400">Stripe: {store.subscription.stripeId}</p>}
                {store.subscription.currentPeriodEnd && <p className="text-xs text-gray-500">Renews: {new Date(store.subscription.currentPeriodEnd).toLocaleDateString()}</p>}
              </div>
            ) : <p className="text-gray-400">No subscription</p>}
          </div>

          {/* API Keys */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4"><Key className="w-5 h-5 text-lemon-green" /><h3 className="font-bold text-dark-navy">API Keys</h3></div>
            {store.apiKeys?.length > 0 ? (
              <div className="space-y-2">
                {store.apiKeys.map((k: any) => (
                  <div key={k.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div><code className="text-xs bg-gray-50 px-2 py-1 rounded">{k.key}</code><p className="text-xs text-gray-400 mt-0.5">{k.name}</p></div>
                    <button onClick={() => revokeKey(k.id)} className="text-xs text-red-500 hover:text-red-700">Revoke</button>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-400">No API keys</p>}
          </div>

          {/* Embed Config */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4"><Settings className="w-5 h-5 text-lemon-green" /><h3 className="font-bold text-dark-navy">Widget Config</h3></div>
            {store.embedConfig ? (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Color:</span><span className="font-mono">{store.embedConfig.widgetColor}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Position:</span><span>{store.embedConfig.position}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Title:</span><span>{store.embedConfig.title}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tone:</span><span>{store.embedConfig.toneStyle}</span></div>
              </div>
            ) : <p className="text-gray-400">Not configured</p>}
            {store.embedCode && <pre className="mt-3 text-xs bg-dark-navy text-white p-3 rounded-lg overflow-x-auto">{store.embedCode.substring(0, 200)}...</pre>}
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4"><MessageSquare className="w-5 h-5 text-lemon-green" /><h3 className="font-bold text-dark-navy">Recent Conversations</h3></div>
          {store.conversations?.length > 0 ? (
            <div className="overflow-x-auto"><table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500"><th className="pb-3">Customer</th><th className="pb-3">Status</th><th className="pb-3">Messages</th><th className="pb-3">Escalated</th><th className="pb-3">Date</th></tr></thead>
              <tbody>
                {store.conversations.map((c: any) => (
                  <tr key={c.id} className="border-t border-gray-100">
                    <td className="py-3">{c.customerName || "Visitor"}</td>
                    <td className="py-3"><span className={`px-2 py-0.5 rounded text-xs ${c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{c.status}</span></td>
                    <td className="py-3">{c.messageCount}</td>
                    <td className="py-3">{c.escalated ? <span className="text-red-500 font-medium">Yes</span> : "No"}</td>
                    <td className="py-3 text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          ) : <p className="text-gray-400">No conversations yet</p>}
        </div>
      </div>
    </div>
  );
}
