import { CircleCheck } from "lucide-react";
import Link from "next/link";

const plans = [
  { name: "Starter", price: "0", period: "/mo", messages: "1,000 Messages/mo", stores: "1 Store", training: "Basic AI Training", support: "Standard Support", cta: "Start Free", href: "/signup", featured: false },
  { name: "Growth", price: "49", period: "/mo", messages: "10,000 Messages/mo", stores: "3 Stores", training: "Advanced AI Training", support: "Priority Support", extra: "Detailed Analytics", cta: "Try 14 Days Free", href: "/signup", featured: true },
  { name: "Enterprise", price: "199", period: "/mo", messages: "Unlimited Messages", stores: "Unlimited Stores", training: "Custom LLM Training", support: "Dedicated Manager", extra: "API Access", cta: "Contact Sales", href: "/contact-sales", featured: false },
];

export default function PricingPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-dark-navy mb-4">Simple, Transparent Pricing</h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">Scale your AI support as your business grows. No hidden fees.</p>
      </div>
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {plans.map((p) => (
          <div key={p.name} className={`relative p-8 rounded-3xl transition-all border ${p.featured ? "bg-dark-navy text-white border-lemon-green shadow-2xl scale-105 z-10" : "bg-white border-gray-200 hover:border-lemon-green shadow-sm"}`}>
            {p.featured && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-lemon-gradient text-dark-navy text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>}
            <div className="text-center mb-8">
              <h3 className={`text-lg font-semibold mb-2 ${p.featured ? "text-white/80" : "text-gray-600"}`}>{p.name}</h3>
              <div className="flex items-center justify-center gap-1">
                <span className="text-4xl font-bold">${p.price}</span>
                <span className={`text-sm ${p.featured ? "text-white/60" : "text-gray-400"}`}>{p.period}</span>
              </div>
            </div>
            <ul className="space-y-4 mb-10">
              {[p.messages, p.stores, p.training, p.support, p.extra].filter(Boolean).map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <CircleCheck className={`w-5 h-5 ${p.featured ? "text-lemon-green" : "text-lemon-green"}`} />
                  <span className={p.featured ? "text-gray-300" : "text-gray-600"}>{item}</span>
                </li>
              ))}
            </ul>
            <Link href={p.href} className={`block w-full py-3 rounded-xl font-bold text-center transition-all ${p.featured ? "bg-lemon-gradient text-dark-navy hover:scale-105 shadow-lemon" : "bg-dark-navy text-white hover:bg-dark-navy/90"}`}>{p.cta}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
