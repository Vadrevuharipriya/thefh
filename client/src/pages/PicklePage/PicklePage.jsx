import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Check } from 'lucide-react';
import { COMMON_CART_ORDER_CATEGORY, readCommonCartItems, readCommonCartPlate, writeCartItems, writeCartPlate } from '../../utils/cartStorage';
import ServiceProductCard from '../../components/ServiceProductCard/ServiceProductCard';
import FloatingCartButton from '../../components/FloatingCartButton/FloatingCartButton';
import './PicklePage.scss';

// PicklePage.jsx — line 8
const HERO_IMAGE = 'https://images.pexels.com/photos/4110541/pexels-photo-4110541.jpeg?auto=compress&cs=tinysrgb&w=1600';
const ITEMS_BASE_URL = 'https://www.thefamoushalwai.com/frontEnd/items/';
const PRODUCT_CATEGORY = 'pickle';
const ORDER_CATEGORY = 'chutney-pickle';
const CART_ORDER_CATEGORY = COMMON_CART_ORDER_CATEGORY;

const normalizeProduct = (product) => ({
  id: product._id || product.id,
  name: product.name,
  price: product.price,
  image: product.image || `${ITEMS_BASE_URL}${product._id || product.id}.jpg`,
  category: product.category,
  description: product.description,
  inStock: product.inStock,
  featured: product.featured
});

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="pk-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
      <div className="pk-hero__overlay" />
      <div className="pk-hero__content">
        <nav className="pk-hero__breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <span>Our Services</span>
          <ChevronRight size={13} />
          <span>Pickle / Achhar</span>
        </nav>
        <h1 className="pk-hero__title">
          Pickle &amp; <span className="pk-hero__title-accent">Achhar</span>
        </h1>
        <p className="pk-hero__sub">
          Authentic homemade pickles — hand-crafted with traditional recipes and the finest spices.
        </p>
      </div>
    </section>
  );
}



// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PicklePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [plate, setPlate] = useState(() => readCommonCartPlate());
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const totalItems = Object.values(plate).reduce((sum, c) => sum + c, 0);
  const plateItems = useMemo(() => items.reduce((acc, item) => ({
    ...acc,
    [item.id]: { id: item.id, name: item.name, price: item.price, image: item.image, type: 'dish' }
  }), {}), [items]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchItems = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch('/api/products', { signal: controller.signal });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to fetch pickle items');
        setItems(data.filter((product) => product.category === PRODUCT_CATEGORY).map(normalizeProduct));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch pickle items');
          console.error('Failed to fetch pickle items:', err);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchItems();

    return () => controller.abort();
  }, []);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }, []);

  useEffect(() => {
    writeCartPlate(COMMON_CART_ORDER_CATEGORY, plate);
  }, [plate]);

  useEffect(() => {
    const existingItems = readCommonCartItems();
    writeCartItems(COMMON_CART_ORDER_CATEGORY, { ...existingItems, ...plateItems });
  }, [plateItems]);

  const handleAdd = (id) => {
    const item = items.find(i => i.id === id);
    setPlate(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    if (item) showToast(`${item.name} added!`);
  };

  const handleRemove = (id) => {
    setPlate(prev => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
  };

  return (
    <div className="pickle-page">
      {toast && (
        <div className="pk-toast">
          <Check size={16} />
          {toast}
        </div>
      )}
      <HeroSection />

      <div className="pk-body">
        <div className="pk-body__inner">

          {/* Header row */}
          <div className="pk-body__header">
            <div>
              <h2 className="pk-body__title">Pickle &amp; Achhar Services</h2>
              <p className="pk-body__subtitle">Select items to request a quote — handcrafted with traditional recipes</p>
            </div>
            {totalItems > 0 && (
              <button
                type="button"
                className="pk-cart-btn"
                onClick={() => navigate('/view-menu-cart', { state: { plate, plateItems, orderCategory: ORDER_CATEGORY, cartOrderCategory: CART_ORDER_CATEGORY } })}
              >
                View cart ({totalItems})
              </button>
            )}
          </div>

          {/* Product grid */}
          <div className="pk-grid">
            {loading ? (
              <p className="pk-loading">Loading pickle items...</p>
            ) : error ? (
              <p className="pk-error">{error}</p>
            ) : items.length === 0 ? (
              <p className="pk-empty">No pickle items available right now.</p>
            ) : (
              items.map((item) => (
                <ServiceProductCard
                  key={item.id}
                  item={item}
                  count={plate[item.id] || 0}
                  onAdd={handleAdd}
                  onRemove={handleRemove}
                  imageBaseUrl={ITEMS_BASE_URL}
                />
              ))
            )}
          </div>

          {/* Sticky cart bar */}
          
        </div>
      </div>

      {/* Contact strip */}
      {/* <div className="pk-contact-strip">
        <div className="pk-contact-strip__inner">
          <p className="pk-contact-strip__text">Have a question? Reach us directly.</p>
          <div className="pk-contact-strip__actions">
            <a href="tel:+918926262674" className="pk-contact-strip__btn pk-contact-strip__btn--call">
              <Phone size={15} /> +91-89262 62675
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="pk-contact-strip__btn pk-contact-strip__btn--wa">
              <MessageCircle size={15} /> WhatsApp
            </a>
          </div>
        </div>
      </div> */}
      <FloatingCartButton
        plate={plate}
        plateItems={plateItems}
        orderCategory={ORDER_CATEGORY}
        cartOrderCategory={CART_ORDER_CATEGORY}
        totalItems={totalItems}
      />
    </div>
  );
}
