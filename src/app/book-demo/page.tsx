"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Mail, User, Building2, MessageSquare } from "lucide-react";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";

export default function BookDemoPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {submitted ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-lemon-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lemon">
                <Calendar className="w-10 h-10 text-dark-navy" />
              </div>
              <h1 className="text-3xl font-bold text-dark-navy mb-4">Demo Request Submitted!</h1>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">Our team will reach out within 24 hours to schedule your personalized demo.</p>
              <button onClick={() => router.push("/")} className="bg-dark-navy text-white px-8 py-3 rounded-xl font-medium hover:bg-dark-navy/90 transition-colors">Return to Home</button>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-dark-navy mb-4">Book a Demo</h1>
                <p className="text-gray-600 text-lg max-w-xl mx-auto">See how CircuCity AI can transform your customer support.</p>
              </div>
              <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all" placeholder="John Doe" /></div></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Work Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="email" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all" placeholder="john@company.com" /></div></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label><div className="relative"><Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all" placeholder="Acme Inc." /></div></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label><div className="relative"><MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" /><textarea rows={3} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all resize-none" placeholder="Tell us about your use case..." /></div></div>
                  <button type="submit" className="w-full py-3.5 rounded-xl font-bold bg-lemon-gradient text-dark-navy hover:opacity-90 shadow-lemon transition-all text-lg">Request Demo</button>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
