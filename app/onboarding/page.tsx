"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Check, Copy, ArrowRight, ArrowLeft, Upload } from "lucide-react";

const steps = [
  { id: "store", label: "Store Info" },
  { id: "embed", label: "Install Code" },
  { id: "products", label: "Add Products" },
  { id: "tone", label: "AI Tone" },
  { id: "activate", label: "Activate" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [store, setStore] = useState({ name: "", url: "", industry: "ecommerce" });
  const [tone, setTone] = useState("professional");
  const [products, setProducts] = useState<File | null>(null);

  const embedCode = `<script src="https://chatbot.circucity.se/api/widget?apiKey=cc_your_api_key_here" async></script>`;

  async function handleFinish() {
    router.push("/dashboard");
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-dark-navy">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-lemon-gradient rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-dark-navy fill-current" />
          </div>
          <span className="text-xl font-bold text-white">
            CircuitCity<span className="text-lemon-green">AI</span>
          </span>
        </div>

        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i <= currentStep ? "bg-lemon-gradient text-dark-navy" : "bg-white/10 text-gray-500"
                }`}>
                  {i < currentStep ? <Check className="w-5 h-5" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                    i < currentStep ? "bg-lemon-green" : "bg-white/10"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <span key={step.id} className={`text-xs ${steps.indexOf(step) <= currentStep ? "text-lemon-green" : "text-gray-600"}`}>
                {step.label}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          {currentStep === 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Tell us about your store</h2>
              <p className="text-gray-400 text-sm mb-8">We'll customize your AI agent based on your business.</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-1.5">Store Name</label>
                  <input
                    type="text"
                    placeholder="My Awesome Store"
                    value={store.name}
                    onChange={(e) => setStore({ ...store, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-dark-navy border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-lemon-green focus:ring-1 focus:ring-lemon-green"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-1.5">Store URL</label>
                  <input
                    type="url"
                    placeholder="https://mystore.com"
                    value={store.url}
                    onChange={(e) => setStore({ ...store, url: e.target.value })}
                    className="w-full px-4 py-2.5 bg-dark-navy border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-lemon-green focus:ring-1 focus:ring-lemon-green"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-1.5">Industry</label>
                  <select
                    value={store.industry}
                    onChange={(e) => setStore({ ...store, industry: e.target.value })}
                    className="w-full px-4 py-2.5 bg-dark-navy border border-white/10 rounded-lg text-white focus:outline-none focus:border-lemon-green focus:ring-1 focus:ring-lemon-green"
                  >
                    <option value="ecommerce">E-commerce</option>
                    <option value="saas">SaaS</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="mt-8 flex items-center gap-2 px-6 py-3 bg-lemon-gradient text-dark-navy font-bold rounded-lg hover:opacity-90"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Install the chatbot on your site</h2>
              <p className="text-gray-400 text-sm mb-8">{'Add this code to your website\'s <head> section.'}</p>
              <div className="relative">
                <pre className="bg-dark-navy border border-white/10 rounded-xl p-4 text-sm text-gray-300 overflow-x-auto">
                  {embedCode}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 p-2 bg-white/10 rounded-lg hover:bg-white/20 text-white transition"
                >
                  {copied ? <Check className="w-4 h-4 text-lemon-green" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copied && <p className="text-lemon-green text-sm mt-2">✓ Copied to clipboard!</p>}
              <div className="flex gap-3 mt-8">
                <button onClick={() => setCurrentStep(0)} className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setCurrentStep(2)} className="flex items-center gap-2 px-6 py-3 bg-lemon-gradient text-dark-navy font-bold rounded-lg hover:opacity-90">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Add your products</h2>
              <p className="text-gray-400 text-sm mb-8">Upload a CSV or JSON file with your product catalog.</p>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-lemon-green/50 transition cursor-pointer">
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Drop your CSV or JSON file here, or click to browse</p>
                <p className="text-gray-600 text-xs mt-2">Supported: CSV, JSON (max 10MB)</p>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setCurrentStep(1)} className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setCurrentStep(3)} className="flex items-center gap-2 px-6 py-3 bg-lemon-gradient text-dark-navy font-bold rounded-lg hover:opacity-90">
                  Skip for now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Customize your AI's tone</h2>
              <p className="text-gray-400 text-sm mb-8">Choose how your AI assistant communicates with customers.</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: "professional", label: "Professional", desc: "Formal & business-like" },
                  { id: "friendly", label: "Friendly", desc: "Warm & approachable" },
                  { id: "casual", label: "Casual", desc: "Relaxed & informal" },
                  { id: "enthusiastic", label: "Enthusiastic", desc: "Energetic & excited" },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTone(option.id)}
                    className={`p-4 rounded-xl border text-left transition ${
                      tone === option.id
                        ? "border-lemon-green bg-lemon-green/10 text-white"
                        : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <div className="font-bold text-sm mb-1">{option.label}</div>
                    <div className="text-xs opacity-70">{option.desc}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setCurrentStep(2)} className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setCurrentStep(4)} className="flex items-center gap-2 px-6 py-3 bg-lemon-gradient text-dark-navy font-bold rounded-lg hover:opacity-90">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <div className="text-center">
                <div className="w-20 h-20 bg-lemon-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-dark-navy fill-current" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Your AI agent is ready!</h2>
                <p className="text-gray-400 text-sm mb-8">Your CircuitCity AI chatbot is now active and learning your products.</p>
                
                <div className="bg-dark-navy border border-white/10 rounded-xl p-6 mb-8 text-left">
                  <div className="flex items-center gap-2 text-lemon-green mb-4">
                    <Check className="w-5 h-5" />
                    <span className="font-bold">Setup Complete</span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>✓ Store configured</li>
                    <li>✓ Embed code generated</li>
                    <li>✓ AI assistant active</li>
                    <li>✓ Ready to accept conversations</li>
                  </ul>
                </div>

                <button
                  onClick={handleFinish}
                  className="px-8 py-3 bg-lemon-gradient text-dark-navy font-bold rounded-lg hover:opacity-90 text-lg"
                >
                  Go to Dashboard <ArrowRight className="w-5 h-5 inline ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}