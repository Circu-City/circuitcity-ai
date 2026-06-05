"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Store, CreditCard, MessageSquare, LogOut, Bot, Shield, UserCog, ShoppingBag, TicketCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include" })
      .then(r => { if (!r.ok) throw new Error("failed"); return r.json(); })
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => { setLoading(false); toast.error("Failed to load admin data"); });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/login");
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full mx-auto mb-4" /><p className="text-gray-500">Loading...</p></div>;

  if (!stats || stats.error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
        <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-dark-navy mb-2">Not Authorized</h2>
        <p className="text-sm text-gray-500 mb-6">Please log in with an admin account.</p>
        <button onClick={() => router.push("/login")} className="w-full py-3 rounded-xl bg-dark-navy text-white font-bold">Go to Login</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark-navy text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3"><div className="w-9 h-9 bg-lemon-gradient rounded-xl flex items-center justify-center"><Bot className="text-dark-navy w-5 h-5" /></div><span className="font-bold">CircuCity AI</span><span className="text-lemon-green ml-2 text-sm">Admin</span></div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-lemon-green hover:underline">App Dashboard</Link>
          <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300"><LogOut className="w-4 h-4 inline mr-1" /> Logout</button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div><h1 className="text-2xl font-bold text-dark-navy">Admin Dashboard</h1><p className="text-gray-500">Manage your application</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[{ label: "Total Users", value: stats.users ?? 0, icon: Users, href: "/admin/users" },{ label: "Total Stores", value: stats.stores ?? 0, icon: Store, href: "/admin/stores" },{ label: "Subscriptions", value: stats.subscriptions ?? 0, icon: CreditCard, href: "/admin/stores" },{ label: "Conversations", value: stats.conversations ?? 0, icon: MessageSquare, href: "/admin/support" }].map(card => (
            <Link key={card.label} href={card.href} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all block">
              <div className="flex items-center justify-between mb-3"><card.icon className="w-6 h-6 text-gray-400" /><span className="text-2xl font-bold text-dark-navy">{card.value}</span></div>
              <p className="text-sm text-gray-500">{card.label}</p>
            </Link>
          ))}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-dark-navy mb-4 flex items-center gap-2"><Shield className="w-5 h-5" /> Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/users" className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><UserCog className="w-6 h-6 text-blue-600" /></div>
              <h3 className="font-semibold text-dark-navy mb-1">Manage Users</h3><p className="text-sm text-gray-500">View, edit roles, or delete users</p><p className="text-xs text-lemon-green font-semibold mt-2">{stats.users} users →</p>
            </Link>
            <Link href="/admin/stores" className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><ShoppingBag className="w-6 h-6 text-green-600" /></div>
              <h3 className="font-semibold text-dark-navy mb-1">Manage Stores</h3><p className="text-sm text-gray-500">View and manage all stores</p><p className="text-xs text-lemon-green font-semibold mt-2">{stats.stores} stores →</p>
            </Link>
            <Link href="/admin/support" className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><TicketCheck className="w-6 h-6 text-purple-600" /></div>
              <h3 className="font-semibold text-dark-navy mb-1">Support Tickets</h3><p className="text-sm text-gray-500">View and respond to tickets</p><p className="text-xs text-lemon-green font-semibold mt-2">View tickets →</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
