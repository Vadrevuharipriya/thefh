import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './BlogPage.scss';
import HeroBanner from './components/HeroBanner';
import SearchFilterBar from './components/SearchFilterBar';
import BlogGrid from './components/BlogGrid';

function mapBlog(b) {
  return {
    id: b._id,
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt || '',
    image: b.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: b.category || 'General',
    date: b.date ? new Date(b.date) : new Date(),
    author: b.author || 'The Famous Halwai Team',
    content: b.content || '',
  };
}

const CATEGORIES = ['All', 'Catering', 'Weddings', 'Corporate', 'Guide', 'Party Ideas', 'Recipes', 'Tips'];

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await axios.get('/api/blogs', { params: { _t: Date.now() } });
      setPosts((res.data || []).map(mapBlog));
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();

    const handleStorageChange = (event) => {
      if (event.key === 'blogUpdatedAt') fetchBlogs();
    };

    const handleBlogChanged = () => fetchBlogs();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('blog-changed', handleBlogChanged);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('blog-changed', handleBlogChanged);
    };
  }, [fetchBlogs]);

  const filtered = (filter === 'All' ? posts : posts.filter(p => p.category === filter))
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="blog-page bg-[#f5f5f5] text-[#1f2937]">
      <HeroBanner subtitle="Tips, guides, and insights about catering, event planning, and authentic Indian cuisine." />
      <SearchFilterBar filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} categories={CATEGORIES} />
      {loading ? (
        <div className="max-w-[1400px] mx-auto px-6 py-12"><p className="text-center">Loading…</p></div>
      ) : filtered.length === 0 ? (
        <div className="max-w-[1400px] mx-auto px-6 py-12"><p className="text-center">No articles found.</p></div>
      ) : (
        <BlogGrid posts={filtered} />
      )}

      <section className="max-w-[1400px] mx-auto px-6 pb-20">
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mt-2">Get the latest articles, tips, and exclusive offers delivered to your inbox.</p>
          <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" className="flex-1 rounded-md border border-gray-200 px-3 py-2" />
            <button type="submit" className="bg-[#c91c24] text-white px-4 py-2 rounded-md">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
