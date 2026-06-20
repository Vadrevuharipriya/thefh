import { useAdminServices, useUpdateAdminServiceStatus, useDeleteAdminService } from '../../hooks/admin/useAdminServices';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminServicesPage.scss';

export default function AdminServicesPage() {
  const navigate = useNavigate();

  const { data: servicesData, isLoading: loading, isError: fetchError, refetch } = useAdminServices();
  const { mutateAsync: updateStatus } = useUpdateAdminServiceStatus();
  const { mutateAsync: deleteService } = useDeleteAdminService();

  const services = Array.isArray(servicesData) ? servicesData : [];
  const error = fetchError ? 'Failed to fetch services' : '';

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Approved' ? 'Pending' : 'Approved';
    try {
      await updateStatus({ id, status: newStatus });
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteService(id);
      alert('Service deleted successfully');
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Failed to delete service');
    }
  };

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
                <button onClick={() => refetch()} className="btn btn-primary" style={{marginTop: '1rem'}}>Retry</button>
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
