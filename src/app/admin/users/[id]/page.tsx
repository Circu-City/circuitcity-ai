"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Store, Key, Bell, Shield, Clock, Mail } from "lucide-react";
import { toast } from "sonner";

export default function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/users/${params.id}`, { credentials: "include" })
      .then(async r => { if (!r.ok) throw r; return r.json(); })
      .then(d => { setUserData(d); setLoading(false); })
      .catch(() => { router.push("/admin/users"); });
  }, [params.id, router]);

  const changeRole = async (userId: string, role: string) => {
    await fetch("/api/admin/users", {
      method: "PUT", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    toast.success(`Role changed to ${role}`);
    window.location.reload();
  };

  const deleteUser = async () => {
    if (!confirm("Permanently delete this user and all related data?")) return;
    await fetch(`/api/admin/users?id=${userData.id}`, { method: "DELETE", credentials: "include" });
    toast.success("User deleted");
    router.push("/admin/users");
  };

  if (loading) return <div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full mx-auto mt-20" />;
  if (!userData) return <div className="text-center py-20 text-gray-500">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark-navy text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin/users" className="p-2 hover:bg-white/10 rounded-lg"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-xl font-bold">{userData.name || userData.email}</h1>
          <Link href="/admin" className="ml-auto text-sm text-gray-400 hover:text-white">Dashboard</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* User Profile */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-lemon-green/20 flex items-center justify-center">
                <User className="w-8 h-8 text-lemon-green" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-dark-navy">{userData.name || "Unnamed"}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-3 h-3 text-gray-400" /><span className="text-gray-500">{userData.email}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${userData.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>{userData.role}</span>
                  {userData.emailVerified && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Verified</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => changeRole(userData.id, userData.role === "admin" ? "customer" : "admin")} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1">
                <Shield className="w-3 h-3" />{userData.role === "admin" ? "Demote to Customer" : "Promote to Admin"}
              </button>
              <button onClick={deleteUser} className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50">Delete</button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-dark-navy">{userData.counts?.stores || 0}</div><div className="text-xs text-gray-500">Stores</div></div>
            <div className="bg-gray-50 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-dark-navy">{userData.counts?.notifications || 0}</div><div className="text-xs text-gray-500">Notifications</div></div>
            <div className="bg-gray-50 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-dark-navy">{userData.apiKeys?.length || 0}</div><div className="text-xs text-gray-500">API Keys</div></div>
            <div className="bg-gray-50 rounded-xl p-4 text-center"><div className="text-xs text-gray-400 mt-2"><Clock className="w-3 h-3 inline" /> Joined</div><div className="text-sm font-medium text-dark-navy">{new Date(userData.createdAt).toLocaleDateString()}</div></div>
          </div>
        </div>

        {/* Stores */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4"><Store className="w-5 h-5 text-lemon-green" /><h3 className="font-bold text-dark-navy">Stores ({userData.stores?.length || 0})</h3></div>
          {userData.stores?.length > 0 ? (
            <div className="space-y-3">
              {userData.stores.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <Link href={`/admin/stores/${s.id}`} className="font-semibold text-lemon-green hover:underline">{s.name}</Link>
                    {s.url && <p className="text-xs text-gray-500">{s.url}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{s.status}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">{s.plan}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400">No stores</p>}
        </div>

        {/* API Keys */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4"><Key className="w-5 h-5 text-lemon-green" /><h3 className="font-bold text-dark-navy">API Keys</h3></div>
          {userData.apiKeys?.length > 0 ? (
            <div className="space-y-2">{userData.apiKeys.map((k: any) => (
              <div key={k.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <code className="text-xs bg-gray-50 px-2 py-1 rounded">{k.key}</code>
                <span className="text-xs text-gray-400">{new Date(k.createdAt).toLocaleDateString()}</span>
              </div>
            ))}</div>
          ) : <p className="text-gray-400">No API keys</p>}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4"><Bell className="w-5 h-5 text-lemon-green" /><h3 className="font-bold text-dark-navy">Notifications</h3></div>
          {userData.notifications?.length > 0 ? (
            <div className="space-y-2">{userData.notifications.map((n: any) => (
              <div key={n.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div><span className="font-medium text-dark-navy">{n.title}</span><p className="text-xs text-gray-500">{n.message}</p></div>
                <div className="flex items-center gap-2">
                  {n.read && <span className="text-xs text-green-600">Read</span>}
                  <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}</div>
          ) : <p className="text-gray-400">No notifications</p>}
        </div>
      </div>
    </div>
  );
}
