import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { Trash2 } from 'lucide-react';
import './AdminMealSchedulePage.scss';

export default function AdminMealSchedulePage() {
  const { mealId } = useParams();
  const [schedules, setSchedules] = useState([]);
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSchedules = async () => {
    setLoading(true);
    setError('');
    try {
      const [schedRes, mealRes] = await Promise.all([
        axios.get(`/api/meals/${mealId}/schedules`),
        axios.get(`/api/meals/${mealId}`)
      ]);
      setSchedules(schedRes.data);
      setMeal(mealRes.data);
    } catch (err) {
      setError('Failed to fetch schedules');
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

   const handleStatusChange = async (id, currentStatus) => {
     const newStatus = currentStatus === 'Approved' ? 'Pending' : 'Approved';
     try {
       await axios.put(`/api/admin/schedules/${id}`, { displayStatus: newStatus }, {
       });
       setSchedules(schedules.map(s =>
         s._id === id ? { ...s, displayStatus: newStatus } : s
       ));
     } catch (err) {
       console.error('Failed to update status:', err);
       alert('Failed to update status');
     }
   };

   const handleDelete = async (id, scheduleTime) => {
     if (!confirm(`Are you sure you want to delete the "${scheduleTime}" schedule?`)) return;
     try {
       await axios.delete(`/api/admin/schedules/${id}`, {
       });
       setSchedules(schedules.filter(s => s._id !== id));
       alert('Schedule deleted successfully');
     } catch (err) {
       console.error('Failed to delete:', err);
       alert('Failed to delete schedule');
     }
   };

  useEffect(() => {
    fetchSchedules();
  }, [mealId]);

   return (
     <div className="admin-meal-schedule-page-container">
       <AdminSidebar />
       <main className="admin-meal-schedule-page-content">
         <div className="page-header">
           <Link to="/admin/meals" className="btn-back">← Back</Link>
           <h2>{meal?.name || 'Meal'} Schedules</h2>
         </div>

        <div className="content-wrapper">
          <div className="table-card">
            <div className="table-header">
              <h3>Schedule List</h3>
              <Link to={`/admin/meals/${mealId}/schedule/new`} className="btn btn-primary btn-add">Add Schedule</Link>
            </div>

            {error && (
              <div className="table-empty">
                <div className="table-empty-icon">⚠️</div>
                <h4>Error loading data</h4>
                <p>{error}</p>
                <button onClick={fetchSchedules} className="btn btn-primary" style={{marginTop: '1rem'}}>Retry</button>
              </div>
            )}

            {loading && (
              <div className="table-loading">
                <div className="loading-spinner"></div>
                <p>Loading schedules...</p>
              </div>
            )}

            {!loading && !error && schedules.length === 0 && (
              <div className="table-empty">
                <div className="table-empty-icon">📝</div>
                <h4>No schedules found</h4>
                <p>Add your first schedule using the button above to get started.</p>
              </div>
            )}

            {!loading && schedules.length > 0 && (
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Option</th>
                    <th>Schedule Time</th>
                    <th>Display Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((s, i) => (
                    <tr key={s._id}>
                      <td>{i + 1}</td>
                      <td>{s.scheduleTime}</td>
                      <td>{s.displayStatus}</td>
                       <td className="table-actions">
                         <button
                           onClick={() => handleStatusChange(s._id, s.displayStatus)}
                           className={`btn-action ${s.displayStatus === 'Approved' ? 'btn-warning' : 'btn-success'}`}
                         >
                           {s.displayStatus === 'Approved' ? 'Unapprove' : 'Approve'}
                         </button>
                         <Link to={`/admin/meals/${mealId}/schedule/edit/${s._id}`} className="btn-action btn-edit">
                           Edit
                         </Link>
                         <button
                           onClick={() => handleDelete(s._id, s.scheduleTime)}
                           className="btn-action btn-delete"
                           title="Delete schedule"
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