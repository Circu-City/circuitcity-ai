"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "sonner";
import { HeadphonesIcon, Mail, MessageSquare, BookOpen, HelpCircle, Send } from "lucide-react";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) { toast.error("Please fill in all fields"); return; }
    setSending(true);
    try {
      const res = await fetch("/api/support/ticket", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      if (res.ok) { toast.success("Ticket submitted! We'll respond within 24 hours."); setSubject(""); setMessage(""); }
      else toast.error("Failed to submit ticket");
    } catch { toast.error("Failed to submit ticket"); }
    finally { setSending(false); }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-navy">Support</h1>
          <p className="text-gray-500">Get help with your account or AI assistant.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="mailto:support@circucity.se" className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 block hover:border-lemon-green transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4"><Mail className="w-6 h-6 text-blue-600" /></div>
            <h3 className="font-semibold text-dark-navy mb-1">Email Support</h3>
            <p className="text-sm text-gray-500">support@circucity.se</p>
          </a>
          <a href="/contact" className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 block hover:border-lemon-green transition-colors">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4"><MessageSquare className="w-6 h-6 text-green-600" /></div>
            <h3 className="font-semibold text-dark-navy mb-1">Live Chat</h3>
            <p className="text-sm text-gray-500">Mon-Fri, 9:00-18:00 CET</p>
            <p className="text-xs text-lemon-green mt-2 font-medium">Open Contact Form →</p>
          </a>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4"><BookOpen className="w-6 h-6 text-purple-600" /></div>
            <h3 className="font-semibold text-dark-navy mb-1">Documentation</h3>
            <p className="text-sm text-gray-500"><a href="/documentation" className="text-lemon-green hover:underline">View docs</a></p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-dark-navy mb-4">Submit a Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief description of your issue" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} placeholder="Describe your issue in detail..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green outline-none resize-none" />
            </div>
            <button type="submit" disabled={sending} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-lemon-gradient text-dark-navy font-bold shadow-lemon hover:scale-105 transition-transform">
              <Send className="w-4 h-4" /> {sending ? "Sending..." : "Submit Ticket"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}