import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminPanelUsersPage.scss';

export default function AdminPanelUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
  const [viewUser, setViewUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('adminToken');
      console.log('[AdminPanelUsersPage] Fetching panel users');
      const res = await fetch('/api/admin/panel-users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('[AdminPanelUsersPage] Response status:', res.status);
      if (!res.ok) {
        const errData = await res.json();
        console.error('[AdminPanelUsersPage] API error:', errData);
        setError('Failed to fetch users. Please ensure the server is running.');
        return;
      }
      const data = await res.json();
      console.log('[AdminPanelUsersPage] Users fetched:', JSON.stringify(data));
      setUsers(Array.isArray(data) ? data : (data.users || []));
    } catch (err) {
      console.error('[AdminPanelUsersPage] Failed to fetch users:', err);
      setError('Failed to fetch users. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // User Summary counts
  const counts = {
    total: users.length,
    nonApprove: users.filter(u => u.status === 'Non-Approve').length,
    approved: users.filter(u => u.status === 'Approved').length,
    hold: users.filter(u => u.status === 'Hold').length
  };

  const filteredUsers = users.filter(u =>
    u.contactName?.toLowerCase().includes(search.toLowerCase()) ||
    u.mobilePhone?.includes(search) ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.emailAddress?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleView = (user) => {
    setViewUser(user);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/panel-users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
        console.log('[AdminPanelUsersPage] User deleted:', id);
      } else {
        console.error('[AdminPanelUsersPage] Delete failed:', await res.json());
      }
    } catch (err) {
      console.error('[AdminPanelUsersPage] Failed to delete user:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData(e.target);
      const data = {
        contactName: formData.get('contactName'),
        mobilePhone: formData.get('mobilePhone'),
        emailAddress: formData.get('emailAddress'),
        username: formData.get('username'),
        password: formData.get('password'),
        designation: formData.get('designation') || '',
        status: formData.get('status') || 'Non-Approve',
        role: formData.get('role') || 'Panel User'
      };

      const url = editingUser
        ? `/api/admin/panel-users/${editingUser._id}`
        : '/api/admin/panel-users';
      const method = editingUser ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const resData = await res.json();
      console.log('[AdminPanelUsersPage] Save response:', JSON.stringify(resData));

      if (res.ok) {
        if (editingUser) {
          setUsers(users.map(u => u._id === editingUser._id ? resData : u));
        } else {
          setUsers([...users, resData]);
        }
        setShowModal(false);
        setEditingUser(null);
        setError('');
      } else {
        console.error('[AdminPanelUsersPage] Save failed:', resData);
        setError(resData.error || 'Failed to save user');
      }
    } catch (err) {
      console.error('[AdminPanelUsersPage] Save error:', err);
      setError('Failed to save user. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Non-Approve': { bg: '#fee2e2', color: '#991b1b' },
      'Approved': { bg: '#dcfce7', color: '#166534' },
      'Hold': { bg: '#fef3c7', color: '#92400e' }
    };
    const style = colors[status] || colors['Non-Approve'];
    return (
      <span style={{
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '500',
        backgroundColor: style.bg,
        color: style.color
      }}>
        {status}
      </span>
    );
  };

  return (
    <div className="admin-panel-users">
      <AdminSidebar />
      <main className="admin-panel-users__main">
        <header className="admin-panel-users__header">
          <h1>User Summary</h1>
          <div className="admin-panel-users__header-actions">
            <button className="btn-primary" onClick={handleAdd}>
              <Plus size={18} /> Add New User
            </button>
          </div>
        </header>

        {/* User Summary Cards */}
        <div className="admin-panel-users__summary">
          <div className="summary-card">
            <span className="summary-card__number">{counts.total}</span>
            <span className="summary-card__label">Total</span>
          </div>
          <div className="summary-card summary-card--hold">
            <span className="summary-card__number">{counts.nonApprove}</span>
            <span className="summary-card__label">Non-Approve</span>
          </div>
          <div className="summary-card summary-card--approved">
            <span className="summary-card__number">{counts.approved}</span>
            <span className="summary-card__label">Approved</span>
          </div>
          <div className="summary-card summary-card--hold">
            <span className="summary-card__number">{counts.hold}</span>
            <span className="summary-card__label">Hold</span>
          </div>
        </div>

        {error && (
          <div className="admin-panel-users__error">
            <p>{error}</p>
            <button onClick={fetchUsers} className="btn-primary" style={{ marginTop: '0.5rem' }}>Retry</button>
          </div>
        )}

        {/* Search */}
        <div className="admin-panel-users__search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="admin-panel-users__table-container">
          <table className="admin-panel-users__table">
            <thead>
              <tr>
                <th>Option</th>
                <th>Contact Name</th>
                <th>Mobile Phone</th>
                <th>Email Address</th>
                <th>Username</th>
                <th>Password</th>
                <th>Designation</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10" className="loading">Loading...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="10" className="empty-state">No users found</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: user.status === 'Approved' ? '#22c55e' :
                          user.status === 'Hold' ? '#f59e0b' : '#ef4444'
                      }} />
                    </td>
                    <td>{user.contactName}</td>
                    <td>{user.mobilePhone}</td>
                    <td>{user.emailAddress}</td>
                    <td>{user.username}</td>
                    <td>••••••••</td>
                    <td>{user.designation || '-'}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>{getStatusBadge(user.status)}</td>
                    <td>
                      <div className="actions">
                        <button onClick={() => handleView(user)} title="View" className="action-btn view">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleEdit(user)} title="Edit" className="action-btn edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(user._id)} title="Delete" className="action-btn delete">
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

        {/* View Modal */}
        {viewUser && (
          <div className="modal-overlay" onClick={() => setViewUser(null)}>
            <div className="modal-content">
              <div className="modal-header">
                <h3>User Details</h3>
                <button onClick={() => setViewUser(null)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Contact Name</label>
                    <span>{viewUser.contactName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Mobile Phone</label>
                    <span>{viewUser.mobilePhone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email Address</label>
                    <span>{viewUser.emailAddress || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Username</label>
                    <span>{viewUser.username}</span>
                  </div>
                  <div className="detail-item">
                    <label>Designation</label>
                    <span>{viewUser.designation || '-'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status</label>
                    <span>{getStatusBadge(viewUser.status)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Role</label>
                    <span>{viewUser.role || 'Panel User'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Created Date</label>
                    <span>{new Date(viewUser.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => { setShowModal(false); setEditingUser(null); setError(''); }}>
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
                <button onClick={() => { setShowModal(false); setEditingUser(null); setError(''); }}>✕</button>
              </div>
              <div className="modal-body">
                {error && <div className="form-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Contact Name <span>*</span></label>
                      <input
                        type="text"
                        name="contactName"
                        defaultValue={editingUser?.contactName || ''}
                        required
                        placeholder="Enter contact name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Mobile Phone <span>*</span></label>
                      <input
                        type="tel"
                        name="mobilePhone"
                        defaultValue={editingUser?.mobilePhone || ''}
                        required
                        placeholder="Enter mobile number"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="emailAddress"
                        defaultValue={editingUser?.emailAddress || ''}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="form-group">
                      <label>Username <span>*</span></label>
                      <input
                        type="text"
                        name="username"
                        defaultValue={editingUser?.username || ''}
                        required
                        placeholder="Enter username"
                      />
                    </div>
                    <div className="form-group">
                      <label>Password <span>*</span></label>
                      <input
                        type="password"
                        name="password"
                        defaultValue={editingUser?.password || ''}
                        required
                        placeholder={editingUser ? 'Enter new password (leave blank to keep current)' : 'Enter password'}
                      />
                    </div>
                    <div className="form-group">
                      <label>Designation</label>
                      <input
                        type="text"
                        name="designation"
                        defaultValue={editingUser?.designation || ''}
                        placeholder="Enter designation"
                      />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select name="status" defaultValue={editingUser?.status || 'Non-Approve'}>
                        <option value="Non-Approve">Non-Approve</option>
                        <option value="Approved">Approved</option>
                        <option value="Hold">Hold</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Role</label>
                      <select name="role" defaultValue={editingUser?.role || 'Panel User'}>
                        <option value="Panel User">Panel User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                    <button type="button" onClick={() => { setShowModal(false); setEditingUser(null); setError(''); }}>
                      Cancel
                    </button>
                    <button type="submit">
                      {editingUser ? 'Update User' : 'Add User'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}