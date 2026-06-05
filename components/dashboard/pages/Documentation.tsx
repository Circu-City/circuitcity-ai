"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  ChevronRight, 
  Code, 
  LifeBuoy, 
  Zap, 
  MessageCircle,
  FileText
} from "lucide-react";

const CATEGORIES = [
  {
    title: "Getting Started",
    icon: Zap,
    color: "text-yellow-500",
    articles: [
      { title: "Quick Start Guide", desc: "Get your bot live in 5 minutes", link: "#" },
      { title: "Installing the Snippet", desc: "How to add the code to your store", link: "#" },
      { title: "Connecting your Store", desc: "Syncing products via CSV or API", link: "#" },
    ]
  },
  {
    title: "AI Customization",
    icon: MessageCircle,
    color: "text-blue-500",
    articles: [
      { title: "Training your AI", desc: "Fine-tuning the brand voice", link: "#" },
      { title: "Managing Guardrails", desc: "Preventing AI hallucinations", link: "#" },
      { title: "Tone & Personality", desc: "Switching between Friendly and Professional", link: "#" },
    ]
  },
  {
    title: "Developer API",
    icon: Code,
    color: "text-purple-500",
    articles: [
      { title: "API Reference", desc: "Full documentation of endpoints", link: "#" },
      { title: "Webhooks Guide", desc: "Automate actions on chat events", link: "#" },
      { title: "Custom Events", desc: "Track specific user interactions", link: "#" },
    ]
  },
  {
    title: "Support & Legal",
    icon: LifeBuoy,
    color: "text-green-500",
    articles: [
      { title: "Billing & Plans", desc: "Understanding your subscription", link: "#" },
      { title: "GDPR Compliance", desc: "Ensuring user data privacy", link: "#" },
      { title: "Contact Support", desc: "Get help from our human experts", link: "#" },
    ]
  }
];

export default function Documentation() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center text-center space-y-4 py-8 bg-dark-navy rounded-3xl text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full -ml-32 -mb-32 blur-3xl" />
        <BookOpen className="w-12 h-12 text-primary mb-2" />
        <h2 className="text-3xl font-bold">Knowledge Base</h2>
        <p className="text-slate-400 max-w-xl mx-auto px-6">
          Everything you need to know about CircuitCity AI. Find guides, API references, and best practices to optimize your store's AI support.
        </p>
        <div className="relative w-full max-w-md px-6 pt-4">
          <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search for articles..." 
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:ring-primary" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((category, i) => (
          <Card key={i} className="border-border shadow-sm hover:border-primary/50 transition-colors group">
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("p-2 rounded-lg bg-slate-50", category.color)}>
                  <category.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-dark-navy">{category.title}</h3>
              </div>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {category.articles.map((article, idx) => (
                  <a 
                    href={article.link} 
                    key={idx} 
                    className="p-4 block hover:bg-slate-50 transition-colors group/item"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-dark-navy group-hover/item:text-primary transition-colors">
                          {article.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {article.desc}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover/item:text-primary transition-colors" />
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-border shadow-sm bg-primary/5 border-primary/20 flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-dark-navy">Developer Guide</h4>
            <p className="text-xs text-muted-foreground">Complete SDK and API documentation.</p>
            <Button variant="ghost" className="p-0 h-auto text-primary text-xs font-bold mt-2 flex items-center gap-1 hover:bg-transparent">
              Read more <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </Card>

        <Card className="p-6 border-border shadow-sm bg-slate-50 border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <LifeBuoy className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h4 className="font-bold text-dark-navy">Community Forum</h4>
            <p className="text-xs text-muted-foreground">Discuss strategies with other store owners.</p>
            <Button variant="ghost" className="p-0 h-auto text-blue-500 text-xs font-bold mt-2 flex items-center gap-1 hover:bg-transparent">
              Join Forum <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </Card>

        <Card className="p-6 border-border shadow-sm bg-dark-navy text-white flex items-center gap-4">
          <div className="p-3 bg-primary rounded-xl shadow-sm">
            <MessageCircle className="w-6 h-6 text-dark-navy" />
          </div>
          <div>
            <h4 className="font-bold">Direct Support</h4>
            <p className="text-xs text-slate-400">Need urgent help? Contact our team.</p>
            <Button variant="primary" size="sm" className="mt-2 h-7 px-3 text-xs">
              Open Ticket
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}