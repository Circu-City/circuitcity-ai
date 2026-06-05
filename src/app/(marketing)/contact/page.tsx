import { Mail, MapPin, Clock, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-dark-navy mb-4">Contact Us</h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">We would love to hear from you. Reach out and our team will get back to you within 24 hours.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Mail, title: "Email", desc: "hello@circucity.se", href: "mailto:hello@circucity.se" },
            { icon: MapPin, title: "Office", desc: "Stockholm, Sweden" },
            { icon: Clock, title: "Hours", desc: "Mon-Fri, 9:00-18:00 CET" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-lemon-green/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-lemon-green" />
              </div>
              <h3 className="font-bold text-dark-navy mb-1">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label><input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all" placeholder="John" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label><input type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all" placeholder="john@example.com" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label><input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all" placeholder="How can we help?" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label><textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all resize-none" placeholder="Your message..." /></div>
            <button type="submit" className="w-full py-3.5 rounded-xl font-bold bg-lemon-gradient text-dark-navy hover:opacity-90 shadow-lemon transition-all text-lg">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
