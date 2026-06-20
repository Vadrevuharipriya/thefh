import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAdminCuisine, useCreateAdminCuisine, useUpdateAdminCuisine } from '../../hooks/admin/useAdminCuisine';
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
  const [error, setError] = useState('');

  const { data: cuisineData, isLoading: loadingCuisine } = useAdminCuisine(id);
  const { mutateAsync: createCuisine, isPending: creating } = useCreateAdminCuisine();
  const { mutateAsync: updateCuisine, isPending: updating } = useUpdateAdminCuisine();

  const loading = creating || updating;

  useEffect(() => {
    if (cuisineData) {
      setForm({
        name: cuisineData.name || '',
        shortDescription: cuisineData.shortDescription || '',
        displayStatus: cuisineData.displayStatus || 'Approved'
      });
    }
  }, [cuisineData]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form };

      if (id) {
        await updateCuisine({ id, data: payload });
      } else {
        await createCuisine(payload);
      }
      navigate('/admin/cuisine');
    } catch (err) {
      console.error('Save error:', err);
      const msg = err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to save cuisine';
      setError(msg);
    }
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