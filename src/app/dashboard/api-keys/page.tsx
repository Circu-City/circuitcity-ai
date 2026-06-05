import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Key, Copy, Trash2, Plus } from "lucide-react";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

async function generateKeyAction(formData: FormData) {
  "use server";
  const { requireAuth } = await import("@/lib/auth");
  const { prisma: p } = await import("@/lib/prisma");
  const user = await requireAuth();
  const storeId = formData.get("storeId") as string;
  const name = (formData.get("name") as string) || "Default Key";
  if (!storeId) return;
  const key = "cc_live_" + crypto.randomBytes(24).toString("hex");
  await p.apiKey.create({ data: { storeId, userId: user.userId, key, name } });
  revalidatePath("/dashboard/api-keys");
  redirect("/dashboard/api-keys");
}

async function revokeKeyAction(formData: FormData) {
  "use server";
  const { prisma: p } = await import("@/lib/prisma");
  const keyId = formData.get("keyId") as string;
  await p.apiKey.delete({ where: { id: keyId } });
  revalidatePath("/dashboard/api-keys");
  redirect("/dashboard/api-keys");
}

export default async function ApiKeysPage() {
  const user = await requireAuth();
  const stores = await prisma.store.findMany({ where: { userId: user.userId }, include: { apiKeys: true } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-navy">API Keys</h1>
          <p className="text-gray-500 mt-1">Manage API keys for your connected stores</p>
        </div>
      </div>
      {stores.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200"><Key className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-bold text-gray-500 mb-2">No stores connected</h3><p className="text-gray-400">Add a store first to generate API keys.</p></div>
      ) : (
        <div className="space-y-8">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div><h3 className="font-bold text-dark-navy">{store.name}</h3><p className="text-sm text-gray-500">{store.url}</p></div>
                <form action={generateKeyAction} className="flex gap-2">
                  <input type="hidden" name="storeId" value={store.id} />
                  <input name="name" placeholder="Key name" className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
                  <button type="submit" className="bg-lemon-gradient text-dark-navy font-bold px-4 py-1.5 rounded-lg text-sm hover:opacity-90 flex items-center gap-1"><Plus className="w-3 h-3" /> Generate</button>
                </form>
              </div>
              <div className="divide-y divide-gray-100">
                {store.apiKeys.length === 0 ? <p className="p-6 text-sm text-gray-400">No API keys generated yet.</p> : store.apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="p-4 flex items-center justify-between">
                    <div><p className="text-sm font-medium text-dark-navy">{apiKey.name}</p><code className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded mt-1 inline-block">{apiKey.key}</code></div>
                    <div className="flex gap-2">
                      <button onClick={() => navigator.clipboard.writeText(apiKey.key)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400" title="Copy"><Copy className="w-4 h-4" /></button>
                      <form action={revokeKeyAction}><input type="hidden" name="keyId" value={apiKey.id} /><button type="submit" className="p-2 hover:bg-red-50 rounded-lg text-red-400" title="Revoke"><Trash2 className="w-4 h-4" /></button></form>
                    </div>
                  </div>
                ))}
              </div>
              {store.embedCode && <div className="p-4 bg-dark-navy text-white text-xs font-mono overflow-x-auto">{store.embedCode} <button onClick={() => navigator.clipboard.writeText(store.embedCode || "")} className="ml-2 text-lemon-green hover:underline">Copy</button></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
