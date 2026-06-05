import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Plus, ExternalLink, Copy, Store } from "lucide-react";
import Link from "next/link";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

async function createStoreAction(formData: FormData) {
  "use server";
  const { requireAuth } = await import("@/lib/auth");
  const { prisma: p } = await import("@/lib/prisma");
  const user = await requireAuth();
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  if (!name || !url) return;
  const apiKey = "cc_live_" + crypto.randomBytes(16).toString("hex");
  await p.store.create({ data: { userId: user.userId, name, url, apiKey, status: "active" } });
  revalidatePath("/dashboard/stores");
  redirect("/dashboard/stores");
}

export default async function DashboardStoresPage() {
  const user = await requireAuth();
  const stores = await prisma.store.findMany({ where: { userId: user.userId }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-navy">Stores</h1>
          <p className="text-gray-500 mt-1">Manage your connected e-commerce stores</p>
        </div>
        <form action={createStoreAction} className="flex gap-3">
          <input name="name" placeholder="Store Name" required className="px-4 py-2 border border-gray-200 rounded-xl text-sm" />
          <input name="url" placeholder="https://mystore.com" required className="px-4 py-2 border border-gray-200 rounded-xl text-sm" />
          <button type="submit" className="bg-lemon-gradient text-dark-navy font-bold px-5 py-2 rounded-xl text-sm hover:opacity-90 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Store</button>
        </form>
      </div>

      {stores.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
          <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-500 mb-2">No stores yet</h3>
          <p className="text-gray-400">Add your first store to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-lemon-green/10 flex items-center justify-center"><Store className="w-6 h-6 text-lemon-green" /></div>
                <div>
                  <h3 className="font-bold text-dark-navy">{store.name}</h3>
                  <p className="text-sm text-gray-500">{store.url}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${store.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{store.status}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono bg-gray-50 px-3 py-1 rounded-lg">{store.apiKey?.substring(0, 20)}...</span>
                <button onClick={() => navigator.clipboard.writeText(store.apiKey || "")} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"><Copy className="w-4 h-4" /></button>
                <Link href={`/dashboard/stores/${store.id}`} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"><ExternalLink className="w-4 h-4" /></Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
