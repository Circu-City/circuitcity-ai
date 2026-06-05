import { Mail, Building2, User, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function ContactSalesPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dark-navy mb-4">Contact Sales</h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">Interested in an Enterprise plan? Tell us about your needs and our team will reach out within 24 hours.</p>
        </div>
        <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <form className="space-y-5">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all" placeholder="John Doe" /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Work Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="email" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all" placeholder="john@company.com" /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Company</label><div className="relative"><Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all" placeholder="Acme Inc." /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label><div className="relative"><MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" /><textarea rows={4} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all resize-none" placeholder="Tell us about your requirements..." /></div></div>
            <button type="submit" className="w-full py-3.5 rounded-xl font-bold bg-lemon-gradient text-dark-navy hover:opacity-90 shadow-lemon transition-all text-lg">Send Message</button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-4">Or email us directly at <a href="mailto:sales@circucity.se" className="text-lemon-green hover:underline">sales@circucity.se</a></p>
        </div>
      </div>
    </div>
  );
}
