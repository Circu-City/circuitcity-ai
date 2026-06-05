"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Mail, Clock, User, AlertCircle } from "lucide-react";
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
    fetch(`/api/admin/support/${id}`, { credentials: "include" })
      .then(r => { if (!r.ok) { toast.error("Session expired"); router.push("/login"); return null; } return r.json(); })
      .then(data => { if (data) setTicket(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchTicket(); }, [id]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/admin/support/${id}/reply`, {
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

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full" /></div>;
  if (!ticket) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" /><p className="text-gray-500">Ticket not found</p><Link href="/admin/support" className="text-lemon-green hover:underline text-sm">Back to tickets</Link></div></div>;

  const messages = Array.isArray(ticket.messages) ? ticket.messages : [];

  const handleClose = async () => {
    await fetch(`/api/admin/support/${id}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "closed" }) });
    toast.success("Ticket closed");
    router.push("/admin/support");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark-navy text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin/support")} className="text-gray-400 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
          <span className="font-bold">Ticket #{id.substring(0, 8)}</span>
        </div>
        <div className="flex items-center gap-3">
          {ticket.status !== "closed" && <button onClick={handleClose} className="text-sm text-red-400 hover:text-red-300">Close Ticket</button>}
          <Link href="/dashboard" className="text-sm text-lemon-green hover:underline">App Dashboard</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-dark-navy">{ticket.customerName || "Visitor"}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {ticket.email || "—"}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(ticket.createdAt).toLocaleString()}</span>
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {ticket.storeName}</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ticket.status === "closed" ? "bg-gray-100 text-gray-600" : ticket.escalated ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {ticket.status === "closed" ? "Closed" : ticket.escalated ? "Escalated" : "Active"}
            </span>
          </div>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto mb-4">
            {messages.map((msg: any, i: number) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] p-4 rounded-2xl ${msg.role === "user" ? "bg-gray-100 text-gray-800" : "bg-dark-navy text-white"}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <span className="text-[10px] opacity-50 mt-1 block">{msg.role === "user" ? "Customer" : "AI"}</span>
                </div>
              </div>
            ))}
          </div>

          {ticket.status !== "closed" && (
            <form onSubmit={handleReply} className="flex gap-3">
              <input value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..." className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-lemon-green outline-none" />
              <button type="submit" disabled={sending || !reply.trim()} className="px-6 py-3 rounded-xl bg-lemon-gradient text-dark-navy font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"><Send className="w-4 h-4" /> {sending ? "Sending..." : "Reply"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
