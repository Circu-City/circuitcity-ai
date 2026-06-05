"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, ArrowRight, Bot, Zap, ShoppingCart, MessageSquare, ShieldCheck, Globe, ChartColumn, Users, CircleCheck, Star, ChevronDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const LEMON_GREEN = "#9EF01A";
const DARK_NAVY = "#0A1428";

// ─── Navigation Component ───────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "py-3 bg-white/95 backdrop-blur-md shadow-sm" : "py-5 bg-dark-navy/95 backdrop-blur-md"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-10 h-10 bg-lemon-gradient rounded-xl flex items-center justify-center shadow-lemon">
            <Bot className="text-dark-navy w-6 h-6" />
          </div>
          <span className={`text-2xl font-bold tracking-tight ${scrolled ? "text-dark-navy" : "text-white"}`}>
            CircuCity<span className="text-lemon-green"> AI</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <NavDropdown label="Product" items={["Features", "Pricing", "Documentation", "API"]} scrolled={scrolled} />
          <NavDropdown label="Company" items={["About Us", "Blog", "Careers", "Contact"]} scrolled={scrolled} />
          <NavDropdown label="Legal" items={["Privacy", "Terms", "GDPR", "Security"]} scrolled={scrolled} />
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => router.push("/login")} className={`px-5 py-2.5 rounded-lg font-semibold transition-colors ${scrolled ? "text-dark-navy hover:bg-gray-100" : "text-white/80 hover:text-white hover:bg-white/10"}`}>
            Log In
          </button>
          <button onClick={() => router.push("/signup")} className="px-5 py-2.5 rounded-lg font-bold bg-lemon-gradient text-dark-navy hover:opacity-90 shadow-lemon transition-all">
            Start Free Trial
          </button>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-xl animate-fade-in">
          <div className="px-6 py-4 space-y-3">
            {["Features", "Pricing", "About", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="block py-2 text-gray-700 hover:text-dark-navy font-medium" onClick={() => setMobileOpen(false)}>
                {item}
              </a>
            ))}
            <hr className="my-2" />
            <button onClick={() => router.push("/login")} className="w-full py-2.5 rounded-lg font-semibold text-dark-navy border border-gray-200 hover:bg-gray-50">
              Log In
            </button>
            <button onClick={() => router.push("/signup")} className="w-full py-2.5 rounded-lg font-bold bg-lemon-gradient text-dark-navy shadow-lemon">
              Start Free Trial
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavDropdown({ label, items, scrolled }: { label: string; items: string[]; scrolled: boolean }) {
  return (
    <div className="group relative cursor-pointer">
      <span className={`text-sm font-medium transition-colors flex items-center gap-1 ${scrolled ? "text-gray-600 group-hover:text-dark-navy" : "text-white/70 group-hover:text-white"}`}>
        {label} <ChevronDown className="w-3 h-3" />
      </span>
      <div className="absolute top-full left-0 pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0">
        <div className="bg-white shadow-xl rounded-2xl p-3 w-48 border border-gray-100">
          {items.map((item) => (
            <a key={item} href="#" className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-dark-navy transition-colors">
              {item}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────
function HeroSection() {
  const router = useRouter();
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-dark-navy text-white">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-lemon-gradient opacity-10 blur-[120px] rounded-full -translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-lemon-green opacity-5 blur-[100px] rounded-full translate-x-1/4 translate-y-1/4" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full border mb-6 px-4 py-1.5 bg-lemon-green/20 text-lemon-green border-lemon-green/30 font-semibold text-sm tracking-wide">
              ✨ AI-Powered E-commerce Revolution
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-[1.15] mb-6 tracking-tight">
              Turn Visitors into <br />
              <span className="text-lemon-green italic">Loyal Customers</span> <br />
              with AI Chat.
            </h1>
            <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              The ultimate AI support agent for custom online stores. Personalized, 24/7, and trained on your product data in under 15 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button onClick={() => router.push("/signup")} className="bg-lemon-gradient text-dark-navy font-bold px-8 py-4 rounded-xl text-lg hover:scale-105 transition-transform shadow-lemon flex items-center gap-2">
                Start 14-Day Free Trial <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => router.push("/signup")} className="border-2 border-white/20 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-white/10 backdrop-blur-sm transition-all">
                Add Free AI Chatbot Now
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 p-2 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
              <div className="bg-dark-navy rounded-2xl overflow-hidden border border-white/10">
                <div className="bg-white/5 px-4 py-3 flex items-center gap-2 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="mx-auto bg-white/10 rounded-md px-3 py-1 text-[10px] text-gray-400 w-1/2 text-center">CircuCity-store.com/shop</div>
                </div>
                <div className="p-6 h-[350px] bg-gradient-to-b from-dark-navy to-[#111d35] relative">
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-28 rounded-xl bg-white/5 border border-white/10 p-3">
                        <div className="w-full h-14 bg-white/10 rounded-lg mb-2" />
                        <div className="w-2/3 h-3 bg-white/10 rounded mb-1" />
                        <div className="w-1/2 h-3 bg-white/10 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-6 right-6 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden animate-float">
                    <div className="bg-lemon-gradient p-3 flex items-center gap-2">
                      <Bot className="text-dark-navy w-5 h-5" />
                      <span className="font-bold text-dark-navy text-sm">AI Shopping Assistant</span>
                    </div>
                    <div className="p-3 space-y-3 bg-white">
                      <div className="bg-gray-100 p-2.5 rounded-tr-2xl rounded-bl-2xl rounded-br-2xl text-xs text-gray-700 max-w-[85%]">
                        Hi! I see you're looking at our 4K Monitors. Want to know the best deal today? ⚡️
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[10px] bg-lemon-green/20 text-dark-navy px-2 py-1 rounded-full border border-lemon-green/30 cursor-pointer hover:bg-lemon-green/30">Yes, please!</span>
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-200">Just browsing</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ────────────────────────────────────────────────────
const features = [
  { icon: Zap, title: "Instant Deployment", desc: "One line of JS code. No complex plugins. Live in under 15 minutes.", color: "bg-yellow-100 text-yellow-700" },
  { icon: Bot, title: "Product-Aware AI", desc: "Trained directly on your CSV or JSON catalog. It knows every detail of your stock.", color: "bg-green-100 text-green-700" },
  { icon: ChartColumn, title: "Conversion Analytics", desc: "Real-time insights into what your customers want and where they drop off.", color: "bg-blue-100 text-blue-700" },
  { icon: MessageSquare, title: "Omnichannel Reach", desc: "Seamlessly scale from your store to social media and messaging apps.", color: "bg-purple-100 text-purple-700" },
  { icon: ShieldCheck, title: "Enterprise Security", desc: "GDPR compliant, encrypted data, and secure API integrations by default.", color: "bg-orange-100 text-orange-700" },
  { icon: Globe, title: "Global Scalability", desc: "Automatic translation in 50+ languages to capture international markets.", color: "bg-teal-100 text-teal-700" },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-dark-navy mb-6 tracking-tight">
            Supercharge Your Store's <span className="text-lemon-green italic">Conversion</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Stop losing customers to slow support. CircuCity AI provides instant, accurate, and personalized shopping experiences that drive sales.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="group border border-gray-100 rounded-xl p-8 hover:border-lemon-green hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-dark-navy mb-3">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing Section ─────────────────────────────────────────────────────
const plans = [
  {
    name: "Starter", price: "$0", desc: "Perfect for testing the waters",
    features: ["1,000 Messages/mo", "1 Store Integration", "Basic AI Training", "Standard Support"],
    cta: "Start Free", popular: false, gradient: false,
  },
  {
    name: "Growth", price: "$49", desc: "For growing online stores",
    features: ["10,000 Messages/mo", "3 Store Integrations", "Advanced AI Training", "Priority Support", "Detailed Analytics"],
    cta: "Try 14 Days Free", popular: true, gradient: true,
  },
  {
    name: "Enterprise", price: "$199", desc: "For large-scale operations",
    features: ["Unlimited Messages", "Unlimited Stores", "Custom LLM Training", "Dedicated Manager", "API Access"],
    cta: "Contact Sales", popular: false, gradient: false,
  },
];

function PricingSection() {
  const router = useRouter();
  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-dark-navy mb-6">Simple, Transparent Pricing</h2>
          <p className="text-gray-500 text-lg">Scale your AI support as your business grows. No hidden fees.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div key={i} className={`relative p-8 rounded-3xl transition-all duration-300 ${
              plan.popular 
                ? "bg-dark-navy text-white shadow-2xl scale-105 z-10 border-2 border-lemon-green" 
                : "bg-white text-dark-navy border border-gray-200 hover:border-lemon-green shadow-sm"
            }`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-lemon-gradient text-dark-navy text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <div className="mb-8 text-center">
                <h3 className="text-lg font-semibold mb-2 opacity-80">{plan.name}</h3>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-sm opacity-60">/mo</span>
                </div>
                <p className="text-sm mt-2 opacity-60">{plan.desc}</p>
              </div>
              <ul className="space-y-4 mb-10">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm">
                    <CircleCheck className={`w-5 h-5 ${plan.popular ? "text-lemon-green" : "text-lemon-green"}`} />
                    <span className={plan.popular ? "text-gray-300" : "text-gray-600"}>{feat}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => router.push("/signup")}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  plan.popular 
                    ? "bg-lemon-gradient text-dark-navy hover:scale-105 shadow-lemon" 
                    : "bg-dark-navy text-white hover:bg-dark-navy/90"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────────
function CTASection() {
  const router = useRouter();
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto bg-dark-navy rounded-[3rem] p-12 lg:p-20 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lemon-green/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />
        <div className="relative z-10">
          <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-8 leading-tight">
            Ready to Automate Your <br />
            <span className="text-lemon-green">Customer Support?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Join 2,000+ stores increasing their conversion rates by an average of 24% using CircuCity AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => router.push("/signup")} className="bg-lemon-gradient text-dark-navy font-bold px-10 py-5 rounded-xl text-xl hover:scale-105 transition-transform shadow-lemon flex items-center gap-2">
              Start Free Trial Now <ArrowRight className="w-6 h-6" />
            </button>
            <button onClick={() => router.push("/book-demo")} className="border-2 border-white/20 text-white px-10 py-5 rounded-xl text-xl font-medium hover:bg-white/10 backdrop-blur-sm transition-all">
              Book a Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-dark-navy text-gray-400 py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-lemon-gradient rounded-xl flex items-center justify-center">
              <Bot className="text-dark-navy w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-white">CircuCity<span className="text-lemon-green">AI</span></span>
          </div>
          <p className="text-sm leading-relaxed">AI-powered customer support for modern e-commerce stores.</p>
        </div>
        {[
          { title: "Product", links: ["Features", "Pricing", "API", "Documentation"] },
          { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
          { title: "Legal", links: ["Privacy", "Terms", "GDPR", "Security"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-white font-semibold mb-4">{col.title}</h4>
            <ul className="space-y-2 text-sm">
              {col.links.map((link) => (
                <li key={link}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-sm text-center">
        © 2026 CircuCity AI. All rights reserved.
      </div>
    </footer>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}