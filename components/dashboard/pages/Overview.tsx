"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Clock, 
  ArrowUpRight,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Overview() {
  const [stats, setStats] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/client/analytics").then(r => r.json()),
      fetch("/api/client/conversations?limit=5").then(r => r.json()),
      fetch("/api/client/store").then(r => r.json()),
    ]).then(([analytics, convs, storeData]) => {
      if (analytics.success) setStats(analytics.data);
      if (convs.success) setConversations(convs.data);
      if (storeData.success) setStore(storeData.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const userName = store?.user?.name || store?.user?.email || "Store Owner";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark-navy">Welcome back, {userName.split(" ")[0]} 👋</h2>
          <p className="text-muted-foreground text-sm">Here's what's happening with your AI agent today.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="primary" className="px-3 py-1">
            {store?.subscriptions?.[0]?.status || "Active"}
          </Badge>
          <Badge variant="outline" className="px-3 py-1 border-border">
            {store?.name ? "Active" : "Loading..."}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Messages Today" 
          value={stats?.totalMessages?.toLocaleString() || "0"} 
          change={`+${stats?.conversationsThisMonth || 0}`}
          icon={MessageSquare} 
          trend="up" 
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${stats?.conversionRate || "0"}%`} 
          change={`${stats?.resolutionRate || "0"}% resolved`}
          icon={TrendingUp} 
          trend="up" 
        />
        <StatCard 
          title="Total Conversations" 
          value={stats?.totalConversations?.toLocaleString() || "0"} 
          change={`${stats?.resolvedCount || 0} resolved`}
          icon={Users} 
          trend={stats?.resolvedCount > 0 ? "up" : "down"} 
        />
        <StatCard 
          title="Resolution Rate" 
          value={`${stats?.resolutionRate || "0"}%`} 
          change={`${stats?.csatScore || "0"}/5 CSAT`}
          icon={ShoppingBag} 
          trend="up" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-dark-navy">
              <Clock className="w-5 h-5 text-primary" />
              Recent Conversations
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                <tr>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {conversations.length > 0 ? conversations.map((conv: any) => (
                  <tr key={conv.id} className="hover:bg-muted/30 transition-colors group cursor-pointer">
                    <td className="px-6 py-4 text-sm font-medium text-dark-navy">{conv.customerName || "Anonymous"}</td>
                    <td className="px-6 py-4">
                      <Badge variant={conv.resolved ? "primary" : "outline"} className="text-[10px]">
                        {conv.resolved ? "Resolved" : "Active"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground text-right">
                      {new Date(conv.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-sm text-muted-foreground">
                      No conversations yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="border-border shadow-sm bg-dark-navy text-white p-6 relative overflow-hidden">
            <div className="relative z-10">
              <div className="p-2 bg-primary/20 rounded-lg text-primary w-fit mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2">Store Overview</h3>
              <p className="text-sm text-gray-400 mb-4">
                {store?.name || "Your Store"} — {store?._count?.products || 0} products, {store?._count?.conversations || 0} conversations
              </p>
              <Button 
                variant="primary" 
                size="sm" 
                className="w-full"
                onClick={() => window.location.href = "/dashboard?tab=widget"}
              >
                Configure Widget
              </Button>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
          </Card>

          <Card className="border-border shadow-sm p-6">
            <h3 className="font-bold text-dark-navy mb-3">Subscription</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Plan</span>
                <span className="text-dark-navy font-medium capitalize">{store?.subscriptions?.[0]?.plan || "Free"}</span>
              </div>
              <div className="flex justify-between text-xs mb-1 pt-2">
                <span className="text-muted-foreground">Status</span>
                <span className="text-dark-navy font-medium capitalize">{store?.subscriptions?.[0]?.status || "Active"}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, change, icon: Icon, trend }: { 
  title: string; 
  value: string; 
  change: string; 
  icon: any; 
  trend: "up" | "down" 
}) => (
  <Card className="border-border shadow-sm overflow-hidden group hover:border-primary/50 transition-all">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
          trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          <ArrowUpRight className={cn("w-3 h-3", trend === "down" && "rotate-180")} />
          {change}
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-dark-navy mt-1">{value}</h3>
    </CardContent>
  </Card>
);