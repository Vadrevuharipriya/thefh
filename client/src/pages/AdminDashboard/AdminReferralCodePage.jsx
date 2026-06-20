import { useState, useMemo } from 'react';
import { Search, Edit, Trash2, Eye, X, Plus, ArrowUpDown } from 'lucide-react';
import { useAdminReferralCodes, useCreateAdminReferralCode, useUpdateAdminReferralCode, useDeleteAdminReferralCode } from '../../hooks/admin/useAdminReferralCode';
import PropTypes from 'prop-types';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminReferralCodePage.scss';

const STATUS_OPTIONS = ['Active', 'Inactive'];

export default function AdminReferralCodePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingReferral, setEditingReferral] = useState(null);
  const [formData, setFormData] = useState({
    user: '',
    referralCode: '',
    earnings: '',
    displayStatus: 'Active',
  });
  const [error, setError] = useState('');

  const queryParams = useMemo(() => {
    const p = {};
    if (search) p.search = search;
    if (statusFilter) p.status = statusFilter;
    return p;
  }, [search, statusFilter]);

  const { data: referralsData, isLoading: loading } = useAdminReferralCodes(queryParams);
  const { mutateAsync: createReferralCode } = useCreateAdminReferralCode();
  const { mutateAsync: updateReferralCode } = useUpdateAdminReferralCode();
  const { mutateAsync: deleteReferralCode } = useDeleteAdminReferralCode();

  const referrals = Array.isArray(referralsData) ? referralsData : [];

  // ── Open Edit Modal ────────────────────────────────────────────────────
  const handleEdit = (referral) => {
    setEditingReferral(referral);
    setFormData({
      user: referral.user || '',
      referralCode: referral.referralCode || '',
      earnings: referral.earnings || '',
      displayStatus: referral.displayStatus || 'Active',
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingReferral(null);
    setFormData({
      user: '',
      referralCode: '',
      earnings: '',
      displayStatus: 'Active',
    });
    setShowModal(true);
  };

  // ── Save (create or update) ────────────────────────────────────────────
  const handleSave = async () => {
    setError('');
    try {
      const body = {
        user: formData.user,
        referralCode: formData.referralCode,
        earnings: Number(formData.earnings) || 0,
        displayStatus: formData.displayStatus,
      };

      if (editingReferral) {
        await updateReferralCode({ id: editingReferral._id, data: body });
      } else {
        await createReferralCode(body);
      }
      setShowModal(false);
      setEditingReferral(null);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.error || 'Failed to save referral');
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────
  const handleDelete = async (referral) => {
    if (!window.confirm(`Delete referral code "${referral.referralCode}"?`)) return;
    try {
      await deleteReferralCode(referral._id);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // ── Quick Status Toggle ─────────────────────────────────────────────────
  const cycleStatus = async (referral) => {
    const idx = STATUS_OPTIONS.indexOf(referral.displayStatus || 'Inactive');
    const next = STATUS_OPTIONS[(idx + 1) % STATUS_OPTIONS.length];
    try {
      await updateReferralCode({ id: referral._id, data: { displayStatus: next } });
    } catch (err) {
      console.error(err);
    }
  };

  // ── Sort helpers ───────────────────────────────────────────────────────
  const [sortKey, setSortKey] = useState('referralCode');
  const [sortAsc, setSortAsc] = useState(false);

  const sortedReferrals = [...referrals].sort((a, b) => {
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
    <div className="admin-referral-code">
      <AdminSidebar />
      <main className="admin-referral-code__main">
        <header className="admin-referral-code__header">
          <h1>Referral Code Management</h1>
        </header>

        {/* ── Filter / Search bar ── */}
        <div className="admin-referral-code__toolbar">
          <div className="admin-referral-code__search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by referral code or user…"
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
        <div className="admin-referral-code__summary">
          <div className="summary-card">
            <span className="summary-card__number">{referrals.length}</span>
            <span className="summary-card__label">Total</span>
          </div>
          <div className="summary-card summary-card--approved">
            <span className="summary-card__number">
              {referrals.filter(r => r.displayStatus === 'Active').length}
            </span>
            <span className="summary-card__label">Active</span>
          </div>
          <div className="summary-card summary-card--hold">
            <span className="summary-card__number">
              {referrals.filter(r => r.displayStatus === 'Inactive').length}
            </span>
            <span className="summary-card__label">Inactive</span>
          </div>
        </div>

        {error && <p className="admin-referral-code__error">{error}</p>}

        {/* ── Table ── */}
        <div className="admin-referral-code__table-wrap">
          <table className="admin-referral-code__table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort('_id')}>SlNo{sortIndicator('_id')}</th>
                <th className="sortable" onClick={() => handleSort('user')}>User{sortIndicator('user')}</th>
                <th className="sortable" onClick={() => handleSort('referralCode')}>Referral Code{sortIndicator('referralCode')}</th>
                <th className="sortable" onClick={() => handleSort('earnings')}>Earnings (Rs.){sortIndicator('earnings')}</th>
                <th>Display Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="loading">Loading…</td></tr>
              ) : sortedReferrals.length === 0 ? (
                <tr><td colSpan={6} className="empty-state">No referrals found</td></tr>
              ) : (
                sortedReferrals.map((r, i) => (
                  <tr key={r._id}>
                    <td>{i + 1}</td>
                    <td>{r.user}</td>
                    <td>{r.referralCode}</td>
                    <td>{r.earnings}</td>
                    <td>
                      <button
                        className={`status-badge status-badge--${(r.displayStatus || '').toLowerCase()}`}
                        onClick={() => cycleStatus(r)}
                        title="Click to cycle status"
                      >
                        {r.displayStatus || 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button title="View Details" onClick={() => { /* View details if needed */ }} className="btn-icon">
                          <Eye size={16} />
                        </button>
                        <button
                          title="Update Referral"
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
        <div className="modal-overlay" onClick={() => { setShowModal(false); setEditingReferral(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editingReferral ? 'Update Referral' : 'Add New Referral'}</h3>
              <button onClick={() => { setShowModal(false); setEditingReferral(null); }}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="modal-form__row">
                <div className="modal-form__group">
                  <label>User *</label>
                  <input type="text" value={formData.user} onChange={(e) => setFormData({ ...formData, user: e.target.value })} />
                </div>
              </div>
              <div className="modal-form__row">
                <div className="modal-form__group">
                  <label>Referral Code *</label>
                  <input type="text" value={formData.referralCode} onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })} />
                </div>
              </div>
              <div className="modal-form__row">
                <div className="modal-form__group">
                  <label>Earnings (Rs.)</label>
                  <input type="number" value={formData.earnings} onChange={(e) => setFormData({ ...formData, earnings: e.target.value })} />
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
              <button className="btn-secondary" onClick={() => { setShowModal(false); setEditingReferral(null); }}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

AdminReferralCodePage.propTypes = {};