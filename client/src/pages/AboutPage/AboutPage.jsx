import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Phone, MessageCircle, Star, Users, Award, MapPin, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { professionals, stats } from '../../data/homeData';
import './AboutPage.scss';

const WHATSAPP_URL = 'https://wa.me/918926262674';
const PHONE_URL = 'tel:+918926262674';
const HERO_IMAGE = 'https://images.pexels.com/photos/5775684/pexels-photo-5775684.jpeg';
const STORY_IMAGE = 'https://images.pexels.com/photos/17294714/pexels-photo-17294714.jpeg';

const values = [
  {
    icon: '🍽️',
    title: 'Authentic Flavours',
    desc: 'From traditional North Indian thalis to exotic continental spreads — every dish crafted with love and expertise.',
  },
  {
    icon: '✅',
    title: 'Verified Professionals',
    desc: 'All our chefs and halwais are background-verified and trained to maintain highest standards of hygiene.',
  },
  {
    icon: '📋',
    title: 'Tailored Menus',
    desc: 'We craft fully customised menus as per your preferences, dietary needs and event type.',
  },
  {
    icon: '🤝',
    title: 'End-to-End Service',
    desc: 'From menu planning and food preparation to presentation, serving, and cleanup — we handle it all.',
  },
  {
    icon: '💰',
    title: 'Transparent Pricing',
    desc: 'No hidden charges. Clear, competitive quotes tailored to your guest count and event requirements.',
  },
  {
    icon: '⏰',
    title: 'On-Time Delivery',
    desc: 'We understand the importance of timing at events. Punctuality and reliability are core to how we operate.',
  },
];

const storyParagraphs = [
  'The Famous Halwai is renowned for its state-of-the-art catering services for personal parties, office parties and public gatherings. We understand the intricacies of the trade and our years of experience has earned us a place among the leading caterers in Delhi NCR. Customer satisfaction is our primary goal and we make sure to be consistent on high standards.',
  'With The Famous Halwai, your parties, gatherings and celebrations turn into a gala event the world will remember! You get the choice of regional and international cuisine and our innovative style in menus as well as serving will win over every guest. Rely upon our years of experience in the hospitality industry and quest for the latest trends in catering services.',
  'As the leading caterers in Delhi NCR, exceeding your every expectation constantly and consistently is our motto. We are loved and trusted by many of our clients due to the efficiency, professionalism, friendly attitude and helpful behaviour reflected in our service. We let our work do the talking.',
];

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="ab-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
      <div className="ab-hero__overlay" />
      <div className="ab-hero__content">
        <nav className="ab-hero__breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <span>About Us</span>
        </nav>
        <h1 className="ab-hero__title">About <span className="ab-hero__title-accent">Us</span></h1>
        <p className="ab-hero__sub">
          Delhi NCR's most trusted catering & halwai service — bringing authentic flavours to your celebrations since day one.
        </p>
      </div>
    </section>
  );
}

// ─── Stats strip ──────────────────────────────────────────────────────────────
function StatsStrip() {
  return (
    <div className="ab-stats">
      {stats.map((s, i) => (
        <div key={i} className="ab-stats__item">
          <span className="ab-stats__icon">{s.icon}</span>
          <div>
            <p className="ab-stats__value">{s.value}</p>
            <p className="ab-stats__label">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Our Story ────────────────────────────────────────────────────────────────
function StorySection() {
  return (
    <section className="ab-story">
      <div className="ab-story__inner">
        <div className="ab-story__text">
          <div className="section-tag">📖 Our Story</div>
          <h2 className="ab-story__heading">
            Serving <span className="text-brand-red">Authentic</span> Flavours<br />Across Delhi NCR
          </h2>
          {storyParagraphs.map((para, i) => (
            <p key={i} className="ab-story__para">{para}</p>
          ))}
          <ul className="ab-story__checklist">
            {[
              'Best home catering service provider in Delhi NCR',
              'Leading corporate catering service agency',
              'Expert wedding & personal catering specialists',
              'Serving kitty parties, birthdays, house warmings & more',
            ].map((item) => (
              <li key={item} className="ab-story__check-item">
                <CheckCircle size={16} className="ab-story__check-icon" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="ab-story__image-wrap">
          <img
            src={STORY_IMAGE}
            alt="Our team at work"
            className="ab-story__image"
          />
          <div className="ab-story__image-badge">
            <Award size={20} className="text-brand-gold" />
            <div>
              <p className="font-heading font-black text-white text-sm">Since 2018</p>
              <p className="font-body text-white/70 text-xs">Serving with pride</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Values ───────────────────────────────────────────────────────────────────
function ValuesSection() {
  return (
    <section className="ab-values">
      <div className="ab-section-inner">
        <div className="text-center mb-12">
          <div className="section-tag mx-auto">⭐ Why Choose Us</div>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-dark mt-2">
            What Makes Us <span className="text-brand-red">Different</span>
          </h2>
          <p className="font-body text-gray-500 mt-3 max-w-lg mx-auto text-base">
            We don't just serve food — we craft experiences that your guests will talk about for years.
          </p>
        </div>
        <div className="ab-values__grid">
          {values.map((v, i) => (
            <div key={i} className="ab-value-card">
              <span className="ab-value-card__icon">{v.icon}</span>
              <h3 className="ab-value-card__title">{v.title}</h3>
              <p className="ab-value-card__desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Team ─────────────────────────────────────────────────────────────────────
function TeamSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) setItemsPerView(4);
      else if (window.innerWidth >= 768) setItemsPerView(3);
      else if (window.innerWidth >= 640) setItemsPerView(2);
      else setItemsPerView(1);
    };
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, professionals.length - itemsPerView);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const goPrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const goNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));

  return (
    <section className="ab-team">
      <div className="ab-team__inner">
        <div className="text-center mb-10">
          <div className="section-tag mx-auto" style={{ color: '#fff', background: 'rgba(255,255,255,0.12)' }}>
            👨‍🍳 Meet the Team
          </div>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-white mt-2">
            Our Expert Chefs &amp; Halwais
          </h2>
          <p className="font-body text-white/60 mt-3 max-w-lg mx-auto">
            Background-verified professionals with hundreds of successful events under their belt.
          </p>
        </div>

        <div className="ab-team__carousel">
          <button
            className="ab-team__nav ab-team__nav--prev"
            onClick={goPrev}
            disabled={!canGoPrev}
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="ab-team__grid-wrapper">
            <div
              className="ab-team__grid"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {professionals.map((pro) => (
                <div key={pro.id} className="ab-pro-card">
                  <div className="ab-pro-card__img-wrap">
                    <img
                      src={pro.image}
                      alt={pro.name}
                      className="ab-pro-card__img"
                      onError={(e) => { e.target.src = `https://i.pravatar.cc/300?u=${pro.id}-pro`; }}
                    />
                  </div>
                  <div className="ab-pro-card__info">
                    <p className="ab-pro-card__name">{pro.name}</p>
                    <p className="ab-pro-card__role">{pro.role}</p>
                    <div className="ab-pro-card__meta">
                      <span className="flex items-center gap-1">
                        <Star size={12} fill="#DA9100" color="#DA9100" />
                        <span className="font-body text-xs font-bold text-white">{pro.rating}</span>
                      </span>
                      <span className="font-body text-xs text-white/50">{pro.events}+ events</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="ab-team__nav ab-team__nav--next"
            onClick={goNext}
            disabled={!canGoNext}
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="ab-team__dots">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              className={`ab-team__dot ${i === currentIndex ? 'ab-team__dot--active' : ''}`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Address ──────────────────────────────────────────────────────────────────
function AddressSection() {
  // return (
  //   // <section className="ab-address">
  //   //   <div className="ab-section-inner">
  //   //     <div className="ab-address__info">
  //   //       <div className="section-tag">📍 Find Us</div>
  //   //       <h2 className="font-heading font-black text-3xl text-dark mt-2 mb-4">
  //   //         Our Head Office
  //   //       </h2>
  //   //       <div className="ab-address__detail">
  //   //         <MapPin size={18} className="text-brand-red flex-shrink-0 mt-1" />
  //   //         <div>
  //   //           <p className="font-heading font-bold text-dark text-sm">Head Office</p>
  //   //           <p className="font-body text-gray-500 text-sm leading-relaxed">
  //   //             B-191, Kushak No. 2, Kadhi Pur,<br />
  //   //             Near Saint Sujan Singh Gurudwara,<br />
  //   //             Delhi — 110036
  //   //           </p>
  //   //         </div>
  //   //       </div>
  //   //       <div className="ab-address__detail mt-4">
  //   //         <Phone size={18} className="text-brand-red flex-shrink-0" />
  //   //         <div>
  //   //           <a href="tel:+918926262674" className="font-body text-sm text-gray-700 hover:text-brand-red transition-colors block">+91-8926262674</a>
  //   //           <a href="tel:+918926262675" className="font-body text-sm text-gray-700 hover:text-brand-red transition-colors block">+91-8926262675</a>
  //   //         </div>
  //   //       </div>
  //   //     </div>
  //   //   </div>
  //   // </section>
  // );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="ab-cta">
      <div className="ab-cta__inner">
        <h2 className="font-heading font-black text-3xl md:text-4xl text-white leading-tight text-center">
          Ready to Plan Your <span className="text-brand-gold">Perfect Event?</span>
        </h2>
        <p className="font-body text-white/70 mt-3 text-base text-center max-w-lg mx-auto">
          Get a free consultation, customised menu and competitive quote — confirmed within 24 hours.
        </p>
        <div className="ab-cta__actions">
          <a href={PHONE_URL} className="ab-cta__btn ab-cta__btn--white">
            <Phone size={18} /> Call Us Now
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="ab-cta__btn ab-cta__btn--outline">
            <MessageCircle size={18} /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div className="about-page">
      <HeroSection />
      <StatsStrip />
      <StorySection />
      <ValuesSection />
      <TeamSection />
      <AddressSection />
      <CTASection />
    </div>
  );
}


