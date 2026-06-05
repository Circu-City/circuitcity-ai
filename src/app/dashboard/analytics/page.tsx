import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BarChart3, MessageSquare, ShoppingBag, TrendingUp } from "lucide-react";

export default async function AnalyticsPage() {
  const user = await auth();
  if (!user) redirect("/login");

  const storeIds = (await prisma.store.findMany({ where: { userId: user.id }, select: { id: true } })).map(s => s.id);
  const [totalConvs, totalMsgs, totalStores] = await Promise.all([
    prisma.conversation.count({ where: { storeId: { in: storeIds } } }),
    prisma.usageLog.aggregate({ where: { storeId: { in: storeIds } }, _sum: { messagesCount: true } }),
    Promise.resolve(storeIds.length),
  ]);

  const monthlyData = await prisma.usageLog.groupBy({
    by: ["date"],
    where: { storeId: { in: storeIds }, date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    _sum: { messagesCount: true },
    orderBy: { date: "asc" },
  });

  const maxMsgs = Math.max(...monthlyData.map(d => d._sum.messagesCount || 0), 1);

  return (
    <div>
      <h1 className="text-3xl font-bold text-dark-navy mb-2">Analytics</h1>
      <p className="text-gray-500 mb-8">Track your chatbot performance and usage.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { icon: MessageSquare, label: "Total Conversations", value: totalConvs },
          { icon: TrendingUp, label: "Messages This Month", value: totalMsgs._sum.messagesCount || 0 },
          { icon: ShoppingBag, label: "Connected Stores", value: totalStores },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="w-10 h-10 rounded-xl bg-lemon-green/10 flex items-center justify-center mb-3">
              <stat.icon className="w-5 h-5 text-lemon-green" />
            </div>
            <p className="text-3xl font-bold text-dark-navy">{stat.value.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="font-bold text-dark-navy mb-6">Messages (Last 30 Days)</h3>
        {monthlyData.length === 0 ? (
          <p className="text-gray-400 text-sm py-8 text-center">No data yet.</p>
        ) : (
          <div className="flex items-end gap-2 h-48">
            {monthlyData.map((d, i) => {
              const h = Math.max(((d._sum.messagesCount || 0) / maxMsgs) * 100, 4);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-lemon-green/20 rounded-t-sm hover:bg-lemon-green/40 transition-colors relative group" style={{ height: `${h}%` }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-dark-navy text-white text-xs px-2 py-1 rounded whitespace-nowrap">{d._sum.messagesCount || 0} msgs</div>
                  </div>
                  <span className="text-[10px] text-gray-400">{new Date(d.date).getDate()}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
