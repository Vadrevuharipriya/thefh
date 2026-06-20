import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import './CitiesSection.scss';

const SCROLL_AMOUNT = 600;

function CityCard({ city }) {
  return (
    <Link to={`/city/${city.slug}`} className="city-card">
      <div className="city-card__aspect">
        <img
          src={city.image}
          alt={city.name}
          className="city-card__img"
          loading="lazy"
          decoding="async"
          onError={(e) => { e.target.src = `https://picsum.photos/300/400?u=city-${city._id}`; }}
        />
        <div className="city-card__overlay" />
      </div>
      <div className="city-card__info">
        <MapPin size={12} color="#DA9100" style={{ flexShrink: 0 }} />
        <span className="city-card__name">{city.name}</span>
      </div>
    </Link>
  );
}

export default function CitiesSection() {
  const stripRef = useRef(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const scroll = (dir) => {
    if (stripRef.current) {
      stripRef.current.scrollBy({ left: dir * SCROLL_AMOUNT, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get('/api/locations');
        // Only show enabled/approved locations
        const activeCities = res.data.filter(city => city.displayStatus === 'Approved');
        setCities(activeCities);
      } catch (err) {
        console.error('Failed to fetch cities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  return (
    <section className="cities-section">
      <div className="cities-section__glow" />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="section-tag">📍 Service Locations</div>
          <h2 className="font-heading font-black text-4xl md:text-5xl text-white leading-tight">
            Serving <span className="text-gradient">{cities.length}+ Cities</span>
          </h2>
          <p className="font-body text-gray-400 mt-3 text-sm">And expanding to more cities every month!</p>
        </div>

        {loading ? (
          <div className="text-center py-10 text-white">Loading cities...</div>
        ) : (
          <div className="cities-section__carousel">
            <button
              className="cities-section__nav-btn cities-section__nav-btn--left"
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="cities-section__filmstrip" ref={stripRef}>
              {cities.map((city) => (
                <CityCard key={city._id} city={city} />
              ))}
            </div>

            <button
              className="cities-section__nav-btn cities-section__nav-btn--right"
              onClick={() => scroll(1)}
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        <div className="text-center mt-8">
          {/* <Link to="/" className="btn-outline inline-block border-white/20 text-white hover:bg-white hover:text-brand-red cities-section__view-btn">
            View All Cities
          </Link> */}
        </div>
      </div>
    </section>
  );
}
