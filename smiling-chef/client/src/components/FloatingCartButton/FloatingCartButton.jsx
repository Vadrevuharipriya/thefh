import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { COMMON_CART_ORDER_CATEGORY } from '../../utils/cartStorage';
import './FloatingCartButton.scss';

function FloatingCartButton({ plate, plateItems, orderCategory, cartOrderCategory = COMMON_CART_ORDER_CATEGORY, totalItems }) {
  const navigate = useNavigate();

  if (totalItems <= 0) return null;

  return (
    <button
      className="floating-cart-btn"
      onClick={() => navigate('/view-menu-cart', { state: { plate, plateItems, orderCategory, cartOrderCategory } })}
    >
      <span className="floating-cart-btn__text">View cart</span>
      <span className="floating-cart-btn__count">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
    </button>
  );
}

FloatingCartButton.propTypes = {
  plate: PropTypes.object.isRequired,
  plateItems: PropTypes.object.isRequired,
  orderCategory: PropTypes.string.isRequired,
  cartOrderCategory: PropTypes.string,
  totalItems: PropTypes.number.isRequired
};

export default FloatingCartButton;
