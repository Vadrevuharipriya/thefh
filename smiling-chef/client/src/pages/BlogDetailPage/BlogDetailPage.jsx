import { Link, useParams } from 'react-router-dom';
import {
  ChevronRight,
  Calendar,
  User,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './BlogDetailPage.scss';

function mapBlog(b) {
  return {
    id: b._id,
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt || '',
    image: b.image || '',
    category: b.category || 'General',
    date: b.date ? new Date(b.date) : new Date(),
    author: b.author || 'The Famous Halwai Team',
    content: b.content || '',
  };
}

// ─── Breadcrumb ────────────────────────────────────────────────────────────────
function Breadcrumb({ category }) {
  return (
    <nav className="cp-breadcrumb" aria-label="Breadcrumb">
      <div className="cp-breadcrumb__inner">
        <Link to="/" className="cp-breadcrumb__link">Home</Link>
        <ChevronRight size={13} className="cp-breadcrumb__sep" />
        <Link to="/blog" className="cp-breadcrumb__link">Blog</Link>
        <ChevronRight size={13} className="cp-breadcrumb__sep" />
        <span className="cp-breadcrumb__current">{category}</span>
      </div>
    </nav>
  );
}

// ─── Blog Content ───────────────────────────────────────────────────────────────
function BlogContent({ post }) {
  return (
    <article className="cp-content">
      <div className="cp-content__inner">
        {/* Blog title */}
        <h1 className="cp-content__city-name">{post.title}</h1>

        {/* Blog image with category badge */}
        <div className="cp-content__img-wrap">
          <img
            src={post.image}
            alt={post.title}
            className="cp-content__img"
            onError={(e) => {
              e.target.src = `https://picsum.photos/900/480?u=blog-${post.id}`;
            }}
          />
          {/* <div className="cp-content__img-badge">
            <Share2 size={14} />
            <span>{post.category}</span>
          </div> */}
        </div>

        {/* Meta info */}
        <div className="cp-content__meta">
          <span><Calendar size={16} /> {post.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span><User size={16} /> {post.author}</span>
        </div>

        {/* Excerpt/Intro */}
        {post.excerpt && (
          <p className="cp-content__intro">{post.excerpt}</p>
        )}

        {/* Main heading */}
        {/* <h2 className="cp-content__heading">Article Content</h2> */}

        {/* Body paragraphs */}
        <div className="cp-content__body">
          <div className="blog-detail__body" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </article>
  );
}

// ─── Share Section ───────────────────────────────────────────────────────────────
// function ShareSection() {
//   return (
//     <section className="cp-share">
//       <div className="cp-share__inner">
//         <div className="cp-share__text">
//           <span>Share this article:</span>
//         </div>
//         <div className="cp-share__actions">
//           <a href="#" className="cp-share__btn" aria-label="Share on Facebook"><Facebook size={18} /></a>
//           <a href="#" className="cp-share__btn" aria-label="Share on Twitter"><Twitter size={18} /></a>
//           <a href="#" className="cp-share__btn" aria-label="Share on LinkedIn"><Linkedin size={18} /></a>
//         </div>
//       </div>
//     </section>
//   );
// }

// ─── Success Modal ─────────────────────────────────────────────────────────────
function SuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="cp-modal-overlay" onClick={onClose}>
      <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cp-modal__content">
          <div className="cp-modal__icon">✓</div>
          <h2 className="cp-modal__title">Thank You!</h2>
          <p className="cp-modal__message">Thanks for reaching out. We'll get back to you soon.</p>
          <button className="cp-modal__btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── CTA Strip ─────────────────────────────────────────────────────────────────
function RequestCallbackCard() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', city: '' });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.mobile || !form.email || !form.city) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        name: form.name,
        phone: form.mobile,
        mobile: form.mobile,
        email: form.email,
        location: form.city,
        enquiryType: 'general',
        category: 'general'
      };

      const response = await fetch('/api/enquiries/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setShowModal(true);
        setForm({ name: '', mobile: '', email: '', city: '' });
      } else {
        setError(data.error || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <div className="cp-sidebar-card">
        <h3 className="cp-sidebar-card__title">Request A Call Back</h3>
        <p className="cp-sidebar-card__desc">Leave your details and our team will get back to you shortly.</p>
        {error && (
          <div style={{
            fontSize: '0.75rem',
            marginBottom: '0.5rem',
            padding: '0.4rem',
            borderRadius: '4px',
            backgroundColor: '#fee2e2',
            color: '#991b1b'
          }}>
            {error}
          </div>
        )}
        <form className="cp-sidebar-card__form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Full Name"
              disabled={loading}
            />
          </label>
          <label>
            Mobile Number
            <input
              type="tel"
              value={form.mobile}
              onChange={(e) => handleChange('mobile', e.target.value)}
              placeholder="Mobile Number"
              disabled={loading}
            />
          </label>
          <label>
            Email ID
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Email ID"
              disabled={loading}
            />
          </label>
          <label>
            City
            <input
              type="text"
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="City"
              disabled={loading}
            />
          </label>
          <button type="submit" className="cp-sidebar-card__btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Get Quote'}
          </button>
        </form>
      </div>
    </>
  );
}

function RelatedBlogs({ related }) {
  if (related.length === 0) return null;

  return (
    <section className="cp-related-blogs">
      <div className="cp-related-blogs__inner">
        <h3 className="cp-related-blogs__heading">Related Articles</h3>
        <div className="cp-related-blogs__strip">
          {related.map((blog) => (
            <Link
              key={blog.id}
              to={`/blog/${blog.slug}`}
              className="cp-blog-card"
            >
              <div className="cp-blog-card__img-wrap">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="cp-blog-card__img"
                  onError={(e) => {
                    e.target.src = `https://picsum.photos/300/200?u=blog-${blog.id}`;
                  }}
                />
                <div className="cp-blog-card__overlay" />
              </div>
              <div className="cp-blog-card__info">
                <span className="cp-blog-card__cat">{blog.category}</span>
                <h4 className="cp-blog-card__title">{blog.title}</h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Not Found ───────────────────────────────────────────────────────────────────
function NotFound({ slug }) {
  return (
    <div className="cp-not-found">
      <h2 className="cp-not-found__title">Blog Post Not Found</h2>
      <p className="cp-not-found__desc">
        We couldn&apos;t find a blog post matching &quot;{slug}&quot;.
      </p>
      <Link to="/blog" className="btn-red">Back to Blog</Link>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────────
export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/blogs/${slug}`, { params: { _t: Date.now() } })
      .then(res => {
        const p = mapBlog(res.data);
        setPost(p);
        return axios.get('/api/blogs', { params: { _t: Date.now() } });
      })
      .then(res => {
        const all = (res.data || []).map(mapBlog);
        setRelated(all.filter(b => b.slug !== slug).slice(0, 4));
      })
      .catch(err => {
        console.error('Failed to fetch blog:', err);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="blog-detail">
        <div className="blog-detail__loading">
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-detail">
        <NotFound slug={slug} />
      </div>
    );
  }

  return (
    <div className="blog-detail">
      <Breadcrumb category={post.category} />
      <section className="cp-detail-layout">
        <BlogContent post={post} />
        <aside className="cp-sidebar">
          <RequestCallbackCard />
          <div className="cp-sidebar-follow">
            <h3 className="cp-sidebar-follow__title">Follow us on</h3>
            <div className="cp-sidebar-follow__icons">
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>
        </aside>
      </section>
      <RelatedBlogs related={related} />
    </div>
  );
}