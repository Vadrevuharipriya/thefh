import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { COMMON_CART_ORDER_CATEGORY, readCommonCartItems, readCommonCartPlate, writeCartItems, writeCartPlate } from '../../utils/cartStorage';
import { useProducts } from '../../hooks/public/useProducts';
import Loader from '../../components/Common/Loader';
import './ViewMenuCartPage.scss';

const VEG_ICON = 'https://www.thefamoushalwai.com/frontEnd/images/veg_icon.png';
const NON_VEG_ICON = 'https://www.thefamoushalwai.com/frontEnd/images/non_veg_icon.png';

// Common occasions
const OCCASIONS = [
  'Wedding Functions',
  'Cocktail & Sangeet',
  'Birthday Party',
  'Corporate Event',
  'House Party',
  'Kids Party',
  'Pooja at Home',
  'Baby Shower',
  'Anniversary',
  'Roka Ceremony',
  'Other Occasion',
];

// Number of people options
const PEOPLE_OPTIONS = [
  '25', '50', '75', '100', '150', '200', '300', '500', '1000', '2000+'
];

// Service locations
const LOCATIONS = [
  'Delhi NCR',
  'Noida',
  'Gurugram',
  'Faridabad',
  'Ghaziabad',
  'Lucknow',
  'Jaipur',
  'Chandigarh',
  'Dehradun',
  'Other',
];

export default function ViewMenuCartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartOrderCategory = location.state?.cartOrderCategory || location.state?.orderCategory || COMMON_CART_ORDER_CATEGORY;
  const orderCategory = location.state?.orderCategory || cartOrderCategory;
  const initialPlate = useMemo(() => ({
    ...readCommonCartPlate(),
    ...(location.state?.plate || {})
  }), [location.state?.plate]);
  const initialPlateItems = useMemo(() => ({
    ...readCommonCartItems(),
    ...(location.state?.plateItems || {})
  }), [location.state?.plateItems]);
  
  const [plate, setPlate] = useState(initialPlate);
  const [allItemsMap, setAllItemsMap] = useState(initialPlateItems);

  useEffect(() => {
    writeCartPlate(COMMON_CART_ORDER_CATEGORY, plate);
  }, [plate]);

  useEffect(() => {
    writeCartItems(COMMON_CART_ORDER_CATEGORY, allItemsMap);
  }, [allItemsMap]);

  const plateEntries = Object.entries(plate).filter(([, count]) => count > 0);

  const { data: allProducts = [], isLoading: isLoadingProducts } = useProducts();

  useEffect(() => {
    const plateIds = Object.keys(initialPlate);
    if (plateIds.length === 0) {
      setAllItemsMap({});
      return;
    }

    const hasAllItems = plateIds.length > 0 && plateIds.every(id => id in initialPlateItems);
    if (hasAllItems) {
      setAllItemsMap(initialPlateItems);
      return;
    }

    if (allProducts.length > 0) {
      const map = { ...initialPlateItems };
      plateIds.forEach(id => {
        if (!map[id]) {
          const product = allProducts.find(p => p._id === id);
          if (product) {
            map[id] = {
              id: product._id,
              name: product.name,
              price: product.price,
              image: product.image,
              veg: product.vegType === 'Vegetarian',
              type: 'dish'
            };
          }
        }
      });
      setAllItemsMap(prev => ({ ...prev, ...map }));
    }
  }, [initialPlate, initialPlateItems, allProducts]);

  // Calculate Summary
  const summary = useMemo(() => {
    let subtotal = 0;
    let totalItemsCount = 0;
    
    plateEntries.forEach(([id, count]) => {
      const item = allItemsMap[id];
      if (item) {
        subtotal += (item.price || 0) * count;
        totalItemsCount += count;
      }
    });

    const discount = subtotal > 1000 ? 200 : 0;
    const platformFee = 8;
    const gst = Math.round((subtotal - discount) * 0.18);
    const totalPayable = subtotal - discount + platformFee + gst;

    return {
      subtotal,
      totalItems: totalItemsCount,
      totalPlates: plateEntries.length,
      discount,
      platformFee,
      gst,
      totalPayable
    };
  }, [plateEntries, allItemsMap]);

  const handleQuantity = (id, delta) => {
    setPlate(prev => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleRemove = (id) => {
    setPlate(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = () => {
    navigate('/enquiry', { state: { plate, plateItems: allItemsMap, orderCategory, cartOrderCategory: COMMON_CART_ORDER_CATEGORY } });
  };

  return (
    <div className="vmc-page">
      <div className="vmc-container">
        <header className="vmc-top-bar">
          <Link to="/our-menu" className="vmc-back-link">
            <ArrowLeft size={18} /> Back to menu
          </Link>
        </header>

        <div className="vmc-layout">
          {/* Main List Section */}
          <div className="vmc-list-card">
            <div className="vmc-list-header">
              <span className="col-items">Items</span>
              <span className="col-qty">Quantity</span>
              <span className="col-price">Price</span>
            </div>

            <div className="vmc-items">
              {plateEntries.length === 0 ? (
                <div className="vmc-empty-state">
                  <ShoppingBag size={48} />
                  <p>Your plate is empty. Start adding items!</p>
                  <Link to="/our-menu" className="btn-red">Browse Menu</Link>
                </div>
              ) : (
                plateEntries.map(([id, count]) => {
                  const item = allItemsMap[id];
                  if (!item) return null;
                  return (
                    <div key={id} className="vmc-row">
                      <div className="vmc-row__item">
                        <div className="vmc-row__img-wrap">
                          <img src={item.image} alt={item.name} onError={e => e.target.src = 'https://picsum.photos/100/100'} />
                        </div>
                        <span className="vmc-row__name">{item.name}</span>
                      </div>
                      
                      <div className="vmc-row__qty">
                        <div className="vmc-qty-pill">
                          <button onClick={() => handleQuantity(id, -1)} aria-label="Decrease">
                            <Minus size={12} />
                          </button>
                          <span>{count}</span>
                          <button onClick={() => handleQuantity(id, 1)} aria-label="Increase">
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="vmc-row__price">
                        <span className="price-val">Rs. {item.price || 300}</span>
                        <button className="vmc-row__del" onClick={() => handleRemove(id)} aria-label="Remove item">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="vmc-add-more">
              <Link to="/our-menu" className="vmc-add-more-link">
                Add more items
              </Link>
            </div>

          </div>

          {/* Sidebar Section */}
          <aside className="vmc-sidebar">
            <div className="vmc-summary-card">
              <h2 className="vmc-summary-card__title">Order Summary</h2>
              
              <div className="vmc-summary-card__rows">
                <div className="summary-row">
                  <span className="label">Total Plates</span>
                  <span className="val">{summary.totalPlates}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Total Items</span>
                  <span className="val">{summary.totalItems}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Subtotal</span>
                  <span className="val">₹{summary.subtotal}</span>
                </div>
                <div className="summary-row discount">
                  <span className="label">Online Discount</span>
                  <span className="val">-₹{summary.discount}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Platform Fee</span>
                  <span className="val">₹{summary.platformFee}</span>
                </div>
                <div className="summary-row">
                  <span className="label">GST (18%)</span>
                  <span className="val">₹{summary.gst}</span>
                </div>
              </div>

              <div className="vmc-summary-card__total">
                <span className="label">Total Payable</span>
                <span className="val">₹{summary.totalPayable}</span>
              </div>

              <button className="vmc-summary-card__btn" onClick={handleSubmit}>
                Continue
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
