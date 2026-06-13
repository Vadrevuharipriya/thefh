import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Edit, Trash2 } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminCuisineMenuPage.scss';

export default function AdminCuisineMenuPage() {
  const { cuisineId } = useParams();
  const [cuisine, setCuisine] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    vegType: 'Vegetarian',
    description: '',
    image: '',
    inStock: true,
    menuCategory: ''
  });
  const [imagePreview, setImagePreview] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [cuisineRes, menuRes] = await Promise.all([
        axios.get(`/api/cuisines/${cuisineId}`),
        axios.get(`/api/cuisines/${cuisineId}/menu`)
      ]);
      setCuisine(cuisineRes.data);
      setMenuItems(menuRes.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Fetch error:', err);
    }
    setLoading(false);
  }, [cuisineId]);

const openAddForm = () => {
      setEditingItem(null);
      setShowAddForm(true);
      setFormData({
        name: '',
        price: '',
        vegType: 'Vegetarian',
        description: '',
        image: '',
        inStock: true,
        menuCategory: ''
      });
      setImagePreview('');
    };

    const openEditForm = (item) => {
      setEditingItem(item);
      setShowAddForm(true);
      setFormData({
        name: item.name,
        price: item.price,
        vegType: item.vegType || 'Vegetarian',
        description: item.description || '',
        image: item.image || '',
        inStock: item.inStock,
        menuCategory: item.menuCategory || 'main'
      });
      setImagePreview(item.image || '');
    };

  const closeAddForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setImagePreview('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.post('/api/admin/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFormData({ ...formData, image: res.data.url });
      setImagePreview(res.data.url);
    } catch (err) {
      console.warn('Multipart upload failed, attempting base64 fallback:', err?.response?.data || err.message || err);
      try {
        const reader = await new Promise((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result);
          r.onerror = reject;
          r.readAsDataURL(file);
        });
        const token = localStorage.getItem('adminToken');
        const res2 = await axios.post('/api/admin/upload', { image: reader }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFormData({ ...formData, image: res2.data.url });
        setImagePreview(res2.data.url);
      } catch (err2) {
        console.error('Upload failed:', err2);
        setError(err2?.response?.data?.error || err2?.message || 'Failed to upload image');
      }
    }
  };

  const handleClearImage = () => {
    setFormData({ ...formData, image: '' });
    setImagePreview('');
  };

   const handleSubmit = async (e) => {
     e.preventDefault();
     try {
       const token = localStorage.getItem('adminToken');
       const payload = {
         ...formData,
         price: Number(formData.price),
         category: 'menu_item', // explicitly set category to menu_item for menu items
         cuisine: cuisineId
       };
 
       if (editingItem) {
         // Update existing item
         const res = await fetch(`/api/admin/products/${editingItem._id}`, {
           method: 'PUT',
           headers: {
             'Content-Type': 'application/json',
             Authorization: `Bearer ${token}`
           },
           body: JSON.stringify(payload)
         });
         if (!res.ok) {
           const errorBody = await res.json().catch(() => ({}));
           throw new Error(errorBody.error || 'Failed to update menu item');
         }
         const updated = await res.json();
         setMenuItems((prev) =>
           prev.map((item) => (item._id === updated._id ? updated : item))
         );
       } else {
         // Create new item
         const res = await fetch('/api/admin/products', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             Authorization: `Bearer ${token}`
           },
           body: JSON.stringify(payload)
         });
         if (!res.ok) {
           const errorBody = await res.json().catch(() => ({}));
           throw new Error(errorBody.error || 'Failed to create menu item');
         }
         const created = await res.json();
         setMenuItems((prev) => [...prev, created]);
       }
       closeAddForm();
     } catch (err) {
       console.error('Menu item operation failed:', err);
       setError(err.message || 'Operation failed');
     }
   };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/products/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || 'Failed to delete menu item');
      }
      setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error('Delete failed:', err);
      setError(err.message || 'Failed to delete menu item');
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="admin-cuisine-menu-page">
      <AdminSidebar />
      <main className="admin-cuisine-menu-content">
        <div className="page-header">
          <div>
            <h2>Menu Items: {cuisine?.name}</h2>
            <p className="table-subtitle">{cuisine?.shortDescription}</p>
          </div>
          <div className="page-header-actions">
            <button type="button" className="btn btn-primary" onClick={openAddForm}>
              + Add Menu Item
            </button>
            <Link to="/admin/cuisine" className="btn btn-back">← Back to Cuisines</Link>
          </div>
        </div>

        <div className="content-wrapper">
          <div className="table-card">
            <div className="table-header">
              <h3>Menu Items List</h3>
              <span className="count-badge">{menuItems.length} items</span>
            </div>

            {error && (
              <div className="table-empty">
                <div className="table-empty-icon">⚠️</div>
                <h4>Error loading data</h4>
                <p>{error}</p>
                <button onClick={fetchData} className="btn btn-primary" style={{marginTop: '1rem'}}>Retry</button>
              </div>
            )}

            {loading && (
              <div className="table-loading">
                <div className="loading-spinner"></div>
                <p>Loading menu items...</p>
              </div>
            )}

            {!loading && !error && menuItems.length === 0 && (
              <div className="table-empty">
                <div className="table-empty-icon">📝</div>
                <h4>No menu items found</h4>
                <p>This cuisine does not have any menu items yet.</p>
              </div>
            )}

            {!loading && menuItems.length > 0 && (
              <table className="cuisine-menu-table">
                <thead>
                  <tr>
                    <th>Option</th>
                    <th>Menu Name</th>
                    <th>Price (INR)</th>
                    <th>Veg Type</th>
                    <th>Image</th>
                    <th>Display Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item, i) => (
                    <tr key={item._id}>
                      <td>{i + 1}</td>
                      <td>{item.name}</td>
                      <td>₹{item.price}</td>
                      <td>
                        <span className={`badge ${item.vegType === 'Vegetarian' ? 'veg' : 'non-veg'}`}>
                          {item.vegType || 'Vegetarian'}
                        </span>
                      </td>
                      <td>
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="menu-image-thumb" />
                        ) : (
                          <span className="no-image">-</span>
                        )}
                      </td>
                      <td>{item.inStock ? 'Approved' : 'Pending'}</td>
                      <td className="table-actions">
                        <button
                          type="button"
                          className="btn-action btn-edit"
                          onClick={() => openEditForm(item)}
                          title="Edit item"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(item._id)}
                          title="Delete item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {showAddForm && (
          <div className="modal-overlay" onClick={closeAddForm}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>{editingItem ? `Edit Menu Item: ${editingItem.name}` : `Add Menu Item for ${cuisine?.name}`}</h3>
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Veg Type</label>
                    <select
                      value={formData.vegType}
                      onChange={(e) => setFormData({ ...formData, vegType: e.target.value })}
                    >
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Menu Category *</label>
                    <select
                      value={formData.menuCategory}
                      onChange={(e) => setFormData({ ...formData, menuCategory: e.target.value })}
                      required
                    >
                      <option value="">-- Select Menu Category --</option>
                      <option value="breakfast">Breakfast</option>
                      <option value="main">Main Course</option>
                      <option value="starters">Starters</option>
                      <option value="bbq">BBQ & Live Grills</option>
                      <option value="desserts">Sweets & Desserts</option>
                      <option value="soups">Soups & Beverages</option>
                      <option value="breads">Breads & Rice</option>
                      <option value="state-special">Traditional State Food</option>
                    </select>
                  </div>
                </div>
                 <div className="form-group">
                   <label>Description</label>
                   <textarea
                     value={formData.description}
                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                     rows="3"
                   />
                 </div>
                <div className="form-group">
                  <label>Image</label>
                  {imagePreview ? (
                    <div className="image-preview-wrapper">
                      <img src={imagePreview} alt="Preview" className="image-preview" />
                      <div className="preview-actions">
                        <button type="button" className="btn-view" onClick={() => window.open(imagePreview, '_blank')}>
                          View
                        </button>
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={handleClearImage}
                          title="Remove image"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="image-upload-wrapper">
                      <input
                        type="file"
                        id="menu-item-image"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={handleImageUpload}
                        className="file-input"
                      />
                      <label htmlFor="menu-item-image" className="file-label">Choose Image</label>
                    </div>
                  )}
                  <p className="dimension-note">Note: JPEG,JPG,PNG only. Max file size applies.</p>
                </div>
                <div className="form-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    />
                    Approved
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={closeAddForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingItem ? 'Update Item' : 'Save Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>

  );
}