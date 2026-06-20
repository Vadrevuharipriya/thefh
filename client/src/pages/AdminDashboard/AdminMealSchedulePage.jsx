import { useAdminSchedules, useUpdateAdminScheduleStatus, useDeleteAdminSchedule } from '../../hooks/admin/useAdminSchedules';
import { useAdminMeal } from '../../hooks/admin/useAdminMeals';
import { Link, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { Trash2 } from 'lucide-react';
import './AdminMealSchedulePage.scss';

export default function AdminMealSchedulePage() {
  const { mealId } = useParams();
  const { data: meal, isLoading: loadingMeal, isError: mealError } = useAdminMeal(mealId);
  const { data: schedulesData, isLoading: loadingSchedules, isError: schedulesError, refetch } = useAdminSchedules(mealId);

  const { mutateAsync: updateStatus } = useUpdateAdminScheduleStatus();
  const { mutateAsync: deleteSchedule } = useDeleteAdminSchedule();

  const schedules = Array.isArray(schedulesData) ? schedulesData : [];
  const loading = loadingMeal || loadingSchedules;
  const error = mealError || schedulesError ? 'Failed to fetch schedules' : '';

   const handleStatusChange = async (id, currentStatus) => {
     const newStatus = currentStatus === 'Approved' ? 'Pending' : 'Approved';
     try {
       await updateStatus({ id, status: newStatus });
     } catch (err) {
       console.error('Failed to update status:', err);
       alert('Failed to update status');
     }
   };

   const handleDelete = async (id, scheduleTime) => {
     if (!window.confirm(`Are you sure you want to delete the "${scheduleTime}" schedule?`)) return;
     try {
       await deleteSchedule(id);
       alert('Schedule deleted successfully');
     } catch (err) {
       console.error('Failed to delete:', err);
       alert('Failed to delete schedule');
     }
   };

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
                <button onClick={() => refetch()} className="btn btn-primary" style={{marginTop: '1rem'}}>Retry</button>
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