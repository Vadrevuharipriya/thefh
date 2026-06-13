import { useState, useEffect, useCallback } from 'react';
import { Search, Edit, Trash2, Eye, X, Plus, ArrowUpDown } from 'lucide-react';
import PropTypes from 'prop-types';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import axios from 'axios';
import './AdminJobWorkerRatePage.scss';

const STATUS_OPTIONS = ['Approved', 'Pending'];

export default function AdminJobWorkerRatePage() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    rate: '',
    displayStatus: 'Pending',
  });
  const [error, setError] = useState('');

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await axios.get(`/api/admin/job-worker-rates?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRates(res.data || []);
    } catch (err) {
      console.error('Failed to fetch rates:', err);
      setError('Failed to fetch rates. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  // ── Open Edit Modal ────────────────────────────────────────────────────
  const handleEdit = (rate) => {
    setEditingRate(rate);
    setFormData({
      title: rate.title || '',
      rate: rate.rate || '',
      displayStatus: rate.displayStatus || 'Pending',
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingRate(null);
    setFormData({
      title: '',
      rate: '',
      displayStatus: 'Pending',
    });
    setShowModal(true);
  };

  // ── Save (create or update) ────────────────────────────────────────────
  const handleSave = async () => {
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const body = {
        title: formData.title,
        rate: Number(formData.rate) || 0,
        displayStatus: formData.displayStatus,
      };

      let res;
      if (editingRate) {
        res = await axios.put(`/api/admin/job-worker-rates/${editingRate._id}`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRates(rates.map(r => (r._id === editingRate._id ? res.data : r)));
      } else {
        res = await axios.post(`/api/admin/job-worker-rates`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchRates();
      }
      setShowModal(false);
      setEditingRate(null);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.error || 'Failed to save rate');
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────
  const handleDelete = async (rate) => {
    if (!confirm(`Delete "${rate.title}"?`)) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/admin/job-worker-rates/${rate._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRates(rates.filter(r => r._id !== rate._id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // ── Quick Status Toggle ─────────────────────────────────────────────────
  const cycleStatus = (rate) => {
    const idx = STATUS_OPTIONS.indexOf(rate.displayStatus || 'Pending');
    const next = STATUS_OPTIONS[(idx + 1) % STATUS_OPTIONS.length];
    setRates(
      rates.map(r => (r._id === rate._id ? { ...r, displayStatus: next } : r))
    );
    // Persist
    axios
      .put(
        `/api/admin/job-worker-rates/${rate._id}`,
        { displayStatus: next },
        { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
      )
      .catch(console.error);
  };

  // ── Sort helpers ───────────────────────────────────────────────────────
  const [sortKey, setSortKey] = useState('title');
  const [sortAsc, setSortAsc] = useState(false);

  const sortedRates = [...rates].sort((a, b) => {
    let va = a[sortKey] ?? '';
    let vb = b[sortKey] ?? '';
    if (typeof va === 'string') va = va.toLowerCase();
    if (typeof vb === 'string') vb = vb.toLowerCase();
    if (va < vb) return sortAsc ? -1 : 1;
    if (va > vb) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortIndicator = (key) => {
    if (sortKey !== key) return <ArrowUpDown size={12} style={{ opacity: 0.35 }} />;
    return <ArrowUpDown size={12} />;
  };

  return (
    <div className="admin-job-worker-rate">
      <AdminSidebar />
      <main className="admin-job-worker-rate__main">
        <header className="admin-job-worker-rate__header">
          <h1>Job Worker Rate</h1>
        </header>

        {/* ── Filter / Search bar ── */}
        <div className="admin-job-worker-rate__toolbar">
          <div className="admin-job-worker-rate__search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by title…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); }}
            className="filter-tab"
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button className="btn-primary" onClick={handleAddNew}>
            <Plus size={18} /> Add New
          </button>
        </div>

        {/* ── Summary Cards ── */}
        <div className="admin-job-worker-rate__summary">
          <div className="summary-card">
            <span className="summary-card__number">{rates.length}</span>
            <span className="summary-card__label">Total</span>
          </div>
          <div className="summary-card summary-card--approved">
            <span className="summary-card__number">
              {rates.filter(r => r.displayStatus === 'Approved').length}
            </span>
            <span className="summary-card__label">Approved</span>
          </div>
          <div className="summary-card summary-card--hold">
            <span className="summary-card__number">
              {rates.filter(r => r.displayStatus === 'Pending').length}
            </span>
            <span className="summary-card__label">Pending</span>
          </div>
        </div>

        {error && <p className="admin-job-worker-rate__error">{error}</p>}

        {/* ── Table ── */}
        <div className="admin-job-worker-rate__table-wrap">
          <table className="admin-job-worker-rate__table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort('_id')}>SlNo{sortIndicator('_id')}</th>
                <th className="sortable" onClick={() => handleSort('title')}>Job Worker Title{sortIndicator('title')}</th>
                <th className="sortable" onClick={() => handleSort('rate')}>Rate (in Rs.){sortIndicator('rate')}</th>
                <th>Display Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="loading">Loading…</td></tr>
              ) : sortedRates.length === 0 ? (
                <tr><td colSpan={5} className="empty-state">No rates found</td></tr>
              ) : (
                sortedRates.map((r, i) => (
                  <tr key={r._id}>
                    <td>{i + 1}</td>
                    <td>{r.title}</td>
                    <td>{r.rate}</td>
                    <td>
                      <button
                        className={`status-badge status-badge--${(r.displayStatus || '').toLowerCase()}`}
                        onClick={() => cycleStatus(r)}
                        title="Click to cycle status"
                      >
                        {r.displayStatus || 'Pending'}
                      </button>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button title="View Details" onClick={() => { /* View details if needed */ }} className="btn-icon">
                          <Eye size={16} />
                        </button>
                        <button
                          title="Update Rate"
                          onClick={() => handleEdit(r)}
                          className="btn-icon"
                        >
                          <Edit size={16} />
                        </button>
                        <button title="Delete" onClick={() => handleDelete(r)} className="btn-icon btn-icon--danger">
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

      {/* ── Edit / Add Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setEditingRate(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editingRate ? 'Update Rate' : 'Add New Rate'}</h3>
              <button onClick={() => { setShowModal(false); setEditingRate(null); }}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="modal-form__row">
                <div className="modal-form__group">
                  <label>Job Worker Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>
              </div>
              <div className="modal-form__row">
                <div className="modal-form__group">
                  <label>Rate (in Rs.) *</label>
                  <input type="number" value={formData.rate} onChange={(e) => setFormData({ ...formData, rate: e.target.value })} />
                </div>
              </div>
              <div className="modal-form__row">
                <div className="modal-form__group">
                  <label>Display Status</label>
                  <select value={formData.displayStatus} onChange={(e) => setFormData({ ...formData, displayStatus: e.target.value })}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            {error && <div className="modal-error">{error}</div>}
            <div className="modal-foot">
              <button className="btn-secondary" onClick={() => { setShowModal(false); setEditingRate(null); }}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

AdminJobWorkerRatePage.propTypes = {};