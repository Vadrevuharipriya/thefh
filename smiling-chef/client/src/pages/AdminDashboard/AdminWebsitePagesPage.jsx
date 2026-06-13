import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { Plus, Edit, Trash2, Search, FileText, Globe, Settings, Trash } from 'lucide-react';
import './AdminWebsitePagesPage.scss';

const PAGE_TYPES = [
  { id: 'static', label: 'Static Page', icon: FileText },
  { id: 'dynamic', label: 'Dynamic Page', icon: Globe },
  { id: 'service', label: 'Service Page', icon: Settings },
  { id: 'category', label: 'Category Page', icon: FileText },
  { id: 'blog', label: 'Blog Page', icon: FileText },
  { id: 'other', label: 'Other', icon: Settings },
];

export default function AdminWebsitePagesPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    url: '',
    metaTitle: '',
    metaDescription: '',
    pageType: 'static',
    displayStatus: 'Approved',
    content: '',
    featuredImage: ''
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('/api/admin/website-pages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPages(res.data);
    } catch (err) {
      console.error('Failed to fetch website pages:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.url.toLowerCase().includes(search.toLowerCase())
  );

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: editingPage ? formData.slug : generateSlug(title),
      url: editingPage ? formData.url : `/${generateSlug(title)}`,
      metaTitle: editingPage ? formData.metaTitle : title
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingPage
        ? `/api/admin/website-pages/${editingPage._id}`
        : '/api/admin/website-pages';
      const method = editingPage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Save failed');

      setShowModal(false);
      setEditingPage(null);
      resetForm();
      fetchPages();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      url: '',
      metaTitle: '',
      metaDescription: '',
      pageType: 'static',
      displayStatus: 'Approved',
      content: '',
      featuredImage: ''
    });
    setImagePreview('');
  };

  const openEdit = (page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      url: page.url || '',
      metaTitle: page.metaTitle || '',
      metaDescription: page.metaDescription || '',
      pageType: page.pageType || 'static',
      displayStatus: page.displayStatus || 'Approved',
      content: page.content || '',
      featuredImage: page.featuredImage || ''
    });
    if (page.featuredImage) setImagePreview(page.featuredImage);
    setShowModal(true);
  };

  const openCreate = () => {
    setEditingPage(null);
    resetForm();
    setShowModal(true);
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
      setFormData({ ...formData, featuredImage: res.data.url });
      setImagePreview(res.data.url);
    } catch (err) {
      console.error('Failed to upload image');
    }
  };

  const handleClearImage = () => {
    setFormData({ ...formData, featuredImage: '' });
    setImagePreview('');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    try {
      await fetch(`/api/admin/website-pages/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      fetchPages();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const getPageTypeIcon = (pageType) => {
    const type = PAGE_TYPES.find(t => t.id === pageType);
    return type ? type.icon : FileText;
  };

  const getPageTypeLabel = (pageType) => {
    const type = PAGE_TYPES.find(t => t.id === pageType);
    return type ? type.label : pageType;
  };

  return (
    <div className="admin-website-pages">
      <AdminSidebar />
      <main className="admin-website-pages__main">
        <header className="admin-website-pages__header">
          <h1>Website Pages</h1>
          <button className="btn-primary" onClick={openCreate}>
            <Plus size={18} />
            Add Website Page
          </button>
        </header>

        <div className="admin-website-pages__search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search pages by title, slug, or URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-website-pages__table-container">
          <table className="admin-website-pages__table">
            <thead>
              <tr>
                <th>Slno</th>
                <th>Page Title</th>
                <th>Page URL</th>
                <th>Meta Title</th>
                <th>Page Type</th>
                <th>Display Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="loading">Loading...</td>
                </tr>
              ) : (
                filteredPages.map((page, i) => {
                  const PageTypeIcon = getPageTypeIcon(page.pageType);
                  return (
                    <tr key={page._id}>
                      <td>{i + 1}</td>
                      <td>{page.title}</td>
                      <td><code>{page.url}</code></td>
                      <td>{page.metaTitle || '-'}</td>
                      <td>
                        <span className={`page-type-badge ${page.pageType}`}>
                          <PageTypeIcon size={14} />
                          {getPageTypeLabel(page.pageType)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${page.displayStatus === 'Approved' ? 'status-active' : 'status-inactive'}`}>
                          {page.displayStatus}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button onClick={() => openEdit(page)} className="btn-edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(page._id)} className="btn-delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <h2>{editingPage ? `Edit "${editingPage.title}"` : 'Add New Website Page'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Page Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={handleTitleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                  <small>Auto-generated, used in URLs</small>
                </div>
              </div>

              <div className="form-group">
                <label>Page URL</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="/page-url"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Meta Title</label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="SEO meta title"
                  />
                </div>
                <div className="form-group">
                  <label>Page Type</label>
                  <select
                    value={formData.pageType}
                    onChange={(e) => setFormData({ ...formData, pageType: e.target.value })}
                  >
                    {PAGE_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Meta Description</label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  rows="2"
                  placeholder="Brief description for SEO"
                />
              </div>

              <div className="form-group">
                <label>Featured Image</label>
                {imagePreview ? (
                  <div className="image-preview-wrapper">
                    <img src={imagePreview} alt="Page" className="image-preview" />
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
                      id="featured-image"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleImageUpload}
                      className="file-input"
                    />
                    <label htmlFor="featured-image" className="file-label">
                      Choose Image
                    </label>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Display Status</label>
                <select
                  value={formData.displayStatus}
                  onChange={(e) => setFormData({ ...formData, displayStatus: e.target.value })}
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit">{editingPage ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
