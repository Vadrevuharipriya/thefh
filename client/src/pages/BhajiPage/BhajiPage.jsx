import { useState, useEffect, useCallback, useMemo } from 'react';
import { useProducts } from '../../hooks/public/useProducts';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Check } from 'lucide-react';
import { COMMON_CART_ORDER_CATEGORY, readCommonCartItems, readCommonCartPlate, writeCartItems, writeCartPlate } from '../../utils/cartStorage';
import ServiceProductCard from '../../components/ServiceProductCard/ServiceProductCard';
import FloatingCartButton from '../../components/FloatingCartButton/FloatingCartButton';
import './BhajiPage.scss';

const HERO_IMAGE = 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1600';
const ITEMS_BASE_URL = 'https://www.thefamoushalwai.com/frontEnd/items/';
const PRODUCT_CATEGORY = 'bhaji';
const ORDER_CATEGORY = 'bhaji-orders';
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
    <section className="bj-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
      <div className="bj-hero__overlay" />
      <div className="bj-hero__content">
        <nav className="bj-hero__breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <span>Our Services</span>
          <ChevronRight size={13} />
          <span>Bhaji Services</span>
        </nav>
        <h1 className="bj-hero__title">
          Bhaji <span className="bj-hero__title-accent">Services</span>
        </h1>
        <p className="bj-hero__sub">
          Authentic Indian mithai &amp; snacks — freshly made with desi ghee, delivered for weddings and gifting.
        </p>
      </div>
    </section>
  );
}



// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BhajiPage() {
  const { data: serverItems, isLoading: loading, isError, error: queryError } = useProducts();
  const error = isError ? queryError?.message || 'Failed to fetch bhaji items' : '';
  const [plate, setPlate] = useState(() => readCommonCartPlate());
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const items = useMemo(() => {
    if (!serverItems) return [];
    return serverItems.filter((product) => product.category === PRODUCT_CATEGORY).map(normalizeProduct);
  }, [serverItems]);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const totalItems = Object.values(plate).reduce((sum, c) => sum + c, 0);
  const plateItems = useMemo(() => items.reduce((acc, item) => ({
    ...acc,
    [item.id]: { id: item.id, name: item.name, price: item.price, image: item.image, type: 'dish' }
  }), {}), [items]);

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
    <div className="bhaji-page">
      {toast && (
        <div className="bj-toast">
          <Check size={16} />
          {toast}
        </div>
      )}
      <HeroSection />

      <div className="bj-body">
        <div className="bj-body__inner">

          {/* Header row */}
          <div className="bj-body__header">
            <div>
              <h2 className="bj-body__title">Bhaji Services</h2>
              <p className="bj-body__subtitle">Select items to request a quote — freshly prepared on order</p>
            </div>
            {totalItems > 0 && (
              <button
                type="button"
                className="bj-cart-btn"
                onClick={() => navigate('/view-menu-cart', { state: { plate, plateItems, orderCategory: ORDER_CATEGORY, cartOrderCategory: CART_ORDER_CATEGORY } })}
              >
                View cart ({totalItems})
              </button>
            )}
          </div>

          {/* Product grid */}
          <div className="bj-grid">
            {loading ? (
              <p className="bj-loading">Loading bhaji items...</p>
            ) : error ? (
              <p className="bj-error">{error}</p>
            ) : items.length === 0 ? (
              <p className="bj-empty">No bhaji items available right now.</p>
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
        </div>
      </div>

      {/* Contact strip */}
      {/* <div className="bj-contact-strip">
        <div className="bj-contact-strip__inner">
          <p className="bj-contact-strip__text">Have a question? Reach us directly.</p>
          <div className="bj-contact-strip__actions">
            <a href="tel:+918926262674" className="bj-contact-strip__btn bj-contact-strip__btn--call">
              <Phone size={15} /> +91-89262 62674
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="bj-contact-strip__btn bj-contact-strip__btn--wa">
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
