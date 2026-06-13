import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trash2, Eye, X, MapPin } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminEnquiriesPage.scss';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [counts, setCounts] = useState({ halwai: 0, general: 0, tiffin: 0, venue: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);

  const itemsPerPage = 20;

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      console.log('[AdminEnquiriesPage] Fetching all enquiries');
      console.log('[AdminEnquiriesPage] Token present:', !!token);
      const res = await fetch('/api/enquiries', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('[AdminEnquiriesPage] Response status:', res.status);
      const data = await res.json();
      console.log('[AdminEnquiriesPage] Response data:', JSON.stringify(data));
      if (res.ok) {
        setEnquiries(Array.isArray(data) ? data : (data.inquiries || []));
      } else {
        console.error('[AdminEnquiriesPage] API error:', data);
      }
    } catch (err) {
      console.error('[AdminEnquiriesPage] Failed to fetch inquiries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCounts = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      console.log('[AdminEnquiriesPage] Fetching inquiry counts');
      console.log('[AdminEnquiriesPage] Token present:', !!token);
      const res = await fetch('/api/inquiries/counts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('[AdminEnquiriesPage] Counts response status:', res.status);
      const data = await res.json();
      console.log('[AdminEnquiriesPage] Counts response data:', JSON.stringify(data));
      if (res.ok) {
        setCounts(data);
      } else {
        console.error('[AdminEnquiriesPage] Counts API error:', data);
      }
    } catch (err) {
      console.error('[AdminEnquiriesPage] Failed to fetch counts:', err);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
    fetchCounts();
  }, [fetchInquiries, fetchCounts]);

const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('[AdminEnquiriesPage] Delete response status:', res.status);
      if (res.ok) {
        setEnquiries(enquiries.filter(i => i._id !== id));
      } else {
        console.error('[AdminEnquiriesPage] Delete failed:', await res.json());
      }
    } catch (err) {
      console.error('[AdminEnquiriesPage] Failed to delete inquiry:', err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setUpdateStatusLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/enquiries/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      console.log('[AdminEnquiriesPage] Status update response status:', res.status);
      if (res.ok) {
        setEnquiries(enquiries.map(i => i._id === id ? { ...i, status } : i));
      } else {
        console.error('[AdminEnquiriesPage] Status update failed:', await res.json());
      }
    } catch (err) {
      console.error('[AdminEnquiriesPage] Failed to update status:', err);
    } finally {
      setUpdateStatusLoading(false);
    }
  };

  const filteredInquiries = enquiries.filter(i => {
    // Exclude order-category inquiries — they belong in Order Inquiry tabs
    const isOrderInquiry = i.orderCategory && i.orderCategory !== '';
    const matchesSearch = !search ||
      (i.name && i.name.toLowerCase().includes(search.toLowerCase())) ||
      (i.email && i.email.toLowerCase().includes(search.toLowerCase())) ||
      (i.phone && i.phone.includes(search));

    const matchesStatus = !statusFilter || i.status === statusFilter;

    const matchesDate = !dateFilter ||
      (i.createdAt && new Date(i.createdAt).toISOString().split('T')[0] === dateFilter);

    return !isOrderInquiry && matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCategoryLabel = (type) => {
    const map = { 'halwai-chef-caterers': 'Halwai/Chef/Caterers', 'general': 'General', 'tiffin-services': 'Tiffin', 'venue': 'Venue' };
    return map[type] || type;
  };

  const renderInquiryDetails = (inquiry) => {
    const fields = [
      { label: 'Name', value: inquiry.name },
      { label: 'Mobile', value: inquiry.phone || inquiry.mobile },
      { label: 'Email', value: inquiry.email },
      { label: 'Location', value: inquiry.location },
      { label: 'Event/Plan', value: inquiry.service },
      { label: 'Date', value: inquiry.date },
      { label: 'Message', value: inquiry.message }
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
          <h1>All Inquiries</h1>
          <span className="badge-count">{filteredInquiries.length} total</span>
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

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Link to="/admin/inquiries/halwai" className="filter-tab" style={{ textDecoration: 'none' }}>
            Halwai ({counts.halwai})
          </Link>
          <Link to="/admin/inquiries/general" className="filter-tab" style={{ textDecoration: 'none' }}>
            General ({counts.general})
          </Link>
          <Link to="/admin/inquiries/tiffin" className="filter-tab" style={{ textDecoration: 'none' }}>
            Tiffin ({counts.tiffin})
          </Link>
          <Link to="/admin/inquiries/venue" className="filter-tab" style={{ textDecoration: 'none' }}>
            Venue ({counts.venue})
          </Link>
        </div>

        <div className="admin-enquiries__table-container">
          <table className="admin-enquiries__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Type</th>
                <th>Details</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="loading">Loading...</td></tr>
              ) : paginatedInquiries.length === 0 ? (
                <tr><td colSpan="7" className="empty-state">No inquiries found</td></tr>
              ) : (
                paginatedInquiries.map(i => (
                  <tr key={i._id}>
                    <td>{i.name}</td>
                    <td>
                      <div><a href={`tel:${i.phone}`} className="phone-link">{i.phone}</a></div>
                      <a href={`mailto:${i.email}`} className="email-link">{i.email}</a>
                    </td>
                    <td><span className="badge-type">{getCategoryLabel(i.enquiryType)}</span></td>
                    <td>
                      <div>{i.service || i.message?.substring(0, 30)}...</div>
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