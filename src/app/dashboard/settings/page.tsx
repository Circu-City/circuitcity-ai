"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "sonner";
import { Shield, Eye, EyeOff, Smartphone, KeyRound, Save, User, Mail, Store, Globe } from "lucide-react";

export default function SettingsPage() {
  const [form, setForm] = useState({ name: "", email: "", storeName: "", storeUrl: "", notifications: { email: true, weekly: true, updates: false } });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [pwOpen, setPwOpen] = useState(false);
  const [pwShow, setPwShow] = useState(false);
  const [pwNewShow, setPwNewShow] = useState(false);
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwChanging, setPwChanging] = useState(false);

  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setForm(prev => ({ ...prev, name: data.user.name || "", email: data.user.email || "" }));
        }
      })
      .catch(() => {});
    fetch("/api/dashboard/widget", { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        setForm(prev => ({ ...prev, notifications: data.notifications || prev.notifications }));
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
        body: JSON.stringify(form),
      });
      if (res.ok) { toast.success("Settings saved!"); setSaved(true); setTimeout(() => setSaved(false), 2000); }
      else { const d = await res.json(); toast.error(d.error || "Failed to save"); }
    } catch { toast.error("Failed to save"); }
    finally { setLoading(false); }
  };

  const handleChangePassword = async () => {
    if (!pwCurrent || !pwNew || !pwConfirm) { toast.error("All password fields are required"); return; }
    if (pwNew !== pwConfirm) { toast.error("Passwords do not match"); return; }
    if (pwNew.length < 8) { toast.error("Minimum 8 characters"); return; }
    setPwChanging(true);
    try {
      const res = await fetch("/api/auth/password", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew }) });
      const data = await res.json();
      if (res.ok) { toast.success("Password changed!"); setPwOpen(false); setPwCurrent(""); setPwNew(""); setPwConfirm(""); }
      else toast.error(data.error || "Failed");
    } catch { toast.error("Failed"); }
    finally { setPwChanging(false); }
  };

  const handleToggle2FA = async () => {
    setTwoFALoading(true);
    try {
      const res = await fetch("/api/auth/2fa", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: twoFAEnabled ? "disable" : "enable", code: "SETUP" }) });
      const data = await res.json();
      if (data.success) { setTwoFAEnabled(!twoFAEnabled); toast.success(data.message); }
      else toast.error(data.error || "Failed");
    } catch { toast.error("Failed"); }
    finally { setTwoFALoading(false); }
  };

  const I = ({ label, icon: Icon, type, value, onChange, placeholder }: any) => (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
        <input type={type || "text"} value={value} onChange={onChange} placeholder={placeholder} className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all`} />
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-dark-navy">Settings</h1><p className="text-gray-500">Manage your account settings.</p></div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold text-dark-navy">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <I label="Full Name" icon={User} value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            <I label="Email" icon={Mail} type="email" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
            <I label="Store Name" icon={Store} value={form.storeName} onChange={(e: any) => setForm({ ...form, storeName: e.target.value })} placeholder="Your store name" />
            <I label="Store URL" icon={Globe} value={form.storeUrl} onChange={(e: any) => setForm({ ...form, storeUrl: e.target.value })} placeholder="https://mystore.com" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-dark-navy">Notifications</h2>
          {[{ key: "email", label: "Email notifications" }, { key: "weekly", label: "Weekly report" }, { key: "updates", label: "Product updates" }].map(item => (
            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={(form.notifications as any)[item.key]} onChange={e => setForm({ ...form, notifications: { ...form.notifications, [item.key]: e.target.checked } })} className="w-4 h-4 rounded border-gray-300 text-lemon-green focus:ring-lemon-green" />
              <span className="text-sm text-dark-navy">{item.label}</span>
            </label>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-dark-navy flex items-center gap-2"><Shield className="w-5 h-5" /> Security</h2>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"><KeyRound className="w-5 h-5 text-purple-600" /></div><div><p className="text-sm font-medium text-dark-navy">Change Password</p><p className="text-xs text-gray-500">Update your account password</p></div></div>
            <button onClick={() => setPwOpen(true)} className="px-4 py-2 rounded-lg border border-gray-200 font-medium text-dark-navy bg-white hover:bg-gray-50 text-sm transition-colors">Change</button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"><Smartphone className="w-5 h-5 text-green-600" /></div><div><p className="text-sm font-medium text-dark-navy">Two-Factor Authentication</p><p className="text-xs text-gray-500">{twoFAEnabled ? "Enabled" : "Disabled"}</p></div></div>
            <button onClick={handleToggle2FA} disabled={twoFALoading} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${twoFAEnabled ? "border border-red-200 text-red-600 bg-red-50 hover:bg-red-100" : "border border-gray-200 text-dark-navy bg-white hover:bg-gray-50"}`}>{twoFALoading ? "..." : twoFAEnabled ? "Disable" : "Enable"}</button>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} disabled={loading} className="px-6 py-3 rounded-xl bg-lemon-gradient text-dark-navy font-bold shadow-lemon hover:scale-105 transition-transform flex items-center gap-2">
            <Save className="w-4 h-4" /> {loading ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {pwOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setPwOpen(false); }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-dark-navy mb-6">Change Password</h3>
            <div className="space-y-4">
              <I label="Current Password" type={pwShow ? "text" : "password"} value={pwCurrent} onChange={(e: any) => setPwCurrent(e.target.value)} placeholder="Current password" />
              <I label="New Password" type={pwNewShow ? "text" : "password"} value={pwNew} onChange={(e: any) => setPwNew(e.target.value)} placeholder="New password" />
              <I label="Confirm Password" type={pwNewShow ? "text" : "password"} value={pwConfirm} onChange={(e: any) => setPwConfirm(e.target.value)} placeholder="Confirm password" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setPwOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleChangePassword} disabled={pwChanging} className="flex-1 py-3 rounded-xl bg-lemon-gradient text-dark-navy font-bold shadow-lemon">{pwChanging ? "Changing..." : "Change"}</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
