"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard-layout";

export default function ConversationsPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [storeFilter, setStoreFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/overview", { ...{ credentials: "include" }, credentials: "include" })
      .then(async r => { if (r.status === 401) { router.push("/login"); return null; } return r.json(); })
      .then(d => { if (d) { setStores(d.stores || []); return fetch("/api/dashboard/conversations?store=" + (storeFilter || "")); } return null; })
      .then(async r => { if (!r || r.status === 401) { router.push("/login"); return []; } return r.json(); })
      .then(data => { setConversations(data || []); setLoading(false); })
      .catch(() => { setLoading(false); toast.error("Failed to load conversations"); });
  }, [router, storeFilter]);

  if (loading) return <DashboardLayout><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full mx-auto mt-20" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-2xl font-bold text-dark-navy">Conversations</h1><p className="text-gray-500">View and manage chatbot conversations</p></div>
          <select value={storeFilter} onChange={e => setStoreFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white">
            <option value="">All Stores</option>
            {stores.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        {conversations.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-500 mb-2">No conversations yet</h3>
            <p className="text-gray-400">Conversations will appear here when visitors interact with your chatbot.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv: any) => {
              const msgs = Array.isArray(conv.messages) ? conv.messages : [];
              const lastMsg = msgs[msgs.length - 1];
              return (
                <Link key={conv.id} href={`/dashboard/conversations/${conv.id}`} className="block bg-white rounded-2xl border border-gray-200 p-5 hover:border-lemon-green hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div><span className="font-bold text-dark-navy">{conv.customerName || "Visitor"} {conv.email ? `(${conv.email})` : ""}</span><span className="text-xs text-gray-400 ml-2">{conv.store?.name}</span></div>
                    <span className="text-xs text-gray-400">{new Date(conv.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{lastMsg?.content || "No messages"}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${conv.escalated ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{conv.escalated ? "Escalated" : "Active"}</span>
                    <span className="text-xs text-gray-400">{msgs.length} messages</span>
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
