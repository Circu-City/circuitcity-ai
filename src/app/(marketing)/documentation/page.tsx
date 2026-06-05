import { BookOpen, Code, Terminal, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DocumentationPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-dark-navy mb-4">Documentation</h1>
        <p className="text-gray-600 text-lg">Everything you need to integrate CircuCity AI into your store.</p>
      </div>
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
        {[
          { icon: BookOpen, title: "Getting Started", desc: "Quick start guide to set up your AI agent in minutes." },
          { icon: Terminal, title: "API Reference", desc: "Complete REST API documentation with examples." },
          { icon: Code, title: "SDK & Widgets", desc: "JavaScript widget, React components, and more." },
        ].map((item, i) => (
          <Link key={i} href="/api-docs" className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg hover:-translate-y-1 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-lemon-green/10 flex items-center justify-center mb-6 group-hover:bg-lemon-green/20 transition-colors">
              <item.icon className="w-7 h-7 text-lemon-green" />
            </div>
            <h3 className="text-xl font-bold text-dark-navy mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
            <span className="inline-flex items-center gap-1 text-lemon-green font-medium text-sm mt-4">Learn more <ArrowRight className="w-4 h-4" /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
