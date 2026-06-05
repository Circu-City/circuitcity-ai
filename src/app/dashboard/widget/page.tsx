"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Code, Copy, Check, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function WidgetPage() {
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState({ widgetColor: "#9EF01A", position: "bottom-right", title: "AI Assistant", welcomeMsg: "Hi! How can I help you today?", toneStyle: "friendly" });
  const [saving, setSaving] = useState(false);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/widget", { ...{ credentials: "include" }, credentials: "include" })
      .then(r => r.json())
      .then(data => {
        if (data.config) setConfig(data.config);
        if (data.apiKey) setApiKey(data.apiKey);
      })
      .catch(() => {});
  }, []);

  const embedCode = `<script src="https://chatbot.circucity.se/widget.js" data-store-id="${apiKey || "YOUR_STORE_API_KEY"}" async></script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success("Embed code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/widget", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) toast.success("Widget settings saved!");
      else toast.error("Failed to save settings");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-navy">Chat Widget</h1>
          <p className="text-gray-500">Configure your AI chat widget appearance and behavior.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-dark-navy">Widget Settings</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Widget Color</label>
              <div className="flex gap-3 items-center">
                <input type="color" value={config.widgetColor} onChange={e => setConfig({...config, widgetColor: e.target.value})} className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer" />
                <span className="text-sm text-gray-500">{config.widgetColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <select value={config.position} onChange={e => setConfig({...config, position: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green outline-none bg-white">
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Widget Title</label>
              <input type="text" value={config.title} onChange={e => setConfig({...config, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
              <textarea value={config.welcomeMsg} onChange={e => setConfig({...config, welcomeMsg: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green outline-none h-24 resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tone Style</label>
              <select value={config.toneStyle} onChange={e => setConfig({...config, toneStyle: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green outline-none bg-white">
                <option value="friendly">Friendly</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
              </select>
            </div>

            <button onClick={handleSave} disabled={saving} className="w-full py-3.5 rounded-xl font-bold bg-lemon-gradient text-dark-navy hover:opacity-90 shadow-lemon transition-all">{saving ? "Saving..." : "Save Settings"}</button>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-dark-navy">Embed Code</h2>
            <p className="text-sm text-gray-500">Copy this code and paste it just before the closing {"</body>"} tag in your website.</p>
            {!apiKey ? (
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-lemon-green border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-sm text-gray-500">Loading your store API key...</p>
                <p className="text-xs text-gray-400 mt-1">Go to <a href="/dashboard/api-keys" className="text-lemon-green hover:underline">API Keys</a> if this takes too long.</p>
              </div>
            ) : (
            <>
            <div className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm font-mono overflow-x-auto relative">
              <code className="whitespace-pre-wrap break-all">{embedCode}</code>
              <button onClick={copyCode} className="absolute top-2 right-2 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <Code className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-dark-navy mb-1">Your Unique Store ID</h3>
              <p className="text-sm text-gray-500">The API key is pre-configured in this code. Just paste it into your website.</p>
            </div>
            </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}