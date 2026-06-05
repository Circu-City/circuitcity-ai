"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Check, 
  MessageCircle, 
  Palette, 
  Layout, 
  Bell, 
  Eye 
} from "lucide-react";
import { cn, generateEmbedCode } from "@/lib/utils";

export default function ChatWidget() {
  const [copied, setCopied] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#9EF01A");
  const [embedCode, setEmbedCode] = useState("");

  // Fetch real embed code from API
  useEffect(() => {
    fetch("/api/client/store")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.apiKey) {
          setEmbedCode(generateEmbedCode(data.data.apiKey));
        } else {
          setEmbedCode(generateEmbedCode("YOUR_API_KEY_HERE"));
        }
      })
      .catch(() => {
        setEmbedCode(`<script src="https://chatbot.circucity.se/widget.js" data-api-key="YOUR_API_KEY_HERE" async></script>`);
      });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark-navy">Chat Widget Configuration</h2>
          <p className="text-muted-foreground text-sm">Customize your AI agent's appearance and installation.</p>
        </div>
        <Button 
          variant="primary" 
          className="flex items-center gap-2" 
          onClick={() => window.open('/', '_blank')}
        >
          <Eye className="w-4 h-4" />
          View Live Site
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2 font-bold text-dark-navy">
                <Copy className="w-5 h-5 text-primary" />
                Installation Code
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Paste this code before the closing {"</body>"} tag of your website.
              </p>
            </div>
            <CardContent className="p-6">
              <div className="relative group">
                <pre className="p-4 bg-dark-navy text-gray-300 rounded-lg text-sm font-mono overflow-x-auto border border-border">
                  {embedCode}
                </pre>
                <Button 
                  onClick={handleCopy} 
                  className={cn(
                    "absolute top-3 right-3 gap-2 transition-all",
                    copied ? "bg-green-500 hover:bg-green-600" : "bg-primary text-dark-navy hover:bg-primary/90"
                  )}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Code"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border shadow-sm p-6">
              <div className="flex items-center gap-2 font-bold text-dark-navy mb-4">
                <Palette className="w-5 h-5 text-primary" />
                Visual Customization
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Primary Theme Color</label>
                  <div className="flex gap-3 items-center">
                    <div 
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-pointer" 
                      style={{ backgroundColor: primaryColor }} 
                    />
                    <Input 
                      type="text" 
                      value={primaryColor} 
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="font-mono text-sm" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Widget Position</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="text-xs py-1">Bottom Right</Button>
                    <Button variant="outline" className="text-xs py-1">Bottom Left</Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-border shadow-sm p-6">
              <div className="flex items-center gap-2 font-bold text-dark-navy mb-4">
                <Bell className="w-5 h-5 text-primary" />
                Greetings & Alerts
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Welcome Message</label>
                  <Input 
                    placeholder="Hi! How can we help you today?" 
                    className="text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Trigger Event</label>
                  <select className="w-full p-2 text-sm rounded-md border border-border bg-white text-dark-navy focus:ring-2 focus:ring-primary outline-none">
                    <option>Immediately on load</option>
                    <option>After 5 seconds</option>
                    <option>When user scrolls 50%</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-border shadow-sm p-6 sticky top-8">
            <div className="flex items-center gap-2 font-bold text-dark-navy mb-6">
              <Layout className="w-5 h-5 text-primary" />
              Live Preview
            </div>
            <div className="relative h-[400px] bg-slate-200 rounded-xl overflow-hidden border-4 border-white shadow-inner">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557821552-171051766828?auto=format&fit=crop&q=80&w=500')] bg-cover bg-center opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground text-xs font-medium">Your Store View</p>
              </div>
              
              <div className="absolute bottom-4 right-4 flex flex-col items-end gap-3">
                <div className="bg-white p-4 rounded-2xl shadow-2xl w-64 animate-in slide-in-from-bottom-10 duration-500">
                  <div className="flex items-center gap-2 mb-3 border-b pb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-bold text-dark-navy">AI Assistant</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Hi! I'm your CircuitCity AI agent. I can help you find products or track orders!
                  </p>
                </div>
                <div 
                  className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110 cursor-pointer" 
                  style={{ backgroundColor: primaryColor }}
                >
                  <MessageCircle className="w-6 h-6 text-dark-navy" />
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Badge variant="outline" className="text-[10px] py-1">
                Simulated Environment
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}