"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Clock, User, Bot } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "sonner";

export default function TicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [ticket, setTicket] = useState<any>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTicket = () => {
    fetch(`/api/dashboard/conversations/${id}`, { credentials: "include" })
      .then(async r => { if (!r.ok) throw new Error("failed"); return r.json(); })
      .then(data => { setTicket(data); setLoading(false); })
      .catch(() => { setLoading(false); toast.error("Failed to load ticket"); });
  };

  useEffect(() => { if (id) fetchTicket(); }, [id]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/dashboard/tickets/${id}/reply`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: reply }),
      });
      if (res.ok) { toast.success("Reply sent!"); setReply(""); fetchTicket(); }
      else toast.error("Failed to send reply");
    } catch { toast.error("Failed to send reply"); }
    finally { setSending(false); }
  };

  if (loading) return <DashboardLayout><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full mx-auto mt-20" /></DashboardLayout>;
  if (!ticket) return <DashboardLayout><div className="text-center py-20"><p className="text-gray-500">Ticket not found</p><Link href="/dashboard/tickets" className="text-lemon-green hover:underline">Back to tickets</Link></div></DashboardLayout>;

  const messages = Array.isArray(ticket.messages) ? ticket.messages : [];

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/dashboard/tickets")} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="text-2xl font-bold text-dark-navy">Ticket #{id.substring(0, 8)}</h1>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                <Clock className="w-3 h-3" /> {new Date(ticket.createdAt).toLocaleString()}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${ticket.status === "closed" ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"}`}>{ticket.status || "open"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="space-y-4 max-h-[55vh] overflow-y-auto mb-4">
            {messages.map((msg: any, i: number) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] p-4 rounded-2xl ${msg.role === "user" ? "bg-gray-100 text-gray-800 rounded-br-md" : "bg-dark-navy text-white rounded-bl-md"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {msg.role === "user" ? <User className="w-3 h-3 opacity-50" /> : <Bot className="w-3 h-3 text-lemon-green" />}
                    <span className="text-[10px] opacity-50">{msg.role === "user" ? "You" : "Support"}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {ticket.status !== "closed" && (
            <form onSubmit={handleReply} className="flex gap-3 border-t border-gray-100 pt-4">
              <input value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..." className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green outline-none text-sm" />
              <button type="submit" disabled={sending || !reply.trim()} className="px-6 py-3 rounded-xl bg-lemon-gradient text-dark-navy font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"><Send className="w-4 h-4" /> {sending ? "Sending..." : "Reply"}</button>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
