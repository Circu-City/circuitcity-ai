"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bot, Check, Copy, Upload, Smile, Zap, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const steps = ["Store Info", "Integration", "Products", "AI Tone", "Activate"];

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [storeId, setStoreId] = useState("");
  const [copied, setCopied] = useState(false);
  const [toneStyle, setToneStyle] = useState("friendly");
  const [toneDesc, setToneDesc] = useState("");

  useEffect(() => {
    fetch("/api/onboarding/status")
      .then((r) => r.json())
      .then((data) => {
        if (data.done) {
          router.push("/dashboard");
          return;
        }
        if (data.store) {
          setStoreName(data.store.name || "");
          setStoreUrl(data.store.url || "");
          setApiKey(data.store.apiKey || "");
          setStoreId(data.store.id || "");
          if (data.config) {
            setToneStyle(data.config.toneStyle || "friendly");
          }
        }
      })
      .catch(() => {});
  }, [router]);

  useEffect(() => {
    if (apiKey && storeId) {
      setEmbedCode(`<script src="https://chatbot.CircuCity.se/widget.js" data-store-id="${storeId}" data-api-key="${apiKey}"></script>`);
    }
  }, [apiKey, storeId]);

  const handleStep1 = async () => {
    if (!storeName) { toast.error("Enter your store name"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/store", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: storeName, url: storeUrl, industry }),
      });
      const data = await res.json();
      if (data.apiKey) setApiKey(data.apiKey);
      if (data.storeId) setStoreId(data.storeId);
      setStep(1);
    } catch { toast.error("Failed to save store info"); }
    finally { setLoading(false); }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success("Embed code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await fetch("/api/onboarding/tone", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toneStyle, toneDesc }),
      });
      await fetch("/api/onboarding/complete", { method: "POST" });
      toast.success("All set! Welcome to CircuCity AI.");
      router.push("/dashboard");
    } catch { toast.error("Failed to complete setup"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-lemon-gradient rounded-xl flex items-center justify-center shadow-lemon">
              <Bot className="text-dark-navy w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-dark-navy">CircuCity<span className="text-lemon-green">AI</span></span>
          </div>
          <h1 className="text-3xl font-bold text-dark-navy mb-2">Set Up Your AI Assistant</h1>
          <p className="text-gray-500">Follow these steps to get your AI chatbot live on your store.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i <= step ? "bg-lemon-gradient text-dark-navy" : "bg-gray-200 text-gray-400"
              }`}>
                {i < step ? <Check className="w-5 h-5" /> : i + 1}
              </div>
              {i < steps.length - 1 && <div className={`w-16 sm:w-24 h-1 mx-2 rounded transition-all ${i < step ? "bg-lemon-green" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-dark-navy">Tell us about your store</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Name *</label>
                <input value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="My Online Store"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Store URL</label>
                <input value={storeUrl} onChange={(e) => setStoreUrl(e.target.value)} placeholder="https://mystore.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry</label>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none bg-white">
                  <option value="">Select industry</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion & Apparel</option>
                  <option value="home">Home & Garden</option>
                  <option value="beauty">Beauty & Health</option>
                  <option value="food">Food & Beverage</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button onClick={handleStep1} disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold bg-lemon-gradient text-dark-navy hover:opacity-90 shadow-lemon transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-dark-navy">Add the embed code to your store</h2>
              <p className="text-gray-500">Copy this code and paste it just before the closing body tag in your website.</p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm font-mono overflow-x-auto relative">
                <code>{embedCode || "Loading..."}</code>
                <button onClick={copyCode} className="absolute top-2 right-2 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-sm text-gray-400">Your unique store ID and API key are pre-configured in this code.</p>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3.5 rounded-xl font-bold bg-lemon-gradient text-dark-navy hover:opacity-90 shadow-lemon transition-all">
                  I've added the code <ArrowRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-dark-navy">Add your products</h2>
              <p className="text-gray-500">Upload a CSV or JSON file with your product catalog. This trains our AI on your inventory.</p>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-lemon-green transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">Drop your CSV/JSON file here</p>
                <p className="text-sm text-gray-400 mt-1">Or click to browse files</p>
              </div>
              <p className="text-sm text-gray-400">You can always add products later from your dashboard.</p>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3.5 rounded-xl font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">
                  <ArrowLeft className="w-4 h-4 inline mr-1" /> Back
                </button>
                <button onClick={() => setStep(3)} className="flex-1 py-3.5 rounded-xl font-bold bg-lemon-gradient text-dark-navy hover:opacity-90 shadow-lemon transition-all">
                  Skip for now <ArrowRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-dark-navy">Customize AI tone</h2>
              <p className="text-gray-500">How should your AI assistant communicate with customers?</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "friendly", label: "Friendly & Casual", icon: "😊" },
                  { id: "professional", label: "Professional", icon: "👔" },
                  { id: "playful", label: "Playful & Fun", icon: "🎮" },
                  { id: "formal", label: "Formal & Polished", icon: "📋" },
                ].map((tone) => (
                  <button key={tone.id} onClick={() => setToneStyle(tone.id)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      toneStyle === tone.id ? "border-lemon-green bg-lemon-green/5" : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <span className="text-3xl mb-2 block">{tone.icon}</span>
                    <span className="font-semibold text-dark-navy">{tone.label}</span>
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional instructions (optional)</label>
                <textarea value={toneDesc} onChange={(e) => setToneDesc(e.target.value)} placeholder="e.g., Be enthusiastic about product features..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none h-24 resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-6 py-3.5 rounded-xl font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">
                  <ArrowLeft className="w-4 h-4 inline mr-1" /> Back
                </button>
                <button onClick={() => setStep(4)} className="flex-1 py-3.5 rounded-xl font-bold bg-lemon-gradient text-dark-navy hover:opacity-90 shadow-lemon transition-all">
                  Continue <ArrowRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 rounded-full bg-lemon-gradient mx-auto flex items-center justify-center">
                <Zap className="w-10 h-10 text-dark-navy" />
              </div>
              <h2 className="text-2xl font-bold text-dark-navy">You're all set!</h2>
              <p className="text-gray-500 max-w-md mx-auto">Your AI assistant is configured and ready to start helping your customers. Visit your dashboard to see it in action.</p>
              <div className="bg-gray-50 rounded-xl p-6 text-left space-y-3">
                <h3 className="font-semibold text-dark-navy">Next steps:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-lemon-green" /> Store configured</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-lemon-green" /> Embed code generated</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-lemon-green" /> AI tone customized</li>
                  <li className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-400">4</span> Add products from dashboard</li>
                </ul>
              </div>
              <button onClick={handleComplete} disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold bg-lemon-gradient text-dark-navy hover:opacity-90 shadow-lemon transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}