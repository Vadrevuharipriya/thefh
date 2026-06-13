import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { Plus, Edit, Trash2, Search, Trash } from 'lucide-react';
import './AdminProductsPage.scss';

const CATEGORIES = [
  { id: 'bhaji', label: 'Bhaji' },
  { id: 'pickle', label: 'Pickle / Achhar' },
  { id: 'chutney', label: 'Chutney' },
  { id: 'menu_item', label: 'Menu Items' },
  { id: 'other', label: 'Other' },
];

export default function AdminProductsPage() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState('bhaji');
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'pickle',
    cuisine: '',
    menuCategory: '',
    description: '',
    image: '',
    inStock: true,
    featured: false
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryCategory = params.get('category');
    const queryCuisine = params.get('cuisineId');

    if (queryCategory) {
      setActiveCategory(queryCategory);
      setFormData((prev) => ({ ...prev, category: queryCategory }));
      if (queryCuisine) {
        setFormData((prev) => ({ ...prev, cuisine: queryCuisine }));
      }
    }

    fetchProducts();
    fetchCuisines();
  }, [location.search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.details || data?.error || 'Failed to fetch products');
      }
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCuisines = async () => {
    try {
      const res = await fetch('/api/cuisines');
      const data = await res.json();
      setCuisines(data);
    } catch (err) {
      console.error('Failed to fetch cuisines:', err);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      String(p.category || '').toLowerCase() === String(activeCategory || '').toLowerCase() &&
      (!search.trim() ||
       p.name.toLowerCase().includes(search.toLowerCase()) ||
       p.category.toLowerCase().includes(search.toLowerCase()))
  );

  const getCategoryLabel = (cat) => {
    const catObj = CATEGORIES.find(c => c.id === cat);
    return catObj ? catObj.label : cat;
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      fetchProducts();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      cuisine: typeof product.cuisine === 'object' ? product.cuisine?._id || '' : product.cuisine || '',
      menuCategory: product.menuCategory || '',
      description: product.description || '',
      image: product.image || '',
      inStock: product.inStock,
      featured: product.featured
    });
    if (product.image) setImagePreview(product.image);
    setShowModal(true);
  };

  const openCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      category: activeCategory,
      cuisine: '',
      menuCategory: '',
      description: '',
      image: '',
      inStock: true,
      featured: false
    });
    setImagePreview('');
    setShowModal(true);
  };

  const buildProductPayload = (values) => {
    const payload = {
      ...values,
      price: Number(values.price || 0),
      category: values.category || activeCategory,
      inStock: Boolean(values.inStock),
      featured: Boolean(values.featured)
    };

    if (!payload.cuisine || payload.cuisine === 'undefined' || payload.cuisine === 'null') delete payload.cuisine;
    if (!payload.menuCategory) delete payload.menuCategory;
    if (!payload.description) delete payload.description;
    if (!payload.image) delete payload.image;

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = buildProductPayload(formData);

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct._id}`
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(payload)
      });
      const responseJson = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error('Product save failed:', { status: res.status, payload, response: responseJson });
        throw new Error(responseJson.details || responseJson.error || 'Failed to save product');
      }

      const savedProduct = responseJson;
      if (savedProduct?.category && savedProduct.category !== activeCategory) {
        setActiveCategory(savedProduct.category);
      }
      setSearch('');

      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        category: 'pickle',
        cuisine: '',
        menuCategory: '',
        description: '',
        image: '',
        inStock: true,
        featured: false
      });
      setImagePreview('');
      fetchProducts();
    } catch (err) {
      console.error('Save failed:', err);
    }
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
      const token = localStorage.getItem('adminToken');
      const res = await axios.post('/api/admin/upload', uploadData, {
        headers: {
          Authorization: `Bearer ${token}`
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
    <div className="admin-products">
      <AdminSidebar />
      <main className="admin-products__main">
        <header className="admin-products__header">
          <h1>Manage {getCategoryLabel(activeCategory)} Items</h1>
          <button className="btn-primary" onClick={openCreate}>
            <Plus size={18} />
            Add New Item
          </button>
        </header>

        {/* Category Tabs */}
        <div className="admin-products__tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`tab-btn${activeCategory === cat.id ? ' tab-btn--active' : ''}`}
              onClick={() => {
                setActiveCategory(cat.id);
                setFormData((prev) => ({ ...prev, category: cat.id }));
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="admin-products__search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-products__table-container">
          <table className="admin-products__table">
            <thead>
              <tr>
                <th>Option</th>
                <th>Items Name</th>
                <th>Image</th>
                <th>Price (INR)</th>
                <th>Display Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="loading">Loading...</td>
                </tr>
              ) : (
                filteredProducts.map((product, i) => (
                  <tr key={product._id}>
                    <td>{i + 1}</td>
                    <td>{product.name}</td>
                    <td>
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="product-image-thumb" />
                      ) : (
                        <span className="no-image">-</span>
                      )}
                    </td>
                    <td>₹{product.price}</td>
                    <td>
                      <span className={`badge ${product.inStock ? 'status-active' : 'status-inactive'}`}>
                        {product.inStock ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button onClick={() => openEdit(product)}>
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(product._id)}>
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
            <h2>{editingProduct ? `Edit ${editingProduct.name}` : `Add New ${getCategoryLabel(formData.category)} Item`}</h2>
            <form onSubmit={handleSubmit}>
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
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="pickle">Pickle</option>
                    <option value="bhaji">Bhaji</option>
                    <option value="chutney">Chutney</option>
                    <option value="menu_item">Menu Item</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              {formData.category === 'menu_item' && (
                <>
                  <div className="form-group">
                    <label>Cuisine</label>
                    <select
                      value={formData.cuisine}
                      onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                      required
                    >
                      <option value="">Select Cuisine</option>
                      {cuisines.map((cuisine) => (
                        <option key={cuisine._id} value={cuisine._id}>{cuisine.name}</option>
                      ))}
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
                </>
              )}
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
                    <img src={imagePreview} alt="Product" className="image-preview" />
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
                      id="product-image"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleImageUpload}
                      className="file-input"
                    />
                    <label htmlFor="product-image" className="file-label">
                      Choose Image
                    </label>
                  </div>
                )}
              </div>
              <div className="form-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  />
                  In Stock
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  Featured
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit">{editingProduct ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}