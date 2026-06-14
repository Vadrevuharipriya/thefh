import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, CheckCircle, Phone, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { clearAllCarts } from '../../utils/cartStorage';
import OrderInquiryForm from '../../components/OrderInquiryForm/OrderInquiryForm';
import './EnquiryPage.scss';

const LOCATIONS = ['Delhi NCR', 'Noida', 'Gurugram', 'Faridabad', 'Ghaziabad', 'Lucknow', 'Jaipur', 'Chandigarh', 'Dehradun', 'Other'];

const HERO_IMAGE = 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1600';
const WHATSAPP_URL = 'https://wa.me/918926262675?text=Hello! I am looking for a Halwai %26 Chefs?';

const ENQUIRY_TYPES = [
  { value: 'halwai-chef-caterers', label: 'Halwai/Chef/Caterers' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'tiffin-services', label: 'Tiffin Services Inquiry' },
  { value: 'venue', label: 'Venue Inquiry' },
];

const ORDER_CATEGORIES = {
  'customized-plate': { enquiryType: 'halwai-chef-caterers', label: 'Customized Plate' },
  'bhaji-orders': { enquiryType: 'halwai-chef-caterers', label: 'Bhaji Orders' },
  'chutney-pickle': { enquiryType: 'halwai-chef-caterers', label: 'Chutney/Pickle' },
};

const PEOPLE_OPTIONS = ['25', '50', '75', '100', '150', '200', '300', '500', '1000', '2000+'];

const TIME_OPTIONS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

// ─── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="eq-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
      <div className="eq-hero__overlay" />
      <div className="eq-hero__content">
        <nav className="eq-hero__breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <span>Book Halwai &amp; Chefs</span>
        </nav>
        <h1 className="eq-hero__title">
          Book Halwai &amp; <span className="eq-hero__title-accent">Chefs</span>
        </h1>
        <p className="eq-hero__sub">
          Verified professionals at your doorstep — for every occasion, every cuisine.
        </p>
      </div>
    </section>
  );
}

// ─── Trust badges ──────────────────────────────────────────────────────────────
const TRUST_BADGES = [
  { icon: '✅', label: 'Verified Professionals' },
  { icon: '🍽️', label: 'All Cuisines Covered' },
  { icon: '⏰', label: 'On-Time Guarantee' },
  { icon: '💰', label: 'Transparent Pricing' },
];

function TrustBar() {
  return (
    <div className="eq-trust-bar">
      {TRUST_BADGES.map((b) => (
        <div key={b.label} className="eq-trust-bar__item">
          <span className="eq-trust-bar__icon">{b.icon}</span>
          <span className="eq-trust-bar__label">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Contact Aside ──────────────────────────────────────────────────────────────
function MobileFormHeader({ title }) {
  const navigate = useNavigate();

  return (
    <div className="eq-mobile-header">
      <button type="button" className="eq-mobile-header__back" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
      </button>
      <h1 className="eq-mobile-header__title">{title}</h1>
    </div>
  );
}

function ContactAside() {
  return (
    <aside className="eq-aside">
      <div className="eq-aside__card">
        <span className="eq-aside__emoji">📞</span>
        <h3 className="eq-aside__title">Prefer to call?</h3>
        <p className="eq-aside__desc">Talk to our team directly and get a personalised quote in minutes.</p>
        <a href="tel:+918926262675" className="eq-aside__btn eq-aside__btn--red">
          <Phone size={16} /> +91-89262 62675
        </a>
      </div>
      <div className="eq-aside__card eq-aside__card--whatsapp">
        <span className="eq-aside__emoji">💬</span>
        <h3 className="eq-aside__title eq-aside__title--white">Chat on WhatsApp</h3>
        <p className="eq-aside__desc eq-aside__desc--white">Get instant responses from our team via WhatsApp.</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="eq-aside__btn eq-aside__btn--white">
          <MessageCircle size={16} /> Chat Now
        </a>
      </div>
      <div className="eq-aside__info">
        <h4 className="eq-aside__info-title">Serving Cities</h4>
        <div className="eq-aside__cities">
          {LOCATIONS.map((city) => (
            <span key={city} className="eq-aside__city-chip">{city}</span>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── Enquiry Form ──────────────────────────────────────────────────────────────
function EnquiryForm({ preSelectedOccasion, orderCategory: propOrderCategory, initialMessage = '' }) {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 7);
  const maxDate = maxDateObj.toISOString().split('T')[0];
  const orderCategory = propOrderCategory || '';
  const orderCategoryInfo = ORDER_CATEGORIES[orderCategory];
  const isOrderCategory = ['customized-plate', 'bhaji-orders', 'chutney-pickle'].includes(orderCategory);
  const initialEnquiryType = orderCategoryInfo ? orderCategoryInfo.enquiryType : 'general';

  const [form, setForm] = useState({
    occasion: preSelectedOccasion || '',
    location: '',
    people: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    pincode: '',
    address: '',
    message: initialMessage,
    enquiryType: initialEnquiryType,
    orderCategory: orderCategory,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [occasions, setOccasions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingOccasions, setLoadingOccasions] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.email) {
      setForm(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [occRes, locRes] = await Promise.all([
          axios.get('/api/occasions'),
          axios.get('/api/locations')
        ]);
        setOccasions(occRes.data);
        setLocations(locRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoadingOccasions(false);
        setLoadingLocations(false);
      }
    };
    fetchData();
  }, []);

  // Update enquiryType when orderCategory is provided
  useEffect(() => {
    if (orderCategory && orderCategoryInfo) {
      setForm(prev => ({ ...prev, enquiryType: orderCategoryInfo.enquiryType, orderCategory }));
    }
  }, [orderCategory, orderCategoryInfo]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    const missingFields = [];
    if (!form.location?.trim()) missingFields.push('Location');
    if (!form.people?.trim()) missingFields.push('No of People');
    if (!form.occasion?.trim()) missingFields.push('Occasion');
    if (!form.date?.trim()) missingFields.push('Date');
    if (!form.time?.trim()) missingFields.push('Time');
    if (!form.name?.trim()) missingFields.push('Full Name');
    if (!form.phone?.trim()) missingFields.push('Contact Number');
    if (!form.email?.trim()) missingFields.push('Email Address');
    if (!form.pincode?.trim()) missingFields.push('Pincode');
    if (!form.address?.trim()) missingFields.push('Full Address');

    if (missingFields.length > 0) {
      setError('Fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const endpoint = isOrderCategory ? '/api/order-inquiry' : '/api/enquiries/enquiry';
      const payload = {
        ...form,
        deliveryAddress: form.address,
        deliveryTime: form.time,
        deliveryDate: form.date,
        quantity: form.people ? Number(form.people) : undefined,
        specialInstructions: form.message || undefined,
        category: form.orderCategory || form.category,
      };

      console.log('[EnquiryForm] Submitting payload:', payload);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      if (!response.ok) {
        console.error('[EnquiryForm] Backend response error:', responseData);
        throw new Error(responseData?.details || responseData?.error || 'Failed to submit');
      }
      clearAllCarts();
      setSubmitted(true);
    } catch (err) {
      console.error('[EnquiryForm] Submission error:', err);
      setError(err.message || 'Failed to submit enquiry. Please try again.');
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="eq-success">
        <div className="eq-success__card">
          <CheckCircle size={54} className="eq-success__icon" />
          <h2 className="eq-success__title">Enquiry Submitted!</h2>
          <p className="eq-success__msg">
            Thank you, <strong>{form.name}!</strong> Our customer representative will contact you shortly at <strong>{form.phone}</strong>.
          </p>
          <div className="eq-success__actions">
            <Link to="/" className="eq-success__btn eq-success__btn--primary">Back to Home</Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="eq-success__btn eq-success__btn--whatsapp">
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="eq-form" onSubmit={handleSubmit} noValidate>
      <p className="eq-form__subtitle">
        Please fill out your information below and our Customer Representative will contact you shortly.
      </p>

      {/* Hidden orderCategory field for auto-categorization */}
      {orderCategory && (
        <input type="hidden" name="orderCategory" value={orderCategory} />
      )}

      {/* Row: Occasion + Location */}
      <div className="eq-form__row">
        <div className="eq-form__group">
          <label className="eq-form__label"><span className="eq-form__req">*</span> Select Location</label>
          <select
            className="eq-form__select"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
            disabled={loadingLocations}
          >
            <option value="">— Select Location * —</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc.name}>{loc.name}</option>
            ))}
          </select>
        </div>

        <div className="eq-form__group">
          <label className="eq-form__label"><span className="eq-form__req">*</span> No of People</label>
          <select
            className="eq-form__select"
            value={form.people}
            onChange={(e) => setForm({ ...form, people: e.target.value })}
            required
          >
            <option value="">— No of People * —</option>
            {PEOPLE_OPTIONS.map((count) => (
              <option key={count} value={count}>{count}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="eq-form__row">
        <div className="eq-form__group">
          <label className="eq-form__label"><span className="eq-form__req">*</span> Select Occasion</label>
          <select
            className="eq-form__select"
            value={form.occasion}
            onChange={(e) => setForm({ ...form, occasion: e.target.value })}
            required
            disabled={loadingOccasions}
          >
            <option value="">— Select Occasion * —</option>
            {occasions.map((occ) => (
              <option key={occ._id} value={occ.name}>{occ.name}</option>
            ))}
          </select>
        </div>

        <div className="eq-form__group">
          <label className="eq-form__label"><span className="eq-form__req">*</span> Select Date</label>
          <input
            type="date"
            className="eq-form__input eq-form__input--date"
            min={today}
            max={maxDate}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="eq-form__row">
        <div className="eq-form__group">
          <label className="eq-form__label"><span className="eq-form__req">*</span> Select Time</label>
          <select
            className="eq-form__select"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            required
          >
            <option value="">— Select Time * —</option>
            {TIME_OPTIONS.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row: Enquiry Type - hidden when order category is specified */}
       {!orderCategory && (
        <div className="eq-form__row">
          <div className="eq-form__group">
            <label className="eq-form__label"><span className="eq-form__req">*</span> Inquiry Type</label>
            <select
              className="eq-form__select"
              value={form.enquiryType}
              onChange={(e) => set('enquiryType', e.target.value)}
              required
            >
              {ENQUIRY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
       )}

       {/* Row: Full Name + Contact */}
       <div className="eq-form__row">
        <div className="eq-form__group">
          <label className="eq-form__label"><span className="eq-form__req">*</span> Full Name</label>
          <input
            type="text"
            className="eq-form__input"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
          />
        </div>

        <div className="eq-form__group">
          <label className="eq-form__label"><span className="eq-form__req">*</span> Contact Number</label>
          <input
            type="tel"
            className="eq-form__input"
            placeholder="Contact Number"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Row: Email + Pincode */}
      <div className="eq-form__row">
        <div className="eq-form__group">
          <label className="eq-form__label"><span className="eq-form__req">*</span> Email Address</label>
          <input
            type="email"
            className="eq-form__input"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            required
          />
        </div>

          <div className="eq-form__group">
            <label className="eq-form__label"><span className="eq-form__req">*</span> Enter Pincode</label>
            <input
              type="text"
              className="eq-form__input"
              placeholder="Enter Pincode"
              value={form.pincode}
              onChange={(e) => set('pincode', e.target.value)}
              required
            />
          </div>
        </div>
      )}

      <div className="eq-form__row">
        <div className="eq-form__group">
          <label className="eq-form__label"><span className="eq-form__req">*</span> Enter Full Address</label>
          <textarea
            className="eq-form__input eq-form__textarea"
            rows="3"
            placeholder="Enter Full Address"
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="eq-form__row">
        <div className="eq-form__group">
          <label className="eq-form__label">Any Special Requirement</label>
          <textarea
            className="eq-form__input eq-form__textarea"
            rows="3"
            placeholder="Any special requirement"
            value={form.message}
            onChange={(e) => set('message', e.target.value)}
          />
        </div>
      </div>

      <div className="eq-form__footer">
        <button type="submit" className="eq-form__submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Send Enquiry'}
        </button>
        {error && <p className="eq-form__error">{error}</p>}
        <p className="eq-form__privacy">
          🔒 Your details are safe with us. We never share your data.
        </p>
      </div>
    </form>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
function buildPlateSummary(plate, plateItems = {}) {
  if (!plate || typeof plate !== 'object') return '';
  const idMap = { ...plateItems };
  return Object.entries(plate)
    .filter(([, count]) => count > 0)
    .map(([id, count]) => {
      const name = idMap[id]?.name || 'Unknown item';
      return `${name} x ${count}`;
    })
    .join(', ');
}

export default function EnquiryPage() {
  const location = useLocation();
  const incomingPlate = location.state?.plate || null;
  const initialPlateItems = location.state?.plateItems || {};
  const [resolvedPlateItems, setResolvedPlateItems] = useState(initialPlateItems);
  const orderCategory = location.state?.orderCategory || null;
  const cartOrderCategory = location.state?.cartOrderCategory || null;
  const preSelectedOccasion = location.state?.occasion || new URLSearchParams(location.search).get('occasion');

  // Check if this is an order category inquiry
  const isOrderCategory = ['customized-plate', 'bhaji-orders', 'chutney-pickle'].includes(orderCategory);

  // If it's an order category, show the new form directly
  if (isOrderCategory) {
    return <OrderInquiryForm plateData={incomingPlate} orderCategory={orderCategory} cartOrderCategory={cartOrderCategory} plateSummary="" />;
  }

  useEffect(() => {
    if (!incomingPlate) return;

    const plateIds = Object.keys(incomingPlate);
    const missingIds = plateIds.filter((id) => !resolvedPlateItems[id]);
    if (missingIds.length === 0) return;

    const fetchMissingItems = async () => {
      try {
        const responses = await Promise.all(
          missingIds.map((id) => axios.get(`/api/products/${id}`).then((res) => res.data).catch(() => null))
        );

        const fetchedMap = responses.reduce((acc, product, index) => {
          const id = missingIds[index];
          if (product) {
            acc[id] = {
              id,
              name: product.name,
              price: product.price,
              image: product.image,
              veg: product.vegType === 'Vegetarian',
            };
          }
          return acc;
        }, {});

        if (Object.keys(fetchedMap).length > 0) {
          setResolvedPlateItems((prev) => ({ ...prev, ...fetchedMap }));
        }
      } catch (err) {
        console.error('[EnquiryPage] Failed to resolve plate item names:', err);
      }
    };

    fetchMissingItems();
  }, [incomingPlate, resolvedPlateItems]);

  const orderCategoryInfo = ORDER_CATEGORIES[orderCategory || ''] || null;
  const plateSummary = useMemo(
    () => (incomingPlate ? buildPlateSummary(incomingPlate, resolvedPlateItems) : ''),
    [incomingPlate, resolvedPlateItems]
  );
  const formHeading = orderCategoryInfo
    ? `Book ${orderCategoryInfo.label}`
    : incomingPlate
      ? 'Confirm Your Menu Selection'
      : 'Enquiry Now';

  return (
    <div className="enquiry-page">
      <MobileFormHeader title="Please share details" />
      <HeroSection />
      <TrustBar />
      <div className="eq-body">
        <div className="eq-body__inner">
          <div className="eq-body__left">
            <div className="eq-form-card">
              <h2 className="eq-form-card__heading">{formHeading}</h2>
              <EnquiryForm preSelectedOccasion={preSelectedOccasion} orderCategory={orderCategory} initialMessage={plateSummary} />
            </div>
          </div>
          <ContactAside />
        </div>
      </div>
    </div>
  );
}
