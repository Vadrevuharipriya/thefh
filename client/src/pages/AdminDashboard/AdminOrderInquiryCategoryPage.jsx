import { useState } from 'react';
import { useOrderInquiriesByCategory, useDeleteOrderInquiry, useUpdateOrderInquiryStatus } from '../../hooks/admin/useAdminEnquiry';
import PropTypes from 'prop-types';
import { Search, Trash2, Eye, X, CheckCircle, Clock } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminEnquiriesPage.scss';

const FOOD_ORDER_CATEGORIES = ['customized-plate', 'bhaji-orders', 'chutney-pickle'];

export default function AdminOrderInquiryCategoryPage({ category }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const itemsPerPage = 20;
  const categoryLabels = {
    'customized-plate': 'Customized Plate Orders',
    'bhaji-orders': 'Bhaji Orders',
    'chutney-pickle': 'Chutney Pickle / Achhar Orders'
  };

  const { data: rawInquiries, isLoading: loading } = useOrderInquiriesByCategory(category);
  const deleteInquiry = useDeleteOrderInquiry();
  const updateStatus = useUpdateOrderInquiryStatus();

  const inquiries = Array.isArray(rawInquiries) ? rawInquiries : (rawInquiries?.inquiries || []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await deleteInquiry.mutateAsync(id);
    } catch (err) {
      console.error('[AdminOrderInquiryCategoryPage] Failed to delete inquiry:', err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateStatus.mutateAsync({ id, status });
    } catch (err) {
      console.error('[AdminOrderInquiryCategoryPage] Failed to update status:', err);
    }
  };

  const filteredInquiries = inquiries.filter(i => {
    const matchesSearch = !search || 
      (i.name && i.name.toLowerCase().includes(search.toLowerCase())) ||
      (i.email && i.email.toLowerCase().includes(search.toLowerCase())) ||
      (i.mobile && i.mobile.includes(search));
    
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
      { label: 'Location', value: inquiry.deliveryAddress },
      { label: 'Special Instructions', value: inquiry.specialInstructions || inquiry.message },
    ].filter(f => f.value);
    
    // Add OTP info for food orders when status is in-progress
    if (FOOD_ORDER_CATEGORIES.includes(inquiry.category) && inquiry.status === 'in-progress') {
      fields.push({ label: 'Delivery OTP', value: inquiry.deliveryOtp || 'Generating...' });
    }
    
    return fields.map(f => (
      <div key={f.label} className="detail-row">
        <span className="detail-label">{f.label}:</span>
        <span className="detail-value">{f.value}</span>
      </div>
    ));
  };

  const getDisplayValue = (inquiry) => {
    // Prefer the decoded plate-items summary stored in specialInstructions or message
    const plateSummary = inquiry.specialInstructions || inquiry.message;
    switch (category) {
      case 'customized-plate':
        return plateSummary || inquiry.plateType || 'Customised Plate';
      case 'bhaji-orders':
      case 'chutney-pickle':
        if (plateSummary) return plateSummary;
        return inquiry.productType || inquiry.bhajiType || inquiry.service || (category === 'bhaji-orders' ? 'Bhaji Order' : 'Chutney / Pickle');
      default:
        return inquiry.name || inquiry.service || '';
    }
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
                <th>Order Details</th>
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
                      <div><a href={`tel:${i.mobile}`} className="phone-link">{i.mobile}</a></div>
                      <a href={`mailto:${i.email}`} className="email-link">{i.email}</a>
                    </td>
                    <td>
                      {getDisplayValue(i)}
                      {/* Show OTP for food orders in in-progress status */}
                      {FOOD_ORDER_CATEGORIES.includes(i.category) && i.status === 'in-progress' && i.deliveryOtp && (
                        <div className="otp-display" style={{ marginTop: '0.25rem' }}>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>OTP: </span>
                          <span className="otp-value">{i.deliveryOtp}</span>
                        </div>
                      )}
                    </td>
                    <td>{new Date(i.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select 
                        value={i.status || 'new'}
                        onChange={(e) => handleStatusUpdate(i._id, e.target.value)}
                        disabled={updateStatus.isPending}
                      >
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
{/* OTP verification badge for food orders */}
                      {FOOD_ORDER_CATEGORIES.includes(i.category) && i.status === 'in-progress' && (
                        <div style={{ marginTop: '0.5rem' }}>
                          {i.otpVerified ? (
                            <span className="otp-verified-badge">
                              <CheckCircle size={12} /> Verified
                            </span>
                          ) : (
                            <span className="otp-pending-badge">
                              <Clock size={12} /> Awaiting Verification
                            </span>
                          )}
                        </div>
                      )}
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

AdminOrderInquiryCategoryPage.propTypes = {
  category: PropTypes.string.isRequired
};