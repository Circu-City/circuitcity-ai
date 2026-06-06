"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "sonner";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/conversations", { credentials: "include" })
      .then(async r => { if (r.status === 401) { toast.error("Session expired. Redirecting..."); setTimeout(() => window.location.href = "/login", 1500); return []; } return r.json(); })
      .then(data => {
        const answered = (data || []).filter((c: any) => {
          const msgs = Array.isArray(c.messages) ? c.messages : [];
          return msgs.some((m: any) => m.role === "assistant" && c.escalated);
        });
        setTickets(answered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full mx-auto mt-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-2xl font-bold text-dark-navy">My Tickets</h1><p className="text-gray-500">Tickets with admin responses</p></div>
          <Link href="/dashboard/support" className="text-sm text-lemon-green font-semibold hover:underline flex items-center gap-1">New Ticket <ArrowRight className="w-3 h-3" /></Link>
        </div>
        {tickets.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-500 mb-2">No tickets yet</h3>
            <p className="text-gray-400 max-w-md mx-auto">When you submit a support ticket and our team responds, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket: any) => {
              const msgs = Array.isArray(ticket.messages) ? ticket.messages : [];
              const adminReplies = msgs.filter((m: any) => m.role === "assistant");
              const lastReply = adminReplies[adminReplies.length - 1];
              return (
                <div key={ticket.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-lemon-green hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-dark-navy">Ticket #{ticket.id.substring(0, 8)}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-medium">{adminReplies.length} {adminReplies.length === 1 ? "reply" : "replies"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {lastReply && (
                    <div className="bg-gray-50 rounded-xl p-4 mt-2">
                      <p className="text-xs text-gray-500 mb-1">Latest response from our team:</p>
                      <p className="text-sm text-gray-700">{lastReply.content?.substring(0, 200)}{lastReply.content?.length > 200 ? "..." : ""}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
