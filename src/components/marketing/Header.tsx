"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Bot, ChevronDown } from "lucide-react";

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

export function Header() {
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
