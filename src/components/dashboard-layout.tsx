"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Bot, LayoutDashboard, MessageSquare, ShoppingBag, BarChart3, CreditCard, Settings, LogOut,
  Search, Bell, ChevronDown, Menu, X, User, Package, Code, HeadphonesIcon, X as CloseIcon, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const allNavItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/stores", label: "Stores", icon: ShoppingBag },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Code },
  { href: "/dashboard/widget", label: "Chat Widget", icon: MessageSquare },
  { href: "/dashboard/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/dashboard/tickets", label: "Tickets", icon: MessageSquare },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/support", label: "Support", icon: HeadphonesIcon },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifList, setNotifList] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>({ products: [], conversations: [] });
  const [searching, setSearching] = useState(false);
  const searchTimer = useRef<any>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (r.status === 401) { router.push("/login"); return null; }
        return r.json();
      })
      .then((data) => { if (data) setUser(data.user || data); })
      .catch(() => { /* Silently fail - don't logout on network errors */ });
  }, [router]);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
        if (data.notifications) setNotifList(data.notifications);
        if (typeof data.unread === "number") setUnreadCount(data.unread);
      })
      .catch(() => {});
  }, []);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!q.trim()) { setSearchResults({ products: [], conversations: [] }); setSearching(false); return; }
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/dashboard/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setSearchResults(data);
      } catch { setSearchResults({ products: [], conversations: [] }); }
      finally { setSearching(false); }
    }, 300);
  };

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ readAll: true }) });
    setUnreadCount(0);
    setNotifList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const searchResultsCount = searchResults.products.length + searchResults.conversations.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-dark-navy text-white transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-lemon-gradient rounded-xl flex items-center justify-center shadow-lemon">
                <Bot className="text-dark-navy w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white">CircuCity <span className="text-lemon-green">Ai</span></span>
            </div>
            <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
          </div>
          <nav className="space-y-1">
            {allNavItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    active ? "bg-lemon-green/20 text-lemon-green" : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            {user?.role === "admin" && (
              <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-gray-400 hover:text-white hover:bg-white/5">
                <Shield className="w-5 h-5" /> Admin Panel
              </Link>
            )}
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="px-6 h-16 flex items-center justify-between gap-4">
            <button className="lg:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Search */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl flex-1 max-w-md relative">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                placeholder="Search conversations, products..."
                className="bg-transparent border-none outline-none text-sm flex-1 text-gray-700 placeholder:text-gray-400"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setSearchResults({ products: [], conversations: [] }); }} className="text-gray-400 hover:text-gray-600">
                  <CloseIcon className="w-4 h-4" />
                </button>
              )}
              {searchOpen && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-80 overflow-y-auto">
                  {searching ? (
                    <div className="p-4 text-center text-sm text-gray-400">Searching...</div>
                  ) : searchResultsCount === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-400">No results found</div>
                  ) : (
                    <div className="p-2">
                      {searchResults.products.length > 0 && (
                        <div>
                          <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</div>
                          {searchResults.products.map((p: any) => (
                            <Link key={p.id} href="/dashboard/products" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50">
                              <Package className="w-4 h-4 text-gray-400" />
                              <div><p className="text-sm font-medium text-dark-navy">{p.name}</p><p className="text-xs text-gray-400">${p.price} · {p.stock} in stock</p></div>
                            </Link>
                          ))}
                        </div>
                      )}
                      {searchResults.conversations.length > 0 && (
                        <div>
                          <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Conversations</div>
                          {searchResults.conversations.map((c: any) => (
                            <Link key={c.id} href="/dashboard/conversations" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50">
                              <MessageSquare className="w-4 h-4 text-gray-400" />
                              <div><p className="text-sm font-medium text-dark-navy">{c.customer}</p><p className="text-xs text-gray-400">{c.status} · {new Date(c.time).toLocaleDateString()}</p></div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button className="sm:hidden text-gray-500" onClick={() => setSearchOpen(!searchOpen)}>
              <Search className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button onClick={() => setNotifOpen(!notifOpen)} className="relative text-gray-500 hover:text-dark-navy transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-20 animate-fade-in">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <h3 className="text-sm font-bold text-dark-navy">Notifications</h3>
                        {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-lemon-green font-semibold hover:underline">Mark all read</button>}
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifList.length === 0 ? (
                          <div className="p-6 text-center text-sm text-gray-400">No notifications yet</div>
                        ) : (
                          notifList.map((n: any) => (
                            <div key={n.id} className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!n.read ? "bg-blue-50/50" : ""}`}>
                              <p className="text-sm font-medium text-dark-navy">{n.title}</p>
                              {n.message && <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>}
                              <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Profile */}
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 hover:opacity-80">
                  <div className="w-8 h-8 rounded-full bg-lemon-gradient flex items-center justify-center text-dark-navy font-bold text-sm">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name || "User"}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-20 py-2 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-dark-navy">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link href="/dashboard/settings" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>
                        <User className="w-4 h-4 inline mr-2" />Profile Settings
                      </Link>
                      <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4 mr-2" />Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Mobile Search Bar */}
          {searchOpen && (
            <div className="sm:hidden px-6 pb-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl relative">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm flex-1 text-gray-700"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(""); setSearchResults({ products: [], conversations: [] }); }} className="text-gray-400">
                    <CloseIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
              {searchQuery && searchResultsCount > 0 && (
                <div className="mt-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-y-auto">
                  {searchResults.products.map((p: any) => (
                    <Link key={p.id} href="/dashboard/products" className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50" onClick={() => setSearchOpen(false)}>
                      <Package className="w-4 h-4 text-gray-400" /><span className="text-sm">{p.name}</span>
                    </Link>
                  ))}
                  {searchResults.conversations.map((c: any) => (
                    <Link key={c.id} href="/dashboard/conversations" className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50" onClick={() => setSearchOpen(false)}>
                      <MessageSquare className="w-4 h-4 text-gray-400" /><span className="text-sm">{c.customer}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}