import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import axios from 'axios';
import './AdminJobWorkerPage.scss';

const EXPERIENCE_OPTIONS = Array.from({ length: 30 }, (_, i) => i + 1);
const STATUS_OPTIONS = ['Pending', 'Approved', 'Hold'];
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const JOB_OPTIONS = ['Full Time', 'Part Time', 'Hourly', 'Contract'];
const CITY_OPTIONS = [
  'New Delhi', 'Delhi', 'Noida', 'Ghaziabad', 'Faridabad', 'Gurugram',
  'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune',
  'Jaipur', 'Lucknow', 'Chandigarh', 'Indore', 'Kochi', 'Ahmedabad',
  'Bhubaneswar', 'Nagpur', 'Dehradun', 'Shimla', 'Jalandhar', 'Mysuru',
  'Udaipur', 'Varanasi', 'Rajkot', 'Haridwar', 'Rishikesh', 'Mussoorie'
];
const CUISINE_OPTIONS = ['North Indian', 'South Indian', 'Chinese', 'Mexican', 'Thai', 'Korean', 'Italian', 'Fast Food'];

function buildSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getEmptyForm() {
  return {
    name: '', role: '', city: '', experience: '', email: '', mobile: '',
    emergencyContact: '', gender: '', jobPreference: '', cuisines: [],
    pincode: '', communicationAddress: '', permanentAddress: '', zone: '',
    aadhaarNumber: '', panNumber: '', bankAccountNumber: '', ifscCode: '',
    bankName: '', upiNumber: '', aadhaarFrontUrl: '', aadhaarBackUrl: '', panDocumentUrl: '',
    displayStatus: 'Pending', image: '',
  };
}

function normalizeWorker(worker, source) {
  if (!worker) return null;
  const cuisines = Array.isArray(worker.profile?.cuisines)
    ? worker.profile.cuisines
    : Array.isArray(worker.cuisines)
      ? worker.cuisines
      : (worker.cuisines ? worker.cuisines : []);

  const profile = worker.profile || {};
  const kyc = worker.kycDocuments || {};

  return {
    _id: worker._id || worker.firebaseId || worker.id,
    firebaseId: worker.firebaseId || '',
    source,
    name: worker.name || profile.name || profile.displayName || '',
    role: worker.role || profile.role || '',
    city: worker.city || profile.city || profile.location || '',
    experience: worker.experience != null ? String(worker.experience) : (profile.experience != null ? String(profile.experience) : ''),
    email: worker.email || profile.email || '',
    mobile: worker.mobile || worker.phone || profile.mobile || profile.phone || profile.contact || '',
    emergencyContact: worker.emergencyContact || worker.emergencyPhone || profile.emergencyContact || '',
    gender: worker.gender || profile.gender || '',
    jobPreference: worker.jobPreference || profile.jobPreference || '',
    cuisines,
    pincode: worker.pincode || worker.pinCode || profile.pincode || '',
    address: worker.address || profile.address || kyc.address || '',
    communicationAddress: worker.communicationAddress || worker.address || profile.communicationAddress || profile.address || kyc.communicationAddress || '',
    permanentAddress: worker.permanentAddress || profile.permanentAddress || kyc.permanentAddress || '',
    zone: worker.zone || profile.zone || '',
    aadhaarNumber: worker.aadhaarNumber || worker.aadharNumber || profile.aadhaarNumber || kyc.aadharNumber || '',
    panNumber: worker.panNumber || profile.panNumber || kyc.panNumber || '',
    bankAccountNumber: worker.bankAccountNumber || profile.bankAccountNumber || '',
    ifscCode: worker.ifscCode || profile.ifscCode || '',
    bankName: worker.bankName || profile.bankName || '',
    upiNumber: worker.upiNumber || profile.upiNumber || '',
    aadhaarFrontUrl: worker.aadhaarFrontUrl || worker.aadharFrontUrl || profile.aadhaarFrontUrl || kyc.aadharFrontUrl || '',
    aadhaarBackUrl: worker.aadhaarBackUrl || worker.aadharBackUrl || profile.aadhaarBackUrl || kyc.aadharBackUrl || '',
    panDocumentUrl: worker.panDocumentUrl || worker.panUrl || profile.panDocumentUrl || kyc.panUrl || '',
    displayStatus: worker.displayStatus || profile.displayStatus || 'Pending',
    image: worker.image || profile.image || '',
  };
}

export default function AdminJobWorkerProfilePage() {
  const { workerId } = useParams();
  const isNew = !workerId || workerId === 'new';
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [formData, setFormData] = useState(getEmptyForm());
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cuisineDropdownOpen, setCuisineDropdownOpen] = useState(false);
  const cuisineRef = useRef(null);

  const loadWorker = useCallback(async () => {
    if (isNew) {
      setWorker(null);
      setFormData(getEmptyForm());
      setImagePreview('');
      setError('');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    const token = localStorage.getItem('adminToken');
    let found = null;

    try {
      const res = await axios.get(`/api/admin/chefs/${workerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      found = normalizeWorker(res.data, 'local');
    } catch (err) {
      // Silently continue if local lookup fails
    }

    if (!found) {
      try {
        const firebaseRes = await axios.get('/api/admin/firebase/chefs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const firebaseChefs = firebaseRes.data || [];
        const raw = firebaseChefs.find((item) => 
          item.firebaseId === workerId || 
          item._id === workerId || 
          item.id === workerId
        );
        if (raw) {
          found = normalizeWorker(raw, 'firebase');
        }
      } catch (err) {
        console.error('Failed to fetch Firebase chefs:', err.response?.data || err.message);
      }
    }

    if (!found) {
      setError('Worker not found.');
      setWorker(null);
      setFormData(getEmptyForm());
      setImagePreview('');
    } else {
      setWorker(found);
      setFormData({
        ...found,
        cuisines: Array.isArray(found.cuisines)
          ? found.cuisines
          : typeof found.cuisines === 'string'
            ? found.cuisines.split(',').map((item) => item.trim()).filter(Boolean)
            : [],
      });
      setImagePreview(found.image || '');
    }
    setLoading(false);
  }, [workerId]);

  useEffect(() => {
    loadWorker();
  }, [loadWorker]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!cuisineDropdownOpen) return;
      if (cuisineRef.current && !cuisineRef.current.contains(event.target)) {
        setCuisineDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [cuisineDropdownOpen]);

  const handleCuisineToggle = () => {
    setCuisineDropdownOpen((prev) => !prev);
  };

  const toggleCuisineOption = (cuisine) => {
    setFormData((prev) => {
      const selected = new Set(prev.cuisines || []);
      if (selected.has(cuisine)) {
        selected.delete(cuisine);
      } else {
        selected.add(cuisine);
      }
      return { ...prev, cuisines: Array.from(selected) };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPG, JPEG, PNG, WebP files allowed');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('You must be logged in to upload files.');
        return;
      }
      const uploadData = new FormData();
      uploadData.append('image', file);
      const res = await axios.post('/api/admin/upload', uploadData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData((prev) => ({ ...prev, image: res.data.url }));
      setImagePreview(res.data.url);
      setError('');
    } catch (err) {
      console.error('Upload error:', err);
      setError('Image upload failed.');
    }
  };

  const handleDocumentUpload = async (field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPG, JPEG, PNG, WebP, PDF files allowed');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('You must be logged in to upload files.');
        return;
      }
      const uploadData = new FormData();
      uploadData.append('image', file);
      const res = await axios.post('/api/admin/upload', uploadData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData((prev) => ({ ...prev, [field]: res.data.url }));
      setError('');
    } catch (err) {
      console.error('Upload error:', err);
      setError('Document upload failed.');
    }
  };

  const getFileLabel = (url) => {
    if (!url) return 'No file uploaded';
    if (url.startsWith('data:')) {
      const mime = url.split(';')[0].replace('data:', '');
      if (mime === 'application/pdf') return 'Uploaded PDF document';
      return 'Uploaded image';
    }

    try {
      const parts = url.split('/');
      return parts[parts.length - 1] || 'Uploaded file';
    } catch {
      return 'Uploaded file';
    }
  };

  const openDocument = (url) => {
    if (!url) return;

    if (url.startsWith('data:')) {
      const [metadata, data] = url.split(',');
      const mime = metadata.split(':')[1].split(';')[0];
      const binary = atob(data);
      const buffer = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        buffer[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([buffer], { type: mime });
      const objectUrl = URL.createObjectURL(blob);
      const newWindow = window.open(objectUrl, '_blank', 'noopener,noreferrer');
      if (!newWindow) {
        URL.revokeObjectURL(objectUrl);
      } else {
        newWindow.onload = () => {
          URL.revokeObjectURL(objectUrl);
        };
      }
      return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const cuisineList = Array.isArray(formData.cuisines)
        ? formData.cuisines
        : formData.cuisines
          ? formData.cuisines.split(',').map((item) => item.trim()).filter(Boolean)
          : [];

      const body = {
        name: formData.name,
        role: formData.role,
        city: formData.city,
        experience: formData.experience ? Number(formData.experience) : null,
        email: formData.email,
        mobile: formData.mobile,
        displayStatus: formData.displayStatus,
        image: formData.image,
        profile: {
          emergencyContact: formData.emergencyContact,
          gender: formData.gender,
          jobPreference: formData.jobPreference,
          cuisines: cuisineList,
          pincode: formData.pincode,
          communicationAddress: formData.communicationAddress,
          permanentAddress: formData.permanentAddress,
          zone: formData.zone,
          aadhaarNumber: formData.aadhaarNumber,
          panNumber: formData.panNumber,
          bankAccountNumber: formData.bankAccountNumber,
          ifscCode: formData.ifscCode,
          bankName: formData.bankName,
          upiNumber: formData.upiNumber,
          aadhaarFrontUrl: formData.aadhaarFrontUrl,
          aadhaarBackUrl: formData.aadhaarBackUrl,
          panDocumentUrl: formData.panDocumentUrl,
        },
      };

      if (isNew) {
        const res = await axios.post('/api/admin/chefs', {
          ...body,
          slug: `${buildSlug(formData.name)}-${Date.now()}`,
          bio: '',
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate(`/admin/order-inquiry/manage-job-worker/${res.data._id}`);
      } else {
        await axios.put(`/api/admin/chefs/${workerId}`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setError('Saved successfully.');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save worker profile.');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard admin-job-workers">
        <AdminSidebar />
        <main className="admin-job-workers__content">
          <div className="loading">Loading…</div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-dashboard admin-job-workers">
      <AdminSidebar />
      <main className="admin-job-workers__content">
        <div className="profile-page__Header">
          <button className="btn-secondary btn-back" onClick={() => navigate('/admin/order-inquiry/manage-job-worker')}>
            <X size={18} /> Back
          </button>
          <div className="profile-page__HeaderInner">
            <h2>{isNew ? 'Add New Chef' : 'Chef Profile'}</h2>
            {!isNew && (
              <button
                type="button"
                className="btn-secondary btn-booking-detail"
                onClick={() =>
                  navigate(
                    `/admin/order-inquiry/manage-job-worker/${
                      worker?.firebaseId || workerId
                    }/bookings`
                  )
}
              >
                Booking detail
              </button>
            )}
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-card">
            <div className="modal-card__section">
              <div className="modal-card__heading">Chef detail</div>
              <div className="modal-card__grid">
                <div className="modal-card__field">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full name"
                   
                  />
                </div>
                <div className="modal-card__field">
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Role"
                   
                  />
                </div>
                <div className="modal-card__field">
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="Mobile number"
                   
                  />
                </div>
                <div className="modal-card__field">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email address"
                   
                  />
                </div>
                <div className="modal-card__field">
                  <input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="Emergency contact number"
                   
                  />
                </div>
                <div className="modal-card__field">
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                   
                  >
                    <option value="">Select gender</option>
                    {GENDER_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-card__field">
                  <select
                    value={formData.jobPreference}
                    onChange={(e) => setFormData({ ...formData, jobPreference: e.target.value })}
                   
                  >
                    <option value="">Job preference</option>
                    {JOB_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-card__field">
                  <div className="multi-select" ref={cuisineRef}>
                    <button
                      type="button"
                      className="multi-select__trigger"
                      onClick={handleCuisineToggle}
                     
                    >
                      <span>{Array.isArray(formData.cuisines) && formData.cuisines.length > 0
                        ? formData.cuisines.join(', ')
                        : 'Select cuisines'
                      }</span>
                      <ChevronDown size={18} />
                    </button>
                    {cuisineDropdownOpen && (
                      <div className="multi-select__menu">
                        {CUISINE_OPTIONS.map((cuisine) => (
                          <label key={cuisine} className="multi-select__option">
                            <input
                              type="checkbox"
                              checked={Array.isArray(formData.cuisines) && formData.cuisines.includes(cuisine)}
                              onChange={() => toggleCuisineOption(cuisine)}
                             
                            />
                            <span>{cuisine}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-card__field">
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                   
                  >
                    <option value="">Work experience</option>
                    {EXPERIENCE_OPTIONS.map((n) => (
                      <option key={n} value={String(n)}>{n} Year{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-card__field">
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                   
                  >
                    <option value="">Select city</option>
                    {CITY_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-card__field">
                  <input
                    type="text"
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                    placeholder="Zone"
                   
                  />
                </div>
                <div className="modal-card__field">
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="Enter 6-digit pin code"
                   
                  />
                </div>
                <div className="modal-card__field modal-card__field--full">
                  <textarea
                    rows={3}
                    value={formData.communicationAddress}
                    onChange={(e) => setFormData({ ...formData, communicationAddress: e.target.value })}
                    placeholder="Address"
                   
                  />
                </div>
              </div>
            </div>

            <div className="modal-card__section">
              <div className="modal-card__heading">KYC details & verification</div>
              <div className="modal-card__grid">
                <div className="modal-card__field">
                  <input
                    type="text"
                    value={formData.aadhaarNumber}
                    onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                    placeholder="Aadhaar number"
                   
                  />
                </div>
                <div className="modal-card__field">
                  <input
                    type="text"
                    value={formData.panNumber}
                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                    placeholder="PAN number"
                   
                  />
                </div>
                <div className="modal-card__field modal-card__field--full">
                  <div className="doc-upload-header">Upload documents</div>
                  <div className="doc-upload-group">
                    <div className="doc-upload">
                      <div>
                        <span>Upload Aadhaar Card</span>
                        <div className="doc-upload__subtitle">Upload both front and back</div>
                      </div>
                      <div className="doc-upload__action">
                        <input
                          id="aadhaar-file"
                          type="file"
                          className="doc-upload__input"
                          accept=".jpg,.jpeg,.png,.webp,.pdf"
                          onChange={(e) => handleDocumentUpload('aadhaarFrontUrl', e)}
                         
                        />
                        <label htmlFor="aadhaar-file" className="btn-upload">
                          Upload
                        </label>
                        {formData.aadhaarFrontUrl && (
                          <button type="button" className="btn-view-doc" onClick={() => openDocument(formData.aadhaarFrontUrl)}>
                            View
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="doc-upload">
                      <div>
                        <span>Upload PAN Card</span>
                        <div className="doc-upload__subtitle">Upload PAN copy for verification</div>
                      </div>
                      <div className="doc-upload__action">
                        <input
                          id="pan-document-file"
                          type="file"
                          className="doc-upload__input"
                          accept=".jpg,.jpeg,.png,.webp,.pdf"
                          onChange={(e) => handleDocumentUpload('panDocumentUrl', e)}
                         
                        />
                        <label htmlFor="pan-document-file" className="btn-upload">
                          Upload
                        </label>
                        {formData.panDocumentUrl && (
                          <button type="button" className="btn-view-doc" onClick={() => openDocument(formData.panDocumentUrl)}>
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-card__section">
              <div className="modal-card__heading">Bank Details</div>
              <div className="modal-card__grid">
                <div className="modal-card__field">
                  <input
                    type="text"
                    value={formData.bankAccountNumber}
                    onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                    placeholder="Bank account number"
                   
                  />
                </div>
                <div className="modal-card__field">
                  <input
                    type="text"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                    placeholder="IFSC code"
                   
                  />
                </div>
                <div className="modal-card__field">
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    placeholder="Bank name"
                   
                  />
                </div>
              </div>
            </div>

            <div className="modal-card__section">
              <div className="modal-card__heading">UPI Details</div>
              <div className="modal-card__grid modal-card__grid--single">
                <div className="modal-card__field modal-card__field--full">
                  <input
                    type="text"
                    value={formData.upiNumber}
                    onChange={(e) => setFormData({ ...formData, upiNumber: e.target.value })}
                    placeholder="UPI number"
                   
                  />
                </div>
              </div>
            </div>
          </div>

          {error && <div className="modal-error">{error}</div>}
          <div className="modal-foot">
            <button className="btn-secondary" onClick={() => navigate('/admin/order-inquiry/manage-job-worker')}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave}>
              Save Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

AdminJobWorkerProfilePage.propTypes = {};
