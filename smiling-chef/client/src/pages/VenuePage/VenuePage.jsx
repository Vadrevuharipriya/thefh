import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle, Phone, MessageCircle } from 'lucide-react';
import './VenuePage.scss';

const HERO_IMAGE = 'https://images.pexels.com/photos/169193/pexels-photo-169193.jpeg?auto=compress&cs=tinysrgb&w=1600';
const WHATSAPP_URL = 'https://wa.me/918926262674?text=Hello! I am looking for a banquet or venue booking.';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttarakhand', 'Uttar Pradesh', 'West Bengal',
];

// Generate people options 1–500
const PEOPLE_OPTIONS = Array.from({ length: 500 }, (_, i) => i + 1);

const TRUST_BADGES = [
  { icon: '🏛️', label: 'Premium Banquet Halls' },
  { icon: '🌿', label: 'Outdoor Venues' },
  { icon: '📍', label: 'Near Your Location' },
  { icon: '💰', label: 'Budget Friendly' },
];

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="vn-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
      <div className="vn-hero__overlay" />
      <div className="vn-hero__content">
        <nav className="vn-hero__breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <span>Our Services</span>
          <ChevronRight size={13} />
          <span>Venue Booking</span>
        </nav>
        <h1 className="vn-hero__title">
          Banquet &amp; <span className="vn-hero__title-accent">Venue</span>
        </h1>
        <p className="vn-hero__sub">
          Luxurious banquet halls &amp; destination venues for weddings, corporate galas and grand celebrations — near you.
        </p>
      </div>
    </section>
  );
}

// ─── Trust Bar ────────────────────────────────────────────────────────────────
function TrustBar() {
  return (
    <div className="vn-trust-bar">
      {TRUST_BADGES.map((b) => (
        <div key={b.label} className="vn-trust-bar__item">
          <span className="vn-trust-bar__icon">{b.icon}</span>
          <span className="vn-trust-bar__label">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Venue Form ───────────────────────────────────────────────────────────────
function VenueForm() {
  const [form, setForm] = useState({
    people: '', state: '', city: '', location: '',
    name: '', phone: '', email: '', budget: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="vn-success">
        <CheckCircle size={56} className="vn-success__icon" />
        <h2 className="vn-success__title">Enquiry Submitted!</h2>
        <p className="vn-success__msg">
          Thank you, <strong>{form.name}</strong>! Our team will contact you at <strong>{form.phone}</strong> with the best venue options near you.
        </p>
        <div className="vn-success__actions">
          <Link to="/" className="vn-success__btn vn-success__btn--primary">Back to Home</Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="vn-success__btn vn-success__btn--whatsapp">
            <MessageCircle size={17} /> Chat on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="vn-form" onSubmit={handleSubmit} noValidate>
      <p className="vn-form__subtitle">
        We are providing the best Banquet and Destination Venue Services near your location. Please fill up the form below.
      </p>

      {/* Row: People + State */}
      <div className="vn-form__row">
        <div className="vn-form__group">
          <label className="vn-form__label"><span className="vn-form__req">*</span> No. of People</label>
          <select className="vn-form__select" value={form.people} onChange={(e) => set('people', e.target.value)} required>
            <option value="">— Select One —</option>
            {PEOPLE_OPTIONS.map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
            ))}
          </select>
        </div>
        <div className="vn-form__group">
          <label className="vn-form__label"><span className="vn-form__req">*</span> Select State</label>
          <select className="vn-form__select" value={form.state} onChange={(e) => set('state', e.target.value)} required>
            <option value="">— Select State —</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Row: City + Location */}
      <div className="vn-form__row">
        <div className="vn-form__group">
          <label className="vn-form__label"><span className="vn-form__req">*</span> Enter City</label>
          <input type="text" className="vn-form__input" placeholder="Enter City Name"
            value={form.city} onChange={(e) => set('city', e.target.value)} required />
        </div>
        <div className="vn-form__group">
          <label className="vn-form__label"><span className="vn-form__req">*</span> Enter Location</label>
          <input type="text" className="vn-form__input" placeholder="Enter Location (area / landmark)"
            value={form.location} onChange={(e) => set('location', e.target.value)} required />
        </div>
      </div>

      {/* Row: Name + Phone */}
      <div className="vn-form__row">
        <div className="vn-form__group">
          <label className="vn-form__label"><span className="vn-form__req">*</span> Contact Name</label>
          <input type="text" className="vn-form__input" placeholder="Enter Contact Name"
            value={form.name} onChange={(e) => set('name', e.target.value)} required />
        </div>
        <div className="vn-form__group">
          <label className="vn-form__label"><span className="vn-form__req">*</span> Mobile Number</label>
          <input type="tel" className="vn-form__input" placeholder="Enter Mobile Number"
            value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
        </div>
      </div>

      {/* Row: Email + Budget */}
      <div className="vn-form__row">
        <div className="vn-form__group">
          <label className="vn-form__label"><span className="vn-form__req">*</span> Email Address</label>
          <input type="email" className="vn-form__input" placeholder="Enter Email Address"
            value={form.email} onChange={(e) => set('email', e.target.value)} required />
        </div>
        <div className="vn-form__group">
          <label className="vn-form__label"><span className="vn-form__req">*</span> Your Budget (in INR)</label>
          <input type="number" className="vn-form__input" placeholder="Enter Your Budget (in INR)"
            value={form.budget} onChange={(e) => set('budget', e.target.value)} min="0" required />
        </div>
      </div>

      <div className="vn-form__footer">
        <button type="submit" className="vn-form__submit">Submit Enquiry</button>
        <p className="vn-form__privacy">🔒 Your details are safe with us. We never share your data.</p>
      </div>
    </form>
  );
}

// ─── Contact Aside ─────────────────────────────────────────────────────────────
function ContactAside() {
  return (
    <aside className="vn-aside">
      <div className="vn-aside__card">
        <span className="vn-aside__emoji">📞</span>
        <h3 className="vn-aside__title">Prefer to call?</h3>
        <p className="vn-aside__desc">Talk to our venue experts and get personalised options in minutes.</p>
        <a href="tel:+918926262674" className="vn-aside__btn vn-aside__btn--red">
          <Phone size={16} /> +91-89262 62674
        </a>
        <a href="tel:+918926262675" className="vn-aside__btn vn-aside__btn--outline">
          <Phone size={16} /> +91-89262 62675
        </a>
      </div>
      <div className="vn-aside__card vn-aside__card--whatsapp">
        <span className="vn-aside__emoji">💬</span>
        <h3 className="vn-aside__title vn-aside__title--white">Chat on WhatsApp</h3>
        <p className="vn-aside__desc vn-aside__desc--white">Get instant responses from our venue team.</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="vn-aside__btn vn-aside__btn--white">
          <MessageCircle size={16} /> Chat Now
        </a>
      </div>
      <div className="vn-aside__info">
        <h4 className="vn-aside__info-title">Why Book With Us</h4>
        {[
          '🏆 Curated premium venues',
          '📅 Flexible date availability',
          '💡 Full event planning support',
          '🤝 Transparent pricing & no hidden fees',
        ].map((item) => (
          <p key={item} className="vn-aside__why-item">{item}</p>
        ))}
      </div>
    </aside>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function VenuePage() {
  return (
    <div className="venue-page">
      <HeroSection />
      <TrustBar />
      <div className="vn-body">
        <div className="vn-body__inner">
          <div className="vn-body__left">
            <div className="vn-form-card">
              <h2 className="vn-form-card__heading">Banquet and Destination Venue for Enquiry</h2>
              <VenueForm />
            </div>
          </div>
          <ContactAside />
        </div>
      </div>
    </div>
  );
}
