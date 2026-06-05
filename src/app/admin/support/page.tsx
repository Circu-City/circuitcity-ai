"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, TicketCheck, MessageSquare, Mail, Search } from "lucide-react";
import { apiFetch } from "@/lib/api-client";

export default function AdminSupportPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiFetch("/api/admin/support")
      .then(r => r.json())
      .then(data => { setTickets(data || []); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [router]);

  const filtered = tickets.filter(t => !search || t.customer?.toLowerCase().includes(search.toLowerCase()) || t.email?.toLowerCase().includes(search.toLowerCase()) || t.storeName?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark-navy text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin")} className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
          <div className="w-9 h-9 bg-lemon-gradient rounded-xl flex items-center justify-center"><TicketCheck className="text-dark-navy w-5 h-5" /></div>
          <span className="font-bold">Support Tickets</span>
        </div>
        <Link href="/dashboard" className="text-sm text-lemon-green hover:underline">App Dashboard</Link>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-navy">Escalated Tickets</h1>
            <p className="text-gray-500">{tickets.length} tickets requiring attention</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets..." className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-64" />
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map(ticket => (
            <Link key={ticket.id} href={`/dashboard/conversations/${ticket.id}`} className="block bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-lemon-green hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-bold text-dark-navy">{ticket.customer}</span>
                  <span className="text-xs text-gray-400 ml-2">{ticket.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{ticket.storeName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ticket.status === 'active' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>{ticket.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {ticket.messages} messages</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {ticket.email}</span>
                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No escalated tickets found.</div>}
        </div>
      </div>
    </div>
  );
}
