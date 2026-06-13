import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle, Phone, MessageCircle } from 'lucide-react';
import './TiffinPage.scss';

const HERO_IMAGE = 'https://images.pexels.com/photos/弁当/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600';
const HERO_IMAGE_FALLBACK = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600';
const WHATSAPP_URL = 'https://wa.me/918926262674?text=Hello! I am interested in Tiffin Services.';

const MEALS = ['Breakfast', 'Lunch', 'Evening Snacks', 'Dinner'];
const CUISINES = ['South Indian', 'North Indian', 'China to India'];
const PEOPLE_OPTIONS = Array.from({ length: 50 }, (_, i) => `${i + 1} ${i === 0 ? 'Person' : 'People'}`);
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttarakhand', 'Uttar Pradesh',
  'West Bengal',
];

const TRUST_BADGES = [
  { icon: '🏠', label: 'Home Delivery' },
  { icon: '🍱', label: 'Fresh Daily Meals' },
  { icon: '🌿', label: 'Hygienic & Healthy' },
  { icon: '📍', label: 'Across Multiple Cities' },
];

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="tf-hero" style={{ backgroundImage: `url(${HERO_IMAGE_FALLBACK})` }}>
      <div className="tf-hero__overlay" />
      <div className="tf-hero__content">
        <nav className="tf-hero__breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <span>Our Services</span>
          <ChevronRight size={13} />
          <span>Tiffin Services</span>
        </nav>
        <h1 className="tf-hero__title">
          Tiffin <span className="tf-hero__title-accent">Services</span>
        </h1>
        <p className="tf-hero__sub">
          Healthy, homestyle tiffin meals delivered to your doorstep — daily or as per your schedule.
        </p>
      </div>
    </section>
  );
}

// ─── Trust Bar ────────────────────────────────────────────────────────────────
function TrustBar() {
  return (
    <div className="tf-trust-bar">
      {TRUST_BADGES.map((b) => (
        <div key={b.label} className="tf-trust-bar__item">
          <span className="tf-trust-bar__icon">{b.icon}</span>
          <span className="tf-trust-bar__label">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────
function TiffinForm() {
  const [form, setForm] = useState({
    meals: [],
    cuisine: '',
    serviceTime: '',
    people: '',
    name: '',
    phone: '',
    state: '',
    city: '',
    address: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleMeal = (meal) => {
    setForm((prev) => {
      const arr = prev.meals;
      return { ...prev, meals: arr.includes(meal) ? arr.filter((m) => m !== meal) : [...arr, meal] };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="tf-success">
        <CheckCircle size={56} className="tf-success__icon" />
        <h2 className="tf-success__title">Enquiry Submitted!</h2>
        <p className="tf-success__msg">
          Thank you, <strong>{form.name}</strong>! Our team will contact you at{' '}
          <strong>{form.phone}</strong> to confirm your tiffin schedule.
        </p>
        <div className="tf-success__actions">
          <Link to="/" className="tf-success__btn tf-success__btn--primary">Back to Home</Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="tf-success__btn tf-success__btn--whatsapp">
            <MessageCircle size={17} /> Chat on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="tf-form" onSubmit={handleSubmit} noValidate>
      <p className="tf-form__subtitle">
        We are providing the best Tiffin Services near your location. Please fill up the form below.
      </p>

      {/* Meals */}
      <div className="tf-form__group">
        <label className="tf-form__label"><span className="tf-form__req">*</span> Select Meals</label>
        <div className="tf-toggle-group">
          {MEALS.map((meal) => (
            <button
              key={meal}
              type="button"
              className={`tf-toggle-btn${form.meals.includes(meal) ? ' tf-toggle-btn--active' : ''}`}
              onClick={() => toggleMeal(meal)}
            >
              {meal}
            </button>
          ))}
        </div>
      </div>

      {/* Row: Cuisine + Service Time */}
      <div className="tf-form__row">
        <div className="tf-form__group">
          <label className="tf-form__label"><span className="tf-form__req">*</span> Select Cuisine</label>
          <select
            className="tf-form__select"
            value={form.cuisine}
            onChange={(e) => set('cuisine', e.target.value)}
            required
          >
            <option value="">— Select Cuisine —</option>
            {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="tf-form__group">
          <label className="tf-form__label"><span className="tf-form__req">*</span> Service Time</label>
          <input
            type="time"
            className="tf-form__input"
            value={form.serviceTime}
            onChange={(e) => set('serviceTime', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Row: No. of People */}
      <div className="tf-form__row">
        <div className="tf-form__group">
          <label className="tf-form__label"><span className="tf-form__req">*</span> No. of People</label>
          <select
            className="tf-form__select"
            value={form.people}
            onChange={(e) => set('people', e.target.value)}
            required
          >
            <option value="">— Select One —</option>
            {PEOPLE_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="tf-form__group">
          <label className="tf-form__label"><span className="tf-form__req">*</span> Contact Name</label>
          <input
            type="text"
            className="tf-form__input"
            placeholder="Your Full Name"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Row: Phone + State */}
      <div className="tf-form__row">
        <div className="tf-form__group">
          <label className="tf-form__label"><span className="tf-form__req">*</span> Mobile Number</label>
          <input
            type="tel"
            className="tf-form__input"
            placeholder="eg. 98xxxxxx10"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            required
          />
        </div>

        <div className="tf-form__group">
          <label className="tf-form__label"><span className="tf-form__req">*</span> Select State</label>
          <select
            className="tf-form__select"
            value={form.state}
            onChange={(e) => set('state', e.target.value)}
            required
          >
            <option value="">— Select State —</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Row: City + Address */}
      <div className="tf-form__row">
        <div className="tf-form__group">
          <label className="tf-form__label"><span className="tf-form__req">*</span> Enter City</label>
          <input
            type="text"
            className="tf-form__input"
            placeholder="Your City"
            value={form.city}
            onChange={(e) => set('city', e.target.value)}
            required
          />
        </div>

        <div className="tf-form__group">
          <label className="tf-form__label"><span className="tf-form__req">*</span> Delivery Address</label>
          <input
            type="text"
            className="tf-form__input"
            placeholder="Full delivery address"
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="tf-form__footer">
        <button type="submit" className="tf-form__submit">Submit Enquiry</button>
        <p className="tf-form__privacy">🔒 Your details are safe with us. We never share your data.</p>
      </div>
    </form>
  );
}

// ─── Contact Aside ─────────────────────────────────────────────────────────────
function ContactAside() {
  return (
    <aside className="tf-aside">
      <div className="tf-aside__card">
        <span className="tf-aside__emoji">📞</span>
        <h3 className="tf-aside__title">Prefer to call?</h3>
        <p className="tf-aside__desc">Talk to our team and get your tiffin schedule confirmed quickly.</p>
        <a href="tel:+918926262674" className="tf-aside__btn tf-aside__btn--red">
          <Phone size={16} /> +91-89262 62674
        </a>
        <a href="tel:+918926262675" className="tf-aside__btn tf-aside__btn--outline">
          <Phone size={16} /> +91-89262 62675
        </a>
      </div>

      <div className="tf-aside__card tf-aside__card--whatsapp">
        <span className="tf-aside__emoji">💬</span>
        <h3 className="tf-aside__title tf-aside__title--white">Chat on WhatsApp</h3>
        <p className="tf-aside__desc tf-aside__desc--white">Get instant responses from our team.</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="tf-aside__btn tf-aside__btn--white">
          <MessageCircle size={16} /> Chat Now
        </a>
      </div>

      <div className="tf-aside__info">
        <h4 className="tf-aside__info-title">Why choose our Tiffin?</h4>
        {[
          'Fresh, hygienic homestyle meals',
          'Customisable menu preferences',
          'Delivered on time, every day',
          'Affordable monthly plans',
        ].map((item) => (
          <div key={item} className="tf-aside__check-item">
            <CheckCircle size={14} className="tf-aside__check-icon" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function TiffinPage() {
  return (
    <div className="tiffin-page">
      <HeroSection />
      <TrustBar />
      <div className="tf-body">
        <div className="tf-body__inner">
          <div className="tf-body__left">
            <div className="tf-form-card">
              <h2 className="tf-form-card__heading">Tiffin Services</h2>
              <TiffinForm />
            </div>
          </div>
          <ContactAside />
        </div>
      </div>
    </div>
  );
}
