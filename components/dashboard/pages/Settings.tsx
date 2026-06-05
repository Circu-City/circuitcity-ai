"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Lock, 
  Bell, 
  Key, 
  Globe, 
  Trash2, 
  Save, 
  Eye, 
  EyeOff,
  Loader2,
  Store
} from "lucide-react";

export default function Settings() {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", url: "", industry: "", tone: "" });
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    weeklyReport: false,
    productUpdates: true,
  });

  useEffect(() => {
    fetch("/api/client/store")
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setStore(d.data);
          setForm({
            name: d.data.name || "",
            email: d.data.user?.email || "",
            url: d.data.url || "",
            industry: d.data.industry || "",
            tone: d.data.tone || "professional",
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/client/store", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        url: form.url,
        industry: form.industry,
        tone: form.tone,
      }),
    });
    const json = await res.json();
    setSaving(false);
    if (json.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark-navy">Settings</h2>
          <p className="text-muted-foreground text-sm">Manage your account and AI chatbot configurations.</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2" onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Settings */}
        <Card className="border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <User className="w-5 h-5 text-dark-navy" />
            <h3 className="font-bold text-dark-navy">Profile Information</h3>
          </div>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-navy">Store Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-navy">Email Address</label>
                <Input type="email" value={form.email} disabled className="bg-slate-50" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-dark-navy">Store Website</label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 bg-slate-100 border border-border rounded-l-lg text-slate-500 text-sm">
                  <Globe className="w-3 h-3 mr-2" />
                  https://
                </div>
                <Input className="rounded-l-none" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-navy">Industry</label>
                <Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="e.g. Electronics, Fashion" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-navy">AI Tone</label>
                <select className="w-full px-3 py-2 bg-white border border-border rounded-md text-sm outline-none"
                  value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })}>
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="casual">Casual</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Agent Configuration */}
        <Card className="border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <Store className="w-5 h-5 text-dark-navy" />
            <h3 className="font-bold text-dark-navy">Store Details</h3>
          </div>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium text-dark-navy">Total Products</p>
                  <p className="text-xs text-muted-foreground">Products in your catalog</p>
                </div>
                <span className="text-lg font-bold text-dark-navy">{store?._count?.products || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium text-dark-navy">Total Conversations</p>
                  <p className="text-xs text-muted-foreground">AI handled conversations</p>
                </div>
                <span className="text-lg font-bold text-dark-navy">{store?._count?.conversations || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium text-dark-navy">Subscription Plan</p>
                  <p className="text-xs text-muted-foreground">Current billing plan</p>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 capitalize font-bold">
                  {store?.subscriptions?.[0]?.plan || "Free"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications & Security */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center gap-3">
              <Bell className="w-5 h-5 text-dark-navy" />
              <h3 className="font-bold text-dark-navy">Notifications</h3>
            </div>
            <CardContent className="p-6 space-y-4">
              {[
                { key: "emailAlerts", label: "Email notifications for new conversations", desc: "Get notified when customers start a new chat", enabled: notifications.emailAlerts },
                { key: "weeklyReport", label: "Weekly analytics report", desc: "Receive a weekly AI performance summary", enabled: notifications.weeklyReport },
                { key: "productUpdates", label: "Product update alerts", desc: "Updates on new features and improvements", enabled: notifications.productUpdates },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-dark-navy">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <input type="checkbox" checked={item.enabled} onChange={() => setNotifications({ ...notifications, [item.key]: !item.enabled })}
                    className="w-4 h-4 accent-primary rounded" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm overflow-hidden border-red-100">
            <div className="p-6 border-b border-border flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-red-600">Danger Zone</h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Once you delete your account, there is no going back. All your product indexing and chat history will be permanently erased.
              </p>
              <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}