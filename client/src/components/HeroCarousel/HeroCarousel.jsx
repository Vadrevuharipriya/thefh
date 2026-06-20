import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Users, MapPin } from 'lucide-react';
import { useBanners } from '../../hooks/public/useBanners';
import './HeroCarousel.scss';

const GOOGLE_LOGO = 'https://www.thefamoushalwai.com/frontEnd/images/g-rating.png';

const floatingCards = [
  { icon: <Star size={16} fill="#DA9100" className="text-brand-gold" />, label: 'Google Rating', value: '4.9 ★', color: 'from-amber-500/20 to-yellow-500/10' },
  { icon: <Users size={16} className="text-green-400" />, label: 'Happy Families', value: '10,000+', color: 'from-green-500/20 to-emerald-500/10' },
  { icon: <MapPin size={16} className="text-blue-400" />, label: 'Cities Served', value: '15+ Cities', color: 'from-blue-500/20 to-cyan-500/10' },
];

const fallbackHeroSlides = [
  {
    id: 1,
    tag: 'Banquet & Venue',
    title: 'Destination',
    titleAccent: 'Venues',
    subtitle: 'Luxurious banquet halls & outdoor venues for weddings, corporate galas & grand celebrations.',
    rating: 4.9,
    reviews: 1012,
    image: 'https://images.pexels.com/photos/34079355/pexels-photo-34079355.jpeg',
    link: '#',
  },
  {
    id: 2,
    tag: 'Halwai at Home',
    title: 'Expert Chefs',
    titleAccent: 'At Your Door',
    subtitle: 'Verified halwais & professional chefs for any occasion — from pooja to full-scale weddings.',
    rating: 4.5,
    reviews: 1440,
    image: 'https://images.pexels.com/photos/17294714/pexels-photo-17294714.jpeg',
    link: '#',
  },
  {
    id: 3,
    tag: 'Catering Services',
    title: 'Authentic',
    titleAccent: 'Indian Cuisine',
    subtitle: 'From North Indian thalis to Continental spreads — curated menus for 15+ occasion types.',
    rating: 4.9,
    reviews: 1012,
    image: 'https://images.pexels.com/photos/5775684/pexels-photo-5775684.jpeg',
    link: '#',
  },
  {
    id: 4,
    tag: 'Celebrations',
    title: 'Unforgettable',
    titleAccent: 'Celebrations',
    subtitle: 'Birthday parties, anniversaries, house parties — every event deserves a perfect spread.',
    rating: 4.9,
    reviews: 1012,
    image: 'https://images.pexels.com/photos/30844787/pexels-photo-30844787.jpeg',
    link: '#',
  },
];

function toHeroSlide(b) {
  return {
    id: b._id || b.sortOrder,
    tag: b.tag || '',
    title: b.title || '',
    titleAccent: b.titleAccent || '',
    subtitle: b.subtitle || '',
    image: b.image || '',
    rating: b.rating ?? 4.9,
    reviews: b.reviews ?? 0,
    link: b.link || '#',
  };
}

export default function HeroCarousel() {
  const { data: banners, isLoading } = useBanners('Approved');
  
  const slides = banners && banners.length > 0 
    ? banners.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map(toHeroSlide)
    : fallbackHeroSlides;

  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const goTo = useCallback((index) => {
    setCurrent(index);
  }, []);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo, slides.length]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo, slides.length]);

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="relative w-full h-[100svh] min-h-[560px] max-h-[800px] overflow-hidden">

      {/* Each slide: image + text rendered together, crossfaded as a unit */}
      {slides.map((slide, i) => {
        const active = i === current;
        return (
          <div
            key={slide.id}
            className="hero-carousel__slide"
            style={{ opacity: active ? 1 : 0, pointerEvents: active ? 'auto' : 'none' }}
          >
            {/* Background image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ transform: active ? 'scale(1)' : 'scale(1.05)', transition: 'transform 8s ease' }}
            />
            <div className="absolute inset-0 bg-hero-gradient" />
            <div className="hero-carousel__vignette" />

            {/* Content — same layer as image, fades in sync */}
            <div className="relative z-10 h-full flex items-center pt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">

                {/* Left: Text */}
                <div className="max-w-2xl">
                  {/* Tag */}
                  <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                    <span className="text-white/90 text-xs font-heading font-bold tracking-widest uppercase">{slide.tag}</span>
                  </div>

                  {/* Headline */}
                  <h1 className="font-heading font-black text-white leading-[1.05] mb-4 md:mb-5">
                    <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">{slide.title}</span>
                    <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gradient">{slide.titleAccent}</span>
                  </h1>

                  <p className="text-white/75 font-body text-base sm:text-lg leading-relaxed mb-6 md:mb-8 max-w-lg">
                    {slide.subtitle}
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-wrap items-center gap-4">
                    <button onClick={() => navigate('/enquiry')} className="btn-red text-base px-8 py-4 shadow-red">
                      Book Now
                      <ChevronRight size={18} />
                    </button>
                    <Link to="/our-menu" className="flex items-center gap-2 text-white/90 hover:text-white font-body text-sm font-semibold underline underline-offset-4 transition-colors">
                      View Our Menu
                    </Link>
                  </div>

                  {/* Google Rating */}
                  <div className="flex items-center gap-3 mt-8">
                    <img src={GOOGLE_LOGO} alt="Google" className="h-6 opacity-90" onError={(e) => { e.target.style.display = 'none'; }} />
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#DA9100" className="text-brand-gold" />)}
                    </div>
                    <span className="text-white/80 text-sm font-body">{slide.rating} · {slide.reviews.toLocaleString()} Reviews</span>
                  </div>
                </div>

                {/* Right: Floating stat cards */}
                <div className="hidden lg:flex flex-col gap-3">
                  {floatingCards.map((card, i) => (
                    <div
                      key={i}
                      className="glass rounded-2xl px-5 py-4 flex items-center gap-3 min-w-[180px] animate-float"
                      style={{ animationDelay: `${i * 0.8}s` }}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                        {card.icon}
                      </div>
                      <div>
                        <p className="font-heading font-black text-white text-lg leading-none">{card.value}</p>
                        <p className="font-body text-white/60 text-xs mt-0.5">{card.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        );
      })}

      {/* Prev / Next — above slides */}
      <button onClick={prev} aria-label="Previous"
        className="hero-carousel__nav-btn absolute left-3 sm:left-4 top-1/2 -translate-y-1/4 z-10">
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} aria-label="Next"
        className="hero-carousel__nav-btn absolute right-3 sm:right-4 top-1/2 -translate-y-1/4 z-10">
        <ChevronRight size={20} />
      </button>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`hero-carousel__dot ${i === current ? 'hero-carousel__dot--active' : 'hero-carousel__dot--inactive'}`}
          />
        ))}
      </div>
    </section>
  );
}
