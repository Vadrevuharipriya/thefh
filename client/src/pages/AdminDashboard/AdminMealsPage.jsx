import { useAdminMealsCategories, useDeleteAdminMeal, useUpdateAdminMealStatus } from '../../hooks/admin/useAdminMeals';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminMealsPage.scss';

export default function AdminMealsPage() {
  const navigate = useNavigate();

  const { data: mealsData, isLoading: loading, isError: fetchError, refetch } = useAdminMealsCategories();
  const { mutateAsync: deleteMeal } = useDeleteAdminMeal();
  const { mutateAsync: updateStatus } = useUpdateAdminMealStatus();

  const meals = Array.isArray(mealsData) ? mealsData : [];

  const error = fetchError ? 'Failed to fetch meals. Please ensure the server is running.' : '';

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This will also delete all its schedules.`)) return;
    try {
      await deleteMeal(id);
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
     if (!id) {
       alert('Error: Meal ID is missing');
       return;
     }
     const newStatus = currentStatus === 'Approved' ? 'Pending' : 'Approved';
     
     try {
       await updateStatus({ id, status: newStatus });
     } catch (err) {
       console.error('[Status Change] Full error object:', err);
       const data = err.response?.data;
       let msg = 'Failed to update status';
       if (data?.error) msg = data.error;
       if (data?.details) msg += ' - ' + data.details;
       alert(msg);
     }
   };

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
                <button onClick={() => refetch()} className="btn btn-primary" style={{marginTop: '1rem'}}>Retry</button>
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