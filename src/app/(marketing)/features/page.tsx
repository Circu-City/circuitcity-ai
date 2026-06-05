import { Zap, Bot, Globe, ShieldCheck, ChartColumn, MessageSquare } from "lucide-react";

const features = [
  { icon: Zap, title: "Instant AI Responses", desc: "Lightning-fast answers to customer questions, 24/7. No more waiting for support tickets." },
  { icon: Bot, title: "Product-Aware Chatbot", desc: "Your AI knows every detail of your catalog — prices, stock, specs, and recommendations." },
  { icon: Globe, title: "50+ Languages", desc: "Automatic translation so you can serve customers worldwide without hiring translators." },
  { icon: ShieldCheck, title: "Enterprise Security", desc: "GDPR compliant, end-to-end encrypted, with SOC 2 certification in progress." },
  { icon: ChartColumn, title: "Conversion Analytics", desc: "Track how the chatbot impacts sales, cart recovery, and customer satisfaction." },
  { icon: MessageSquare, title: "Omnichannel Support", desc: "Deploy on your website, WhatsApp, Messenger, Instagram — one AI, everywhere." },
];

export default function FeaturesPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-dark-navy mb-4">Powerful Features</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">Everything you need to automate customer support and boost sales.</p>
      </div>
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-lemon-green/10 flex items-center justify-center mb-6">
              <f.icon className="w-7 h-7 text-lemon-green" />
            </div>
            <h3 className="text-xl font-bold text-dark-navy mb-3">{f.title}</h3>
            <p className="text-gray-600 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
