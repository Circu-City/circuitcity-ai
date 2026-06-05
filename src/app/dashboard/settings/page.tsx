"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "sonner";
import { Shield, Eye, EyeOff, Smartphone, KeyRound } from "lucide-react";

export default function SettingsPage() {
  const [form, setForm] = useState({ name: "", email: "", notifications: { email: true, weekly: true, updates: false } });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Change Password
  const [pwOpen, setPwOpen] = useState(false);
  const [pwShow, setPwShow] = useState(false);
  const [pwNewShow, setPwNewShow] = useState(false);
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwChanging, setPwChanging] = useState(false);

  // 2FA
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { ...{ credentials: "include" }, credentials: "include" })
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setForm({ name: data.user.name || "", email: data.user.email || "", notifications: data.notifications || { email: true, weekly: true, updates: false } });
        }
      })
      .catch(() => {});
    fetch("/api/auth/2fa", { ...{ credentials: "include" }, credentials: "include" })
      .then(r => r.json())
      .then(data => { if (typeof data.enabled === "boolean") setTwoFAEnabled(data.enabled); })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { toast.success("Settings saved!"); setSaved(true); setTimeout(() => setSaved(false), 2000); }
      else toast.error("Failed to save settings");
    } catch { toast.error("Failed to save settings"); }
    finally { setLoading(false); }
  };

  const handleChangePassword = async () => {
    if (!pwCurrent || !pwNew || !pwConfirm) { toast.error("All password fields are required"); return; }
    if (pwNew !== pwConfirm) { toast.error("New passwords do not match"); return; }
    if (pwNew.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setPwChanging(true);
    try {
      const res = await fetch("/api/auth/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew }) });
      const data = await res.json();
      if (res.ok) { toast.success("Password changed successfully!"); setPwOpen(false); setPwCurrent(""); setPwNew(""); setPwConfirm(""); }
      else toast.error(data.error || "Failed to change password");
    } catch { toast.error("Failed to change password"); }
    finally { setPwChanging(false); }
  };

  const handleToggle2FA = async () => {
    setTwoFALoading(true);
    try {
      const res = await fetch("/api/auth/2fa", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: twoFAEnabled ? "disable" : "enable", code: "SETUP" }) });
      const data = await res.json();
      if (data.success) { setTwoFAEnabled(!twoFAEnabled); toast.success(data.message); }
      else { toast.error(data.error || data.message || "Failed to update2FA"); }
    } catch { toast.error("Failed to update 2FA"); }
    finally { setTwoFALoading(false); }
  };

  const InputField = ({ label, type, value, onChange, placeholder, showToggle, toggleShow, show }: any) => (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input type={showToggle ? (show ? "text" : "password") : type} value={value} onChange={onChange} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green outline-none pr-10" />
        {showToggle && (
          <button type="button" onClick={toggleShow} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-navy">Settings</h1>
          <p className="text-gray-500">Manage your account settings and preferences.</p>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h2 className="text-lg font-semibold text-dark-navy">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green outline-none" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-dark-navy">Notifications</h2>
          {[
            { key: "email", label: "Email notifications for new conversations" },
            { key: "weekly", label: "Weekly analytics report" },
            { key: "updates", label: "Product update alerts" },
          ].map(item => (
            <label key={item.key} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.notifications[item.key as keyof typeof form.notifications]} onChange={e => setForm({...form, notifications: {...form.notifications, [item.key]: e.target.checked}})} className="w-4 h-4 rounded border-gray-300 text-lemon-green focus:ring-lemon-green" />
              <span className="text-sm text-dark-navy">{item.label}</span>
            </label>
          ))}
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-dark-navy flex items-center gap-2"><Shield className="w-5 h-5" /> Security</h2>

          {/* Change Password */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"><KeyRound className="w-5 h-5 text-purple-600" /></div>
              <div>
                <p className="text-sm font-medium text-dark-navy">Change Password</p>
                <p className="text-xs text-gray-500">Update your account password</p>
              </div>
            </div>
            <button onClick={() => setPwOpen(true)} className="px-4 py-2 rounded-lg border border-gray-200 font-medium text-dark-navy bg-white hover:bg-gray-50 text-sm transition-colors shadow-sm">Change Password</button>
          </div>

          {/* 2FA */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"><Smartphone className="w-5 h-5 text-green-600" /></div>
              <div>
                <p className="text-sm font-medium text-dark-navy">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500">{twoFAEnabled ? "Enabled — adds extra security" : "Disabled — enable for extra security"}</p>
              </div>
            </div>
            <button onClick={handleToggle2FA} disabled={twoFALoading} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm ${twoFAEnabled ? "border border-red-200 text-red-600 bg-red-50 hover:bg-red-100" : "border border-gray-200 text-dark-navy bg-white hover:bg-gray-50"}`}>
              {twoFALoading ? "Updating..." : twoFAEnabled ? "Disable" : "Enable"}
            </button>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button onClick={handleSave} disabled={loading} className="px-6 py-3 rounded-xl bg-lemon-gradient text-dark-navy font-bold shadow-lemon hover:scale-105 transition-transform">
            {loading ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {pwOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setPwOpen(false); }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-dark-navy mb-6">Change Password</h3>
            <div className="space-y-4">
              <InputField label="Current Password" type="password" value={pwCurrent} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPwCurrent(e.target.value)} placeholder="Enter current password" showToggle toggleShow={() => setPwShow(!pwShow)} show={pwShow} />
              <InputField label="New Password" type="password" value={pwNew} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPwNew(e.target.value)} placeholder="Enter new password" showToggle toggleShow={() => setPwNewShow(!pwNewShow)} show={pwNewShow} />
              <InputField label="Confirm New Password" type="password" value={pwConfirm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPwConfirm(e.target.value)} placeholder="Confirm new password" showToggle toggleShow={() => setPwNewShow(!pwNewShow)} show={pwNewShow} />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setPwOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleChangePassword} disabled={pwChanging} className="flex-1 py-3 rounded-xl bg-lemon-gradient text-dark-navy font-bold shadow-lemon hover:scale-105 transition-transform">{pwChanging ? "Changing..." : "Change Password"}</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}