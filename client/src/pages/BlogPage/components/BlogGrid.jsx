import React from 'react';
import BlogCard from './BlogCard';

export default function BlogGrid({ posts }) {
  return (
    <section className="max-w-[1400px] mx-auto px-6 pb-12">
      <h2 className="text-center text-2xl font-bold text-[#1f2937] mb-8">Our Blogs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {posts.map(p => <BlogCard key={p.id} post={p} />)}
      </div>
    </section>
  );
}
