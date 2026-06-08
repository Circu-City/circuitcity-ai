"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then(r => r.json())
      .then(d => { setPosts(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-dark-navy mb-4">Blog</h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">Insights on AI, e-commerce, and customer experience from the CircuCity team.</p>
        </div>
        {loading ? (
          <div className="flex justify-center"><div className="animate-spin w-10 h-10 border-2 border-lemon-green border-t-transparent rounded-full" /></div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post: any) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-lemon-green hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-lemon-green/10 text-lemon-green font-medium">{post.category}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h2 className="text-lg font-bold text-dark-navy mb-2 group-hover:text-lemon-green transition-colors">{post.title}</h2>
                <p className="text-gray-500 text-sm mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                  <span className="text-lemon-green text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Read More <ArrowRight className="w-3 h-3" /></span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
