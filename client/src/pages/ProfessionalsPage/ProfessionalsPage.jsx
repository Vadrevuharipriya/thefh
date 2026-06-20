import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight, Award } from 'lucide-react';
import axios from 'axios';
import HERO_IMAGE from '../../assets/chefs/proffesionals-hero.avif';
import './ProfessionalsPage.scss';

function ProfCard({ pro }) {
  return (
    <Link to={`/professionals/${pro.slug}`} className="pros-card">
      <div className="pros-card__image-wrap">
        <img
          src={pro.image}
          alt={pro.name}
          className="pros-card__img"
          onError={(e) => { e.target.src = `https://i.pravatar.cc/200?u=${pro.id}-pro`; }}
        />
      </div>
      <h3 className="pros-card__name">{pro.name}</h3>
      <p className="pros-card__role">{pro.role}</p>
      <p className="pros-card__exp">{pro.experience} Years of Experience</p>
      <div className="pros-card__rating-badge">{pro.rating}</div>
    </Link>
  );
}

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('All Cities');

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/chefs');
        setProfessionals(res.data || []);
      } catch (err) {
        console.error('Failed to fetch professionals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  const filtered = useMemo(() => {
    return city === 'All Cities'
      ? professionals
      : professionals.filter((p) => p.city === city);
  }, [city, professionals]);

  if (loading) {
    return (
      <div className="pros-page">
        <div className="pros-page__hero">
          <div className="pros-page__hero-tag">
            <Award size={14} />
            Verified Professionals
          </div>
          <h1 className="pros-page__title">Our Professionals</h1>
          <p className="pros-page__subtitle">
            Our professionals are trained and verified from top restaurants and hotels.
          </p>
        </div>
        <div className="pros-page__filter-wrap">
          <div className="pros-page__filter-bar">
            <div className="pros-page__filter-left">
              <Star size={14} className="pros-page__filter-star" />
              <span>Showing profiles of <strong>all professionals</strong></span>
            </div>
            <select
              className="pros-page__city-select"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option key="All Cities" value="All Cities">All Cities</option>
              {/* Cities will be populated after data loads */}
            </select>
          </div>
        </div>
        <div className="pros-page__grid-wrap">
          <div className="pros-page__empty">
            <p>Loading professionals...</p>
          </div>
        </div>
      </div>
    );
  }

  const CITIES = ['All Cities', ...Array.from(new Set(professionals.map((p) => p.city))).sort()];

  return (
    <div className="pros-page">
      {/* Hero */}
      <section className="pros-page__hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
        <nav className="pros-page__breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <span>Top Professionals</span>
        </nav>
        <div className="pros-page__hero-tag">
          <Award size={14} />
          Verified Professionals
        </div>
        <h1 className="pros-page__title">Our Professionals</h1>
        <p className="pros-page__subtitle">
          Our professionals are trained and verified from top restaurants and hotels.
        </p>
      </section>

      {/* Filter Bar */}
      <div className="pros-page__filter-wrap">
        <div className="pros-page__filter-bar">
          <div className="pros-page__filter-left">
            <Star size={14} className="pros-page__filter-star" />
            <span>Showing profiles of <strong>all professionals</strong></span>
          </div>
          <select
            className="pros-page__city-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="pros-page__grid-wrap">
        {filtered.length === 0 ? (
          <div className="pros-page__empty">
            <p>No professionals found for the selected city.</p>
          </div>
        ) : (
          <div className="pros-page__grid">
            {filtered.map((pro) => (
              <ProfCard key={pro._id || pro.id} pro={pro} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
