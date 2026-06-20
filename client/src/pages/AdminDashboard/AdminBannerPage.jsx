import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Plus, Edit2, Trash2, Eye, ImageOff, Tag, Bold as BoldIcon, Trash
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminBannerPage.scss';

export default function AdminBannerPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    tag: '',
    title: '',
    titleAccent: '',
    subtitle: '',
    image: '',
    rating: 4.9,
    reviews: 0,
    link: '',
    sortOrder: 0,
    displayStatus: 'Approved'
  });

   const fetchBanners = async () => {
     setLoading(true);
     setError('');
     try {
      const res = await axios.get('/api/admin/banners', {
       });
       setBanners(res.data);
     } catch (err) {
       console.error('Fetch banners failed:', err);
       if (err.response) {
         console.error('Response data:', err.response.data);
         console.error('Response status:', err.response.status);
         setError(`Failed to fetch banners: ${err.response.data.error || err.response.statusText}`);
       } else if (err.request) {
         console.error('No response received:', err.request);
         setError('No response from server. Please check if the server is running.');
       } else {
         setError('Failed to fetch banners. Please check console for details.');
       }
     }
     setLoading(false);
   };

  useEffect(() => {
    fetchBanners();
  }, []);

  const bannerHeading = (b) => [b.tag, b.title, b.titleAccent].filter(Boolean).join(' ');

   const handleStatusToggle = async (banner) => {
     const newStatus = banner.displayStatus === 'Approved' ? 'Pending' : 'Approved';
     try {
       await axios.put(`/api/admin/banners/${banner._id}`, { displayStatus: newStatus }, {
       });
      await fetchBanners();
      // notify other tabs/clients to refresh public banners
      try { localStorage.setItem('bannersUpdated', String(Date.now())); } catch (e) { /* ignore */ }
      try { window.dispatchEvent(new Event('bannersUpdated')); } catch (e) { /* ignore */ }
     } catch (err) {
       console.error('Status update failed:', err);
       if (err.response) {
         console.error('Response data:', err.response.data);
         console.error('Response status:', err.response.status);
         setError(`Status update failed: ${err.response.data.error || err.response.statusText}`);
       } else if (err.request) {
         console.error('No response received:', err.request);
         setError('No response from server. Please check if the server is running.');
       } else {
         setError('Status update failed. Please check console for details.');
       }
     }
   };

   const handleDelete = async (id, name) => {
     if (!confirm(`Delete banner "${name}"?`)) return;
     try {
       await axios.delete(`/api/admin/banners/${id}`, {
       });
      await fetchBanners();
      try { localStorage.setItem('bannersUpdated', String(Date.now())); } catch (e) { /* ignore */ }
      try { window.dispatchEvent(new Event('bannersUpdated')); } catch (e) { /* ignore */ }
     } catch (err) {
       console.error('Delete failed:', err);
       if (err.response) {
         console.error('Response data:', err.response.data);
         console.error('Response status:', err.response.status);
         setError(`Delete failed: ${err.response.data.error || err.response.statusText}`);
       } else if (err.request) {
         console.error('No response received:', err.request);
         setError('No response from server. Please check if the server is running.');
       } else {
         setError('Delete failed. Please check console for details.');
       }
     }
   };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPG, JPEG, PNG, WebP files allowed');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const res = await axios.post('/api/admin/upload', formDataUpload, {
        headers: {
        }
      });
      setFormData({ ...formData, image: res.data.url });
      setImagePreview(res.data.url);
    } catch (err) {
      setError('Failed to upload image');
    }
  };

  const handleClearImage = () => {
    setFormData({ ...formData, image: '' });
    setImagePreview('');
  };

  const handleViewImage = (b) => {
    setPreview(b);
  };

  const closePreview = () => setPreview(null);

  const resetForm = () => {
    setFormData({
      tag: '', title: '', titleAccent: '', subtitle: '',
      image: '', rating: 4.9, reviews: 0, link: '',
      sortOrder: banners.length, displayStatus: 'Approved'
    });
    setImagePreview('');
  };

  const openCreate = () => {
    setEditingBanner(null);
    resetForm();
    setShowForm(true);
  };

  const openEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      tag: banner.tag || '', title: banner.title || '', titleAccent: banner.titleAccent || '',
      subtitle: banner.subtitle || '', image: banner.image || '',
      rating: banner.rating || 4.9, reviews: banner.reviews || 0,
      link: banner.link || '', sortOrder: banner.sortOrder || 0,
      displayStatus: banner.displayStatus || 'Approved'
    });
    if (banner.image) setImagePreview(banner.image);
    setShowForm(true);
  };

   const handleSubmit = async (e) => {
     e.preventDefault();
     try {
       const body = { ...formData };
       if (editingBanner) {
         await axios.put(`/api/admin/banners/${editingBanner._id}`, body, {
         });
       } else {
         await axios.post(`/api/admin/banners`, body, {
         });
       }
       setShowForm(false);
       setEditingBanner(null);
       resetForm();
      await fetchBanners();
      try { localStorage.setItem('bannersUpdated', String(Date.now())); } catch (e) { /* ignore */ }
      try { window.dispatchEvent(new Event('bannersUpdated')); } catch (e) { /* ignore */ }
     } catch (err) {
       console.error('Save failed:', err);
       if (err.response) {
         console.error('Response data:', err.response.data);
         console.error('Response status:', err.response.status);
         setError(`Server error: ${err.response.data.error || err.response.statusText}`);
       } else if (err.request) {
         console.error('No response received:', err.request);
         setError('No response from server. Please check if the server is running.');
       } else {
         setError('Failed to save banner. Please check console for details.');
       }
     }
   };

  return (
    <div className="admin-banner-page">
      <AdminSidebar />
      <main className="admin-banner-content">
        <div className="page-header">
          <h2>Manage Top Header Banner</h2>
          <button className="btn btn-primary btn-add" onClick={openCreate}>
            <Plus size={16} /> Add New Banner
          </button>
        </div>

        <div className="table-card">
          <div className="table-header">
            <h3>Banner List</h3>
            <span className="count-badge">{banners.length} banners</span>
          </div>

          {error && (
            <div className="table-empty">
              <p>{error}</p>
              <button onClick={fetchBanners} className="btn btn-primary" style={{ marginTop: '1rem' }}>Retry</button>
            </div>
          )}

          {loading ? (
            <div className="table-loading"><div className="loading-spinner" /></div>
          ) : banners.length === 0 ? (
            <div className="table-empty">
              <p>No banners yet. Click "Add New Banner" to create the first one.</p>
            </div>
          ) : (
            <table className="banner-table">
              <colgroup>
                <col style={{ width: '6%' }} />
                <col style={{ width: '64%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '20%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Slno</th>
                  <th>Banner Heading</th>
                  <th>Banner View</th>
                  <th>Option</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((b, i) => (
                  <tr key={b._id}>
                    <td data-label="Slno" style={{ textAlign: 'center' }}>{i + 1}</td>
                    <td data-label="Banner Heading">
                      <div className="banner-heading">
                        <div className="banner-tag">{b.tag}</div>
                        <strong>{b.title}</strong>
                        {b.titleAccent && <em> {b.titleAccent}</em>}
                      </div>
                      {b.subtitle && <span className="banner-subtitle">{b.subtitle}</span>}
                    </td>
                    <td data-label="Banner View" className="banner-view-cell">
                      <button
                        className="btn-view-icon"
                        onClick={() => handleViewImage(b)}
                        title="View banner image"
                      >
                        {b.image ? <><Eye size={16} /> <span className="btn-view-text">View</span></> : <><ImageOff size={16} /> <span className="btn-view-text">No image</span></>}
                      </button>
                    </td>
                    <td data-label="Option">
                      <div className="banner-options">
                        <button
                          onClick={() => handleStatusToggle(b)}
                          className={`btn-action ${b.displayStatus === 'Approved' ? 'btn-warning' : 'btn-success'}`}
                          title={b.displayStatus === 'Approved' ? 'Click to disable' : 'Click to enable'}
                        >
                          {b.displayStatus === 'Approved' ? 'Disable' : 'Enable'}
                        </button>
                        <button className="btn-action btn-edit" title="Edit" onClick={() => openEdit(b)}>
                          <Edit2 size={15} />
                        </button>
                        <button className="btn-action btn-delete" title="Delete" onClick={() => handleDelete(b._id, bannerHeading(b))}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* ─────── Image Preview Modal ─────── */}
      {preview && (
        <div className="banner-modal-overlay" onClick={closePreview}>
          <div className="banner-modal" onClick={e => e.stopPropagation()}>
            <button className="banner-modal-close" onClick={closePreview}>&times;</button>
            <h3>{bannerHeading(preview)}</h3>
            {preview.subtitle && <p className="banner-modal-sub">{preview.subtitle}</p>}
            {preview.image ? (
              <img src={preview.image} alt={bannerHeading(preview)} className="banner-modal-img"
                   onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <div className="banner-modal-no-img">No image</div>
            )}
          </div>
        </div>
      )}

      {/* ─────── Add / Edit Form Modal ─────── */}
      {showForm && (
        <div className="banner-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="banner-modal banner-form-modal" onClick={e => e.stopPropagation()}>
            <button className="banner-modal-close" onClick={() => setShowForm(false)}>&times;</button>
            <h2>{editingBanner ? `Edit Banner — "${bannerHeading(editingBanner)}"` : 'Add New Banner'}</h2>
            <form onSubmit={handleSubmit} className="banner-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Tag</label>
                  <input type="text" value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })} placeholder="e.g. Banquet & Venue" />
                </div>
                <div className="form-group">
                  <label>Title *</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Destination" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Title Accent</label>
                  <input type="text" value={formData.titleAccent} onChange={e => setFormData({ ...formData, titleAccent: e.target.value })} placeholder="e.g. Venues" />
                </div>
                <div className="form-group">
                  <label>Sort Order</label>
                  <input type="number" value={formData.sortOrder} onChange={e => setFormData({ ...formData, sortOrder: Number(e.target.value) })} />
                </div>
              </div>
              <div className="form-group">
                <label>Subtitle</label>
                <textarea value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} rows="2" placeholder="Brief tagline shown on the slider…" />
              </div>
              <div className="form-group">
                <label>Banner Image <span className="required">*</span></label>
                {imagePreview ? (
                  <div className="image-preview-wrapper">
                    <img src={imagePreview} alt="Banner" className="image-preview" />
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
                      id="banner-image"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleImageUpload}
                      className="file-input"
                    />
                    <label htmlFor="banner-image" className="file-label">
                      Choose Image
                    </label>
                  </div>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Link</label>
                  <input type="text" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} placeholder="#" />
                </div>
                <div className="form-group">
                  <label>Rating</label>
                  <input type="number" step="0.1" value={formData.rating} onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Reviews</label>
                  <input type="number" value={formData.reviews} onChange={e => setFormData({ ...formData, reviews: Number(e.target.value) })} />
                </div>
              </div>
              <div className="form-group">
                <label>Display Status</label>
                <select value={formData.displayStatus} onChange={e => setFormData({ ...formData, displayStatus: e.target.value })}>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
<div className="form-actions">
                 <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                 <button type="submit" className="btn-primary">{editingBanner ? 'Update Banner' : 'Create Banner'}</button>
               </div>
               {error && <div className="alert-error" style={{ marginTop: '1rem' }}>{error}</div>}
             </form>
           </div>
         </div>
       )}
    </div>
  );
}
