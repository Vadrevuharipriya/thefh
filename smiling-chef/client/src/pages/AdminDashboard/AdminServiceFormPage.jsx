import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { Trash2 } from 'lucide-react';
import './AdminServiceFormPage.scss';

export default function AdminServiceFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isViewMode = location.pathname.includes('/view/');
  
  const [form, setForm] = useState({
    name: '',
    menuName: '',
    filename: '',
    metaTitle: '',
    metaDesc: '',
    image: '',
    displayStatus: 'Approved',
    isCategory: true
  });
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem('adminToken');
      if (!token) { setError('Not authenticated. Please login again.'); return; }
      axios.get(`/api/admin/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          const data = res.data;
          setForm({
            name: data.name || '',
            menuName: data.menuName || '',
            filename: data.filename || '',
            metaTitle: data.metaTitle || '',
            metaDesc: data.metaDesc || '',
            image: data.image || '',
            displayStatus: data.displayStatus || 'Approved',
            isCategory: data.isCategory !== false
          });
          if (data.image) setImagePreview(data.image);
        })
        .catch(() => setError('Failed to fetch service'));
    }
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPG, JPEG, PNG files allowed');
      return;
    }
    if (file.size > 1024 * 100) { // 100KB limit
      setError('Image must be less than 100KB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.post('/api/admin/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setForm({ ...form, image: res.data.url });
      setImagePreview(res.data.url);
    } catch {
      setError('Failed to upload image');
    }
  };

  const handleClearImage = () => {
    setForm({ ...form, image: '' });
    setImagePreview('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      if (id) {
        await axios.put(`/api/admin/services/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/admin/services', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate('/admin/services');
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.error || 'Failed to save service');
    }
    setLoading(false);
  };

   return (
     <div className="admin-service-form-container">
       <AdminSidebar />
       <main className="admin-service-form-content">
         <div className="page-header">
           <button onClick={() => navigate('/admin/services')} className="btn-back">
             ← Back
           </button>
           <h2>{isViewMode ? 'View Service Category' : (id ? 'Edit Service Category' : 'Add New Service Category')}</h2>
         </div>

         <div className="form-card">
           {isViewMode ? (
             <div className="view-mode-content">
               <div className="info-section">
                 <h4>Service Details</h4>
                 <div className="info-grid">
                   <div className="info-item">
                     <label>Category Name</label>
                     <p>{form.name}</p>
                   </div>
                   <div className="info-item">
                     <label>Menu Name</label>
                     <p>{form.menuName}</p>
                   </div>
                   <div className="info-item">
                     <label>Filename</label>
                     <p>{form.filename}</p>
                   </div>
                   <div className="info-item">
                     <label>Meta Title</label>
                     <p>{form.metaTitle || '-'}</p>
                   </div>
                   <div className="info-item">
                     <label>Meta Description</label>
                     <p>{form.metaDesc || '-'}</p>
                   </div>
                   <div className="info-item">
                     <label>Publish Status</label>
                     <p>
                       <span className={`status-badge ${form.displayStatus === 'Approved' ? 'status-approved' : 'status-pending'}`}>
                         {form.displayStatus}
                       </span>
                     </p>
                   </div>
                 </div>
                 {form.image && (
                   <div className="info-item">
                     <label>Category Image</label>
                     <div className="image-preview-wrapper">
                       <img src={form.image} alt={form.name} className="image-preview" />
                       <button
                         type="button"
                         className="btn-view-image"
                         onClick={() => window.open(form.image, '_blank')}
                       >
                         View Full Image
                       </button>
                     </div>
                   </div>
                 )}
               </div>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="service-form">
               <div className="form-section">
                 <h4>Service Information</h4>

                 <div className="form-group">
                   <label htmlFor="name">Category Name <span className="required">*</span></label>
                   <input
                     id="name"
                     name="name"
                     type="text"
                     value={form.name}
                     onChange={handleChange}
                     placeholder="Enter category name (e.g., Halwai & Chefs)"
                     required
                     disabled={isViewMode}
                   />
                 </div>

                 <div className="form-group">
                   <label htmlFor="menuName">Menu Name (slug) <span className="required">*</span></label>
                   <input
                     id="menuName"
                     name="menuName"
                     type="text"
                     value={form.menuName}
                     onChange={handleChange}
                     placeholder="URL friendly name (e.g., halwai-chefs)"
                     required
                     disabled={isViewMode}
                   />
                   <small>Used in URL: /services/halwai-chefs</small>
                 </div>

                 <div className="form-group">
                   <label htmlFor="filename">Filename <span className="required">*</span></label>
                   <input
                     id="filename"
                     name="filename"
                     type="text"
                     value={form.filename}
                     onChange={handleChange}
                     placeholder="Image filename (e.g., halwai-chefs.jpg)"
                     required
                     disabled={isViewMode}
                   />
                   <small>For reference purposes</small>
                 </div>

                 <div className="form-group">
                   <label htmlFor="metaTitle">Meta Title</label>
                   <input
                     id="metaTitle"
                     name="metaTitle"
                     type="text"
                     value={form.metaTitle}
                     onChange={handleChange}
                     placeholder="SEO meta title"
                     disabled={isViewMode}
                   />
                 </div>

                 <div className="form-group">
                   <label htmlFor="metaDesc">Meta Description</label>
                   <textarea
                     id="metaDesc"
                     name="metaDesc"
                     value={form.metaDesc}
                     onChange={handleChange}
                     placeholder="SEO meta description"
                     rows="3"
                     disabled={isViewMode}
                   />
                 </div>

                 <div className="form-group">
                   <label>Category Image <span className="required">*</span></label>
                   {imagePreview ? (
                     <div className="image-preview-wrapper">
                       <img src={imagePreview} alt="Service" className="image-preview" />
                       {!isViewMode && (
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
                             <Trash2 size={16} />
                           </button>
                         </div>
                       )}
                     </div>
                   ) : (
                     !isViewMode && (
                       <div className="image-upload-wrapper">
                         <input
                           type="file"
                           id="image"
                           accept=".jpg,.jpeg,.png"
                           onChange={handleImageUpload}
                           className="file-input"
                         />
                         <label htmlFor="image" className="file-label">
                           Choose Image (120×120px, JPG/PNG)
                         </label>
                         <small>Spec: (W:120px & H:120px) and JPEG,JPG,PNG only</small>
                       </div>
                     )
                   )}
                 </div>

                 <div className="form-group">
                   <label>
                     <input
                       type="checkbox"
                       name="isCategory"
                       checked={form.isCategory}
                       onChange={e => setForm({ ...form, isCategory: e.target.checked })}
                       disabled={isViewMode}
                     />
                     Is Category
                   </label>
                   <small>This is a top-level service category</small>
                 </div>

                 <div className="form-group">
                   <label htmlFor="displayStatus">Publish Status</label>
                   <select
                     id="displayStatus"
                     name="displayStatus"
                     value={form.displayStatus}
                     onChange={handleChange}
                     disabled={isViewMode}
                   >
                     <option value="Approved">Enabled</option>
                     <option value="Pending">Disabled</option>
                   </select>
                 </div>
               </div>

               <div className="form-footer">
                 {!isViewMode && (
                   <>
                     <button type="submit" disabled={loading} className="btn btn-primary">
                       {loading ? 'Saving...' : (id ? 'Update Service' : 'Add Service')}
                     </button>
                     <button
                       type="button"
                       onClick={() => navigate('/admin/services')}
                       className="btn btn-outline"
                     >
                       Cancel
                     </button>
                   </>
                 )}
                 {isViewMode && (
                   <button
                     type="button"
                     onClick={() => navigate(`/admin/services/edit/${id}`)}
                     className="btn btn-primary"
                   >
                     Edit Service
                   </button>
                 )}
               </div>
             </form>
           )}

           {error && <div className="alert-error">{error}</div>}
         </div>
       </main>
     </div>
   );
 }
