import React from 'react';
import { Link } from 'react-router-dom';

export default function BlogCard({ post }) {
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1.5 transition-all duration-200 overflow-hidden">
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="h-48 bg-gray-100 overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" onError={(e)=>{e.target.src='https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'}} />
        </div>
      </Link>
      <div className="p-4">
        <h3 className="text-[15px] font-semibold text-[#1f2937] line-clamp-2 h-12 overflow-hidden">{post.title}</h3>
        <p className="text-sm text-gray-500 mt-3">Posted Date: {post.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        <p className="text-sm text-gray-500">Author: {post.author}</p>
      </div>
    </article>
  );
}
