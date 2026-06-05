"use client";

import React, { useState, useCallback } from "react";
import { Search, Key, ChevronLeft, ChevronRight } from "lucide-react";

interface ApiKeyItem {
  id: string;
  key: string;
  name: string;
  permissions: string;
  lastUsedAt: Date | null;
  createdAt: Date;
  store: { id: string; name: string; user: { email: string } };
}

interface PaginatedResult {
  keys: ApiKeyItem[];
  total: number;
  page: number;
  totalPages: number;
}

export default function ApiKeysClient({ initialData }: { initialData: PaginatedResult }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (page: number) => {
    setLoading(true);
    const res = await fetch(`/api/admin/api-keys?page=${page}`);
    const json = await res.json();
    if (json.success) setData(json.data);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">API Keys</h2>
        <p className="text-sm text-slate-500">{data.total} total API keys</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Key</th>
                <th className="px-6 py-3">Store</th>
                <th className="px-6 py-3">Permissions</th>
                <th className="px-6 py-3">Last Used</th>
                <th className="px-6 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.keys.map((k) => (
                <tr key={k.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{k.name}</td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-slate-600 font-mono">
                      {k.key.substring(0, 16)}...
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{k.store.name}</td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">{k.permissions}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : "Never"}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{new Date(k.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {data.keys.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">No API keys found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {data.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Page {data.page} of {data.totalPages}</span>
            <div className="flex gap-1">
              <button disabled={data.page <= 1} onClick={() => fetchData(data.page - 1)}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button disabled={data.page >= data.totalPages} onClick={() => fetchData(data.page + 1)}
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