import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, Phone, MessageCircle, ChevronRight, Star, Users, Award } from 'lucide-react';
import { professionals } from '../../data/professionalsData';
import { occasionPageData, getFallbackData } from '../../data/occasionPageData';
import { slugify } from '../../utils/slugify';
import './OccasionPage.scss';

const WHATSAPP_URL = 'https://wa.me/918926262674';

// ─── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection({ occasion, pageData, onBookNow }) {
  return (
    <section
      className="op-hero"
      style={{ backgroundImage: `url(${occasion.image})` }}
    >
      <div className="op-hero__overlay" />
      <div className="op-hero__content">
        {/* Breadcrumb */}
        <nav className="op-hero__breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <span>Services</span>
          <ChevronRight size={13} />
          <span>{occasion.name}</span>
        </nav>

        {pageData.badge && (
          <span className="op-hero__badge">{pageData.badge}</span>
        )}
        <h1 className="op-hero__title">{occasion.name}</h1>
        <p className="op-hero__tagline">{pageData.tagline}</p>

        
        {occasion.pricingEnabled && occasion.startingPrice && (
             <div className="op-hero__price">
          Starting <strong>{occasion.startingPrice}</strong> / plate
        </div>
           )}

        <div className="op-hero__actions">
          <button onClick={onBookNow} className="btn-red">
            <Phone size={16} />
            Book Now
          </button>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="op-hero__whatsapp-btn">
            <MessageCircle size={16} />
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Stats strip ───────────────────────────────────────────────────────────────
function StatsStrip({ stats }) {
  return (
    <div className="op-stats">
      {stats.map((s, i) => (
        <div key={i} className="op-stats__item">
          <span className="op-stats__icon">{s.icon}</span>
          <div>
            <p className="op-stats__value">{s.value}</p>
            <p className="op-stats__label">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Overview ──────────────────────────────────────────────────────────────────
function OverviewSection({ occasion, pageData }) {
  return (
    <section className="op-overview">
      <div className="op-overview__inner">
        <div className="op-overview__text">
          <div className="section-tag">🎊 About This Service</div>
          <h2 className="op-overview__heading">{occasion.name}</h2>
          <p className="op-overview__desc">{pageData.description}</p>
          <div className="op-overview__trust">
            <div className="op-overview__trust-item">
              <Star size={18} fill="#DA9100" color="#DA9100" />
              <span className="font-heading font-black text-dark">4.9</span>
              <span className="font-body text-gray-500 text-sm">Google Rating</span>
            </div>
            <div className="op-overview__trust-divider" />
            <div className="op-overview__trust-item">
              <Users size={18} className="text-brand-red" />
              <span className="font-heading font-black text-dark">10,000+</span>
              <span className="font-body text-gray-500 text-sm">Happy Families</span>
            </div>
            <div className="op-overview__trust-divider" />
            <div className="op-overview__trust-item">
              <Award size={18} className="text-brand-red" />
              <span className="font-heading font-black text-dark">99%</span>
              <span className="font-body text-gray-500 text-sm">Success Rate</span>
            </div>
          </div>
        </div>
         <div className="op-overview__image-wrap">
           <img
             src={occasion.image}
             alt={occasion.name}
             className="op-overview__image"
             onError={(e) => { e.target.src = `https://picsum.photos/600/450?u=${occasion._id}`; }}
           />
           {occasion.pricingEnabled && occasion.startingPrice && (
             <div className="op-overview__image-badge">
               <span className="font-heading font-black text-white text-xl">{occasion.startingPrice}</span>
               <span className="font-body text-white/80 text-xs">/ plate onwards</span>
             </div>
           )}
         </div>
      </div>
    </section>
  );
}

// ─── What's Included ───────────────────────────────────────────────────────────
function FeaturesSection({ features }) {
  return (
    <section className="op-features">
      <div className="op-section-inner">
        <div className="text-center mb-10">
          <div className="section-tag mx-auto">✅ What's Included</div>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-dark mt-2">
            Everything Taken Care Of
          </h2>
        </div>
        <div className="op-features__grid">
          {features.map((f, i) => (
            <div key={i} className="op-feature-card">
              <span className="op-feature-card__icon">{f.icon}</span>
              <h3 className="op-feature-card__title">{f.title}</h3>
              <p className="op-feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Menu highlights ───────────────────────────────────────────────────────────
function MenuSection({ menuHighlights }) {
  return (
    <section className="op-menu">
      <div className="op-section-inner">
        <div className="text-center mb-10">
          <div className="section-tag mx-auto">🍽️ Sample Menu</div>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-dark mt-2">
            A Taste of What We Offer
          </h2>
          <p className="font-body text-gray-500 mt-3 max-w-lg mx-auto">
            Menus are fully customisable — tell us your favourites and we'll craft the perfect spread.
          </p>
        </div>
        <div className="op-menu__pills">
          {menuHighlights.map((item, i) => (
            <span key={i} className="op-menu__pill">{item}</span>
          ))}
        </div>
        <p className="text-center font-body text-sm text-gray-400 mt-6">
          + Many more dishes based on your preferences
        </p>
      </div>
    </section>
  );
}

// ─── Professionals ─────────────────────────────────────────────────────────────
function ProsSection({ pros }) {
  return (
    <section className="op-pros">
      <div className="op-pros__inner">
        <div className="text-center mb-10">
          <div className="section-tag mx-auto" style={{ color: '#fff', background: 'rgba(255,255,255,0.15)' }}>
            <Award size={12} /> Our Professionals
          </div>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-white mt-2">
            Expert Chefs & Halwais
          </h2>
          <p className="font-body text-white/60 mt-3 max-w-lg mx-auto">
            Background-verified, trained professionals with hundreds of events under their belt.
          </p>
        </div>
        <div className="op-pros__grid">
          {pros.map((pro) => (
            <div key={pro.id} className="op-pro-card">
              <div className="op-pro-card__img-wrap">
                <img
                  src={pro.image}
                  alt={pro.name}
                  className="op-pro-card__img"
                  onError={(e) => { e.target.src = `https://i.pravatar.cc/300?u=${pro.id}-pro`; }}
                />
              </div>
              <div className="op-pro-card__info">
                <p className="op-pro-card__name">{pro.name}</p>
                <p className="op-pro-card__role">{pro.role}</p>
                <div className="op-pro-card__meta">
                  <span className="flex items-center gap-1">
                    <Star size={12} fill="#DA9100" color="#DA9100" />
                    <span className="font-body text-xs font-bold">{pro.rating}</span>
                  </span>
                  <span className="font-body text-xs text-white/50">{pro.events}+ events</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Booking CTA ────────────────────────────────────────────────────────────────
function BookingCTA({ occasion, onBookNow }) {
  return (
    <section className="op-cta">
      <div className="op-cta__inner">
        <div className="op-cta__text">
          <h2 className="font-heading font-black text-3xl md:text-4xl text-white leading-tight">
            Ready to Book Your<br />
            <span className="text-brand-gold">{occasion.name}?</span>
          </h2>
          <p className="font-body text-white/70 mt-3 text-base">
            Get in touch for a free consultation, customised menu and competitive quote.
          </p>
          <ul className="op-cta__checklist">
            {['Free consultation & menu planning', 'Transparent pricing, no hidden charges', 'Confirmed in 24 hours'].map((item) => (
              <li key={item} className="font-body text-sm text-white/80 flex items-center gap-2">
                <span className="text-brand-gold">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="op-cta__actions">
          <button onClick={onBookNow} className="op-cta__btn op-cta__btn--white">
            <Phone size={18} />
            Call Us Now
          </button>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="op-cta__btn op-cta__btn--outline">
            <MessageCircle size={18} />
            Chat on WhatsApp
          </a>
          <p className="font-body text-white/50 text-xs text-center mt-2">
            +91-89262 62674 · Available 9am–9pm
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Related occasions ──────────────────────────────────────────────────────────
function RelatedSection({ related }) {
  return (
    <section className="op-related">
      <div className="op-section-inner">
        <div className="text-center mb-10">
          <h2 className="font-heading font-black text-3xl text-dark">
            Explore Other Occasions
          </h2>
        </div>
        <div className="op-related__grid">
          {related.map((occ) => (
            <Link
              key={occ.id}
              to={`/services/${slugify(occ.name)}`}
              className="op-related-card"
            >
              <img
                 src={occ.image}
                 alt={occ.name}
                 className="op-related-card__img"
                 onError={(e) => { e.target.src = `https://picsum.photos/400/300?u=${occ._id}`; }}
              />
              <div className="op-related-card__overlay" />
              <div className="op-related-card__content">
                <h3 className="op-related-card__name">{occ.name}</h3>
                {/* <span className="op-related-card__price">From {occ.price}/plate</span> */}
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/" className="btn-outline">
            View All Occasions
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Not Found ─────────────────────────────────────────────────────────────────
function NotFound({ slug }) {
  return (
    <div className="op-not-found">
      <h2 className="font-heading font-black text-3xl text-dark mb-3">Occasion not found</h2>
      <p className="font-body text-gray-500 mb-6">We couldn't find an occasion matching "{slug}".</p>
      <Link to="/" className="btn-red">Back to Home</Link>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function OccasionPage() {
  const { occasion: slug } = useParams();
  const navigate = useNavigate();

  const [occasion, setOccasion] = useState(null);
  const [allOccasions, setAllOccasions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOccasions = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/occasions?t=' + Date.now());
        const data = await res.json();
        // Filter only approved (enabled) occasions for frontend
        const approvedOccasions = data.filter(o => o.displayStatus === 'Approved');
        setAllOccasions(approvedOccasions);
        const found = approvedOccasions.find((o) => slugify(o.name) === slug);
        setOccasion(found);
      } catch (err) {
        console.error('Failed to fetch occasions:', err);
      }
      setLoading(false);
    };
    fetchOccasions();
  }, [slug]);

  const pageData = occasion ? {
    ...(occasionPageData[slug] || getFallbackData(slug)),
    tagline: occasion.innerHeader || (occasionPageData[slug]?.tagline) || getFallbackData(slug).tagline,
    description: occasion.pageDescription || (occasionPageData[slug]?.description) || getFallbackData(slug).description
  } : null;
  const related = occasion ? allOccasions.filter((o) => slugify(o.name) !== slug).slice(0, 4) : [];
  const pros = professionals.slice(0, 3);

  const handleBookNow = () => {
    if (occasion) {
      navigate('/enquiry', { state: { occasion: occasion.name } });
    }
  };

  if (loading) {
    return (
      <div className="occasion-page">
        <div className="text-center py-20">Loading...</div>
      </div>
    );
  }

  if (!occasion) return <NotFound slug={slug} />;

  return (
    <div className="occasion-page">
      <HeroSection occasion={occasion} pageData={pageData} onBookNow={handleBookNow} />
      <StatsStrip stats={pageData.stats} />
      <OverviewSection occasion={occasion} pageData={pageData} />
      <FeaturesSection features={pageData.features} />
      <MenuSection menuHighlights={pageData.menuHighlights} />
      <ProsSection pros={pros} />
      <BookingCTA occasion={occasion} onBookNow={handleBookNow} />
      <RelatedSection related={related} />
    </div>
  );
}
