import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Trash2, Plus } from 'lucide-react';
import PropTypes from 'prop-types';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import axios from 'axios';
import './AdminJobWorkerPage.scss';

const STATUS_OPTIONS = ['Pending', 'Approved', 'Hold'];

export default function AdminJobWorkerPage() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchWorkers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      let localData = [];
      try {
        const localRes = await axios.get(`/api/admin/chefs/admin?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localData = (localRes.data || []).map((c) => ({
          ...c,
          source: 'local',
          cuisines: Array.isArray(c.profile?.cuisines)
            ? c.profile.cuisines
            : Array.isArray(c.cuisines)
              ? c.cuisines
              : (c.cuisines ? [c.cuisines] : []),
          events: c.events || 0,
          rating: c.rating || 0,
          earnings: c.earnings || null,
          emergencyContact: c.profile?.emergencyContact || '',
          gender: c.profile?.gender || '',
          jobPreference: c.profile?.jobPreference || '',
          pincode: c.profile?.pincode || '',
          communicationAddress: c.profile?.communicationAddress || '',
          permanentAddress: c.profile?.permanentAddress || '',
          aadhaarNumber: c.profile?.aadhaarNumber || '',
          panNumber: c.profile?.panNumber || '',
          bankAccountNumber: c.profile?.bankAccountNumber || '',
          ifscCode: c.profile?.ifscCode || '',
          bankName: c.profile?.bankName || '',
          upiNumber: c.profile?.upiNumber || '',
          aadhaarFrontUrl: c.profile?.aadhaarFrontUrl || '',
          aadhaarBackUrl: c.profile?.aadhaarBackUrl || '',
          zone: c.profile?.zone || c.zone || '',
          address: c.profile?.communicationAddress || c.profile?.permanentAddress || '',
          raw: c,
        })).filter((c) => {
          const name = c.name?.trim();
          const email = c.email?.trim();
          const mobile = c.mobile?.trim();
          return !!(name || email || mobile || c.city || (Array.isArray(c.cuisines) ? c.cuisines.length : 0) || c.events || c.earnings != null);
        });
      } catch (err) {
        console.error('Failed to fetch local chefs:', err);
        setError('Failed to fetch local chefs.');
      }

      let firebaseData = [];
      try {
        const firebaseRes = await axios.get(`/api/admin/firebase/chefs?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const localByFirebaseId = new Map(localData.filter((c) => c.firebaseId).map((c) => [c.firebaseId, c]));
        (firebaseRes.data || []).forEach((f) => {
  const local = localByFirebaseId.get(f.firebaseId);

  if (local) {
    local.events = f.events || 0;
    local.rating = f.rating || 0;

    if (f.earnings != null) {
      local.earnings = f.earnings;
    }

    if (!local.image && f.image) {
      local.image = f.image;
    }

    if (!local.city && f.city) {
      local.city = f.city;
    }
  }
});
        const localByEmail = new Map(localData.filter((c) => c.email).map((c) => [c.email?.toLowerCase(), c]));
        const localByMobile = new Map(localData.filter((c) => c.mobile).map((c) => [c.mobile, c]));

        firebaseData = (firebaseRes.data || []).map((c) => {
          if ((c.firebaseId && localByFirebaseId.has(c.firebaseId)) ||
              (c.email?.toLowerCase() && localByEmail.has(c.email.toLowerCase())) ||
              (c.mobile && localByMobile.has(c.mobile))) {
            return null;
          }

          const name = c.name?.trim() || '';
          const email = c.email?.trim() || '';
          const mobile = c.mobile?.trim() || '';
          const city = c.city?.trim() || '';

          if (!name && !email && !mobile) {
            return null;
          }

          return {
            _id: c.firebaseId,
            source: 'firebase',
            name,
            mobile,
            email,
            city,
            cuisines: Array.isArray(c.cuisines) ? c.cuisines : (c.cuisines ? [c.cuisines] : []),
            events: c.events || 0,
            rating: c.rating || 0,
            earnings: c.earnings || null,
            displayStatus: c.displayStatus || 'Approved',
            image: c.image || '',
            raw: c.raw || {},
          };
        }).filter(Boolean);
      } catch (err) {
        console.error('Failed to fetch Firebase chefs:', err);
      }

      setWorkers([...localData, ...firebaseData]);
    } catch (err) {
      console.error('Failed to fetch workers:', err);
      setError('Failed to fetch workers. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const handleView = (worker) => {
    navigate(`/admin/order-inquiry/manage-job-worker/${worker._id}`);
  };

  const handleAddNew = () => {
    navigate('/admin/order-inquiry/manage-job-worker/new');
  };

  const handleDelete = async (worker) => {
    if (!confirm(`Delete "${worker.name}"?`)) return;

    try {
      setError('');
      const token = localStorage.getItem('adminToken');
      const id = worker._id || worker.id || worker.firebaseId;
      if (!id) {
        setError('Unable to delete worker: missing id.');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      try {
        await axios.delete(`/api/admin/chefs/${id}`, config);
      } catch (err) {
        if (err.response?.status === 404 || err.response?.status === 401) {
          await axios.delete(`/api/chefs/${id}`, config);
        } else {
          throw err;
        }
      }

      setWorkers((prev) => prev.filter((w) => (w._id || w.id || w.firebaseId) !== id));
      await fetchWorkers();
    } catch (err) {
      console.error('Delete error:', err.response?.data || err.message || err);
      setError('Failed to delete worker.');
    }
    
  };

  const cycleStatus = async (worker) => {
    const index = STATUS_OPTIONS.indexOf(worker.displayStatus);
    const nextStatus = STATUS_OPTIONS[(index + 1) % STATUS_OPTIONS.length];
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.put(`/api/admin/chefs/${worker._id}`, { displayStatus: nextStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkers((prev) => prev.map((w) => (w._id === worker._id ? { ...w, displayStatus: res.data.displayStatus } : w)));
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Failed to update status.');
    }
  };

  const sortedWorkers = [...workers].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  const totalChefs = workers.length;
  const approvedChefs = workers.filter((w) => w.displayStatus === 'Approved').length;
  const pendingChefs = workers.filter((w) => w.displayStatus === 'Pending').length;
  const holdChefs = workers.filter((w) => w.displayStatus === 'Hold').length;

  return (
    <div className="admin-dashboard admin-job-workers">
      <AdminSidebar />
      <main className="admin-job-workers__content">
        <div className="admin-job-workers__header">
          <div>
            <h1>Manage Job Workers</h1>
            <p>View and manage all local and Firebase chefs in one place.</p>
          </div>
          <button className="btn-primary btn-add-chef" onClick={handleAddNew}>
            <Plus size={16} /> Add Chef
          </button>
        </div>

        <div className="admin-job-workers__summary">
          <div className="summary-card">
            <span className="summary-card__number">{totalChefs}</span>
            <span className="summary-card__label">Total Chefs</span>
          </div>
          <div className="summary-card summary-card--approved">
            <span className="summary-card__number">{approvedChefs}</span>
            <span className="summary-card__label">Approved</span>
          </div>
          <div className="summary-card summary-card--hold">
            <span className="summary-card__number">{holdChefs}</span>
            <span className="summary-card__label">Hold / Blocked</span>
          </div>
          <div className="summary-card summary-card--pending">
            <span className="summary-card__number">{pendingChefs}</span>
            <span className="summary-card__label">Pending</span>
          </div>
        </div>

        <div className="admin-job-workers__toolbar">
          <div className="admin-job-workers__filters">
            <div className="filter-field">
              <Search size={16} />
              <input
                type="search"
                placeholder="Search chefs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-field">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <div className="admin-job-workers__table-wrap">
          <table className="admin-job-workers__table">
            <thead>
              <tr>
                <th>Sl. no.</th>
                <th>Chef Name</th>
                <th>No. of Bookings</th>
                <th>Cuisine Type</th>
                <th>Location</th>
                <th>Ratings</th>
                <th>Earnings</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="loading">Loading...</td></tr>
              ) : sortedWorkers.length === 0 ? (
                <tr><td colSpan={9} className="empty-state">No workers found</td></tr>
              ) : (
                sortedWorkers.map((w, i) => (
                  <tr key={w._id} className={w.displayStatus === 'Hold' ? 'row--hold' : ''}>
                    <td>{i + 1}</td>
                    <td className="chef-name-cell">
                      <div className="chef-name-inner">
                        <div className="chef-meta">
                          <strong>{w.name || '-'}</strong>
                          <div className="chef-sub">{w.email || w.mobile || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td>{w.events || 0}</td>
                    <td>{(w.cuisines || []).slice(0,3).join(', ') || '-'}</td>
                    <td>{w.city || '-'}</td>
                    <td>{w.rating != null ? w.rating : '-'}</td>
                    <td>{w.earnings != null ? `?${w.earnings}` : '-'}</td>
                    <td>
                      <button
                        className={`status-badge status-badge--${(w.displayStatus || 'approved').toLowerCase()}`}
                        onClick={() => cycleStatus(w)}
                        type="button"
                      >
                        {w.displayStatus}
                      </button>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button title="View Details" onClick={() => handleView(w)} className="btn-icon">
                          <Eye size={16} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(w)}
                          className="btn-icon btn-icon--danger"
                        >
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
      </main>
    </div>
  );
}

AdminJobWorkerPage.propTypes = {};
