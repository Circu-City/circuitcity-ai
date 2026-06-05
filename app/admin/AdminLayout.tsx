"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  CreditCard,
  MessageCircle,
  Key,
  Activity,
  Settings,
  Shield,
  Menu,
  X,
  LogOut,
  Bot,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ImpersonationBanner from "@/components/ImpersonationBanner";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/admin" },
  { id: "users", label: "Users", icon: Users, href: "/admin/users" },
  { id: "stores", label: "Stores", icon: Store, href: "/admin/stores" },
  { id: "products", label: "Products", icon: Package, href: "/admin/products" },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCard, href: "/admin/subscriptions" },
  { id: "conversations", label: "Conversations", icon: MessageCircle, href: "/admin/conversations" },
  { id: "api-keys", label: "API Keys", icon: Key, href: "/admin/api-keys" },
  { id: "activity", label: "Activity Log", icon: Activity, href: "/admin/activity" },
  { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedEmail, setImpersonatedEmail] = useState("");

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/me");
        const json = await res.json();
        if (json.success && json.data?.isImpersonating) {
          setIsImpersonating(true);
          setImpersonatedEmail(json.data.email);
        }
      } catch {}
    };
    check();
  }, []);

  const activePage = navItems.find((item) =>
    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
  )?.id || "overview";

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <ImpersonationBanner isImpersonating={isImpersonating} impersonatedEmail={impersonatedEmail} />
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out transform",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center justify-between px-2 mb-8">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-emerald-400 rounded-xl flex items-center justify-center">
                <Shield className="text-slate-900 w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white block leading-none">
                  CircuCity<span className="text-emerald-400">AI</span>
                </span>
                <span className="text-[10px] text-emerald-400/70 font-semibold uppercase tracking-wider">Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">Management</p>
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm",
                  activePage === item.id
                    ? "bg-emerald-400/10 text-emerald-400 font-semibold border border-emerald-400/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                )}
              >
                <item.icon className={cn("w-4.5 h-4.5", activePage === item.id ? "text-emerald-400" : "text-slate-500")} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Bottom */}
          <div className="mt-auto pt-4 border-t border-slate-800 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
            >
              <Bot className="w-4.5 h-4.5" />
              Switch to Store
            </Link>
            <button
              onClick={async () => {
                await signOut();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all text-left"
            >
              <LogOut className="w-4.5 h-4.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                {navItems.find((n) => n.id === activePage)?.label || "Admin"}
              </h1>
              <p className="text-xs text-slate-500">System Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-slate-700 hidden sm:block">Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-8 overflow-auto">{children}</div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}