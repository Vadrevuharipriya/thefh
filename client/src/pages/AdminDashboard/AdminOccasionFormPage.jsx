import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAdminOccasion, useCreateAdminOccasion, useUpdateAdminOccasion } from '../../hooks/admin/useAdminOccasions';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './AdminOccasionFormPage.scss';

export default function AdminOccasionFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
   const [form, setForm] = useState({
     name: '',
     image: '',
     pageUrl: '',
     innerHeader: '',
     metaTitle: '',
     metaKeyword: '',
     metaDesc: '',
     pageDescription: '',
     startingPrice: '',
     pricingEnabled: false,
     displayStatus: 'Approved'
   });
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const { data: occasionData, isError: occasionError } = useAdminOccasion(id);
  const { mutateAsync: createOccasion, isPending: creating } = useCreateAdminOccasion();
  const { mutateAsync: updateOccasion, isPending: updating } = useUpdateAdminOccasion();

  const loading = creating || updating;

  useEffect(() => {
    if (occasionError) {
      setError('Failed to fetch occasion');
    }
  }, [occasionError]);

  useEffect(() => {
    if (occasionData) {
      setForm({
        name: occasionData.name || '',
        image: occasionData.image || '',
        pageUrl: occasionData.pageUrl || '',
        innerHeader: occasionData.innerHeader || '',
        metaTitle: occasionData.metaTitle || '',
        metaKeyword: occasionData.metaKeyword || '',
        metaDesc: occasionData.metaDesc || '',
        pageDescription: occasionData.pageDescription || '',
        startingPrice: occasionData.startingPrice || '',
        pricingEnabled: occasionData.pricingEnabled || false,
        displayStatus: occasionData.displayStatus || 'Approved'
      });
      if (occasionData.image) {
        setImagePreview(occasionData.image);
      }
    }
  }, [occasionData]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ReactQuill toolbar configuration for page description
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post('/api/admin/upload', formData, {
        headers: {
        }
      });
      setForm({ ...form, image: res.data.url });
      setImagePreview(res.data.url);
    } catch (err) {
      console.warn('Multipart upload failed, attempting base64 fallback:', err?.response?.data || err.message || err);
      try {
        const reader = await new Promise((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result);
          r.onerror = reject;
          r.readAsDataURL(file);
        });
        const res2 = await axios.post('/api/admin/upload', { image: reader }, {
          headers: {
          }
        });
        setForm({ ...form, image: res2.data.url });
        setImagePreview(res2.data.url);
      } catch (err2) {
        console.error('Upload failed:', err2);
        const message = err2?.response?.data?.error || err2?.message || 'Failed to upload image';
        setError(message);
      }
    }
  };

  const handleClearImage = () => {
    setForm({ ...form, image: '' });
    setImagePreview('');
  };

   const handleSubmit = async e => {
     e.preventDefault();
     setError('');
     try {
       const payload = { ...form };
       
       // Ensure pageDescription is present
       if (!payload.pageDescription || payload.pageDescription.trim() === '') {
         throw new Error('Page description is required.');
       }
       
       // Validate innerHeader and occasion image sizes (base64)
       if (payload.innerHeader) {
         const innerSize = payload.innerHeader.length * 0.75;
         if (innerSize > 1024 * 100) {
           throw new Error('Inner header image is too large. Please upload an image under 60KB (file size).');
         }
       }
       if (payload.image) {
         const imgSize = payload.image.length * 0.75;
         if (imgSize > 1024 * 100) {
           throw new Error('Occasion image is too large. Please upload an image under 35KB (file size).');
         }
       }
       
       console.log('Submitting occasion:', { 
         name: payload.name, 
         pageUrl: payload.pageUrl, 
         pricingEnabled: payload.pricingEnabled,
         startingPrice: payload.startingPrice,
         imageLen: payload.image?.length || 0,
         innerHeaderLen: payload.innerHeader?.length || 0
       });
       
       if (id) {
         const result = await updateOccasion({ id, data: payload });
         console.log('Update response:', result);
       } else {
         const result = await createOccasion(payload);
         console.log('Create response:', result);
       }
       navigate('/admin/occasion');
     } catch (err) {
       console.error('Save error:', err);
       const msg = err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to save occasion';
       setError(msg);
     }
   };

  // Map display values to database values
  const getDisplayValue = (status) => {
    return status === 'Approved' ? 'Enabled' : 'Disabled';
  };

  const getStatusFromDisplay = (displayValue) => {
    return displayValue === 'Enabled' ? 'Approved' : 'Pending';
  };

  const handleStatusChange = (displayValue) => {
    const dbValue = getStatusFromDisplay(displayValue);
    setForm({ ...form, displayStatus: dbValue });
  };

  return (
    <div className="admin-occasion-form-container">
      <AdminSidebar />
      <main className="admin-occasion-form-content">
        <div className="page-header">
          <button onClick={() => navigate('/admin/occasion')} className="btn-back">
            ← Back
          </button>
          <h2>{id ? 'Edit Occasion' : 'Add New Occasion'}</h2>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit} className="occasion-form">

            {/* Occasion Title */}
            <div className="form-group">
              <label htmlFor="name">Occasion Title <span className="required">*</span></label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter occasion title"
                required
              />
            </div>

             {/* Starting Price with Toggle */}
             <div className="form-group">
               <div className="field-with-toggle">
                 <label htmlFor="startingPrice">Starting Price</label>
                 <div className="toggle-control">
                   <label className="toggle-switch">
                     <input
                       type="checkbox"
                       name="pricingEnabled"
                       checked={form.pricingEnabled}
                       onChange={(e) => setForm({ ...form, pricingEnabled: e.target.checked })}
                     />
                     <span className="toggle-slider"></span>
                   </label>
                   <span className="toggle-label">
                     {form.pricingEnabled ? 'Enabled' : 'Disabled'}
                   </span>
                 </div>
               </div>
               {form.pricingEnabled && (
                 <input
                   id="startingPrice"
                   name="startingPrice"
                   value={form.startingPrice}
                   onChange={handleChange}
                   placeholder="Enter starting price (e.g., ₹899)"
                   className="mt-2"
                 />
               )}
             </div>

            {/* Page URL */}
            <div className="form-group">
              <label htmlFor="pageUrl">Page URL <span className="required">*</span></label>
              <input
                id="pageUrl"
                name="pageUrl"
                value={form.pageUrl}
                onChange={handleChange}
                placeholder="Enter page URL (e.g., cocktail-and-sangeet)"
                required
              />
            </div>

            {/* Occasion Image */}
            <div className="form-group">
              <label>Occasion Image <span className="file-size-note">(max 35KB)</span></label>
              {imagePreview ? (
                <div className="image-preview-wrapper">
                  <img src={imagePreview} alt="Occasion" className="image-preview" />
                  <div className="preview-actions">
                    <button type="button" className="btn-view" onClick={() => window.open(imagePreview, '_blank')}>
                      View
                    </button>
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => handleClearImage('occasion')}
                      title="Remove image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="image-upload-wrapper">
                  <input
                    type="file"
                    id="occasion-image"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => handleImageUpload(e, 'occasion')}
                    className="file-input"
                  />
                  <label htmlFor="occasion-image" className="file-label">Choose Image</label>
                </div>
              )}
              <p className="dimension-note">Note: (W:500px & H:333px) and JPEG,JPG,PNG only (max 35KB)</p>
            </div>

            {/* Inner Header (Tagline) */}
            <div className="form-group">
              <label htmlFor="innerHeader">Inner Header (Tagline)</label>
              <input
                id="innerHeader"
                name="innerHeader"
                value={form.innerHeader}
                onChange={handleChange}
                placeholder="Enter tagline text (e.g., Create memories that last a lifetime)"
              />
            </div>

            {/* Meta Title */}
            <div className="form-group">
              <label htmlFor="metaTitle">Meta Title <span className="required">*</span></label>
              <input
                id="metaTitle"
                name="metaTitle"
                value={form.metaTitle}
                onChange={handleChange}
                placeholder="Enter meta title"
                required
              />
            </div>

            {/* Meta Keyword */}
            <div className="form-group">
              <label htmlFor="metaKeyword">Meta Keyword</label>
              <input
                id="metaKeyword"
                name="metaKeyword"
                value={form.metaKeyword}
                onChange={handleChange}
                placeholder="Enter meta keywords (comma separated)"
              />
            </div>

            {/* Meta Desc */}
            <div className="form-group">
              <label htmlFor="metaDesc">Meta Desc</label>
              <textarea
                id="metaDesc"
                name="metaDesc"
                value={form.metaDesc}
                onChange={handleChange}
                placeholder="Enter meta description"
                rows="3"
              />
            </div>

            {/* Page Description */}
            <div className="form-group">
              <label htmlFor="pageDescription">Page Description <span className="required">*</span></label>
              <div className="rich-editor">
                <ReactQuill
                  theme="snow"
                  value={form.pageDescription}
                  onChange={(val) => setForm({ ...form, pageDescription: val })}
                  modules={quillModules}
                  formats={quillFormats}
                />
              </div>
            </div>

            {/* Display Status */}
            <div className="form-group">
              <label>Display Status</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="displayStatus"
                    value="Enabled"
                    checked={getDisplayValue(form.displayStatus) === 'Enabled'}
                    onChange={() => handleStatusChange('Enabled')}
                  />
                  Enabled
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="displayStatus"
                    value="Disabled"
                    checked={getDisplayValue(form.displayStatus) === 'Disabled'}
                    onChange={() => handleStatusChange('Disabled')}
                  />
                  Disabled
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-footer">
              <button type="submit" disabled={loading} className="btn btn-submit">
                {loading ? 'Saving...' : 'SUBMIT'}
              </button>
            </div>

          </form>

          {error && <div className="alert-error">{error}</div>}
        </div>
      </main>
    </div>
  );
}
