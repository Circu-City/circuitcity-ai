"use client";

import React, { useState, useCallback } from "react";
import { Search, MessageCircle, ChevronLeft, ChevronRight, Eye } from "lucide-react";

interface ConvItem {
  id: string;
  customerName: string | null;
  customerEmail: string | null;
  sentiment: string | null;
  resolved: boolean;
  escalated: boolean;
  messages: any;
  createdAt: Date;
  store: { id: string; name: string };
}

interface PaginatedResult {
  conversations: ConvItem[];
  total: number;
  page: number;
  totalPages: number;
}

export default function ConversationsClient({ initialData }: { initialData: PaginatedResult }) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [resolvedFilter, setResolvedFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [viewingConv, setViewingConv] = useState<ConvItem | null>(null);

  const fetchData = useCallback(async (page: number, searchTerm?: string, resolved?: string) => {
    setLoading(true);
    const params = new URLSearchParams({ page: page.toString() });
    if (searchTerm) params.set("search", searchTerm);
    if (resolved && resolved !== "all") params.set("resolved", resolved);
    const res = await fetch(`/api/admin/conversations?${params}`);
    const json = await res.json();
    if (json.success) setData(json.data);
    setLoading(false);
  }, []);

  const handleSearch = () => fetchData(1, search, resolvedFilter);

  return (
    <div className="space-y-6">
      {/* View Modal */}
      {viewingConv && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingConv(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Conversation Detail</h3>
              <button onClick={() => setViewingConv(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Customer</p>
                  <p className="text-sm font-medium text-slate-900">{viewingConv.customerName || "Anonymous"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Email</p>
                  <p className="text-sm text-slate-600">{viewingConv.customerEmail || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Store</p>
                  <p className="text-sm text-slate-600">{viewingConv.store.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Sentiment</p>
                  <p className="text-sm text-slate-600">{viewingConv.sentiment || "N/A"}</p>
                </div>
              </div>
              <h4 className="font-semibold text-sm text-slate-700">Messages</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Array.isArray(viewingConv.messages) && viewingConv.messages.map((msg: any, i: number) => (
                  <div key={i} className={`p-3 rounded-lg text-sm ${msg.role === "assistant" ? "bg-emerald-50 ml-8" : "bg-gray-50 mr-8"}`}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{msg.role}</p>
                    <p className="text-slate-700">{msg.content}</p>
                  </div>
                ))}
                {(!Array.isArray(viewingConv.messages) || viewingConv.messages.length === 0) && (
                  <p className="text-sm text-slate-400 text-center py-4">No messages data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Conversations</h2>
          <p className="text-sm text-slate-500">{data.total} total conversations</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by customer name or email..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
            value={search} onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
        </div>
        <select className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none"
          value={resolvedFilter} onChange={(e) => { setResolvedFilter(e.target.value); fetchData(1, search, e.target.value); }}>
          <option value="all">All</option>
          <option value="resolved">Resolved</option>
          <option value="unresolved">Unresolved</option>
        </select>
        <button onClick={handleSearch} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
          Search
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Store</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Sentiment</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.conversations.map((conv) => (
                <tr key={conv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{conv.customerName || "Anonymous"}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{conv.store.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {conv.resolved && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Resolved</span>}
                      {conv.escalated && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Escalated</span>}
                      {!conv.resolved && !conv.escalated && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Open</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{conv.sentiment || "-"}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{new Date(conv.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setViewingConv(conv)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-slate-400 hover:text-emerald-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {data.conversations.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">No conversations found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {data.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Page {data.page} of {data.totalPages}</span>
            <div className="flex gap-1">
              <button disabled={data.page <= 1} onClick={() => fetchData(data.page - 1, search, resolvedFilter)}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button disabled={data.page >= data.totalPages} onClick={() => fetchData(data.page + 1, search, resolvedFilter)}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50">
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}