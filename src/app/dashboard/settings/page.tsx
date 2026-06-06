"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "sonner";
import { Shield, Save, User, Mail, Phone, MapPin, Globe, Building2, CreditCard } from "lucide-react";

export default function SettingsPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", storeName: "", storeUrl: "", plan: "", status: "" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(r => { if (!r.ok) throw new Error("auth"); return r.json(); })
      .then(data => {
        setForm(prev => ({
          ...prev,
          name: data.user?.name || "",
          email: data.user?.email || "",
        }));
      })
      .catch(() => setError("Failed to load profile"));
  }, []);

  useEffect(() => {
    fetch("/api/dashboard/overview", { credentials: "include" })
      .then(r => { if (!r.ok) throw new Error("overview"); return r.json(); })
      .then(data => {
        const store = data.stores?.[0];
        if (store) {
          setForm(prev => ({
            ...prev,
            storeName: store.name || "",
            storeUrl: store.url || store.phone || "",
            phone: store.phone || "",
            address: store.address || "",
          }));
        }
      })
      .catch(() => {});
    fetch("/api/billing/status", { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        setForm(prev => ({ ...prev, plan: data.plan || "free", status: data.status || "" }));
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone, address: form.address, storeName: form.storeName, storeUrl: form.storeUrl }),
      });
      if (res.ok) { toast.success("Settings saved!"); setSaved(true); setTimeout(() => setSaved(false), 2000); }
      else { const d = await res.json(); toast.error(d.error || "Failed"); }
    } catch { toast.error("Failed to save"); }
    finally { setLoading(false); }
  };

  const I = ({ label, icon: Icon, value, onChange, placeholder }: any) => (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
        <input value={value} onChange={onChange} placeholder={placeholder} className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all`} />
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-dark-navy">Settings</h1><p className="text-gray-500">Manage your account and store settings.</p></div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">{error}</div>}

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold text-dark-navy">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <I label="Full Name" icon={User} value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            <I label="Email" icon={Mail} value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} placeholder="Email (read-only)" />
            <I label="Phone" icon={Phone} value={form.phone} onChange={(e: any) => setForm({ ...form, phone: e.target.value })} placeholder="+46 70 123 45 67" />
            <I label="Address" icon={MapPin} value={form.address} onChange={(e: any) => setForm({ ...form, address: e.target.value })} placeholder="Street, City, ZIP" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold text-dark-navy">Store Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <I label="Store Name" icon={Building2} value={form.storeName} onChange={(e: any) => setForm({ ...form, storeName: e.target.value })} placeholder="My Store" />
            <I label="Store URL" icon={Globe} value={form.storeUrl} onChange={(e: any) => setForm({ ...form, storeUrl: e.target.value })} placeholder="https://mystore.com" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-dark-navy flex items-center gap-2"><CreditCard className="w-5 h-5" /> Billing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Current Plan</p>
              <p className="text-sm font-bold text-dark-navy capitalize">{form.plan || "Free"}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <p className="text-sm font-bold text-dark-navy capitalize">{form.status || "—"}</p>
            </div>
          </div>
          <a href="/dashboard/billing" className="inline-block text-sm text-lemon-green font-semibold hover:underline">Manage Billing →</a>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-dark-navy flex items-center gap-2"><Shield className="w-5 h-5" /> Security</h2>
          <a href="/dashboard/settings/password" className="text-sm text-lemon-green font-semibold hover:underline">Change Password →</a>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} disabled={loading} className="px-6 py-3 rounded-xl bg-lemon-gradient text-dark-navy font-bold shadow-lemon hover:scale-105 transition-transform flex items-center gap-2">
            <Save className="w-4 h-4" /> {loading ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
