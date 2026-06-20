import { Star } from 'lucide-react';
import './StarRating.scss';

export default function StarRating({ rating, max = 5, size = 14 }) {
  return (
    <div className="star-rating">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        return (
          <Star
            key={i}
            size={size}
            className={`star-rating__star ${filled ? 'star-rating__star--filled' : 'star-rating__star--empty'}`}
            fill={filled ? '#DA9100' : 'none'}
          />
        );
      })}
    </div>
  );
}
