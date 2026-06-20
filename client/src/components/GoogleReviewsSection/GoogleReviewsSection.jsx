import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { testimonials } from '../../data/homeData';
import './GoogleReviewsSection.scss';

// ─── Helpers ───────────────────────────────────────────────────────────────────
const getVisibleCount = (width) => {
  if (width >= 1024) return 4;
  if (width >= 640) return 2;
  return 1;
};

const GOOGLE_REVIEWS_URL =
  'https://www.google.com/search?q=The+Famous+Halwai+reviews&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOUI6NkEaEB81fReF91UVTfqUYsy5j0jar5-v6PUMuVQU-NPNknRtQU7LJ6WmslvCQs4FACic8PQN1KPe6SjlfmJ4qReFt-4eqfiBShvTLhSeekYyVMLkw4SgGJ7c2jGJdx4gxalaRQDxVNEPx5dgcD40gvD-72ZYrODYFEV3Zzzj84BOoQ%3D%3D';

// ─── Google "G" coloured logo ──────────────────────────────────────────────────
function GoogleGIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

// ─── Avatar colour based on name ──────────────────────────────────────────────
const AVATAR_COLORS = ['#388E3C', '#1565C0', '#6A1B9A', '#BF360C', '#00695C', '#4527A0', '#F57F17'];
function avatarColor(name = '') {
  const hash = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function normaliseApiReviews(data) {
  return (data.reviews || []).map((r, i) => ({
    id: i,
    name: r.author_name,
    handle: `@${r.author_name.replace(/\s+/g, '')}`,
    text: r.text,
    time: r.relative_time_description,
    rating: r.rating,
    photo: r.profile_photo_url || null,
    reviewUrl: r.author_url || GOOGLE_REVIEWS_URL,
  }));
}

function normaliseFallback(data) {
  return data.map((t) => ({
    id: t.id,
    name: t.name,
    handle: t.handle,
    text: t.text,
    time: t.time,
    rating: t.rating,
    photo: null,
    reviewUrl: t.reviewUrl || GOOGLE_REVIEWS_URL,
  }));
}

// ─── Single review card ────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  const [imgError, setImgError] = useState(false);
  const color = avatarColor(review.name);
  const initial = review.name.trim()[0]?.toUpperCase() ?? '?';

  return (
    <div className="gr-card">
      <div className="gr-card__avatar" style={{ background: color }}>
        {review.photo && !imgError ? (
          <img src={review.photo} alt={review.name} onError={() => setImgError(true)} />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      <p className="gr-card__name">{review.name}</p>
      <p className="gr-card__meta">{review.handle}&nbsp;&bull;&nbsp;{review.time}</p>

      <a
        href={review.reviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View on Google"
        className="gr-card__google-link"
      >
        <GoogleGIcon />
      </a>

      <div className="gr-card__stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={18}
            fill={i < review.rating ? '#F5A623' : 'none'}
            color={i < review.rating ? '#F5A623' : '#d1d5db'}
          />
        ))}
      </div>

      <p className="gr-card__text">{review.text}</p>
    </div>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────────
export default function GoogleReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState({ rating: 4.9, totalReviews: 155 });
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const viewportRef = useRef(null);

  // ── Data fetching ────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/reviews')
      .then((r) => r.json())
      .then((data) => {
        if (data.reviews?.length) {
          setReviews(normaliseApiReviews(data));
          setMeta({ rating: data.rating, totalReviews: data.totalReviews });
        } else {
          setReviews(normaliseFallback(testimonials));
        }
      })
      .catch(() => setReviews(normaliseFallback(testimonials)))
      .finally(() => setLoading(false));
  }, []);

  // ── Responsive visible count via ResizeObserver ───────────────────────────────
  const updateVisibleCount = useCallback(() => {
    if (!viewportRef.current) return;
    setVisibleCount(getVisibleCount(viewportRef.current.offsetWidth));
  }, []);

  useEffect(() => {
    if (!reviews.length) return;
    updateVisibleCount();
    const ro = new ResizeObserver(updateVisibleCount);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [updateVisibleCount, reviews.length]);

  // ── Clamp current index when visibleCount or reviews change ─────────────────
  const maxIndex = Math.max(0, reviews.length - visibleCount);
  useEffect(() => {
    setCurrent((c) => Math.min(c, maxIndex));
  }, [maxIndex]);

  // ── Navigation ───────────────────────────────────────────────────────────────
  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(maxIndex, c + 1)), [maxIndex]);

  if (loading || !reviews.length) return null;

  const n = reviews.length;

  // Track spans all cards; each card = 1/visibleCount of the viewport
  // translateX percentage is relative to the track itself:
  //   track.width = n * viewport / visibleCount
  //   translate per step = viewport / visibleCount = track / n
  //   so: translateX(-current * 100 / n %)
  const trackStyle = {
    width: `${(n * 100) / visibleCount}%`,
    transform: `translateX(-${(current * 100) / n}%)`,
  };
  const slideStyle = { width: `${100 / n}%` };

  return (
    <section className="google-reviews">
      {/* ── Top heading ── */}
      <div className="google-reviews__top">
        <h2 className="google-reviews__title">
          More than <span>10,000 Happy Customers</span>
          <br />Testimonials
        </h2>
        <p className="google-reviews__subtitle">With 99% Success Rate</p>
      </div>

      {/* ── Content row: carousel only ── */}
      <div className="google-reviews__carousel">
        <div className="google-reviews__right">

          {/* Carousel wrap — position context for nav arrows */}
          <div className="google-reviews__carousel-wrap">
            {/* Viewport — clips the track */}
            <div className="google-reviews__viewport" ref={viewportRef}>
              <div className="google-reviews__track" style={trackStyle}>
                {reviews.map((review) => (
                  <div key={review.id} className="google-reviews__slide" style={slideStyle}>
                    <ReviewCard review={review} />
                  </div>
                ))}
              </div>
            </div>

            {/* Nav arrows — half-outside viewport */}
            <button
              className="google-reviews__nav google-reviews__nav--prev"
              onClick={prev}
              disabled={current === 0}
              aria-label="Previous reviews"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="google-reviews__nav google-reviews__nav--next"
              onClick={next}
              disabled={current === maxIndex}
              aria-label="Next reviews"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Slide dots */}
          <div className="google-reviews__dots">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                className={`google-reviews__dot${i === current ? ' google-reviews__dot--active' : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
