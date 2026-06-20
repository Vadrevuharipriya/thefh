import { Star, Quote } from 'lucide-react';
import { testimonials } from '../../data/homeData';
import './TestimonialsSection.scss';

const GOOGLE_LOGO = 'https://www.thefamoushalwai.com/frontEnd/images/g-rating.png';

function TestimonialCard({ t, highlight = false }) {
  return (
    <div className={`testimonial-card ${highlight ? 'testimonial-card--highlight' : 'testimonial-card--default'}`}>
      {/* Stars */}
      <div className="flex gap-1">
        {[...Array(t.rating)].map((_, i) => (
          <Star
            key={i}
            size={14}
            fill={highlight ? 'rgba(255,255,255,0.9)' : '#DA9100'}
            className={highlight ? 'text-white/90' : 'text-brand-gold'}
          />
        ))}
      </div>

      <Quote size={20} className={highlight ? 'text-white/30' : 'text-brand-red/20'} />

      <p className={`font-body text-sm leading-relaxed flex-1 ${highlight ? 'text-white/90' : 'text-gray-600'}`}>
        &ldquo;{t.text}&rdquo;
      </p>

      {/* Author */}
      <div className={`flex items-center gap-3 pt-2 border-t ${highlight ? 'border-white/10' : 'border-border'}`}>
        <img
          src={t.avatar}
          alt={t.name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30"
          onError={(e) => { e.target.src = `https://i.pravatar.cc/40?u=${t.id}`; }}
        />
        <div className="flex-1 min-w-0">
          <p className={`font-heading font-bold text-sm ${highlight ? 'text-white' : 'text-gray-900'}`}>{t.name}</p>
          <p className={`font-body text-xs truncate ${highlight ? 'text-white/60' : 'text-gray-400'}`}>{t.time}</p>
        </div>
        <img
          src={GOOGLE_LOGO}
          alt="Google"
          className="h-4 opacity-60 flex-shrink-0"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="testimonials-section">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <div className="section-tag">❤️ Customer Love</div>
            <h2 className="section-heading">
              10,000+ <span className="text-brand-red">Happy Families</span>
            </h2>
            <p className="font-body text-gray-500 mt-3 max-w-md">
              With a 99% success rate — our customers keep coming back.
            </p>
          </div>

          {/* Rating badge */}
          <div className="testimonials-section__rating-badge">
            <div className="text-center">
              <span className="font-heading font-black text-5xl text-brand-red">4.9</span>
              <div className="flex justify-center mt-1 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="#DA9100" className="text-brand-gold" />
                ))}
              </div>
            </div>
            <div className="pl-4 border-l border-border">
              <img
                src={GOOGLE_LOGO}
                alt="Google"
                className="h-5 mb-1"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <p className="font-body text-xs text-gray-400 leading-snug">
                Overall Rating<br />The Famous Halwai
              </p>
            </div>
          </div>
        </div>

        <div className="testimonials-section__grid">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} t={t} highlight={i === 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
