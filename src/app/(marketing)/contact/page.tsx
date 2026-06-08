"use client";

import { useState } from "react";
import { Mail, MapPin, Clock, MessageSquare, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { setSent(true); toast.success("Message sent! We'll get back to you within 24 hours."); }
      else toast.error("Failed to send. Please email hello@circucity.se directly.");
    } catch { toast.error("Network error. Please try again."); }
    finally { setSending(false); }
  };

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
            { icon: MapPin, title: "Office", desc: "Skellefteå, Sweden" },
            { icon: Clock, title: "Hours", desc: "Mon-Fri, 9:00-18:00 CET" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-lemon-green/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-lemon-green" />
              </div>
              <h3 className="font-bold text-dark-navy mb-1">{item.title}</h3>
              {item.href ? <a href={item.href} className="text-gray-600 text-sm hover:text-lemon-green">{item.desc}</a> : <p className="text-gray-600 text-sm">{item.desc}</p>}
            </div>
          ))}
        </div>
        <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          {sent ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-lemon-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-dark-navy mb-2">Message Sent!</h3>
              <p className="text-gray-500">Thank you for reaching out. We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label><input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all" placeholder="John" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label><input type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all" placeholder="john@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label><input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all" placeholder="How can we help?" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label><textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all resize-none" placeholder="Your message..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} /></div>
              <button type="submit" disabled={sending} className="w-full py-3.5 rounded-xl font-bold bg-lemon-gradient text-dark-navy hover:opacity-90 shadow-lemon transition-all text-lg flex items-center justify-center gap-2">{sending ? "Sending..." : <><Send className="w-4 h-4" /> Send Message</>}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
