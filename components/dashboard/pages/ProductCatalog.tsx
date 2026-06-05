"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  RefreshCw, 
  Search, 
  Package, 
  Trash2, 
  ExternalLink,
  FileText,
  CheckCircle2,
  Loader2,
  Plus,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductCatalog() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ totalProducts: 0, indexedCount: 0, errorCount: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", price: "", description: "", category: "", stock: "" });
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch("/api/client/products");
    const json = await res.json();
    if (json.success) {
      setProducts(json.data.products);
      setStats({ totalProducts: json.data.totalProducts, indexedCount: json.data.indexedCount, errorCount: json.data.errorCount });
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/client/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const handleAdd = async () => {
    if (!addForm.name || !addForm.price) return;
    setSaving(true);
    await fetch("/api/client/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addForm.name,
        price: parseFloat(addForm.price),
        description: addForm.description || undefined,
        category: addForm.category || undefined,
        stock: addForm.stock ? parseInt(addForm.stock) : undefined,
      }),
    });
    setSaving(false);
    setShowAddModal(false);
    setAddForm({ name: "", price: "", description: "", category: "", stock: "" });
    fetchProducts();
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-dark-navy">Add Product</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Product Name *</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                  value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Price *</label>
                <input type="number" step="0.01" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                  value={addForm.price} onChange={(e) => setAddForm({ ...addForm, price: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
                <textarea className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" rows={3}
                  value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                    value={addForm.category} onChange={(e) => setAddForm({ ...addForm, category: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Stock</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                    value={addForm.stock} onChange={(e) => setAddForm({ ...addForm, stock: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-gray-50">Cancel</button>
                <button onClick={handleAdd} disabled={saving || !addForm.name || !addForm.price}
                  className="flex-1 px-4 py-2 bg-primary text-dark-navy rounded-lg text-sm font-bold hover:bg-primary/90 disabled:opacity-50">
                  {saving ? "Adding..." : "Add Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark-navy">Product Catalog</h2>
          <p className="text-muted-foreground text-sm">Manage the products your AI knows about.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="primary" className="flex items-center gap-2" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <h3 className="text-2xl font-bold text-dark-navy">{stats.totalProducts.toLocaleString()}</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6 border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <h3 className="text-2xl font-bold text-dark-navy">{stats.indexedCount.toLocaleString()}</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6 border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inactive</p>
              <h3 className="text-2xl font-bold text-dark-navy">{stats.errorCount}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search products or categories..." className="pl-10"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-border">
                <tr>
                  <th className="p-4 text-sm font-semibold text-dark-navy">Product Name</th>
                  <th className="p-4 text-sm font-semibold text-dark-navy">Category</th>
                  <th className="p-4 text-sm font-semibold text-dark-navy">Price</th>
                  <th className="p-4 text-sm font-semibold text-dark-navy">Status</th>
                  <th className="p-4 text-sm font-semibold text-dark-navy">Stock</th>
                  <th className="p-4 text-sm font-semibold text-dark-navy text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.length > 0 ? filteredProducts.map((product: any) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center">
                          <Package className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <span className="font-medium text-dark-navy">{product.name}</span>
                          {product.description && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{product.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{product.category || "-"}</td>
                    <td className="p-4 text-sm font-medium text-dark-navy">{product.currency} {product.price.toFixed(2)}</td>
                    <td className="p-4">
                      <Badge className={cn(
                        "text-[10px] uppercase tracking-wider",
                        product.isActive ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200"
                      )}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{product.stock ?? "-"}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="p-2 h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(product.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-sm text-muted-foreground">
                      {searchQuery ? "No products match your search." : "No products yet. Click 'Add Product' to get started."}
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