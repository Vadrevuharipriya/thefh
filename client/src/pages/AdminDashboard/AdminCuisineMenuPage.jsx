import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdminCuisine, useAdminCuisineMenu } from '../../hooks/admin/useAdminCuisine';
import { useCreateAdminProduct, useUpdateAdminProduct, useDeleteAdminProduct } from '../../hooks/admin/useAdminProduct';
import axios from 'axios';
import { Edit, Trash2 } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminCuisineMenuPage.scss';

export default function AdminCuisineMenuPage() {
  const { cuisineId } = useParams();
  const { data: cuisine, isLoading: loadingCuisine, isError: cuisineError, refetch: refetchCuisine } = useAdminCuisine(cuisineId);
  const { data: menuItemsData, isLoading: loadingMenu, isError: menuError, refetch: refetchMenu } = useAdminCuisineMenu(cuisineId);
  
  const menuItems = Array.isArray(menuItemsData) ? menuItemsData : [];
  const loading = loadingCuisine || loadingMenu;
  const isError = cuisineError || menuError;

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

  const fetchData = useCallback(() => {
    refetchCuisine();
    refetchMenu();
  }, [refetchCuisine, refetchMenu]);

  const { mutateAsync: createProduct } = useCreateAdminProduct();
  const { mutateAsync: updateProduct } = useUpdateAdminProduct();
  const { mutateAsync: deleteProduct } = useDeleteAdminProduct();

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

    const fd = new FormData();
    fd.append('image', file);

    try {
      const res = await axios.post('/api/admin/upload', fd, {
        headers: {
        }
      });
      setFormData(prev => ({ ...prev, image: res.data.url }));
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
        const res2 = await axios.post('/api/admin/upload', { image: reader }, {
          headers: {
          }
        });
        setFormData(prev => ({ ...prev, image: res2.data.url }));
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

     // Client-side validation
     if (!formData.name || String(formData.name).trim() === '') {
       setError('Product name is required');
       return;
     }
     if (formData.price === '' || formData.price === null || Number.isNaN(Number(formData.price))) {
       setError('Product price is required and must be a number');
       return;
     }

     try {
       const payload = {
         ...formData,
         price: Number(formData.price),
         category: 'menu_item', // explicitly set category to menu_item for cuisine items
         cuisine: cuisineId
       };
 
       if (editingItem) {
         // Update existing item
         await updateProduct({ id: editingItem._id, data: payload });
       } else {
         // Create new item
         await createProduct(payload);
       }
       closeAddForm();
     } catch (err) {
       console.error('Item operation failed:', err);
       setError(err.response?.data?.error || err.message || 'Operation failed');
     }
   };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteProduct(itemId);
    } catch (err) {
      console.error('Delete failed:', err);
      setError(err.response?.data?.error || err.message || 'Failed to delete item');
    }
  };

  return (
    <div className="admin-cuisine-menu-page">
      <AdminSidebar />
      <main className="admin-cuisine-menu-content">
        <div className="page-header">
          <div>
            <h2>{cuisine?.name} Cuisine Items</h2>
            <p className="table-subtitle">{cuisine?.shortDescription}</p>
          </div>
          <div className="page-header-actions">
            <button type="button" className="btn btn-primary" onClick={openAddForm}>
              + Add Item
            </button>
            <Link to="/admin/cuisine" className="btn btn-back">← Back to Cuisines</Link>
          </div>
        </div>

        <div className="content-wrapper">
          <div className="table-card">
            <div className="table-header">
              <h3>Items List</h3>
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
                <p>Loading items...</p>
              </div>
            )}

            {!loading && !error && menuItems.length === 0 && (
              <div className="table-empty">
                <div className="table-empty-icon">📝</div>
                <h4>No items found</h4>
                <p>This cuisine does not have any items yet.</p>
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
              <h3>{editingItem ? `Edit Item: ${editingItem.name}` : `Add Item for ${cuisine?.name}`}</h3>
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