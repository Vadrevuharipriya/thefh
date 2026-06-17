import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, Eye, ImageOff, Trash } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './AdminBlogPage.scss';

const CATEGORIES = ['Catering', 'Weddings', 'Corporate', 'Guide', 'Party Ideas', 'Recipes', 'Tips', 'Lifestyle'];

function generateSlug(title) {
  return title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', metaTitle: '', metaKeyword: '', metaDescription: '', content: '',
    image: '', category: '', author: 'The Famous Halwai Team',
    published: true,
  });

  const notifyBlogChanged = () => {
    localStorage.setItem('blogUpdatedAt', String(Date.now()));
    window.dispatchEvent(new Event('blog-changed'));
  };

  const fetchBlogs = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('/api/admin/blogs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogs(res.data);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  useEffect(() => {
    if (!successMessage) return undefined;
    const timer = setTimeout(() => setSuccessMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const filtered = blogs.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.category?.toLowerCase().includes(search.toLowerCase()) ||
    b.slug?.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      title: '', slug: '', excerpt: '', metaTitle: '', metaKeyword: '', metaDescription: '', content: '',
      image: '', category: '', author: 'The Famous Halwai Team', published: true,
    });
    setImagePreview('');
  };

  const openCreate = () => {
    setEditingBlog(null);
    resetForm();
    setShowForm(true);
  };

  const openEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      metaTitle: blog.metaTitle || '',
      metaKeyword: blog.metaKeyword || '',
      metaDescription: blog.metaDescription || '',
      content: blog.content || '',
      image: blog.image || '',
      category: blog.category || '',
      author: blog.author || 'The Famous Halwai Team',
      published: blog.published ?? true,
    });
    if (blog.image) setImagePreview(blog.image);
    setShowForm(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      console.error('Only JPG, JPEG, PNG, WebP files allowed');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.post('/api/admin/upload', uploadData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFormData({ ...formData, image: res.data.url });
      setImagePreview(res.data.url);
    } catch {
      console.error('Failed to upload image');
    }
  };

  const handleClearImage = () => {
    setFormData({ ...formData, image: '' });
    setImagePreview('');
  };


  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: editingBlog ? formData.slug : generateSlug(title),
    });
  };

  // ReactQuill toolbar configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ]
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'blockquote', 'code-block', 'link', 'image'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setError('Please log in again to manage blogs.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const body = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
      };

      const response = editingBlog
        ? await axios.put(`/api/admin/blogs/${editingBlog._id}`, body, {
            headers: { Authorization: `Bearer ${token}` }
          })
        : await axios.post('/api/admin/blogs', body, {
            headers: { Authorization: `Bearer ${token}` }
          });

      const savedBlog = response.data;
      setBlogs((prev) => editingBlog
        ? prev.map((blog) => (blog._id === savedBlog._id ? savedBlog : blog))
        : [savedBlog, ...prev]);

      setShowForm(false);
      setEditingBlog(null);
      resetForm();
      notifyBlogChanged();
      setSuccessMessage(editingBlog ? 'Blog updated successfully.' : 'Blog added successfully.');
    } catch (err) {
      setError(err.response?.data?.details || err.response?.data?.error || 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setError('Please log in again to manage blogs.');
      return;
    }

    try {
      await axios.delete(`/api/admin/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      notifyBlogChanged();
      setSuccessMessage('Blog deleted successfully.');
    } catch (err) {
      setError(err.response?.data?.details || err.response?.data?.error || 'Delete failed. Please try again.');
    }
  };

  const handleViewImage = (blog) => setPreview(blog);
  const closePreview = () => setPreview(null);

  return (
    <div className="admin-blog-page">
      <AdminSidebar />
      <main className="admin-blog-content">
        <div className="page-header">
          <h2>Our Blog</h2>
          <button className="btn btn-primary btn-add" onClick={openCreate}>
            <Plus size={16} /> Add New Blog
          </button>
        </div>

        {error && <div className="admin-message admin-message--error">{error}</div>}
        {successMessage && <div className="admin-message admin-message--success">{successMessage}</div>}

        <div className="admin-blog-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by title, slug, or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-card">
          <div className="table-header">
            <h3>Blog Posts</h3>
            <span className="count-badge">{blogs.length} posts</span>
          </div>

          {loading ? (
            <div className="table-loading"><div className="loading-spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="table-empty">
              <p>{search ? 'No matching posts found.' : 'No blog posts yet. Click "Add New Blog" to create the first post.'}</p>
            </div>
          ) : (
            <table className="blog-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>Slno</th>
                  <th>Blog Title</th>
                  <th style={{ width: '90px' }}>Category</th>
                  <th style={{ width: '70px' }}>Status</th>
                  <th style={{ width: '90px' }}>Image</th>
                  <th style={{ width: '120px' }}>Date</th>
                  <th style={{ width: '160px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => (
                  <tr key={b._id}>
                    <td style={{ textAlign: 'center' }}>{i + 1}</td>
                    <td>
                      <div className="blog-title-cell">
                        <strong>{b.title}</strong>
                        {b.excerpt && <span className="blog-excerpt">{b.excerpt}</span>}
                      </div>
                    </td>
                    <td>
                      {b.category && <span className="cat-badge">{b.category}</span>}
                    </td>
                    <td>
                      <span className={`status-badge ${b.published ? 'status-published' : 'status-draft'}`}>
                        {b.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <button className="btn-view-icon" onClick={() => handleViewImage(b)} title={b.image ? 'View image' : 'No image'}>
                        {b.image ? <><Eye size={15} /><span className="btn-view-text">View</span></> : <><ImageOff size={15} /><span className="btn-view-text">None</span></>}
                      </button>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#777' }}>{formatDate(b.date || b.createdAt)}</td>
                    <td className="table-actions">
                      <button className="btn-action btn-edit" title="Edit" onClick={() => openEdit(b)}>
                        <Edit2 size={14} /> Edit
                      </button>
                      <button className="btn-action btn-delete" title="Delete" onClick={() => handleDelete(b._id)}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* ─── Image Preview Modal ─── */}
      {preview && (
        <div className="blog-modal-overlay" onClick={closePreview}>
          <div className="blog-modal" onClick={e => e.stopPropagation()}>
            <button className="blog-modal-close" onClick={closePreview}>&times;</button>
            <h3>{preview.title}</h3>
            {preview.image ? (
              <img src={preview.image} alt={preview.title} className="blog-modal-img"
                onError={e => { e.target.style.display = 'none'; }} />
            ) : (
              <div className="blog-modal-no-img">No image</div>
            )}
          </div>
        </div>
      )}

      {/* ─── Add / Edit Form Modal ─── */}
      {showForm && (
        <div className="blog-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="blog-modal blog-form-modal" onClick={e => e.stopPropagation()}>
            <button className="blog-modal-close" onClick={() => setShowForm(false)}>&times;</button>
            <h2>{editingBlog ? `Edit — "${editingBlog.title}"` : 'Add New Blog Post'}</h2>
            <form onSubmit={handleSubmit} className="blog-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input type="text" required value={formData.title}
                    onChange={handleTitleChange} placeholder="Enter blog title…" />
                </div>
                <div className="form-group">
                  <label>Slug *</label>
                  <input type="text" required value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated-from-title" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Meta Title</label>
                  <input type="text" value={formData.metaTitle}
                    onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="SEO meta title" />
                </div>
                <div className="form-group">
                  <label>Meta Keywords</label>
                  <input type="text" value={formData.metaKeyword}
                    onChange={e => setFormData({ ...formData, metaKeyword: e.target.value })}
                    placeholder="Comma-separated keywords" />
                </div>
              </div>
              <div className="form-group">
                <label>Meta Description</label>
                <textarea value={formData.metaDescription}
                  onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                  rows="3"
                  placeholder="Short SEO description for search engines…" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    <option value="">Select category…</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Author</label>
                  <input type="text" value={formData.author}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Author name…" />
                </div>
              </div>
              <div className="form-group">
                <label>Featured Image</label>
                {imagePreview ? (
                  <div className="image-preview-wrapper">
                    <img src={imagePreview} alt="Blog" className="image-preview" />
                    <div className="image-actions">
                      <button
                        type="button"
                        className="btn-view-image"
                        onClick={() => window.open(imagePreview, '_blank')}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="btn-clear-image"
                        onClick={handleClearImage}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="image-upload-wrapper">
                    <input
                      type="file"
                      id="blog-image"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleImageUpload}
                      className="file-input"
                    />
                    <label htmlFor="blog-image" className="file-label">
                      Choose Image
                    </label>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Excerpt</label>
                <input type="text" value={formData.excerpt}
                  onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Short summary shown on the blog listing…" />
              </div>
              <div className="form-group">
                <label>Content *</label>
                <div className="rich-editor">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(val) => setFormData({ ...formData, content: val })}
                    modules={quillModules}
                    formats={quillFormats}
                  />
                </div>
              </div>
              <div className="form-group form-group-inline">
                <label>
                  <input type="checkbox" checked={formData.published}
                    onChange={e => setFormData({ ...formData, published: e.target.checked })} />
                  Published
                </label>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : (editingBlog ? 'Update Post' : 'Publish Post')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
