import React from 'react';
import { Plus, Minus } from 'lucide-react';
import './MenuDishCard.scss';

const VEG_ICON = 'https://www.thefamoushalwai.com/frontEnd/images/veg_icon.png';
const NON_VEG_ICON = 'https://www.thefamoushalwai.com/frontEnd/images/non_veg_icon.png';

const MenuDishCard = ({ dish, count, onAdd, onRemove }) => {
  return (
    <div className="menu-dish-card">
      <div className="menu-dish-card__img-container">
        <img
          src={dish.image}
          alt={dish.name}
          className="menu-dish-card__img"
          loading="lazy"
          onError={e => { e.target.src = `https://picsum.photos/200/200?u=dish-${dish.id}`; }}
        />
        <div className="menu-dish-card__overlay" />
        <h3 className="menu-dish-card__name">{dish.name}</h3>
      </div>
      
      <div className="menu-dish-card__info">
        {/* <img
          src={dish.veg ? VEG_ICON : NON_VEG_ICON}
          alt={dish.veg ? 'Veg' : 'Non-Veg'}
          className="menu-dish-card__veg-icon"
        /> */}
        <div className="menu-dish-card__price">
          <span className='dish-currency' >Rs. </span>
          <span className="menu-dish-card__price">{dish.price}</span>
        </div>

        {count > 0 ? (
          <div className="menu-dish-card__counter">
            <button 
              className="menu-dish-card__counter-btn" 
              onClick={(e) => { e.stopPropagation(); onRemove(dish.id); }}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="menu-dish-card__count">{count}</span>
            <button 
              className="menu-dish-card__counter-btn" 
              onClick={(e) => { e.stopPropagation(); onAdd(dish); }}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button 
            className="menu-dish-card__add-btn" 
            onClick={(e) => { e.stopPropagation(); onAdd(dish); }}
            aria-label={`Add ${dish.name} to cart`}
          >
            ADD
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuDishCard;
