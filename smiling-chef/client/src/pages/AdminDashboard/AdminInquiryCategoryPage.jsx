import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Search, Trash2, Eye, X, MapPin } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminEnquiriesPage.scss';

export default function AdminInquiryCategoryPage({ category }) {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);

  const itemsPerPage = 20;
  const categoryLabels = {
    halwai: 'Halwai/Chef/Caterers',
    general: 'General Inquiry',
    tiffin: 'Tiffin Services Inquiry',
    venue: 'Venue Inquiry'
  };

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      console.log('[AdminInquiryCategoryPage] Fetching inquiries for category:', category);
      console.log('[AdminInquiryCategoryPage] Token present:', !!token);
      const res = await fetch(`/api/inquiries/category/${category}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('[AdminInquiryCategoryPage] Response status:', res.status);
      const data = await res.json();
      console.log('[AdminInquiryCategoryPage] Response data:', JSON.stringify(data));
      if (res.ok) {
        // Handle both array response and wrapped { inquiries: [...] } response
        setInquiries(Array.isArray(data) ? data : (data.inquiries || []));
      } else {
        console.error('[AdminInquiryCategoryPage] API error:', data);
      }
    } catch (err) {
      console.error('[AdminInquiryCategoryPage] Failed to fetch inquiries:', err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('[AdminInquiryCategoryPage] Delete response status:', res.status);
      if (res.ok) {
        setInquiries(inquiries.filter(i => i._id !== id));
      } else {
        console.error('[AdminInquiryCategoryPage] Delete failed:', await res.json());
      }
    } catch (err) {
      console.error('[AdminInquiryCategoryPage] Failed to delete inquiry:', err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setUpdateStatusLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/enquiries/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      console.log('[AdminInquiryCategoryPage] Status update response status:', res.status);
      if (res.ok) {
        setInquiries(inquiries.map(i => i._id === id ? { ...i, status } : i));
      } else {
        console.error('[AdminInquiryCategoryPage] Status update failed:', await res.json());
      }
    } catch (err) {
      console.error('[AdminInquiryCategoryPage] Failed to update status:', err);
    } finally {
      setUpdateStatusLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter(i => {
    const matchesSearch = !search || 
      (i.name && i.name.toLowerCase().includes(search.toLowerCase())) ||
      (i.email && i.email.toLowerCase().includes(search.toLowerCase())) ||
      (i.phone && i.phone.includes(search));
    
    const matchesStatus = !statusFilter || i.status === statusFilter;
    
    const matchesDate = !dateFilter || 
      (i.createdAt && new Date(i.createdAt).toISOString().split('T')[0] === dateFilter);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderInquiryDetails = (inquiry) => {
    const fields = [
      { label: 'Name', value: inquiry.name },
      { label: 'Mobile', value: inquiry.phone || inquiry.mobile },
      { label: 'Email', value: inquiry.email },
      { label: 'Location', value: inquiry.location },
      { label: 'Event/Plan', value: inquiry.event || inquiry.service },
      { label: 'Event Date', value: inquiry.date || inquiry.eventDate },
      { label: 'People', value: inquiry.people },
      { label: 'Message', value: inquiry.message || inquiry.mealDetails },
      { label: 'Budget', value: inquiry.budget },
      { label: 'Query Type', value: inquiry.queryType }
    ];
    
    return fields
      .filter(f => f.value)
      .map(f => (
        <div key={f.label} className="detail-row">
          <span className="detail-label">{f.label}:</span>
          <span className="detail-value">{f.value}</span>
        </div>
      ));
  };

  return (
    <div className="admin-enquiries">
      <AdminSidebar />
      <main className="admin-enquiries__main">
        <header className="admin-enquiries__header">
          <h1>{categoryLabels[category]}</h1>
          <span className="badge-count">{filteredInquiries.length} inquiries</span>
        </header>

        <div className="admin-enquiries__filters">
          <div className="admin-enquiries__search">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search inquiries..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="filter-tab"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <input 
            type="date" 
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
            className="filter-tab"
          />
        </div>

        <div className="admin-enquiries__table-container">
          <table className="admin-enquiries__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Details</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="loading">Loading...</td></tr>
              ) : paginatedInquiries.length === 0 ? (
                <tr><td colSpan="6" className="empty-state">No inquiries found</td></tr>
              ) : (
                paginatedInquiries.map(i => (
                  <tr key={i._id}>
                    <td>{i.name}</td>
                    <td>
                      <div><a href={`tel:${i.phone || i.mobile}`} className="phone-link">{i.phone || i.mobile}</a></div>
                      <a href={`mailto:${i.email}`} className="email-link">{i.email}</a>
                    </td>
                    <td>
                      <div>{i.event || i.service || i.message?.substring(0, 30)}...</div>
                      {i.location && <span className="location-badge"><MapPin size={12} /> {i.location}</span>}
                    </td>
                    <td>{new Date(i.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select 
                        value={i.status || 'new'}
                        onChange={(e) => handleStatusUpdate(i._id, e.target.value)}
                        disabled={updateStatusLoading}
                      >
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td>
                      <div className="actions">
                        <button onClick={() => setSelectedInquiry(i)} title="View Details">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleDelete(i._id)} className="btn-delete" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={page === currentPage ? 'filter-tab--active' : 'filter-tab'}
                style={{ padding: '0.5rem 1rem' }}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </main>

      {selectedInquiry && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: 'white', borderRadius: '12px', padding: '1.5rem',
            maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Inquiry Details</h3>
              <button onClick={() => setSelectedInquiry(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div>{renderInquiryDetails(selectedInquiry)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

AdminInquiryCategoryPage.propTypes = {
  category: PropTypes.string.isRequired
};