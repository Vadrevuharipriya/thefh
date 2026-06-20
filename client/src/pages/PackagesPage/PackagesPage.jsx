import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, Phone, MessageCircle,
  ArrowRight, CheckCircle, Users,
} from 'lucide-react';
import './PackagesPage.scss';

const HERO_IMAGE = 'https://images.pexels.com/photos/5775684/pexels-photo-5775684.jpeg?auto=compress&cs=tinysrgb&w=1600';
const WHATSAPP_URL = 'https://wa.me/918926262674?text=Hello! I am interested in your catering packages.';
const PHONE_URL = 'tel:+918926262674';

const PACKAGES = [
  {
    id: 'starter',
    emoji: '🥗',
    name: 'Starter Pack',
    guests: '50 – 150 Guests',
    price: '₹399',
    unit: '/plate',
    tag: null,
    featured: false,
    items: [
      '1 Soup', '2 Starters', '5 Main Course', '2 Breads',
      '1 Rice Dish', '1 Raita', '1 Dessert', '1 Sweet',
      'Drinking Water',
    ],
  },
  {
    id: 'classic',
    emoji: '🍽️',
    name: 'Classic Pack',
    guests: '150 – 300 Guests',
    price: '₹599',
    unit: '/plate',
    tag: null,
    featured: false,
    items: [
      '1 Soup', '3 Starters', '7 Main Course', '3 Breads',
      '1 Fried Rice', '2 Raitas', '2 Desserts', '2 Sweets',
      'Water & Soft Drinks',
    ],
  },
  {
    id: 'premium',
    emoji: '👑',
    name: 'Premium Pack',
    guests: '300 – 500 Guests',
    price: '₹799',
    unit: '/plate',
    tag: 'Most Popular',
    featured: true,
    items: [
      '2 Soups', '4 Starters', '9 Main Course', '4 Breads',
      '2 Rice Varieties', '2 Raitas', '3 Desserts', '3 Sweets',
      '1 Live Counter', 'Water & Soft Drinks',
    ],
  },
  {
    id: 'royal',
    emoji: '🏆',
    name: 'Royal Pack',
    guests: '500+ Guests',
    price: '₹999',
    unit: '/plate',
    tag: 'Best Value',
    featured: false,
    items: [
      '2 Soups', '6 Starters', '12 Main Course', '5 Breads',
      '2 Rice Varieties', '2 Raitas', '4 Desserts', '4 Sweets',
      '2 Live Counters', 'Mocktails', 'Water & Soft Drinks',
    ],
  },
];

const INCLUSIONS = [
  { icon: '👨‍🍳', title: 'Experienced Chefs & Halwais', desc: 'Verified professionals with 5+ years of event catering experience — background-checked and trained.' },
  { icon: '🍳', title: 'All Equipment Provided', desc: 'Complete cooking & serving equipment brought to your venue. Nothing to arrange on your end.' },
  { icon: '🧹', title: 'Setup & Cleanup', desc: 'Full venue setup before the event and thorough cleanup afterward — at absolutely no extra cost.' },
  { icon: '🧾', title: 'Pre-Event Tasting', desc: 'Complimentary tasting session before your event so we can perfect the menu to match your palate.' },
  { icon: '🌿', title: 'Fresh & Hygienic', desc: 'Ingredients sourced fresh daily. FSSAI-compliant food preparation standards at every event.' },
  { icon: '📋', title: 'Dedicated Coordinator', desc: 'A single point of contact manages all on-ground logistics so you can focus on celebrating.' },
];

const ADD_ONS = [
  { emoji: '🎂', title: 'Custom Cake', price: 'On Request' },
  { emoji: '🍹', title: 'Welcome Drinks & Mocktails', price: '₹49/person' },
  { emoji: '🍕', title: 'Live Food Counter', price: '₹5,000 onwards' },
  { emoji: '🍦', title: 'Ice Cream Station', price: '₹4,000 onwards' },
  { emoji: '🥗', title: 'Chaat & Salad Station', price: '₹3,500 onwards' },
  { emoji: '📦', title: 'Snack Boxes (Take Away)', price: '₹99/box' },
];

const FAQS = [
  {
    q: 'Are the prices per plate or per event?',
    a: 'All prices listed are per plate (per person). The final cost depends on your confirmed guest count. We provide a detailed written quote after understanding your requirements fully.',
  },
  {
    q: 'Can I customise the menu within a package?',
    a: 'Absolutely! Every package is fully customisable. You can swap dishes, add regional specialties, request a no-onion-no-garlic menu, or build a completely bespoke spread tailored to your preferences.',
  },
  {
    q: 'What is the minimum guest count?',
    a: 'Our Starter Pack is designed for a minimum of 50 guests. For smaller gatherings (under 50), please contact us directly and we will create a custom quote for your event.',
  },
  {
    q: 'How far in advance should I book?',
    a: 'We recommend booking at least 7–10 days in advance for standard events and 30+ days for large weddings. We do try to accommodate last-minute requests based on team availability.',
  },
  {
    q: 'Are serving staff included in the package?',
    a: 'Yes! All packages include trained serving staff. The number of staff scales with your guest count to ensure attentive, smooth service throughout the entire event.',
  },
  {
    q: 'Do you serve outside Delhi NCR?',
    a: 'Yes, we currently serve 15+ cities including Dehradun, Haridwar, Lucknow, Jaipur, Chandigarh, Agra and more. Travel charges may apply for locations outside Delhi NCR — contact us for details.',
  },
];

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="pkg-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
      <div className="pkg-hero__overlay" />
      <div className="pkg-hero__content">
        <nav className="pkg-hero__breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <span>Our Services</span>
          <ChevronRight size={13} />
          <span>Our Packages</span>
        </nav>
        <div className="pkg-hero__badge">🍽️ Catering Packages</div>
        <h1 className="pkg-hero__title">
          Choose the Perfect<br />
          <span className="pkg-hero__accent">Catering Package</span>
        </h1>
        <p className="pkg-hero__sub">
          From intimate gatherings to grand weddings — transparent pricing, fully customisable menus
          and everything handled end-to-end by our verified professionals.
        </p>
        <div className="pkg-hero__actions">
          <a href={PHONE_URL} className="pkg-hero__cta pkg-hero__cta--primary">
            <Phone size={16} /> Book Now
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pkg-hero__cta pkg-hero__cta--ghost"
          >
            <MessageCircle size={16} /> WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Stats Strip ──────────────────────────────────────────────────────────────
const STATS = [
  { value: '4',      label: 'Package Tiers' },
  { value: '10,000+', label: 'Events Catered' },
  { value: '₹399',  label: 'Starting Price' },
  { value: '99%',   label: 'Happy Clients' },
];

function StatsStrip() {
  return (
    <div className="pkg-stats">
      {STATS.map((s) => (
        <div key={s.label} className="pkg-stats__item">
          <p className="pkg-stats__value">{s.value}</p>
          <p className="pkg-stats__label">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Package Card ─────────────────────────────────────────────────────────────
function PackageCard({ pkg }) {
  return (
    <div className={`pkg-card ${pkg.featured ? 'pkg-card--featured' : ''}`}>
      {pkg.tag && <div className="pkg-card__tag">{pkg.tag}</div>}

      <div className="pkg-card__header">
        <span className="pkg-card__emoji">{pkg.emoji}</span>
        <h3 className="pkg-card__name">{pkg.name}</h3>
        <div className="pkg-card__guests">
          <Users size={13} />
          {pkg.guests}
        </div>
        <div className="pkg-card__price">
          <span className="pkg-card__price-value">{pkg.price}</span>
          <span className="pkg-card__price-unit">{pkg.unit}</span>
        </div>
      </div>

      <ul className="pkg-card__list">
        {pkg.items.map((item) => (
          <li key={item} className="pkg-card__item">
            <CheckCircle size={14} className="pkg-card__check" />
            {item}
          </li>
        ))}
      </ul>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`pkg-card__cta ${pkg.featured ? 'pkg-card__cta--white' : 'pkg-card__cta--red'}`}
      >
        Get a Free Quote <ArrowRight size={15} />
      </a>
    </div>
  );
}

// ─── Packages Section ─────────────────────────────────────────────────────────
function PackagesSection() {
  return (
    <section className="pkg-packages">
      <div className="pkg-section-inner">
        <div className="text-center mb-14">
          <div className="section-tag mx-auto">📦 Our Packages</div>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-dark mt-2">
            Transparent Pricing,{' '}
            <span className="text-brand-red">Zero Surprises</span>
          </h2>
          <p className="font-body text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            Pick a package that fits your guest count. All packages are fully customisable
            and include setup, trained staff and post-event cleanup.
          </p>
        </div>

        <div className="pkg-packages__grid">
          {PACKAGES.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        <p className="text-center font-body text-xs text-gray-400 mt-8">
          * Prices are indicative. Final pricing depends on menu, location and event size. Contact us for a precise quote.
        </p>
      </div>
    </section>
  );
}

// ─── Inclusions Section ───────────────────────────────────────────────────────
function InclusionsSection() {
  return (
    <section className="pkg-inclusions">
      <div className="pkg-section-inner">
        <div className="text-center mb-12">
          <div className="section-tag mx-auto">✅ Always Included</div>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-dark mt-2">
            Everything Handled{' '}
            <span className="text-brand-red">End-to-End</span>
          </h2>
          <p className="font-body text-gray-500 mt-3 max-w-lg mx-auto text-sm">
            Every package comes with these essentials — at no extra cost, no matter the size of your event.
          </p>
        </div>
        <div className="pkg-inclusions__grid">
          {INCLUSIONS.map((item) => (
            <div key={item.title} className="pkg-inclusion-card">
              <span className="pkg-inclusion-card__icon">{item.icon}</span>
              <h3 className="pkg-inclusion-card__title">{item.title}</h3>
              <p className="pkg-inclusion-card__desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Add-Ons Section ──────────────────────────────────────────────────────────
function AddOnsSection() {
  return (
    <section className="pkg-addons">
      <div className="pkg-section-inner">
        <div className="text-center mb-12">
          <div
            className="section-tag mx-auto"
            style={{ color: '#fff', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            ✨ Enhancements
          </div>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-white mt-2">
            Level Up With <span className="text-brand-gold">Add-Ons</span>
          </h2>
          <p className="font-body text-white/60 mt-3 max-w-lg mx-auto text-sm">
            Complement your package with these optional extras to make your event truly unforgettable.
          </p>
        </div>

        <div className="pkg-addons__grid">
          {ADD_ONS.map((addon) => (
            <div key={addon.title} className="pkg-addon-card">
              <span className="pkg-addon-card__emoji">{addon.emoji}</span>
              <h4 className="pkg-addon-card__title">{addon.title}</h4>
              <p className="pkg-addon-card__price">{addon.price}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pkg-addons__cta"
          >
            <MessageCircle size={16} /> Ask About Add-Ons
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState(null);

  return (
    <section className="pkg-faq">
      <div className="pkg-section-inner pkg-section-inner--narrow">
        <div className="text-center mb-12">
          <div className="section-tag mx-auto">❓ FAQ</div>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-dark mt-2">
            Frequently Asked{' '}
            <span className="text-brand-red">Questions</span>
          </h2>
        </div>

        <div className="pkg-faq__list">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`pkg-faq__item ${open === i ? 'pkg-faq__item--open' : ''}`}
            >
              <button
                className="pkg-faq__question"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`pkg-faq__chevron ${open === i ? 'pkg-faq__chevron--open' : ''}`}
                />
              </button>
              {open === i && <p className="pkg-faq__answer">{faq.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Strip ────────────────────────────────────────────────────────────────
function CTAStrip() {
  return (
    <section className="pkg-cta">
      <div className="pkg-cta__inner">
        <div className="pkg-cta__emoji">🎉</div>
        <h2 className="font-heading font-black text-2xl md:text-3xl text-white text-center">
          Ready to Plan Your Perfect Event?
        </h2>
        <p className="font-body text-white/70 text-sm text-center mt-2 max-w-lg mx-auto leading-relaxed">
          Get a free consultation and a customised quote tailored to your guest count, cuisine preference and budget.
        </p>
        <div className="pkg-cta__actions">
          <a href={PHONE_URL} className="pkg-cta__btn pkg-cta__btn--white">
            <Phone size={16} /> Call Us Now
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pkg-cta__btn pkg-cta__btn--outline"
          >
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </div>
        <p className="font-body text-white/40 text-xs text-center mt-5">
          +91-89262 62674 · Available 9am – 9pm, Monday–Sunday
        </p>
      </div>
    </section>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PackagesPage() {
  return (
    <div className="packages-page">
      <HeroSection />
      <StatsStrip />
      <PackagesSection />
      <InclusionsSection />
      <AddOnsSection />
      <FAQSection />
      <CTAStrip />
    </div>
  );
}
