import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminCuisinePage.scss';

export default function AdminCuisinePage() {
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

   const fetchCuisines = async () => {
     setLoading(true);
     setError('');
     try {
       const token = localStorage.getItem('adminToken');
       if (!token) {
         setError('Not authenticated. Please login again.');
         setLoading(false);
         return;
       }
       const res = await axios.get('/api/admin/cuisines', {
         headers: { Authorization: `Bearer ${token}` }
       });
       setCuisines(res.data);
     } catch (err) {
       setError('Failed to fetch cuisines');
       console.error('Fetch error:', err);
     }
     setLoading(false);
   };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Approved' ? 'Pending' : 'Approved';
    try {
      await axios.put(`/api/admin/cuisines/${id}`, { displayStatus: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setCuisines(cuisines.map(c => 
        c._id === id ? { ...c, displayStatus: newStatus } : c
      ));
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };

  useEffect(() => {
    fetchCuisines();
  }, []);

  return (
    <div className="admin-cuisine-page-container">
      <AdminSidebar />
      <main className="admin-cuisine-page-content">
        <div className="page-header">
          <h2>Manage Cuisine</h2>
        </div>

        <div className="content-wrapper">
          <div className="table-card">
            <div className="table-header">
              <h3>Cuisine List</h3>
              <Link to="/admin/cuisine/new" className="btn btn-primary btn-add">Add New</Link>
            </div>

            {error && (
              <div className="table-empty">
                <div className="table-empty-icon">⚠️</div>
                <h4>Error loading data</h4>
                <p>{error}</p>
                <button onClick={fetchCuisines} className="btn btn-primary" style={{marginTop: '1rem'}}>Retry</button>
              </div>
            )}

            {loading && (
              <div className="table-loading">
                <div className="loading-spinner"></div>
                <p>Loading cuisines...</p>
              </div>
            )}

            {!loading && !error && cuisines.length === 0 && (
              <div className="table-empty">
                <div className="table-empty-icon">📝</div>
                <h4>No cuisines found</h4>
                <p>Add your first cuisine using the button above to get started.</p>
              </div>
            )}

            {!loading && cuisines.length > 0 && (
              <table className="cuisine-table">
                <thead>
                  <tr>
                    <th>Option</th>
                    <th>Cuisine Title</th>
                    <th>No of Menu</th>
                    <th>Short Description</th>
                    <th>Display Status</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cuisines.map((c, i) => (
                    <tr key={c._id}>
                      <td>{i + 1}</td>
                      <td>{c.name}</td>
                      <td>{c.menuCount || 0}</td>
                      <td>{c.shortDescription || '-'}</td>
                      <td>{c.displayStatus}</td>
                      <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="table-actions">
                        <button 
                          onClick={() => handleStatusChange(c._id, c.displayStatus)}
                          className={`btn-action ${c.displayStatus === 'Approved' ? 'btn-warning' : 'btn-success'}`}
                        >
                          {c.displayStatus === 'Approved' ? 'Unapprove' : 'Approve'}
                        </button>
                        <Link to={`/admin/cuisine/${c._id}/menu`} className="btn-action btn-view">
                          View Menu Item
                        </Link>
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