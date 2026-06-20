import { useRef, useEffect, useState } from 'react';
import { Star, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ProfessionalsSection.scss';

function ProfCard({ pro }) {
  return (
    <Link
      to={`/professionals/${pro.slug}`}
      className="prof-card"
      style={{ textDecoration: 'none' }}
    >
      <div className="prof-card__image-wrap">
        <img
          src={pro.image}
          alt={pro.name}
          className="prof-card__img"
          onError={(e) => {
            e.target.src = `https://i.pravatar.cc/300?u=${pro._id}-pro`;
          }}
        />

        <div className="prof-card__overlay" />
        <div className="prof-card__badge">{pro.events}+ events</div>
      </div>

      <div className="prof-card__info">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-heading font-black text-white text-base leading-tight">
              {pro.name}
            </h3>

            <p className="font-body text-white/60 text-xs mt-0.5">
              {pro.role}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1">
            <Star
              size={11}
              fill="#DA9100"
              className="text-brand-gold"
            />
            <span className="text-white text-xs font-bold">
              {pro.rating}
            </span>
          </div>
        </div>

        <div className="flex gap-0.5 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={10}
              fill={i < Math.floor(pro.rating) ? '#DA9100' : 'none'}
              className={
                i < Math.floor(pro.rating)
                  ? 'text-brand-gold'
                  : 'text-white/30'
              }
            />
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function ProfessionalsSection() {
  const scrollRef = useRef(null);

  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/chefs')
      .then((res) => res.json())
      .then((data) => {
        setProfessionals(
          data.filter(
            (chef) => chef.displayStatus === 'Approved'
          )
        );
      })
      .catch((err) => {
        console.error('Failed to load chefs:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === 'left' ? -320 : 320,
      behavior: 'smooth'
    });
  };

  return (
    <section className="prof-section">
      <div className="prof-section__glow-left" />
      <div className="prof-section__glow-right" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="section-tag">
            <Award size={12} />
            Top Rated Professionals
          </div>

          <h2 className="font-heading font-black text-4xl md:text-5xl text-white leading-tight">
            Well Trained &<br />
            <span className="text-gradient">
              Background Verified
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="prof-section__loading">
            <div className="loading-spinner" />
          </div>
        ) : (
          <>
            <div className="prof-section__carousel">
              <button
                className="prof-section__nav-btn prof-section__nav-btn--left"
                onClick={() => scroll('left')}
                aria-label="Scroll left"
              >
                <ChevronLeft size={24} />
              </button>

              <div
                className="prof-section__scroll-row"
                ref={scrollRef}
              >
                {professionals.map((pro) => (
                  <ProfCard
                    key={pro._id}
                    pro={pro}
                  />
                ))}
              </div>

              <button
                className="prof-section__nav-btn prof-section__nav-btn--right"
                onClick={() => scroll('right')}
                aria-label="Scroll right"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="text-center mt-8">
              <Link
                to="/professionals"
                className="btn-outline inline-block border-white text-white hover:bg-white hover:text-brand-red"
              >
                View All Professionals
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}