import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

const posts = [
  { title: "How AI Chatbots Boost E-commerce Conversion by 24%", date: "June 2025", excerpt: "New data shows AI-powered customer support dramatically increases sales. Learn how top stores are leveraging this technology.", category: "AI" },
  { title: "The Ultimate Guide to Reducing Cart Abandonment", date: "May 2025", excerpt: "Cart abandonment costs e-commerce stores billions. Here is how an AI assistant can recover lost sales in real-time.", category: "E-commerce" },
  { title: "Why Multilingual Support Matters for Global Growth", date: "April 2025", excerpt: "Breaking language barriers with AI translation helps stores expand into new markets without hiring translators.", category: "Growth" },
  { title: "GDPR Compliance for AI Chatbots: What You Need to Know", date: "March 2025", excerpt: "A practical guide to ensuring your AI customer support meets European data protection requirements.", category: "Legal" },
  { title: "5 Ways AI is Transforming Customer Support in 2025", date: "February 2025", excerpt: "From predictive analytics to personalized recommendations — the future of customer service is here.", category: "AI" },
  { title: "How to Train Your AI on Your Product Catalog", date: "January 2025", excerpt: "Step-by-step tutorial on uploading your product data to create a knowledgeable shopping assistant.", category: "Guide" },
];

export default function BlogPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-dark-navy mb-4">Blog</h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">Insights, tips, and stories about AI in e-commerce and customer experience.</p>
        </div>
        <div className="space-y-8">
          {posts.map((post, i) => (
            <article key={i} className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
                <span className="bg-lemon-green/10 text-lemon-green px-2 py-0.5 rounded-full text-xs font-medium">{post.category}</span>
              </div>
              <h2 className="text-2xl font-bold text-dark-navy mb-3">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <span className="inline-flex items-center gap-1 text-lemon-green font-medium text-sm">Read More <ArrowRight className="w-4 h-4" /></span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
