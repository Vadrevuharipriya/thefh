import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminCuisineFormPage.scss';

export default function AdminCuisineFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    shortDescription: '',
    displayStatus: 'Approved'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }
    if (id) {
      axios.get(`/api/admin/cuisines/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setForm({
            name: res.data.name || '',
            shortDescription: res.data.shortDescription || '',
            displayStatus: res.data.displayStatus || 'Approved'
          });
        })
        .catch(() => setError('Failed to fetch cuisine'));
    }
  }, [id, navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const payload = { ...form };

      if (id) {
        await axios.put(`/api/admin/cuisines/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/admin/cuisines', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate('/admin/cuisine');
    } catch (err) {
      console.error('Save error:', err);
      const msg = err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to save cuisine';
      setError(msg);
    }
    setLoading(false);
  };

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
    <div className="admin-cuisine-form-container">
      <AdminSidebar />
      <main className="admin-cuisine-form-content">
        <div className="page-header">
          <button onClick={() => navigate('/admin/cuisine')} className="btn-back">
            ← Back
          </button>
          <h2>{id ? 'Edit Cuisine' : 'Add New Cuisine'}</h2>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit} className="cuisine-form">

            {/* Cuisine Name */}
            <div className="form-group">
              <label htmlFor="name">Cuisine Name <span className="required">*</span></label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter cuisine name (e.g., Punjabi, Chinese)"
                required
              />
            </div>

            {/* Short Description */}
            <div className="form-group">
              <label htmlFor="shortDescription">Short Description <span className="required">*</span></label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                placeholder="Brief description of this cuisine"
                rows="3"
                required
              />
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