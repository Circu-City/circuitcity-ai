"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Package, 
  MessageCircle, 
  BarChart3, 
  CreditCard, 
  Settings, 
  BookOpen, 
  Menu, 
  X,
  LogOut,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { signOut } from "@/lib/actions/auth";
import ImpersonationBanner from "@/components/ImpersonationBanner";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, isActive, onClick }: NavItemProps) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      isActive 
        ? "bg-lemon-gradient text-dark-navy font-bold shadow-lemon" 
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    )}
  >
    <Icon className={cn("w-5 h-5", isActive ? "text-dark-navy" : "text-gray-400 group-hover:text-white")} />
    <span className="text-sm">{label}</span>
  </button>
);

export default function DashboardLayout({ children, activePage, setActivePage }: { 
  children: React.ReactNode; 
  activePage: string; 
  setActivePage: (page: string) => void 
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Dynamic user info from DB
  const [storeName, setStoreName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userInitials, setUserInitials] = useState<string>("U");

  // Impersonation detection
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedEmail, setImpersonatedEmail] = useState("");

  useEffect(() => {
    fetch("/api/client/store")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const store = data.data;
          setStoreName(store.name || "Your Store");
          
          const email = store.user?.email || "";
          setUserEmail(email);
          
          if (email) {
            const initials = email.split("@")[0].slice(0, 2).toUpperCase();
            setUserInitials(initials);
          }
        }
      })
      .catch(() => {});

    // Check if we are currently impersonating
    fetch("/api/client/store")
      .then(res => res.json())
      .then(data => {
        // A simple way: if the response has impersonation info in future, use it.
        // For now we rely on a lightweight check
      });

    // Check impersonation status
    const checkImpersonation = async () => {
      try {
        const res = await fetch("/api/me");
        const json = await res.json();
        if (json.success && json.data?.isImpersonating) {
          setIsImpersonating(true);
          setImpersonatedEmail(json.data.email);
        }
      } catch {}
    };
    checkImpersonation();
  }, []);

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "widget", label: "Chat Widget", icon: MessageSquare },
    { id: "catalog", label: "Product Catalog", icon: Package },
    { id: "conversations", label: "Conversations", icon: MessageCircle },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "billing", label: "Billing & Plans", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "docs", label: "Documentation", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      <ImpersonationBanner isImpersonating={isImpersonating} impersonatedEmail={impersonatedEmail} />
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-dark-navy text-white transition-transform duration-300 ease-in-out transform",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 px-2 mb-10">
            <div className="w-9 h-9 bg-lemon-gradient rounded-xl flex items-center justify-center shadow-lemon">
              <Bot className="text-dark-navy w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              CircuCity<span className="text-lemon-green">AI</span>
            </span>
          </div>

          <nav className="flex-1 space-y-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 mb-4">Main Menu</p>
            {menuItems.map((item) => (
              <NavItem 
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activePage === item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setIsSidebarOpen(false);
                }}
              />
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-white/10">
            <div className="bg-white/5 p-4 rounded-2xl mb-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-lemon-green/20 text-lemon-green border-lemon-green/30 text-[10px] font-bold">PRO PLAN</Badge>
              </div>
              <p className="text-xs text-gray-400 mb-3">Your current plan is active. Upgrade for more tokens.</p>
              <Button 
              onClick={() => setActivePage("billing")}
              className="bg-lemon-gradient text-dark-navy font-bold w-full text-xs py-2 hover:opacity-90 shadow-lemon"
            >
              Upgrade Now
            </Button>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10 gap-3"
              onClick={async () => {
                await signOut();
              }}
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden p-2" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold text-dark-navy capitalize">
              {menuItems.find(m => m.id === activePage)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-dark-navy">{storeName || "Your Store"}</p>
              <p className="text-[10px] text-muted-foreground">{userEmail || "Loading..."}</p>
            </div>
            <div className="w-9 h-9 bg-muted rounded-full border border-border flex items-center justify-center font-bold text-xs text-dark-navy">
              {userInitials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-dark-navy/50 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
