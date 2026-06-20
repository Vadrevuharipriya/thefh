import { Plus, Minus } from 'lucide-react';
import './ServiceProductCard.scss';

const ServiceProductCard = ({ item, count, onAdd, onRemove, imageBaseUrl }) => {
  const id = item.id || item._id;
  const imageUrl = item.image || `${imageBaseUrl}${id}.jpg`;

  return (
    <div className="service-product-card">
      <div className="service-product-card__img-container">
        <img
          src={imageUrl}
          alt={item.name}
          className="service-product-card__img"
          loading="lazy"
        />
        <div className="service-product-card__overlay" />
        <h3 className="service-product-card__name">{item.name}</h3>
      </div>
      
      <div className="service-product-card__info">
        <div className="service-product-card__price-wrap">
          <span className="service-product-card__currency">Rs. </span>
          <span className="service-product-card__price">{item.price}</span>
        </div>

        {count > 0 ? (
          <div className="service-product-card__counter">
            <button 
              className="service-product-card__counter-btn" 
              onClick={() => onRemove(id)}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="service-product-card__count">{count}</span>
            <button 
              className="service-product-card__counter-btn" 
          onClick={() => onAdd(id)}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button 
            className="service-product-card__add-btn" 
            onClick={() => onAdd(item.id)}
            aria-label={`Add ${item.name} to cart`}
          >
            ADD
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceProductCard;
