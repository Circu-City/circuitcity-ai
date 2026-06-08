"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, User, ArrowLeft } from "lucide-react";

function renderContent(text: string) {
  return text.split('\n\n').map((block, i) => {
    let html = block
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-dark-navy">$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-lemon-green hover:underline">$1</a>');

    if (block.startsWith('## ')) {
      html = html.replace(/^## /, '');
      return <h2 key={i} className="text-2xl font-bold text-dark-navy mt-8 mb-3" dangerouslySetInnerHTML={{ __html: html }} />;
    }
    if (block.startsWith('- ')) {
      const items = block.split('\n').filter(l => l.startsWith('- '));
      return <ul key={i} className="list-disc pl-5 space-y-1 mb-4">{items.map((item, j) => <li key={j} className="text-gray-700" dangerouslySetInnerHTML={{ __html: item.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-dark-navy">$1</strong>') }} />)}</ul>;
    }
    if (block.match(/^\d\. /)) {
      const items = block.split('\n').filter(l => /^\d\. /.test(l));
      return <ol key={i} className="list-decimal pl-5 space-y-1 mb-4">{items.map((item, j) => <li key={j} className="text-gray-700" dangerouslySetInnerHTML={{ __html: item.replace(/^\d\. /, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-dark-navy">$1</strong>') }} />)}</ol>;
    }
    return <p key={i} className="text-gray-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: html }} />;
  });
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then(r => r.json())
      .then(d => { if (d.title) setPost(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-32 pb-20 px-6 text-center"><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full mx-auto" /></div>;
  if (!post) return <div className="pt-32 pb-20 px-6 text-center"><h1 className="text-3xl font-bold text-dark-navy mb-4">Post Not Found</h1><Link href="/blog" className="text-lemon-green hover:underline">Back to Blog</Link></div>;

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-dark-navy mb-8"><ArrowLeft className="w-4 h-4" /> Back to Blog</Link>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
          <span className="px-2 py-0.5 rounded-full bg-lemon-green/10 text-lemon-green text-xs font-medium">{post.category}</span>
        </div>
        <h1 className="text-4xl font-bold text-dark-navy mb-8">{post.title}</h1>
        <div className="space-y-0">
          {renderContent(post.content)}
        </div>
        <div className="mt-12 p-6 bg-lemon-green/5 rounded-2xl border border-lemon-green/20">
          <p className="text-dark-navy font-semibold mb-2">Ready to add AI to your store?</p>
          <p className="text-gray-600 text-sm mb-4">Start your free 14-day trial and see how CircuCity AI can transform your customer experience.</p>
          <Link href="/signup" className="inline-block px-6 py-2.5 bg-lemon-gradient text-dark-navy font-bold rounded-xl hover:opacity-90">Start Free Trial</Link>
        </div>
      </div>
    </div>
  );
}
