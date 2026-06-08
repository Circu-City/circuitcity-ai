"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Clock, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const slug = params.slug;

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
        <h1 className="text-4xl font-bold text-dark-navy mb-6">{post.title}</h1>
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          <ReactMarkdown>{post.content}</ReactMarkdown>
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
