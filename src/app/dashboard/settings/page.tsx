"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "sonner";
import { Save, User, Mail, Phone, MapPin, Globe, Building2, CreditCard } from "lucide-react";

export default function SettingsPage() {
  const [form, setForm] = useState({ name: "", email: "", storeName: "", storeUrl: "", plan: "free" });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me", { credentials: "include" }).then(r => r.json()).catch(() => ({})),
      fetch("/api/dashboard/overview", { credentials: "include" }).then(r => r.json()).catch(() => ({})),
      fetch("/api/billing/status", { credentials: "include" }).then(r => r.json()).catch(() => ({})),
    ]).then(([me, overview, billing]) => {
      const store = overview?.stores?.[0] || {};
      setForm({
        name: me?.user?.name || "",
        email: me?.user?.email || "",
        storeName: store.name || "",
        storeUrl: store.url || "",
        plan: billing?.plan || "free",
      });
      setPageLoading(false);
    }).catch(e => {
      setError(String(e));
      setPageLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, storeName: form.storeName, storeUrl: form.storeUrl }),
      });
      if (res.ok) toast.success("Saved!");
      else toast.error("Failed to save");
    } catch { toast.error("Failed to save"); }
    finally { setLoading(false); }
  };

  if (pageLoading) return <DashboardLayout><div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-dark-navy">Settings</h1><p className="text-gray-500">Manage your account.</p></div>
        {error && <div className="bg-yellow-50 p-4 rounded-xl text-sm text-yellow-800">{error}</div>}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold text-dark-navy">Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green outline-none" /></div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input value={form.email} disabled className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500" /></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold text-dark-navy">Store</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Store Name</label>
              <div className="relative"><Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input value={form.storeName} onChange={e => setForm({...form, storeName: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green outline-none" /></div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Store URL</label>
              <div className="relative"><Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input value={form.storeUrl} onChange={e => setForm({...form, storeUrl: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green outline-none" /></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-dark-navy flex items-center gap-2"><CreditCard className="w-5 h-5" /> Billing</h2>
          <p className="text-sm text-dark-navy capitalize">Plan: <strong>{form.plan}</strong></p>
          <a href="/dashboard/billing" className="text-lemon-green font-semibold text-sm hover:underline">Manage Billing →</a>
        </div>
        <div className="flex justify-end">
          <button onClick={handleSave} disabled={loading} className="px-6 py-3 rounded-xl bg-lemon-gradient text-dark-navy font-bold shadow-lemon hover:scale-105 transition-transform flex items-center gap-2"><Save className="w-4 h-4" /> {loading ? "Saving..." : "Save Changes"}</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
