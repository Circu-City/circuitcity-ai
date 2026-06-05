"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Shield, UserCog, Bot } from "lucide-react";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const r = await fetch("/api/admin/users");
    if (r.status === 401) { router.push("/login"); return; }
    const data = await r.json();
    if (data.users) setUsers(data.users);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const changeRole = async (userId: string, newRole: string) => {
    const r = await fetch("/api/admin/users", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, role: newRole }) });
    const data = await r.json();
    if (data.success) { toast.success("User role updated!"); fetchUsers(); }
    else toast.error(data.error || "Failed");
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Delete this user and all their data?")) return;
    const r = await fetch(`/api/admin/users?id=${userId}`, { method: "DELETE" });
    const data = await r.json();
    if (data.success) { toast.success("User deleted"); fetchUsers(); }
    else toast.error(data.error || "Failed");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-dark-navy text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-lemon-gradient rounded-xl flex items-center justify-center"><Bot className="text-dark-navy w-5 h-5" /></div>
          <div><span className="font-bold">CircuCity Ai</span><span className="text-lemon-green ml-2 text-sm">Admin</span></div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-sm text-lemon-green hover:underline">Dashboard</Link>
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">Back to App</Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-sm text-gray-500 hover:text-dark-navy flex items-center gap-1 mb-2"><ArrowLeft className="w-3 h-3" /> Back</Link>
            <h1 className="text-2xl font-bold text-dark-navy flex items-center gap-2"><UserCog className="w-6 h-6" /> Manage Users</h1>
          </div>
          <span className="text-sm text-gray-500">{users.length} total</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? <div className="p-12 text-center text-gray-400">Loading...</div> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold">Name</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold">Email</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold">Role</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold">Joined</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-dark-navy">{u.name || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <select value={u.role} onChange={e => changeRole(u.id, e.target.value)}
                        className={`px-2 py-1 rounded-lg text-xs font-semibold border ${u.role === 'admin' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                        <option value="customer">customer</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteUser(u.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete user">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No users found</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}