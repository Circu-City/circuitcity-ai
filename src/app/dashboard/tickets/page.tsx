"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MessageSquare, ArrowRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "sonner";

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/conversations", { credentials: "include" })
      .then(async r => { if (r.status === 401) { toast.error("Session expired"); setTimeout(() => router.push("/login"), 1500); return []; } return r.json(); })
      .then((data: any[]) => {
        const escalated = (data || []).filter((c: any) => c.escalated === true);
        setTickets(escalated);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) return <DashboardLayout><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full mx-auto mt-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-2xl font-bold text-dark-navy">My Tickets</h1><p className="text-gray-500">Support tickets and admin responses</p></div>
          <Link href="/dashboard/support" className="px-4 py-2 bg-lemon-gradient text-dark-navy font-bold rounded-xl text-sm hover:opacity-90 shadow-lemon">New Ticket</Link>
        </div>
        {tickets.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-500 mb-2">No tickets yet</h3>
            <p className="text-gray-400 max-w-md mx-auto">Submit a support ticket and our team will respond here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket: any) => {
              const msgs = Array.isArray(ticket.messages) ? ticket.messages : [];
              const adminReplies = msgs.filter((m: any) => m.role === "assistant");
              const hasReplies = adminReplies.length > 0;
              const firstMsg = msgs[0];
              return (
                <Link key={ticket.id} href={`/dashboard/tickets/${ticket.id}`} className="block bg-white rounded-2xl border border-gray-200 p-6 hover:border-lemon-green hover:shadow-sm transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${hasReplies ? "bg-green-100" : "bg-yellow-100"}`}>
                        {hasReplies ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-yellow-600" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-dark-navy group-hover:text-lemon-green transition-colors">
                          {firstMsg?.content?.substring(0, 60) || "Support Ticket"}
                          {(firstMsg?.content?.length > 60) ? "..." : ""}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                          <span className={hasReplies ? "bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-medium" : "bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-[10px] font-medium"}>
                            {hasReplies ? `${adminReplies.length} replies` : "Awaiting response"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-lemon-green group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
