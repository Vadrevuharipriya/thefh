import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Phone, MessageCircle, MapPin } from 'lucide-react';
import { cities } from '../../data/homeData';
import { cityPageData } from '../../data/cityData';
import { slugify } from '../../utils/slugify';
import './CityPage.scss';

const PHONE_URL = 'tel:+918926262674';
const WHATSAPP_URL = 'https://wa.me/918926262674?text=Hello! I am looking for a Halwai %26 Chef.';

// ─── Breadcrumb ────────────────────────────────────────────────────────────────
function Breadcrumb({ cityName }) {
  return (
    <nav className="cp-breadcrumb" aria-label="Breadcrumb">
      <div className="cp-breadcrumb__inner">
        <Link to="/" className="cp-breadcrumb__link">Home</Link>
        <ChevronRight size={13} className="cp-breadcrumb__sep" />
        <span className="cp-breadcrumb__current">{cityName}</span>
      </div>
    </nav>
  );
}

// ─── Editorial Content ─────────────────────────────────────────────────────────
function CityContent({ city, data }) {
  return (
    <article className="cp-content">
      <div className="cp-content__inner">
        {/* City name */}
        <h1 className="cp-content__city-name">{city.name}</h1>

        {/* City image */}
        <div className="cp-content__img-wrap">
          <img
            src={city.image}
            alt={city.name}
            className="cp-content__img"
            onError={(e) => {
              e.target.src = `https://picsum.photos/900/480?u=city-${city.id}`;
            }}
          />
          <div className="cp-content__img-badge">
            <MapPin size={14} />
            <span>{city.name}</span>
          </div>
        </div>

        {/* Intro paragraph (italic) */}
        <p className="cp-content__intro">{data.intro}</p>

        {/* Main heading */}
        <h2 className="cp-content__heading">{data.heading}</h2>

        {/* Body paragraphs */}
        <div className="cp-content__body">
          {data.paragraphs.map((para, i) => (
            <p
              key={i}
              className="cp-content__para"
              dangerouslySetInnerHTML={{ __html: para }}
            />
          ))}

          {/* Services bullet list */}
          <ul className="cp-content__services">
            {data.services.map((item, i) => (
              <li
                key={i}
                className="cp-content__service-item"
                dangerouslySetInnerHTML={{ __html: item }}
              />
            ))}
          </ul>

          {/* Closing paragraph */}
          <p
            className="cp-content__closing"
            dangerouslySetInnerHTML={{ __html: data.closing }}
          />
        </div>
      </div>
    </article>
  );
}

// ─── CTA Strip ─────────────────────────────────────────────────────────────────
function CTAStrip({ cityName }) {
  return (
    <section className="cp-cta">
      <div className="cp-cta__inner">
        <div className="cp-cta__text">
          <h2 className="cp-cta__heading">
            Need Catering in <span className="cp-cta__city">{cityName}?</span>
          </h2>
          <p className="cp-cta__sub">
            Our verified halwais and chefs are ready to make your next celebration unforgettable.
          </p>
        </div>
        <div className="cp-cta__actions">
          <a href={PHONE_URL} className="cp-cta__btn cp-cta__btn--white">
            <Phone size={16} />
            Call Us Now
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cp-cta__btn cp-cta__btn--outline"
          >
            <MessageCircle size={16} />
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Other Cities ──────────────────────────────────────────────────────────────
function OtherCities({ currentSlug }) {
  const others = cities.filter((c) => slugify(c.name) !== currentSlug);

  return (
    <section className="cp-other-cities">
      <div className="cp-other-cities__inner">
        <h3 className="cp-other-cities__heading">We Also Serve</h3>
        <div className="cp-other-cities__strip">
          {others.map((city) => (
            <Link
              key={city.id}
              to={`/city/${slugify(city.name)}`}
              className="cp-city-card"
            >
              <div className="cp-city-card__img-wrap">
                <img
                  src={city.image}
                  alt={city.name}
                  className="cp-city-card__img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = `https://picsum.photos/300/400?u=city-${city.id}`;
                  }}
                />
                <div className="cp-city-card__overlay" />
              </div>
              <div className="cp-city-card__info">
                <MapPin size={11} color="#DA9100" style={{ flexShrink: 0 }} />
                <span className="cp-city-card__name">{city.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Not Found ─────────────────────────────────────────────────────────────────
function NotFound({ slug }) {
  return (
    <div className="cp-not-found">
      <h2 className="cp-not-found__title">City not found</h2>
      <p className="cp-not-found__desc">
        We couldn&apos;t find a city matching &quot;{slug}&quot;.
      </p>
      <Link to="/" className="btn-red">Back to Home</Link>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function CityPage() {
  const { slug } = useParams();

  const city = cities.find((c) => slugify(c.name) === slug);
  const data = cityPageData[slug];

  if (!city || !data) return <NotFound slug={slug} />;

  return (
    <div className="city-page">
      <Breadcrumb cityName={city.name} />
      <CityContent city={city} data={data} />
      <CTAStrip cityName={city.name} />
      <OtherCities currentSlug={slug} />
    </div>
  );
}
