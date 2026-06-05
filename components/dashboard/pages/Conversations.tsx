"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Search, 
  RefreshCw,
  Loader2,
  Eye
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function Conversations() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewingConv, setViewingConv] = useState<any>(null);

  const fetchConversations = async () => {
    setLoading(true);
    const res = await fetch("/api/client/conversations?limit=50");
    const json = await res.json();
    if (json.success) setConversations(json.data);
    setLoading(false);
  };

  useEffect(() => { fetchConversations(); }, []);

  const filtered = conversations.filter(c =>
    (c.customerName?.toLowerCase().includes(search.toLowerCase()) || "") ||
    (c.customerEmail?.toLowerCase().includes(search.toLowerCase()) || "")
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {viewingConv && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingConv(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-dark-navy">Conversation</h3>
              <button onClick={() => setViewingConv(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Customer</p>
                <p className="text-sm font-medium text-slate-900">{viewingConv.customerName || "Anonymous"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Email</p>
                <p className="text-sm text-slate-600">{viewingConv.customerEmail || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Status</p>
                <p className="text-sm text-slate-600">{viewingConv.resolved ? "Resolved" : "Open"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Sentiment</p>
                <p className="text-sm text-slate-600">{viewingConv.sentiment || "N/A"}</p>
              </div>
            </div>
            <h4 className="font-semibold text-sm text-slate-700 mb-2">Messages</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Array.isArray(viewingConv.messages) ? viewingConv.messages.map((msg: any, i: number) => (
                <div key={i} className={`p-3 rounded-lg text-sm ${msg.role === "assistant" ? "bg-emerald-50 ml-8" : "bg-gray-50 mr-8"}`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{msg.role}</p>
                  <p className="text-slate-700">{msg.content}</p>
                </div>
              )) : (
                <p className="text-sm text-slate-400 text-center py-4">No messages data available</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark-navy">Conversations</h2>
          <p className="text-muted-foreground text-sm">View and manage customer conversations handled by your AI.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2" onClick={fetchConversations}>
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by customer name or email..." className="pl-10"
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card className="border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-border">
                <tr>
                  <th className="p-4 text-sm font-semibold text-dark-navy">Customer</th>
                  <th className="p-4 text-sm font-semibold text-dark-navy">Email</th>
                  <th className="p-4 text-sm font-semibold text-dark-navy">Status</th>
                  <th className="p-4 text-sm font-semibold text-dark-navy">Sentiment</th>
                  <th className="p-4 text-sm font-semibold text-dark-navy">Date</th>
                  <th className="p-4 text-sm font-semibold text-dark-navy text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length > 0 ? filtered.map((conv: any) => (
                  <tr key={conv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-dark-navy">{conv.customerName || "Anonymous"}</td>
                    <td className="p-4 text-sm text-muted-foreground">{conv.customerEmail || "-"}</td>
                    <td className="p-4">
                      <Badge className={cn(
                        "text-[10px] uppercase tracking-wider",
                        conv.resolved ? "bg-green-100 text-green-700 border-green-200" : "bg-blue-100 text-blue-700 border-blue-200"
                      )}>
                        {conv.resolved ? "Resolved" : "Open"}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{conv.sentiment || "-"}</td>
                    <td className="p-4 text-sm text-muted-foreground">{new Date(conv.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm" className="p-2 h-8 w-8" onClick={() => setViewingConv(conv)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-sm text-muted-foreground">
                      {search ? "No conversations match your search." : "No conversations yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}