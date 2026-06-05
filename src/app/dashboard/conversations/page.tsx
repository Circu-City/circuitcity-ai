import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MessageSquare, Search } from "lucide-react";
import Link from "next/link";

export default async function ConversationsPage({ searchParams }: { searchParams: Promise<{ store?: string }> }) {
  const user = await auth();
  if (!user) redirect("/login");
  const { store: storeFilter } = await searchParams;

  const stores = await prisma.store.findMany({ where: { userId: user.id } });
  const where: any = { store: { userId: user.id } };
  if (storeFilter) where.storeId = storeFilter;

  const conversations = await prisma.conversation.findMany({ where, orderBy: { createdAt: "desc" }, take: 50, include: { store: true } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-navy">Conversations</h1>
          <p className="text-gray-500 mt-1">View and manage chatbot conversations</p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white">
            <option value="">All Stores</option>
            {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-500 mb-2">No conversations yet</h3>
          <p className="text-gray-400">Conversations will appear here when visitors interact with your chatbot.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => {
            const msgs = Array.isArray(conv.messages) ? conv.messages as any[] : [];
            const lastMsg = msgs[msgs.length - 1];
            return (
              <Link key={conv.id} href={`/dashboard/conversations/${conv.id}`} className="block bg-white rounded-2xl border border-gray-200 p-5 hover:border-lemon-green hover:shadow-sm transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-bold text-dark-navy">{conv.customerName || "Visitor"} {conv.email ? `(${conv.email})` : ""}</span>
                    <span className="text-xs text-gray-400 ml-2">{conv.store?.name}</span>
                  </div>
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
  );
}
