import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Check } from 'lucide-react';
import { COMMON_CART_ORDER_CATEGORY, readCommonCartItems, readCommonCartPlate, writeCartItems, writeCartPlate } from '../../utils/cartStorage';
import ServiceProductCard from '../../components/ServiceProductCard/ServiceProductCard';
import FloatingCartButton from '../../components/FloatingCartButton/FloatingCartButton';
import './ChutneysPage.scss';

const HERO_IMAGE = 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?auto=compress&cs=tinysrgb&w=1600';
const ITEMS_BASE_URL = 'https://www.thefamoushalwai.com/frontEnd/items/';
const PRODUCT_CATEGORY = 'chutney';
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
    <section className="ch-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
      <div className="ch-hero__overlay" />
      <div className="ch-hero__content">
        <nav className="ch-hero__breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <span>Our Services</span>
          <ChevronRight size={13} />
          <span>Chutney Services</span>
        </nav>
        <h1 className="ch-hero__title">
          Chutney <span className="ch-hero__title-accent">Services</span>
        </h1>
        <p className="ch-hero__sub">
          Homemade chutneys crafted with fresh ingredients — order online and enjoy authentic flavours at home.
        </p>
      </div>
    </section>
  );
}



// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ChutneysPage() {
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
        if (!res.ok) throw new Error(data?.error || 'Failed to fetch chutney items');
        setItems(data.filter((product) => product.category === PRODUCT_CATEGORY).map(normalizeProduct));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch chutney items');
          console.error('Failed to fetch chutney items:', err);
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
    <div className="chutneys-page">
      {toast && (
        <div className="ch-toast">
          <Check size={16} />
          {toast}
        </div>
      )}
      <HeroSection />

      <div className="ch-body">
        <div className="ch-body__inner">

          {/* Header row */}
          <div className="ch-body__header">
            <div>
              <h2 className="ch-body__title">Chutney Services</h2>
              <p className="ch-body__subtitle">Select items to request a quote — made fresh with natural ingredients</p>
            </div>
            {totalItems > 0 && (
              <button
                type="button"
                className="ch-cart-btn"
                onClick={() => navigate('/view-menu-cart', { state: { plate, plateItems, orderCategory: ORDER_CATEGORY, cartOrderCategory: CART_ORDER_CATEGORY } })}
              >
                View cart ({totalItems})
              </button>
            )}
          </div>

          {/* Product grid */}
          <div className="ch-grid">
            {loading ? (
              <p className="ch-loading">Loading chutney items...</p>
            ) : error ? (
              <p className="ch-error">{error}</p>
            ) : items.length === 0 ? (
              <p className="ch-empty">No chutney items available right now.</p>
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
      {/* <div className="ch-contact-strip">
        <div className="ch-contact-strip__inner">
          <p className="ch-contact-strip__text">Have a question? Reach us directly.</p>
          <div className="ch-contact-strip__actions">
            <a href="tel:+918926262674" className="ch-contact-strip__btn ch-contact-strip__btn--call">
              <Phone size={15} /> +91-89262 62674
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="ch-contact-strip__btn ch-contact-strip__btn--wa">
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
