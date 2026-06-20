import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ChevronRight, Star, Award, Clock, Heart, Zap, Flame,
  ChefHat, UtensilsCrossed, CalendarDays, Plane, Coffee, BookOpen,
  ArrowRight,
} from 'lucide-react';
import { useChef } from '../../hooks/public/useChefs';
import Loader from '../../components/Common/Loader';
import './ChefDetailPage.scss';

const HERO_IMAGE = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1600';

const TABS = ['About', 'Ratings', 'Reviews', 'Personal Information', 'Work Experience'];

const AWARD_ICONS = {
  flame: Flame,
  clock: Clock,
  heart: Heart,
  zap: Zap,
  star: Star,
};

const SERVICE_ICONS = {
  'Personal Chef': ChefHat,
  'Catering': UtensilsCrossed,
  'Full Time Chef': Coffee,
  'Vacation Chef': Plane,
  'Daily Chef': CalendarDays,
  'Cooking Classes': BookOpen,
};

const RATING_COLORS = {
  5: '#16a34a',
  4: '#84cc16',
  3: '#DA9100',
  2: '#f97316',
  1: '#C1272D',
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
function ChefHero({ chef }) {
  return (
    <section
      className="cd-hero"
      style={{ backgroundImage: `url(${HERO_IMAGE})` }}
    >
      <div className="cd-hero__overlay" />
      <div className="cd-hero__content">
        <nav className="cd-hero__breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={13} />
          <Link to="/professionals">Professionals</Link>
          <ChevronRight size={13} />
          <span>{chef.name}</span>
        </nav>
      </div>
    </section>
  );
}

// ─── Tab Nav ──────────────────────────────────────────────────────────────────
function TabNav({ active, onSelect }) {
  return (
    <div className="cd-tabs">
      <div className="cd-tabs__inner">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`cd-tabs__tab ${active === tab ? 'cd-tabs__tab--active' : ''}`}
            onClick={() => {
              onSelect(tab);
              const el = document.getElementById(tab.toLowerCase().replace(/\s+/g, '-'));
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Stats Strip ──────────────────────────────────────────────────────────────
function ChefStats({ chef }) {
  const stats = [
    { value: `${chef.experience}+`, label: 'Years of Experience' },
    { value: chef.rating, label: 'Average Rating' },
    { value: `${chef.events}+`, label: 'Bookings Completed' },
    { value: chef.followers, label: 'Followers' },
  ];
  return (
    <div className="cd-stats">
      {stats.map((s) => (
        <div key={s.label} className="cd-stats__card">
          <p className="cd-stats__value">{s.value}</p>
          <p className="cd-stats__label">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────
function AboutSection({ chef }) {
  return (
    <div id="about" className="cd-section">
      <div className="cd-card">
        <h2 className="cd-card__heading">About</h2>
        <p className="cd-card__body">{chef.bio}</p>
      </div>

      {/* Awards */}
      <div className="cd-card cd-card--awards">
        <h2 className="cd-card__heading">Awards</h2>
        <div className="cd-awards">
          {chef.awards.map((award) => {
            const Icon = AWARD_ICONS[award.icon] || Award;
            return (
              <div key={award.label} className="cd-award-item">
                <div className="cd-award-item__icon">
                  <Icon size={22} />
                </div>
                <p className="cd-award-item__label">{award.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Ratings Section ──────────────────────────────────────────────────────────
function RatingsSection({ chef }) {
  const max = Math.max(...Object.values(chef.ratingBreakdown));
  return (
    <div id="ratings" className="cd-section">
      <div className="cd-card">
        <h2 className="cd-card__heading">
          Ratings{' '}
          <span className="cd-card__sub">(based on {chef.totalRatings} ratings)</span>
        </h2>
        <div className="cd-ratings">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = chef.ratingBreakdown[star] || 0;
            const pct = max > 0 ? (count / max) * 100 : 0;
            return (
              <div key={star} className="cd-ratings__row">
                <span className="cd-ratings__star-label">
                  {star} <Star size={11} fill="#DA9100" className="cd-ratings__star-icon" />
                </span>
                <div className="cd-ratings__bar-track">
                  <div
                    className="cd-ratings__bar-fill"
                    style={{
                      width: `${pct}%`,
                      background: RATING_COLORS[star],
                    }}
                  />
                </div>
                <span className="cd-ratings__count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Reviews Section ──────────────────────────────────────────────────────────
function ReviewsSection({ chef }) {
  return (
    <div id="reviews" className="cd-section">
      <div className="cd-card">
        <h2 className="cd-card__heading">Reviews</h2>
        <p className="cd-card__empty">
          Customer reviews for {chef.name} will appear here. Be the first to book and share your experience!
        </p>
      </div>
    </div>
  );
}

// ─── Personal Information Section ─────────────────────────────────────────────
function PersonalInfoSection({ chef }) {
  return (
    <div id="personal-information" className="cd-section">
      <div className="cd-card">
        <div className="cd-personal">
          <div className="cd-personal__left">
            <h2 className="cd-card__heading">Personal Information</h2>
            <p className="cd-card__body">
              Contact details are shared after booking confirmation to protect professional privacy.
            </p>
            <Link to="/enquiry" className="cd-personal__book-btn">
              Book Now <ArrowRight size={15} />
            </Link>
          </div>
          <div className="cd-personal__avatar-wrap">
            <img
              src={chef.image}
              alt={chef.name}
              className="cd-personal__avatar"
              onError={(e) => { e.target.src = `https://i.pravatar.cc/120?u=${chef.id}-pro`; }}
            />
          </div>
        </div>

        {/* Service types */}
        <div className="cd-book-for">
          <p className="cd-book-for__label">Book Chef {chef.name} for</p>
          <div className="cd-book-for__grid">
            {chef.serviceTypes.map((type) => {
              const Icon = SERVICE_ICONS[type] || ChefHat;
              return (
                <div key={type} className="cd-service-chip">
                  <div className="cd-service-chip__icon">
                    <Icon size={20} />
                  </div>
                  <span className="cd-service-chip__label">{type}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Work Experience Section ───────────────────────────────────────────────────
function WorkExperienceSection({ chef }) {
  return (
    <div id="work-experience" className="cd-section">
      <div className="cd-card">
        <h2 className="cd-card__heading">Work Experience</h2>
        <div className="cd-work-exp">
          <div className="cd-work-exp__item">
            <div className="cd-work-exp__dot" />
            <div>
              <p className="cd-work-exp__role">{chef.role}</p>
              <p className="cd-work-exp__detail">Independent Professional · {chef.city}</p>
              <p className="cd-work-exp__period">{chef.experience} Years of Experience</p>
            </div>
          </div>
          <div className="cd-work-exp__item">
            <div className="cd-work-exp__dot" />
            <div>
              <p className="cd-work-exp__role">Cuisines Expertise</p>
              <p className="cd-work-exp__detail">
                {chef.cuisines.join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Book CTA strip ───────────────────────────────────────────────────────────
function BookCTA({ chef }) {
  return (
    <div className="cd-book-cta">
      <div className="cd-book-cta__inner">
        <div>
          <p className="cd-book-cta__title">Ready to book {chef.name}?</p>
          <p className="cd-book-cta__sub">Fill out a quick enquiry and our team will get back to you shortly.</p>
        </div>
        <Link to="/enquiry" className="cd-book-cta__btn">
          Book Now <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ChefDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('About');

  const { data: chef, isLoading: loading, error: fetchError } = useChef(slug);

  if (loading) {
    return (
      <div className="chef-detail-page min-h-screen">
        <Loader />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="chef-detail-page">
        <div className="cd-not-found">
          <h2>Error</h2>
          <p>{fetchError.message || 'Failed to load chef details'}</p>
          <Link to="/professionals" className="cd-not-found__link">← Back to Professionals</Link>
        </div>
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="chef-detail-page">
        <div className="cd-not-found">
          <h2>Chef not found</h2>
          <p>The professional you're looking for doesn't exist.</p>
          <Link to="/professionals" className="cd-not-found__link">← Back to Professionals</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="chef-detail-page">
      <ChefHero chef={chef} />
      <TabNav active={activeTab} onSelect={setActiveTab} />

      <div className="cd-body">
        <div className="cd-body__inner">
          <ChefStats chef={chef} />
          <AboutSection chef={chef} />
          <RatingsSection chef={chef} />
          <ReviewsSection chef={chef} />
          <PersonalInfoSection chef={chef} />
          <WorkExperienceSection chef={chef} />
        </div>
      </div>

      <BookCTA chef={chef} />
    </div>
  );
}