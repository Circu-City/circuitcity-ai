"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Zap, 
  Calendar, 
  ArrowUpRight,
  MousePointer2,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Analytics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/client/analytics")
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const STATS = [
    { label: "Total Messages", value: stats?.totalMessages?.toLocaleString() || "0", change: `+${stats?.conversationsThisMonth || 0} this month`, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Conversations", value: stats?.totalConversations?.toLocaleString() || "0", change: `+${stats?.resolvedCount || 0} resolved`, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Conversion Rate", value: `${stats?.conversionRate || 0}%`, change: `${stats?.resolutionRate || 0}% resolution`, icon: Zap, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Avg Response Time", value: stats?.avgResponseTime || "0s", change: "Live", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark-navy">Analytics</h2>
          <p className="text-muted-foreground text-sm">Real-time performance metrics for your AI assistant.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </Button>
          <Button variant="primary" className="flex items-center gap-2">
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <Card key={i} className="p-6 border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {stat.change}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-bold text-dark-navy">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Message Volume Chart */}
        <Card className="lg:col-span-2 border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-dark-navy">Message Volume (Last 30 Days)</h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Messages</span>
              </div>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="h-64 w-full flex items-end justify-between gap-2">
              {(stats?.dailyMessages?.length ? stats.dailyMessages : Array(30).fill(0)).map((height: number, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full flex flex-col-reverse gap-1 h-full justify-end">
                    <div 
                      className="w-full bg-primary rounded-t-sm transition-all duration-300 group-hover:brightness-110" 
                      style={{ height: `${Math.max(2, (height / Math.max(...(stats?.dailyMessages || [1]), 1)) * 100)}%` }} 
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{i % 5 === 0 ? `D${i+1}` : ""}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Total Messages</p>
                <p className="font-bold text-dark-navy">{stats?.totalMessages?.toLocaleString() || "0"}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Resolution Rate</p>
                <p className="font-bold text-dark-navy">{stats?.resolutionRate || "0"}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Sources */}
        <Card className="border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-bold text-dark-navy">Conversation Summary</h3>
          </div>
          <CardContent className="p-6 space-y-6">
            {[
              { label: "Resolved", value: stats?.resolvedCount || 0, total: stats?.totalConversations || 1, color: "bg-primary" },
              { label: "Escalated", value: stats?.escalatedCount || 0, total: stats?.totalConversations || 1, color: "bg-amber-500" },
              { label: "Open", value: (stats?.totalConversations || 0) - (stats?.resolvedCount || 0) - (stats?.escalatedCount || 0), total: stats?.totalConversations || 1, color: "bg-slate-400" },
            ].map((item, i) => {
              const pct = item.total > 0 ? ((item.value / item.total) * 100).toFixed(1) : "0";
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-bold text-dark-navy">{item.value} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", item.color)} style={{ width: `${parseFloat(pct)}%` }} />
                  </div>
                </div>
              );
            })}
            
            <div className="pt-6 mt-6 border-t border-border">
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-3">
                <MousePointer2 className="w-5 h-5 text-primary shrink-0" />
                <p className="text-xs text-dark-navy">
                  <span className="font-bold">Insight:</span> Your AI assistant has handled {stats?.totalConversations || 0} conversations with a {stats?.resolutionRate || "0"}% resolution rate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}