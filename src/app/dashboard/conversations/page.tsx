"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Bot, User, Clock, Search } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import { toast } from "sonner";

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/dashboard/conversations", { credentials: "include" })
      .then(async r => { if (!r.ok) throw new Error("Failed"); return r.json(); })
      .then((data: any[]) => {
        const convs = (data || []).filter((c: any) => !c.escalated);
        setConversations(convs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = conversations.filter((c: any) => {
    if (!search) return true;
    const msgs = Array.isArray(c.messages) ? c.messages : [];
    const text = msgs.map((m: any) => m.content || "").join(" ").toLowerCase();
    return text.includes(search.toLowerCase()) || (c.customerName || "").toLowerCase().includes(search.toLowerCase());
  });

  if (loading) return <DashboardLayout><div className="flex justify-center py-20"><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-dark-navy">Conversations</h1>
            <p className="text-gray-500">Chatbot interactions from your website visitors</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-64" />
          </div>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
            <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-500 mb-2">No conversations yet</h3>
            <p className="text-gray-400 max-w-md mx-auto">When visitors interact with your chatbot, conversations will appear here. Add the embed code to your website to get started.</p>
            <Link href="/dashboard/widget" className="inline-block mt-4 text-lemon-green font-semibold hover:underline">Set up Chat Widget →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.length === 0 && search ? (
              <p className="text-center py-8 text-gray-400">No conversations match your search.</p>
            ) : (
              filtered.map((conv: any) => {
                const msgs = Array.isArray(conv.messages) ? conv.messages : [];
                const firstMsg = msgs[0];
                const lastMsg = msgs[msgs.length - 1];
                return (
                  <div key={conv.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-lemon-green hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-lemon-green/10 rounded-lg">
                          {conv.customerName ? <User className="w-5 h-5 text-lemon-green" /> : <Bot className="w-5 h-5 text-lemon-green" />}
                        </div>
                        <div>
                          <span className="font-bold text-dark-navy">{conv.customerName || "Anonymous Visitor"}</span>
                          <span className="text-xs text-gray-400 ml-2">{conv.sessionId?.substring(0, 8)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(conv.createdAt).toLocaleDateString()}</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px]">{msgs.length} messages</span>
                      </div>
                    </div>
                    {firstMsg && (
                      <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
                        <span className="text-xs text-gray-400">{firstMsg.role === "user" ? "Visitor" : "Bot"}:</span>{" "}
                        {firstMsg.content?.substring(0, 150)}{firstMsg.content?.length > 150 ? "..." : ""}
                      </div>
                    )}
                    {lastMsg && lastMsg !== firstMsg && (
                      <div className="mt-2 pl-4 border-l-2 border-lemon-green/30 text-sm text-gray-500">
                        <span className="text-xs text-gray-400">{lastMsg.role === "user" ? "Visitor" : "Bot"}:</span>{" "}
                        {lastMsg.content?.substring(0, 100)}{lastMsg.content?.length > 100 ? "..." : ""}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
