import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminChefPage.scss';

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const EXPERIENCE_OPTIONS = ['0-1 year', '1-3 years', '3-5 years', '5+ years'];
const JOB_OPTIONS = ['Full Time', 'Part Time', 'Hourly', 'Contract'];
const CITY_OPTIONS = [
  'New Delhi', 'Delhi', 'Noida', 'Ghaziabad', 'Faridabad', 'Gurugram',
  'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune',
  'Jaipur', 'Lucknow', 'Chandigarh', 'Indore', 'Kochi', 'Ahmedabad',
  'Bhubaneswar', 'Nagpur', 'Dehradun', 'Shimla', 'Jalandhar', 'Mysuru',
  'Udaipur', 'Varanasi', 'Rajkot', 'Haridwar', 'Rishikesh', 'Mussoorie'
];
const CUISINE_OPTIONS = ['North Indian', 'South Indian', 'Chinese', 'Continental', 'Italian', 'Mexican'];

export default function AdminChefPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    emergencyContact: '',
    email: '',
    gender: '',
    experience: '',
    city: '',
    pincode: '',
    jobPreference: '',
    cuisines: '',
    communicationAddress: '',
    permanentAddress: '',
    bio: '',
    aadhaarNumber: '',
    panNumber: '',
    bankAccountNumber: '',
    ifscCode: '',
    bankName: '',
    upiNumber: '',
    aadhaarFrontUrl: '',
    aadhaarBackUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (event, targetField) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Only JPG, JPEG, PNG or WebP files allowed');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      setError('');
      const token = localStorage.getItem('adminToken');
      const res = await axios.post('/api/admin/upload', uploadData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setForm(prev => ({ ...prev, [targetField]: res.data.url || '' }));
    } catch (err) {
      console.error('Upload failed', err);
      setError('Failed to upload document');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      name: form.name,
      mobile: form.mobile,
      email: form.email,
      bio: form.bio,
      displayStatus: 'Pending',
      profile: {
        emergencyContact: form.emergencyContact,
        gender: form.gender,
        experience: form.experience,
        city: form.city,
        pincode: form.pincode,
        jobPreference: form.jobPreference,
        cuisines: form.cuisines ? form.cuisines.split(',').map(item => item.trim()) : [],
        communicationAddress: form.communicationAddress,
        permanentAddress: form.permanentAddress,
        aadhaarNumber: form.aadhaarNumber,
        panNumber: form.panNumber,
        bankAccountNumber: form.bankAccountNumber,
        ifscCode: form.ifscCode,
        bankName: form.bankName,
        upiNumber: form.upiNumber,
        aadhaarFrontUrl: form.aadhaarFrontUrl,
        aadhaarBackUrl: form.aadhaarBackUrl
      }
    };

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post('/api/admin/chefs', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Save chef error', err);
      setError(err.response?.data?.error || 'Failed to register chef');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-chef-page">
      <AdminSidebar />
      <main className="admin-chef-page__content">
        <div className="page-header">
          <button type="button" className="btn-back" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft size={18} /> Back
          </button>
          <h2>Onboard Chef</h2>
        </div>

        <form className="chef-form" onSubmit={handleSubmit}>
          <section className="chef-form__card">
            <div className="chef-form__section-header">
              <h3>Chef Registration Form</h3>
            </div>

            <div className="chef-form__grid">
              <label className="form-field">
                <span>Full name</span>
                <input
                  name="name"
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="form-field">
                <span>Mobile number</span>
                <input
                  name="mobile"
                  type="tel"
                  placeholder="Mobile number"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="form-field">
                <span>Emergency contact number</span>
                <input
                  name="emergencyContact"
                  type="tel"
                  placeholder="Emergency contact number"
                  value={form.emergencyContact}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span>Enter your email (optional)</span>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email (optional)"
                  value={form.email}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span>Select gender</span>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Work experience</span>
                <select name="experience" value={form.experience} onChange={handleChange}>
                  <option value="">Work experience</option>
                  {EXPERIENCE_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Select city</span>
                <select name="city" value={form.city} onChange={handleChange}>
                  <option value="">Select city</option>
                  {CITY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Enter 6-digit pin code</span>
                <input
                  name="pincode"
                  type="text"
                  placeholder="Enter 6-digit pin code"
                  value={form.pincode}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span>Job Preference</span>
                <select name="jobPreference" value={form.jobPreference} onChange={handleChange}>
                  <option value="">Job Preference</option>
                  {JOB_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Select cuisines</span>
                <input
                  name="cuisines"
                  type="text"
                  placeholder="Select cuisines"
                  value={form.cuisines}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field form-field--full">
                <span>Enter communication address</span>
                <textarea
                  name="communicationAddress"
                  rows="3"
                  placeholder="Enter communication address"
                  value={form.communicationAddress}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field form-field--full">
                <span>Enter permanent address</span>
                <textarea
                  name="permanentAddress"
                  rows="3"
                  placeholder="Enter permanent address"
                  value={form.permanentAddress}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field form-field--full">
                <span>A short bio</span>
                <textarea
                  name="bio"
                  rows="3"
                  placeholder="A short bio"
                  value={form.bio}
                  onChange={handleChange}
                />
              </label>
            </div>
          </section>

          <section className="chef-form__card chef-form__card--secondary">
            <div className="chef-form__section-header">
              <h3>Banking & Compliance</h3>
            </div>

            <div className="chef-form__grid">
              <label className="form-field">
                <span>Aadhaar number</span>
                <input
                  name="aadhaarNumber"
                  type="text"
                  placeholder="Aadhaar number"
                  value={form.aadhaarNumber}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span>PAN number</span>
                <input
                  name="panNumber"
                  type="text"
                  placeholder="PAN number"
                  value={form.panNumber}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span>Bank Account number</span>
                <input
                  name="bankAccountNumber"
                  type="text"
                  placeholder="Bank Account number"
                  value={form.bankAccountNumber}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span>IFSC code</span>
                <input
                  name="ifscCode"
                  type="text"
                  placeholder="IFSC code"
                  value={form.ifscCode}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field form-field--full">
                <span>Bank Name</span>
                <input
                  name="bankName"
                  type="text"
                  placeholder="Bank Name"
                  value={form.bankName}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field form-field--full">
                <span>UPI number</span>
                <input
                  name="upiNumber"
                  type="text"
                  placeholder="UPI number"
                  value={form.upiNumber}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="chef-form__section-heading">Upload documents</div>
            <div className="doc-upload-group">
              <label className="doc-upload">
                <span>Upload Aadhaar Card</span>
                <div className="doc-upload__action">
                  <input
                    id="aadhaarFrontInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpload(e, 'aadhaarFrontUrl')}
                    className="doc-upload__input"
                  />
                  <label htmlFor="aadhaarFrontInput" className="btn-upload">
                    <Upload size={16} /> Upload
                  </label>
                </div>
              </label>

              <label className="doc-upload">
                <span>Upload PAN Card</span>
                <div className="doc-upload__action">
                  <input
                    id="aadhaarBackInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpload(e, 'aadhaarBackUrl')}
                    className="doc-upload__input"
                  />
                  <label htmlFor="aadhaarBackInput" className="btn-upload">
                    <Upload size={16} /> Upload
                  </label>
                </div>
              </label>
            </div>
          </section>

          {error && <div className="form-error">{error}</div>}

          <div className="chef-form__actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/admin/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Registering...' : 'Register Chef'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
