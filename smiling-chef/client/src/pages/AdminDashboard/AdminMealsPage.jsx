import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminMealsPage.scss';

export default function AdminMealsPage() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchMeals = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Not authenticated. Please login again.');
        setLoading(false);
        return;
      }
      // Fetch only category meals (Breakfast, Lunch, Snacks, Dinner)
      const res = await axios.get('/api/admin/meals/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeals(res.data);
    } catch (err) {
      setError('Failed to fetch meals. Please ensure the server is running.');
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

   const handleDelete = async (id, name) => {
     if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all its schedules.`)) return;
     try {
       const token = localStorage.getItem('adminToken');
       if (!token) {
         alert('Session expired. Please login again.');
         navigate('/admin/login');
         return;
       }
       await axios.delete(`/api/admin/meals/${id}`, {
         headers: { Authorization: `Bearer ${token}` }
       });
       setMeals(meals.filter(m => m._id !== id));
       alert('Meal deleted successfully');
     } catch (err) {
       console.error('Failed to delete:', err);
       const msg = err.response?.data?.error || 'Failed to delete meal';
       alert(msg);
     }
   };

    const handleViewSchedules = (mealId, mealName) => {
      navigate(`/admin/meals/${mealId}/schedule`);
    };

   const handleStatusChange = async (id, currentStatus) => {
     // Validation
     if (!id) {
       console.error('No meal ID provided');
       alert('Error: Meal ID is missing');
       return;
     }
     const newStatus = currentStatus === 'Approved' ? 'Pending' : 'Approved';
     console.log(`[Status Change] Meal ID: ${id}, Current: ${currentStatus}, New: ${newStatus}`);
     
     try {
       const token = localStorage.getItem('adminToken');
       console.log('[Status Change] Token:', token ? 'present' : 'MISSING');
       if (!token) {
         alert('Session expired. Please login again.');
         navigate('/admin/login');
         return;
       }
       
       const url = `/api/admin/meals/${id}`;
       console.log('[Status Change] PUT', url, { displayStatus: newStatus });
       
       const response = await axios.put(url, { displayStatus: newStatus }, {
         headers: { 
           Authorization: `Bearer ${token}`,
           'Content-Type': 'application/json'
         }
       });
       
       console.log('[Status Change] Success:', response.data);
       setMeals(meals.map(m =>
         m._id === id ? { ...m, displayStatus: newStatus } : m
       ));
     } catch (err) {
       console.error('[Status Change] Full error object:', err);
       const statusCode = err.response?.status;
       const data = err.response?.data;
       console.error('[Status Change] Response status:', statusCode);
       console.error('[Status Change] Response data:', data);
       
       let msg = 'Failed to update status';
       if (data?.error) msg = data.error;
       if (data?.details) msg += ' - ' + data.details;
       alert(msg);
     }
   };

    useEffect(() => {
      fetchMeals();
    }, []);

  return (
    <div className="admin-meals-page-container">
      <AdminSidebar />
      <main className="admin-meals-page-content">
        <div className="page-header">
          <h2>Manage Meals</h2>
        </div>

        <div className="content-wrapper">
          <div className="table-card">
            <div className="table-header">
              <h3>Meals List</h3>
              <Link to="/admin/meals/new" className="btn btn-primary btn-add">Add New</Link>
            </div>

            {error && (
              <div className="table-empty">
                <div className="table-empty-icon">⚠️</div>
                <h4>Error loading data</h4>
                <p>{error}</p>
                <button onClick={fetchMeals} className="btn btn-primary" style={{marginTop: '1rem'}}>Retry</button>
              </div>
            )}

            {loading && (
              <div className="table-loading">
                <div className="loading-spinner"></div>
                <p>Loading meals...</p>
              </div>
            )}

             {!loading && !error && meals.length === 0 && (
               <div className="table-empty">
                 <div className="table-empty-icon">📝</div>
                 <h4>No meals found</h4>
                 <p>Add your first meal category (Breakfast, Lunch, Snacks, Dinner) to get started.</p>
               </div>
             )}

             {!loading && meals.length > 0 && (
               <table className="meals-table">
                 <thead>
                   <tr>
                     <th>Option</th>
                     <th>Meal Title</th>
                     <th>Short Description</th>
                     <th>Display Status</th>
                     <th>Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {meals.map((m, i) => (
                     <tr key={m._id}>
                       <td>{i + 1}</td>
                       <td>{m.name}</td>
                       <td>{m.shortDescription || '-'}</td>
                       <td>
                         <span className={`status-badge ${m.displayStatus === 'Approved' ? 'status-approved' : 'status-pending'}`}>
                           {m.displayStatus}
                         </span>
                       </td>
                       <td className="table-actions">
                         <button
                           onClick={() => handleStatusChange(m._id, m.displayStatus)}
                           className={`btn-action ${m.displayStatus === 'Approved' ? 'btn-warning' : 'btn-success'}`}
                         >
                           {m.displayStatus === 'Approved' ? 'Disable' : 'Enable'}
                         </button>
                         <button
                           onClick={() => handleViewSchedules(m._id, m.name)}
                           className="btn-action btn-view"
                         >
                           Schedules
                         </button>
                         <Link to={`/admin/meals/edit/${m._id}`} className="btn-action btn-edit">
                           Edit
                         </Link>
                         <button
                           onClick={() => handleDelete(m._id, m.name)}
                           className="btn-action btn-delete"
                           title="Delete meal"
                         >
                           🗑️
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}