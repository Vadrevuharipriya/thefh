import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAdminMeal, useCreateAdminMeal, useUpdateAdminMeal } from '../../hooks/admin/useAdminMeals';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminMealsFormPage.scss';

export default function AdminMealsFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
   const [form, setForm] = useState({
     name: '',
     shortDescription: '',
     displayStatus: 'Approved',
     isCategory: true // Default to true for meals page (Breakfast/Lunch/Snacks/Dinner)
   });
   const [error, setError] = useState('');

   const { data: mealData } = useAdminMeal(id);
   const { mutateAsync: createMeal, isPending: creating } = useCreateAdminMeal();
   const { mutateAsync: updateMeal, isPending: updating } = useUpdateAdminMeal();

   const loading = creating || updating;

   useEffect(() => {
     if (mealData) {
       setForm({
         name: mealData.name || '',
         shortDescription: mealData.shortDescription || '',
         displayStatus: mealData.displayStatus || 'Approved',
         isCategory: mealData.isCategory || false
       });
     }
   }, [mealData]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form };
      if (id) {
        await updateMeal({ id, data: payload });
      } else {
        // New meals from this page are categories by default
        payload.isCategory = true;
        await createMeal(payload);
      }
      navigate('/admin/meals');
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.error || 'Failed to save meal');
    }
  };

  return (
    <div className="admin-meals-form-container">
      <AdminSidebar />
      <main className="admin-meals-form-content">
        <div className="page-header">
          <button onClick={() => navigate('/admin/meals')} className="btn-back">
            ← Back
          </button>
          <h2>{id ? 'Edit Meal' : 'Add New Meal'}</h2>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit} className="meals-form">
            <div className="form-section">
              <h4>Meal Information</h4>
              
              <div className="form-group">
                <label htmlFor="name">Meal Title <span className="required">*</span></label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter meal name (e.g., Breakfast)"
                  required
                />
              </div>

               <div className="form-group">
                 <label htmlFor="shortDescription">Short Description</label>
                 <textarea
                   id="shortDescription"
                   name="shortDescription"
                   value={form.shortDescription}
                   onChange={handleChange}
                   placeholder="Enter short description"
                   rows="3"
                 />
               </div>

               {/* Meal Category indicator (always true for meals managed here) */}
               {/* <div className="form-group">
                 <label>
                   <input
                     type="checkbox"
                     checked={true}
                     disabled
                     style={{ marginRight: '0.5rem' }}
                   />
                   This is a Meal Category (Breakfast / Lunch / Snacks / Dinner)
                 </label>
                 <small style={{ color: '#666', fontSize: '0.85rem' }}>
                   Meals in this section are used as time-based categories with schedules.
                 </small>
               </div> */}

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
                {loading ? 'Saving...' : (id ? 'Update Meal' : 'Add Meal')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/meals')}
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