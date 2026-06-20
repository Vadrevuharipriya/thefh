import { ArrowRight } from 'lucide-react';
import './OccasionCard.scss';

export default function OccasionCard({ occasion }) {
  return (
    <a href={occasion.link} className="occasion-card">
      <div className="occasion-card__image-wrap">
        <img
          src={occasion.image}
          alt={occasion.name}
          className="occasion-card__img"
          onError={(e) => { e.target.src = `https://picsum.photos/400/300?u=${occasion.id}`; }}
        />
        <div className="occasion-card__hover-overlay" />
        <div className="occasion-card__badge">
          <ArrowRight size={14} color="white" />
        </div>
      </div>
      <div className="occasion-card__info">
        <h3 className="occasion-card__name">{occasion.name}</h3>
        <p className="occasion-card__price">Starting: @{occasion.price} (INR)</p>
      </div>
    </a>
  );
}
