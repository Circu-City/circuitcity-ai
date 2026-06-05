import { Heart, Globe, Leaf, Users } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-dark-navy mb-4">About CircuCity AI</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">We are on a mission to make AI-powered customer support accessible to every online store, regardless of size.</p>
      </div>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
        {[
          { icon: Heart, title: "Our Mission", desc: "Empower businesses to provide instant, personalized support that converts visitors into loyal customers." },
          { icon: Globe, title: "Global Reach", desc: "Supporting stores in 50+ countries with automatic translation and localization." },
          { icon: Leaf, title: "Sustainability", desc: "We offset 110% of our carbon footprint and run on renewable energy." },
          { icon: Users, title: "Our Team", desc: "A passionate team of AI engineers, designers, and e-commerce experts building the future of support." },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="w-12 h-12 rounded-xl bg-lemon-green/10 flex items-center justify-center mb-4">
              <item.icon className="w-6 h-6 text-lemon-green" />
            </div>
            <h3 className="text-xl font-bold text-dark-navy mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="max-w-4xl mx-auto bg-dark-navy rounded-3xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Join 2,000+ stores already using CircuCity AI</h2>
        <p className="text-gray-400 mb-8">Start your free trial today — no credit card required.</p>
        <a href="/signup" className="inline-block bg-lemon-gradient text-dark-navy font-bold px-8 py-4 rounded-xl hover:scale-105 transition-transform shadow-lemon">Get Started Free</a>
      </div>
    </div>
  );
}
