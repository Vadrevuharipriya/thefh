import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Phone, MessageCircle, Quote, User } from 'lucide-react';
import { testimonials, stats } from '../../data/homeData';
import './TestimonialsPage.scss';

const HERO_IMAGE = 'https://images.pexels.com/photos/5775684/pexels-photo-5775684.jpeg?auto=compress&cs=tinysrgb&w=1600';
const GOOGLE_LOGO = 'https://www.thefamoushalwai.com/frontEnd/images/g-rating.png';
const WHATSAPP_URL = 'https://wa.me/918926262674';
const PHONE_URL = 'tel:+918926262674';

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="tm-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
      <div className="tm-hero__overlay" />
      <div className="tm-hero__content">
        <nav className="tm-hero__breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <span>Testimonials</span>
        </nav>
        <h1 className="tm-hero__title">
          What Our <span className="tm-hero__title-accent">Clients Say</span>
        </h1>
        <p className="tm-hero__sub">
          Join thousands of happy families who trusted us with their special occasions.
        </p>
      </div>
    </section>
  );
}

// ─── Stats Strip ─────────────────────────────────────────────────────────────
function StatsStrip() {
  return (
    <div className="tm-stats">
      {stats.map((s, i) => (
        <div key={i} className="tm-stats__item">
          <span className="tm-stats__icon">{s.icon}</span>
          <div>
            <p className="tm-stats__value">{s.value}</p>
            <p className="tm-stats__label">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Rating Summary ───────────────────────────────────────────────────────
function RatingSummary() {
  return (
    <section className="tm-rating">
      <div className="tm-section-inner">
        <div className="tm-rating__grid">
          <div className="tm-rating__big">
            <div className="tm-rating__score">
              <span className="tm-rating__number">4.9</span>
              <div className="tm-rating__stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} fill="#F5A623" color="#F5A623" />
                ))}
              </div>
            </div>
            <p className="tm-rating__label">Google Overall Rating</p>
            <div className="tm-rating__total">1,500+ Reviews</div>
          </div>
          <div className="tm-rating__info">
            <img src={GOOGLE_LOGO} alt="Google" className="tm-rating__logo" />
            <h3 className="tm-rating__title">The Famous Halwai</h3>
            <p className="tm-rating__desc">
              Caterers, Chef, Event Planner, Halwai, Cloud Kitchen & More
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonial Card ────────────────────────────────────────────────────
function TestimonialCard({ testimonial }) {
  const [imgError, setImgError] = useState(false);
  
  return (
    <div className="tm-card">
      <div className="tm-card__header">
        <div className="tm-card__avatar">
          {!imgError && testimonial.avatar ? (
            <img 
              src={testimonial.avatar} 
              alt={testimonial.name} 
              onError={() => setImgError(true)}
            />
          ) : (
            <User size={24} />
          )}
        </div>
        <div className="tm-card__author">
          <h4 className="tm-card__name">{testimonial.name}</h4>
          <p className="tm-card__handle">{testimonial.handle}</p>
        </div>
        <div className="tm-card__stars">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} size={14} fill="#DA9100" color="#DA9100" />
          ))}
        </div>
      </div>
      
      <div className="tm-card__quote">
        <Quote size={18} className="tm-card__quote-icon" />
        <p className="tm-card__text">&ldquo;{testimonial.text}&rdquo;</p>
      </div>
      
      <div className="tm-card__footer">
        <span className="tm-card__time">{testimonial.time}</span>
        <a 
          href={testimonial.reviewUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="tm-card__google"
        >
          <img src={GOOGLE_LOGO} alt="Google" />
        </a>
      </div>
    </div>
  );
}

// ─── Testimonials Grid ───────────────────────────────────────────────────
function TestimonialsGrid() {
  return (
    <section className="tm-grid">
      <div className="tm-section-inner">
        <div className="text-center mb-12">
          <div className="section-tag mx-auto">💬 Customer Reviews</div>
          <h2 className="font-heading font-black text-3xl md:text-4xl text-dark mt-2">
            Real Stories from <span className="text-brand-red">Real Customers</span>
          </h2>
          <p className="font-body text-gray-500 mt-3 max-w-xl mx-auto">
            Don't just take our word for it — hear from the families who've experienced our service firsthand.
          </p>
        </div>
        
        <div className="tm-grid__wrapper">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
        
        {/* Load more could be added here */}
      </div>
    </section>
  );
}

// ─── CTA Section ───────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="tm-cta">
      <div className="tm-cta__inner">
        <h2 className="font-heading font-black text-2xl md:text-3xl text-white text-center">
          Ready to Create Your Own Success Story?
        </h2>
        <p className="font-body text-white/70 text-sm text-center mt-2 max-w-lg mx-auto">
          Let us bring the same exceptional experience to your special occasion.
        </p>
        <div className="tm-cta__actions">
          <a href={PHONE_URL} className="tm-cta__btn tm-cta__btn--white">
            <Phone size={16} /> Call Us Now
          </a>
          <a 
            href={WHATSAPP_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="tm-cta__btn tm-cta__btn--outline"
          >
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────
export default function TestimonialsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="testimonials-page">
      <HeroSection />
      {/* <StatsStrip /> */}
      {/* <RatingSummary /> */}
      <TestimonialsGrid />
      <CTASection />
    </div>
  );
}