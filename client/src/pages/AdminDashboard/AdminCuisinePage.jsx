import { useState } from 'react';
import { useAdminCuisines, useUpdateAdminCuisineStatus } from '../../hooks/admin/useAdminCuisine';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminCuisinePage.scss';

export default function AdminCuisinePage() {
  const { data: cuisinesData, isLoading: loading, isError, refetch } = useAdminCuisines();
  const { mutateAsync: updateStatus } = useUpdateAdminCuisineStatus();

  const cuisines = Array.isArray(cuisinesData) ? cuisinesData : [];

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Approved' ? 'Pending' : 'Approved';
    try {
      await updateStatus({ id, status: newStatus });
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };

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

            {isError && (
              <div className="table-empty">
                <div className="table-empty-icon">⚠️</div>
                <h4>Error loading data</h4>
                <p>Failed to fetch cuisines</p>
                <button onClick={() => refetch()} className="btn btn-primary" style={{marginTop: '1rem'}}>Retry</button>
              </div>
            )}

            {loading && (
              <div className="table-loading">
                <div className="loading-spinner"></div>
                <p>Loading cuisines...</p>
              </div>
            )}

            {!loading && !isError && cuisines.length === 0 && (
              <div className="table-empty">
                <div className="table-empty-icon">📝</div>
                <h4>No cuisines found</h4>
                <p>Add your first cuisine using the button above to get started.</p>
              </div>
            )}

            {!loading && !isError && cuisines.length > 0 && (
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
                          View Items
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