import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { Plus, Edit, Trash2, Search, Trash } from 'lucide-react';
import './AdminLocationsPage.scss';

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    displayStatus: 'Approved'
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get('/api/admin/locations', {
      });
      setLocations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      (l.slug && l.slug.toLowerCase().includes(search.toLowerCase()))
  );

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: editingLocation ? formData.slug : generateSlug(name)
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    try {
      await fetch(`/api/admin/locations/${id}`, {
        method: 'DELETE',
        headers: {
        }
      });
      fetchLocations();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Approved' ? 'Pending' : 'Approved';

    try {
      const res = await fetch(`/api/admin/locations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ displayStatus: nextStatus })
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.details || data.error || 'Status update failed');
      }

      setLocations((prev) => prev.map((location) => (location._id === id ? data : location)));
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingLocation
      ? `/api/admin/locations/${editingLocation._id}`
      : '/api/admin/locations';
      const method = editingLocation ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const responseJson = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(responseJson.details || responseJson.error || 'Save failed');
      }

      setShowModal(false);
      setEditingLocation(null);
      setFormData({
        name: '',
        slug: '',
        image: '',
        displayStatus: 'Approved'
      });
      setImagePreview('');
      fetchLocations();
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const openEdit = (location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      slug: location.slug,
      image: location.image || '',
      displayStatus: location.displayStatus || 'Approved'
    });
    if (location.image) setImagePreview(location.image);
    setShowModal(true);
  };

  const openCreate = () => {
    setEditingLocation(null);
    setFormData({
      name: '',
      slug: '',
      image: '',
      displayStatus: 'Approved'
    });
    setImagePreview('');
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      console.error('Only JPG, JPEG, PNG, WebP files allowed');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await axios.post('/api/upload', uploadData, {
        headers: {
        }
      });
      setFormData({ ...formData, image: res.data.url });
      setImagePreview(res.data.url);
    } catch {
      console.error('Failed to upload image');
    }
  };

  const handleClearImage = () => {
    setFormData({ ...formData, image: '' });
    setImagePreview('');
  };

  return (
    <div className="admin-locations">
      <AdminSidebar />
      <main className="admin-locations__main">
        <header className="admin-locations__header">
          <h1>Manage Location</h1>
          <button className="btn-primary" onClick={openCreate}>
            <Plus size={18} />
            Add New Location
          </button>
        </header>

        <div className="admin-locations__search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-locations__table-container">
          <table className="admin-locations__table">
            <thead>
              <tr>
                <th>Option</th>
                <th>Location Name</th>
                <th>Image</th>
                <th>Display Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="loading">Loading...</td>
                </tr>
              ) : (
                filteredLocations.map((location, i) => (
                  <tr key={location._id}>
                    <td>{i + 1}</td>
                    <td>{location.name}</td>
                    <td>
                      {location.image ? (
                        <img src={location.image} alt={location.name} className="location-image-thumb" />
                      ) : (
                        <span className="no-image">-</span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`badge status-toggle ${location.displayStatus === 'Approved' ? 'status-active' : 'status-inactive'}`}
                        onClick={() => handleStatusChange(location._id, location.displayStatus)}
                      >
                        {location.displayStatus}
                      </button>
                    </td>
                    <td>
                      <div className="actions">
                        <button onClick={() => openEdit(location)} className="btn-edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(location._id)} className="btn-delete">
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

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingLocation ? `Edit ${editingLocation.name}` : 'Add New Location'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Location Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
                <small>Auto-generated from name. Used in URLs (e.g., delhi-ncr)</small>
              </div>
              <div className="form-group">
                <label>Image</label>
                {imagePreview ? (
                  <div className="image-preview-wrapper">
                    <img src={imagePreview} alt="Location" className="image-preview" />
                    <div className="image-actions">
                      <button
                        type="button"
                        className="btn-view-image"
                        onClick={() => window.open(imagePreview, '_blank')}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="btn-clear-image"
                        onClick={handleClearImage}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="image-upload-wrapper">
                    <input
                      type="file"
                      id="location-image"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleImageUpload}
                      className="file-input"
                    />
                    <label htmlFor="location-image" className="file-label">
                      Choose Image
                    </label>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Display Status</label>
                <select
                  value={formData.displayStatus}
                  onChange={(e) => setFormData({ ...formData, displayStatus: e.target.value })}
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit">{editingLocation ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
