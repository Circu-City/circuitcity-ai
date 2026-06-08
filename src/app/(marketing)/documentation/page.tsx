import { Book, Code, Puzzle, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const sections = [
  { title: "Quick Start", icon: Zap, items: ["Creating your account", "Setting up your first store", "Understanding plans & billing", "Onboarding walkthrough"] },
  { title: "Widget Configuration", icon: Puzzle, items: ["Customizing appearance", "Position & behavior", "Welcome messages", "Tone & personality", "Language settings"] },
  { title: "API & Integration", icon: Code, items: ["API authentication", "Widget embed code", "REST API reference", "Webhook events", "SDK packages"] },
  { title: "Advanced Features", icon: Book, items: ["Custom AI prompts", "Product catalog sync", "Multi-store management", "Analytics & reporting", "Team collaboration"] },
];

const faqs = [
  { q: "How do I install the chatbot on my website?", a: "Go to your dashboard → Chat Widget → copy the embed code → paste it just before the closing </body> tag on your website." },
  { q: "Which AI models does CircuCity use?", a: "We use state-of-the-art LLMs including GPT-4, Claude, and open-source models via OpenRouter, optimized for e-commerce conversations." },
  { q: "Can I customize the chatbot's responses?", a: "Yes! Use the Widget settings page to set tone, welcome messages, and custom prompts. Enterprise plans include full prompt customization." },
  { q: "What languages are supported?", a: "Over 50 languages including Swedish, English, German, French, Spanish, Finnish, Danish, Norwegian, and more. The chatbot auto-detects language." },
  { q: "Where is my data stored?", a: "All data is stored on EU-based servers in Skellefteå, Sweden. We are fully GDPR compliant with end-to-end encryption." },
];

export default function DocumentationPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-dark-navy mb-4">Documentation</h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">Everything you need to build and deploy AI-powered chatbots with CircuCity.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-lemon-green transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-lemon-green/10 flex items-center justify-center"><section.icon className="w-5 h-5 text-lemon-green" /></div>
                <h2 className="font-bold text-dark-navy text-lg">{section.title}</h2>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li key={j} className="text-sm text-gray-600 flex items-center gap-2 before:content-['·'] before:text-lemon-green before:font-bold">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-dark-navy mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group border-b border-gray-100 pb-4 last:border-0">
                <summary className="font-semibold text-dark-navy cursor-pointer hover:text-lemon-green transition-colors list-none flex items-center justify-between">{faq.q}<ArrowRight className="w-4 h-4 transition-transform group-open:rotate-90" /></summary>
                <p className="text-gray-600 text-sm mt-2 pl-1">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4">Can't find what you're looking for?</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-lemon-gradient text-dark-navy font-bold rounded-xl hover:opacity-90">Contact Support <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </div>
  );
}
