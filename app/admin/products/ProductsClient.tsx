"use client";

import React, { useState, useCallback } from "react";
import { Search, Package, ChevronLeft, ChevronRight, Edit3, Trash2 } from "lucide-react";

interface ProductItem {
  id: string;
  name: string;
  price: number;
  description: string | null;
  category: string | null;
  stock: number | null;
  isActive: boolean;
  currency: string;
  createdAt: Date;
  store: { id: string; name: string; user: { email: string } };
}

interface PaginatedResult {
  products: ProductItem[];
  total: number;
  page: number;
  totalPages: number;
}

export default function ProductsClient({ initialData }: { initialData: PaginatedResult }) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (page: number, searchTerm?: string) => {
    setLoading(true);
    const params = new URLSearchParams({ page: page.toString() });
    if (searchTerm) params.set("search", searchTerm);
    const res = await fetch(`/api/admin/products?${params}`);
    const json = await res.json();
    if (json.success) setData(json.data);
    setLoading(false);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    setLoading(true);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setLoading(false);
    fetchData(data.page, search);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Products Management</h2>
          <p className="text-sm text-slate-500">{data.total} total products</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
            value={search} onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchData(1, search)} />
        </div>
        <button onClick={() => fetchData(1, search)}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
          Search
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Store</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3 text-center">Stock</th>
                <th className="px-6 py-3 text-center">Active</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{p.store.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{p.currency} {p.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{p.category || "-"}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 text-center">{p.stock ?? "-"}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${p.isActive ? "bg-emerald-500" : "bg-gray-300"}`} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(p.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {data.products.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-sm text-slate-400">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {data.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Page {data.page} of {data.totalPages}</span>
            <div className="flex gap-1">
              <button disabled={data.page <= 1} onClick={() => fetchData(data.page - 1, search)}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button disabled={data.page >= data.totalPages} onClick={() => fetchData(data.page + 1, search)}
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