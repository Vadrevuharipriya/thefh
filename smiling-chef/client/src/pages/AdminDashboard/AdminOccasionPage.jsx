import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminOccasionPage.scss';

export default function AdminOccasionPage() {
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const getDisplayStatus = (status) => {
    return status === 'Approved' ? 'Enabled' : 'Disabled';
  };

  const fetchOccasions = async () => {
    setLoading(true);
    setError('');
    try {

      const res = await axios.get('/api/admin/occasions', {
      });
      setOccasions(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else {
        setError('Failed to fetch occasions. Please ensure the server is running.');
      }
    }
    setLoading(false);
  };

   const handleStatusChange = async (id, currentStatus) => {
     const dbStatus = currentStatus === 'Enabled' ? 'Approved' : 'Pending';
     const newDbStatus = dbStatus === 'Approved' ? 'Pending' : 'Approved';

     try {
       await axios.put(`/api/admin/occasions/${id}`, { displayStatus: newDbStatus }, {
       });
       setOccasions(occasions.map(o =>
         o._id === id ? { ...o, displayStatus: newDbStatus } : o
       ));
     } catch (err) {
       console.error('Failed to update status:', err);
       alert('Failed to update status');
     }
   };

   const handleDelete = async (id, name) => {
     if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
     try {
       await axios.delete(`/api/admin/occasions/${id}`, {
       });
       setOccasions(occasions.filter(o => o._id !== id));
       alert('Deleted successfully');
     } catch (err) {
       console.error('Failed to delete:', err);
       alert('Failed to delete occasion');
     }
   };

  const handleViewImage = (imageUrl, occasionName) => {
    if (!imageUrl) {
      setSelectedImage({ 
        url: 'https://picsum.photos/400/300?text=No+Image+Available', 
        name: `${occasionName} (No Image)` 
      });
    } else {
      setSelectedImage({ url: imageUrl, name: occasionName });
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {

    fetchOccasions();
  }, [navigate]);

  return (
    <div className="admin-occasion-page-container">
      <AdminSidebar />
      <main className="admin-occasion-page-content">
        <div className="page-header">
        </div>

        <div className="content-wrapper">
          <div className="table-card">
            <div className="table-header">
              <h3>Current Occasions</h3>
              <div className="page-header-inner">
            <Link to="/admin/occasion/new" className="btn btn-primary btn-add">Add New</Link>
          </div>
          {/* <Link to="/admin/occasion/new" className="btn btn-primary btn-add">Add New</Link> */}
            </div>

            {error && (
              <div className="table-empty">
                <div className="table-empty-icon">⚠️</div>
                <h4>Error loading data</h4>
                <p>{error}</p>
                <button onClick={fetchOccasions} className="btn btn-primary" style={{marginTop: '1rem'}}>Retry</button>
              </div>
            )}

            {loading && (
              <div className="table-loading">
                <div className="loading-spinner"></div>
                <p>Loading occasions...</p>
              </div>
            )}

            {!loading && !error && occasions.length === 0 && (
              <div className="table-empty">
                <div className="table-empty-icon">📝</div>
                <h4>No occasions found</h4>
                <p>Add your first occasion using the form above to get started.</p>
              </div>
            )}

            {!loading && occasions.length > 0 && (
               <table className="occasion-table">
                 <thead>
                   <tr>
                     <th>Slno</th>
                     <th>Occasions Name</th>
                     <th>Page URL</th>
                     <th>Meta Title</th>
                     <th>Starting Price</th>
                     <th>Price Enabled</th>
                     <th>Display Status</th>
                     <th>Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {occasions.map((o, i) => (
                     <tr key={o._id}>
                       <td>{i + 1}</td>
                       <td>{o.name}</td>
                       <td>{o.pageUrl}</td>
                       <td>{o.metaTitle || '-'}</td>
                       <td>{o.startingPrice || '-'}</td>
                       <td>
                         <span className={`status-badge ${o.pricingEnabled ? 'status-enabled' : 'status-disabled'}`}>
                           {o.pricingEnabled ? 'Enabled' : 'Disabled'}
                         </span>
                       </td>
                       <td>
                         <span className={`status-badge ${o.displayStatus === 'Approved' ? 'status-approved' : 'status-pending'}`}>
                           {getDisplayStatus(o.displayStatus)}
                         </span>
                       </td>
                       <td className="table-actions">
                         <button
                           onClick={() => handleStatusChange(o._id, getDisplayStatus(o.displayStatus))}
                           className={`btn-action ${o.displayStatus === 'Approved' ? 'btn-warning' : 'btn-success'}`}
                         >
                           {o.displayStatus === 'Approved' ? 'Disable' : 'Enable'}
                         </button>
                         <button
                           onClick={() => handleViewImage(o.image, o.name)}
                           className="btn-action btn-view"
                         >
                           View
                         </button>
                         <Link to={`/admin/occasion/edit/${o._id}`} className="btn-action btn-edit">
                           Edit
                         </Link>
                         <button
                           onClick={() => handleDelete(o._id, o.name)}
                           className="btn-action btn-delete"
                           title="Delete occasion"
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
        {selectedImage && (
          <div className="admin-image-modal-overlay" onClick={closeModal}>
            <div className="admin-image-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="admin-image-modal-close" onClick={closeModal}>&times;</button>
              <h3>{selectedImage.name}</h3>
              <img 
                src={selectedImage.url} 
                alt={selectedImage.name} 
                onError={(e) => { 
                  e.target.src = 'https://picsum.photos/400/300?text=No+Image+Available'; 
                }} 
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
