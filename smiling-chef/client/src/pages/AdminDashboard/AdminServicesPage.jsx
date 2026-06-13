import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminServicesPage.scss';

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

   const fetchServices = async () => {
     setLoading(true);
     setError('');
     try {
       const token = localStorage.getItem('adminToken');
       console.log('[Services] Token:', token ? 'present' : 'MISSING');
       if (!token) {
         setError('Not authenticated. Please login again.');
         setLoading(false);
         return;
       }
       const res = await axios.get('/api/admin/services', {
         headers: { Authorization: `Bearer ${token}` }
       });
       console.log('[Services] Fetched:', res.data.length, 'services');
       setServices(res.data);
     } catch (err) {
       console.error('[Services] Fetch error:', err);
       const status = err.response?.status;
       const data = err.response?.data;
       const msg = data?.error || `Request failed with status ${status}`;
       setError(`Failed to fetch services: ${msg}`);
     }
     setLoading(false);
   };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Approved' ? 'Pending' : 'Approved';
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`/api/admin/services/${id}`, { displayStatus: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(services.map(s =>
        s._id === id ? { ...s, displayStatus: newStatus } : s
      ));
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await axios.delete(`/api/admin/services/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setServices(services.filter(s => s._id !== id));
      alert('Service deleted successfully');
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Failed to delete service');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="admin-services-page-container">
      <AdminSidebar />
      <main className="admin-services-page-content">
        <div className="page-header">
          <h2>Manage Service Categories</h2>
        </div>

        <div className="content-wrapper">
          <div className="table-card">
            <div className="table-header">
              <h3>Service Categories List</h3>
              <Link to="/admin/services/new" className="btn btn-primary btn-add">Add New</Link>
            </div>

            {error && (
              <div className="table-empty">
                <div className="table-empty-icon">⚠️</div>
                <h4>Error loading data</h4>
                <p>{error}</p>
                <button onClick={fetchServices} className="btn btn-primary" style={{marginTop: '1rem'}}>Retry</button>
              </div>
            )}

            {loading && (
              <div className="table-loading">
                <div className="loading-spinner"></div>
                <p>Loading services...</p>
              </div>
            )}

            {!loading && !error && services.length === 0 && (
              <div className="table-empty">
                <div className="table-empty-icon">📝</div>
                <h4>No services found</h4>
                <p>Add your first service category to get started.</p>
              </div>
            )}

            {!loading && services.length > 0 && (
              <table className="services-table">
                <thead>
                  <tr>
                    <th>Slno</th>
                    <th>Category Name</th>
                    <th>Meta Title</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s, i) => (
                    <tr key={s._id}>
                      <td>{i + 1}</td>
                      <td>{s.name}</td>
                      <td>{s.metaTitle || '-'}</td>
                      <td className="table-actions">
                        <button
                          onClick={() => handleStatusChange(s._id, s.displayStatus)}
                          className={`btn-action ${s.displayStatus === 'Approved' ? 'btn-warning' : 'btn-success'}`}
                        >
                          {s.displayStatus === 'Approved' ? 'Disable' : 'Enable'}
                        </button>
                        <Link to={`/admin/services/view/${s._id}`} className="btn-action btn-view">
                          View
                        </Link>
                        <Link to={`/admin/services/edit/${s._id}`} className="btn-action btn-edit">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(s._id, s.name)}
                          className="btn-action btn-delete"
                          title="Delete service"
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
