import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle, Phone, MessageCircle } from 'lucide-react';
import './CloudKitchenPage.scss';

const HERO_IMAGE = 'https://images.pexels.com/photos/3338681/pexels-photo-3338681.jpeg?auto=compress&cs=tinysrgb&w=1600';
const WHATSAPP_URL = 'https://wa.me/918926262674?text=Hello! I am interested in Cloud Kitchen services.';

const LOCATIONS = [
  'Delhi NCR', 'Dehradun', 'Haridwar', 'Faridabad', 'Rishikesh',
  'Lucknow', 'Jaipur', 'Tehri Garhwal', 'Noida', 'Gurugram',
  'Ghaziabad', 'Yamunanagar', 'Chandigarh', 'Saharanpur',
];

const REQUIREMENTS = [
  'Birthday Party', 'Wedding Functions', 'House Party', 'Pooja at Home',
  'Anniversary', 'Roka Ceremony', 'Mehendi Cocktail', 'Baby Shower',
  'Kids Party', 'Corporate Event', 'Bachelor Party', 'Other Occasion',
  'Cocktail and Sangeet', 'Gala Evening', 'High Tea Menu',
  'No Onion No Garlic', 'Continental Food', 'Royal Lunch',
];

const MEALS = ['Breakfast', 'Lunch', 'Evening Snacks', 'Dinner'];

const CUISINES = [
  'South Indian', 'North Indian', 'China to India',
  'Flame Grilled to Perfection', 'Mithas Dil Se',
  'Soups & Beverages', 'Breads, Rice and Raita',
];


const TRUST_BADGES = [
  { icon: '🍳', label: 'Cloud Kitchen Setup' },
  { icon: '📦', label: 'Packaged Deliveries' },
  { icon: '✅', label: 'Verified Professionals' },
  { icon: '💰', label: 'Transparent Pricing' },
];

// ─── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="ck-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
      <div className="ck-hero__overlay" />
      <div className="ck-hero__content">
        <nav className="ck-hero__breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <span>Our Services</span>
          <ChevronRight size={13} />
          <span>Cloud Kitchen</span>
        </nav>
        <h1 className="ck-hero__title">
          Cloud <span className="ck-hero__title-accent">Kitchen</span>
        </h1>
        <p className="ck-hero__sub">
          Expand your reach with our managed cloud kitchen services — authentic home-style food, delivered fresh to your guests.
        </p>
      </div>
    </section>
  );
}

// ─── Trust Bar ────────────────────────────────────────────────────────────────
function TrustBar() {
  return (
    <div className="ck-trust-bar">
      {TRUST_BADGES.map((b) => (
        <div key={b.label} className="ck-trust-bar__item">
          <span className="ck-trust-bar__icon">{b.icon}</span>
          <span className="ck-trust-bar__label">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────
function CloudKitchenForm() {
  const today = new Date().toISOString().split('T')[0];
  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 7);
  const maxDate = maxDateObj.toISOString().split('T')[0];
  const [form, setForm] = useState({
    location: '', requirement: '', name: '', phone: '',
    email: '', date: '', meals: [], cuisines: [],
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleArray = (key, value) => {
    setForm((prev) => {
      const arr = prev[key];
      return { ...prev, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="ck-success">
        <CheckCircle size={56} className="ck-success__icon" />
        <h2 className="ck-success__title">Enquiry Submitted!</h2>
        <p className="ck-success__msg">
          Thank you, <strong>{form.name}</strong>! Our customer representative will contact you shortly at{' '}
          <strong>{form.phone}</strong>.
        </p>
        <div className="ck-success__actions">
          <Link to="/" className="ck-success__btn ck-success__btn--primary">Back to Home</Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="ck-success__btn ck-success__btn--whatsapp">
            <MessageCircle size={17} /> Chat on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="ck-form" onSubmit={handleSubmit} noValidate>
      <p className="ck-form__subtitle">
        Please fill out your information below and our Customer Representative will contact you shortly.
      </p>

      <div className="ck-form__row">
        <div className="ck-form__group">
          <label className="ck-form__label"><span className="ck-form__req">*</span> Services Location</label>
          <select className="ck-form__select" value={form.location} onChange={(e) => set('location', e.target.value)} required>
            <option value="">— Service Location * —</option>
            {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="ck-form__group">
          <label className="ck-form__label"><span className="ck-form__req">*</span> Select Requirement</label>
          <select className="ck-form__select" value={form.requirement} onChange={(e) => set('requirement', e.target.value)} required>
            <option value="">— Select One —</option>
            {REQUIREMENTS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="ck-form__row">
        <div className="ck-form__group">
          <label className="ck-form__label"><span className="ck-form__req">*</span> Your Name</label>
          <input type="text" className="ck-form__input" placeholder="Your Name"
            value={form.name} onChange={(e) => set('name', e.target.value)} required />
        </div>
        <div className="ck-form__group">
          <label className="ck-form__label"><span className="ck-form__req">*</span> Mobile Phone No.</label>
          <input type="tel" className="ck-form__input" placeholder="eg. 98xxxxxx10"
            value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
        </div>
      </div>

      <div className="ck-form__row">
        <div className="ck-form__group">
          <label className="ck-form__label"><span className="ck-form__req">*</span> Email Address</label>
          <input type="email" className="ck-form__input" placeholder="Email Address"
            value={form.email} onChange={(e) => set('email', e.target.value)} required />
        </div>
        <div className="ck-form__group">
          <label className="ck-form__label"><span className="ck-form__req">*</span> Select Date</label>
          <input
            type="date"
            className="ck-form__input ck-form__input--date"
            min={today}
            max={maxDate}
            value={form.date}
            onChange={(e) => set('date', e.target.value)}
            required
          />
        </div>
      </div>

      {/* <div className="ck-form__group">
        <label className="ck-form__label"><span className="ck-form__req">*</span> Select Meals</label>
        <div className="ck-toggle-group">
          {MEALS.map((meal) => (
            <button key={meal} type="button"
              className={`ck-toggle-btn${form.meals.includes(meal) ? ' ck-toggle-btn--active' : ''}`}
              onClick={() => toggleArray('meals', meal)}>
              {meal}
            </button>
          ))}
        </div>
      </div> */}

      {/* <div className="ck-form__group">
        <label className="ck-form__label">
          Select Cuisines <span className="ck-form__optional">(optional — you can choose multiple)</span>
        </label>
        <div className="ck-toggle-group ck-toggle-group--wrap">
          {CUISINES.map((cuisine) => (
            <button key={cuisine} type="button"
              className={`ck-toggle-btn${form.cuisines.includes(cuisine) ? ' ck-toggle-btn--active' : ''}`}
              onClick={() => toggleArray('cuisines', cuisine)}>
              {cuisine}
            </button>
          ))}
        </div>
      </div> */}

      <div className="ck-form__footer">
        <button type="submit" className="ck-form__submit">Process Now</button>
        <p className="ck-form__privacy">🔒 Your details are safe with us. We never share your data.</p>
      </div>
    </form>
  );
}

// ─── Contact Aside ─────────────────────────────────────────────────────────────
function ContactAside() {
  return (
    <aside className="ck-aside">
      <div className="ck-aside__card">
        <span className="ck-aside__emoji">📞</span>
        <h3 className="ck-aside__title">Prefer to call?</h3>
        <p className="ck-aside__desc">Talk to our team directly and get a personalised quote in minutes.</p>
        <a href="tel:+918926262674" className="ck-aside__btn ck-aside__btn--red">
          <Phone size={16} /> +91-89262 62674
        </a>
        <a href="tel:+918926262675" className="ck-aside__btn ck-aside__btn--outline">
          <Phone size={16} /> +91-89262 62675
        </a>
      </div>
      <div className="ck-aside__card ck-aside__card--whatsapp">
        <span className="ck-aside__emoji">💬</span>
        <h3 className="ck-aside__title ck-aside__title--white">Chat on WhatsApp</h3>
        <p className="ck-aside__desc ck-aside__desc--white">Get instant responses from our team via WhatsApp.</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="ck-aside__btn ck-aside__btn--white">
          <MessageCircle size={16} /> Chat Now
        </a>
      </div>
      <div className="ck-aside__info">
        <h4 className="ck-aside__info-title">Serving Cities</h4>
        <div className="ck-aside__cities">
          {LOCATIONS.map((city) => (
            <span key={city} className="ck-aside__city-chip">{city}</span>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CloudKitchenPage() {
  return (
    <div className="cloud-kitchen-page">
      <HeroSection />
      <TrustBar />
      <div className="ck-body">
        <div className="ck-body__inner">
          <div className="ck-body__left">
            <div className="ck-form-card">
              <h2 className="ck-form-card__heading">Enquiry Now</h2>
              <CloudKitchenForm />
            </div>
          </div>
          <ContactAside />
        </div>
      </div>
    </div>
  );
}
