"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, ArrowLeft, Calendar, Mail, User, Building2, MessageSquare, Bot, ChevronDown } from "lucide-react";

function NavDropdown({ label, items, scrolled }: { label: string; items: string[]; scrolled: boolean }) {
  const router = useRouter();
  const getHref = (item: string) => {
    const slug = item.toLowerCase().replace(/\s+/g, "-");
    return `/${slug === "api" ? "api-docs" : slug}`;
  };
  return (
    <div className="group relative cursor-pointer">
      <span className={`text-sm font-medium transition-colors flex items-center gap-1 ${scrolled ? "text-gray-600 group-hover:text-dark-navy" : "text-white/70 group-hover:text-white"}`}>
        {label} <ChevronDown className="w-3 h-3" />
      </span>
      <div className="absolute top-full left-0 pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0">
        <div className="bg-white shadow-xl rounded-2xl p-3 w-48 border border-gray-100">
          {items.map((item) => (
            <button key={item} onClick={() => router.push(getHref(item))} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-dark-navy transition-colors">
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "py-3 bg-white/95 backdrop-blur-md shadow-sm" : "py-5 bg-dark-navy/95 backdrop-blur-md"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-10 h-10 bg-lemon-gradient rounded-xl flex items-center justify-center shadow-lemon">
            <Bot className="text-dark-navy w-6 h-6" />
          </div>
          <span className={`text-2xl font-bold tracking-tight ${scrolled ? "text-dark-navy" : "text-white"}`}>
            CircuCity<span className="text-lemon-green"> AI</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <NavDropdown label="Product" items={["Features", "Pricing", "Documentation", "API"]} scrolled={scrolled} />
          <NavDropdown label="Company" items={["About Us", "Blog", "Careers", "Contact"]} scrolled={scrolled} />
          <NavDropdown label="Legal" items={["Privacy", "Terms", "GDPR", "Security"]} scrolled={scrolled} />
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => router.push("/login")} className={`px-5 py-2.5 rounded-lg font-semibold transition-colors ${scrolled ? "text-dark-navy hover:bg-gray-100" : "text-white/80 hover:text-white hover:bg-white/10"}`}>Log In</button>
          <button onClick={() => router.push("/signup")} className="px-5 py-2.5 rounded-lg font-bold bg-lemon-gradient text-dark-navy hover:opacity-90 shadow-lemon transition-all">Start Free Trial</button>
        </div>
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-dark-navy text-gray-400 py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-lemon-gradient rounded-xl flex items-center justify-center">
              <Bot className="text-dark-navy w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-white">CircuCity<span className="text-lemon-green"> AI</span></span>
          </div>
          <p className="text-sm leading-relaxed">AI-powered customer support for modern e-commerce stores.</p>
        </div>
        {["Product", "Company", "Legal"].map((title) => (
          <div key={title}>
            <h4 className="text-white font-semibold mb-4">{title}</h4>
            <ul className="space-y-2 text-sm">
              {(title === "Product" ? ["Features", "Pricing", "API", "Documentation"] : title === "Company" ? ["About Us", "Blog", "Careers", "Contact"] : ["Privacy", "Terms", "GDPR", "Security"]).map((link) => {
                const slug = link.toLowerCase().replace(/\s+/g, "-");
                const href = `/${slug === "api" ? "api-docs" : slug}`;
                return <li key={link}><a href={href} className="hover:text-white transition-colors">{link}</a></li>;
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} CircuCity AI. All rights reserved.
      </div>
    </footer>
  );
}

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
                <p className="text-gray-600 text-lg max-w-xl mx-auto">See how CircuCity AI can transform your customer support. Fill out the form and we will be in touch.</p>
              </div>
              <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all" placeholder="John Doe" /></div></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Work Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="email" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all" placeholder="john@company.com" /></div></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label><div className="relative"><Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" required className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all" placeholder="Acme Inc." /></div></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">What are you looking for?</label><div className="relative"><MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" /><textarea rows={3} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green focus:ring-2 focus:ring-lemon-green/20 outline-none transition-all resize-none" placeholder="Tell us about your use case..." /></div></div>
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
