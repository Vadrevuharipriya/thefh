import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { Trash2 } from 'lucide-react';
import './AdminMealScheduleFormPage.scss';

const TIME_OPTIONS = [
  '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
  '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM'
];

export default function AdminMealScheduleFormPage() {
  const { mealId, scheduleId } = useParams();
  const navigate = useNavigate();
  const [mealName, setMealName] = useState('');
  const [form, setForm] = useState({
    scheduleTime: '',
    displayStatus: 'Approved'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingMeal, setLoadingMeal] = useState(true);

  // Fetch meal name for display
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const res = await axios.get(`/api/meals/${mealId}`);
        setMealName(res.data.name || '');
      } catch (err) {
        console.error('Failed to fetch meal:', err);
        setError('Failed to load meal details.');
      } finally {
        setLoadingMeal(false);
      }
    };
    fetchMeal();
  }, [mealId]);

  // Fetch existing schedule if editing
  useEffect(() => {
    if (scheduleId) {
      axios.get(`/api/schedules/${scheduleId}`)
        .then(res => {
          setForm({
            scheduleTime: res.data.scheduleTime || '',
            displayStatus: res.data.displayStatus || 'Approved'
          });
        })
        .catch(() => setError('Failed to fetch schedule'));
    }
  }, [scheduleId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...form, meal: mealId };
      if (scheduleId) {
        await axios.put(`/api/admin/schedules/${scheduleId}`, payload, {
        });
      } else {
        await axios.post('/api/admin/schedules', payload, {
        });
      }
      navigate(`/admin/meals/${mealId}/schedule`);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.error || 'Failed to save schedule');
    }
    setLoading(false);
  };

  if (loadingMeal) {
    return (
      <div className="admin-meal-schedule-form-container">
        <AdminSidebar />
        <main className="admin-meal-schedule-form-content">
          <div className="page-header">
            <button onClick={() => navigate(`/admin/meals/${mealId}/schedule`)} className="btn-back">← Back</button>
            <h2>{scheduleId ? 'Edit Schedule' : 'Add New Schedule'}</h2>
          </div>
          <div className="form-card"><p>Loading meal...</p></div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-meal-schedule-form-container">
      <AdminSidebar />
      <main className="admin-meal-schedule-form-content">
        <div className="page-header">
          <button onClick={() => navigate(`/admin/meals/${mealId}/schedule`)} className="btn-back">
            ← Back
          </button>
          <h2>{scheduleId ? 'Edit Schedule' : 'Add New Schedule'}</h2>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit} className="meal-schedule-form">
            <div className="form-section">
              <h4>Schedule Information</h4>

              {/* Meal Name (display only) */}
              <div className="form-group">
                <label>Meal Name <span className="required">*</span></label>
                <div className="readonly-field">{mealName || 'Unknown Meal'}</div>
              </div>

              {/* Schedule Time */}
              <div className="form-group">
                <label htmlFor="scheduleTime">Schedule Time <span className="required">*</span></label>
                <select
                  id="scheduleTime"
                  name="scheduleTime"
                  value={form.scheduleTime}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Time</option>
                  {TIME_OPTIONS.map(t => (
                    <option key={t} value={t}>{t} onwards</option>
                  ))}
                </select>
              </div>

              {/* Display Status */}
              <div className="form-group">
                <label htmlFor="displayStatus">Display Status</label>
                <select
                  id="displayStatus"
                  name="displayStatus"
                  value={form.displayStatus}
                  onChange={handleChange}
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="form-footer">
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Saving...' : (scheduleId ? 'Update Schedule' : 'Add Schedule')}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/admin/meals/${mealId}/schedule`)}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>

          {error && <div className="alert-error">{error}</div>}
        </div>
      </main>
    </div>
  );
}
