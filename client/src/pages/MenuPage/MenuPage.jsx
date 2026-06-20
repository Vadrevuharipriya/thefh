import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingBag, UtensilsCrossed, Check, Filter, X } from 'lucide-react';
import axios from 'axios';
import MenuDishCard from '../../components/MenuDishCard/MenuDishCard';
import FloatingCartButton from '../../components/FloatingCartButton/FloatingCartButton';
import { slugify } from '../../utils/slugify';
import { readCommonCartItems, readCommonCartPlate, writeCartItems, writeCartPlate, COMMON_CART_ORDER_CATEGORY } from '../../utils/cartStorage';
import './MenuPage.scss';

const VEG_ICON = 'https://www.thefamoushalwai.com/frontEnd/images/veg_icon.png';
const NON_VEG_ICON = 'https://www.thefamoushalwai.com/frontEnd/images/non_veg_icon.png';
const CART_ORDER_CATEGORY = COMMON_CART_ORDER_CATEGORY;
const ORDER_CATEGORY = 'customized-plate';

const heroImages = [
  'https://images.pexels.com/photos/5775684/pexels-photo-5775684.jpeg',
  'https://images.pexels.com/photos/4331490/pexels-photo-4331490.jpeg',
  'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
];

// Menu category emoji mapping
const categoryEmojis = {
  breakfast: '🌅',
  main: '🍛',
  starters: '🥗',
  bbq: '🔥',
  desserts: '🍬',
  soups: '☕',
  breads: '🫓',
  'state-special': '🇮🇳'
};

// Menu filter categories (these remain static for the UI filters)
const menuFilterCategories = [
  { id: 'all', label: 'All Dishes' },
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'main', label: 'Main Course' },
  { id: 'starters', label: 'Starters' },
  { id: 'bbq', label: 'BBQ & Live Grills' },
  { id: 'desserts', label: 'Sweets & Desserts' },
  { id: 'soups', label: 'Soups & Beverages' },
  { id: 'breads', label: 'Breads & Rice' },
  { id: 'state-special', label: 'Traditional State Food' }
];

// ─── Cuisine Section ──────────────────────────────────────────────────────────
function CuisineSection({
  section,
  filteredItems,
  selectedCuisine,
  plateMap,
  onAdd,
  onRemove
}) {
  return (
    <div className="menu-section" id={`section-${section.id}`}>
      {selectedCuisine === 'all' && (
        <div className="menu-section__header">
          <span className="menu-section__emoji">
            {section.emoji}
          </span>

          <h2 className="menu-section__title">
            {section.name}
            <span className="menu-section__count">
              {filteredItems.length} dish{filteredItems.length !== 1 ? 'es' : ''}
            </span>
          </h2>
        </div>
      )}

      {filteredItems.length > 0 ? (
        <div className="menu-section__grid">
          {filteredItems.map(dish => (
            <MenuDishCard
              key={dish.id}
              dish={dish}
              count={plateMap[dish.id] || 0}
              onAdd={onAdd}
              onRemove={onRemove}
            />
          ))}
        </div>
      ) : (
        <div className="menu-section__empty">
          <p>No dishes added yet.</p>
        </div>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="menu-empty">
      <UtensilsCrossed size={48} className="menu-empty__icon" />
      <h3 className="menu-empty__title">No dishes found</h3>
      <p className="menu-empty__text">Try changing your filters to see more options.</p>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function MenuPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cuisineParam = searchParams.get('cuisine');

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [currentCuisineTitle, setCurrentCuisineTitle] = useState('All Cuisines');
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const [plate, setPlate] = useState(() => readCommonCartPlate());
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [tempActiveCategory, setTempActiveCategory] = useState('all');
  const [tempVegOnly, setTempVegOnly] = useState(false);
  const [tempNonVegOnly, setTempNonVegOnly] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [selectedPeople, setSelectedPeople] = useState('');
  const [toast, setToast] = useState(null);
  const [occasions, setOccasions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingOccasions, setLoadingOccasions] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [menuSections, setMenuSections] = useState([]); // Fetched from API
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [allDishesMap, setAllDishesMap] = useState(() => readCommonCartItems()); // For plate drawer lookup

  const totalItems = Object.values(plate).reduce((sum, c) => sum + c, 0);

  useEffect(() => {
    writeCartPlate(CART_ORDER_CATEGORY, plate);
  }, [plate]);

  useEffect(() => {
    writeCartItems(CART_ORDER_CATEGORY, allDishesMap);
  }, [allDishesMap]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Fetch occasions and locations from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [occRes, locRes] = await Promise.all([
          axios.get('/api/occasions?t=' + Date.now()),
          axios.get('/api/locations?t=' + Date.now())
        ]);
        setOccasions(occRes.data);
        setLocations(locRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoadingOccasions(false);
        setLoadingLocations(false);
      }
    };
    fetchData();
  }, []);

  // Fetch menu sections and items from API
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        // Fetch all cuisines
        const cuisinesRes = await axios.get('/api/cuisines');
        const cuisines = cuisinesRes.data;
        
        // Fetch all menu items (category: menu_item)
        const menuItemsRes = await axios.get('/api/products');
        const allMenuItems = menuItemsRes.data.filter(item => item.category === 'menu_item');
        
        // Group menu items by cuisine
        const itemsByCuisineId = {};
        allMenuItems.forEach(item => {
          // Handle both populated and non-populated cuisine
          // When populate is used, cuisine might be an object or null
          // When not populated, cuisine is just an ObjectId string
          let cuisineId;
          if (item.cuisine?.name) {
            cuisineId = item.cuisine._id;
          } else if (typeof item.cuisine === 'string') {
            cuisineId = item.cuisine;
          } else {
            cuisineId = null;
          }
          const key = cuisineId || 'uncategorized';
          if (!itemsByCuisineId[key]) {
            itemsByCuisineId[key] = [];
          }
          itemsByCuisineId[key].push(item);
        });
        
// Build menuSections structure - include all cuisines, even those without items
        const sections = cuisines.map(cuisine => {
          // Get items for this cuisine (handle both ObjectId and string comparisons)
          const cuisineItems = itemsByCuisineId[cuisine._id] || itemsByCuisineId[String(cuisine._id)] || [];
          const itemsByCategory = {};
          cuisineItems.forEach(item => {
            const category = item.menuCategory || 'main'; // default to main if not set
            if (!itemsByCategory[category]) {
              itemsByCategory[category] = [];
            }
            itemsByCategory[category].push(item);
          });
          
// Build items array for this section
           const items = [];
           // Add items for each category that has items
           Object.keys(itemsByCategory).forEach(category => {
             itemsByCategory[category].forEach(item => {
               items.push({
                 id: item._id,
                 name: item.name,
                 image: item.image,
                 veg: item.vegType === 'Vegetarian',
                 category: category,
                 cuisineName: cuisine.name,
                 menuCategory: category,
                 price: item.price
               });
             });
           });
          
          return {
            id: slugify(cuisine.name),
            name: cuisine.name,
            emoji: categoryEmojis[Object.keys(itemsByCategory)[0]] || '🍽️', // default emoji or first category's emoji
            items: items
          };
        });
        
        setMenuSections(sections);
        
        // Build flat dish lookup for the plate drawer
        const newAllDishesMap = {};
        sections.forEach(section => {
          section.items.forEach(item => {
            newAllDishesMap[item.id] = item;
          });
        });
        setAllDishesMap(prev => ({ ...prev, ...newAllDishesMap }));
      } catch (err) {
        console.error('Failed to fetch menu data:', err);
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchMenuData();
  }, []); // Empty deps - run once on mount

const getFilteredSectionItems = (section) => section.items.filter(dish => {
    if (activeCategory !== 'all' && dish.category !== activeCategory) return false;
    if (vegOnly && !dish.veg) return false;
    if (nonVegOnly && dish.veg) return false;
    return true;
  });

  const filteredMenuSections = menuSections
    .map(section => ({ ...section, filteredItems: getFilteredSectionItems(section) }))
    .filter(section => selectedCuisine === 'all' ? section.filteredItems.length > 0 : section.id === selectedCuisine);

  const activeCuisineSection = filteredMenuSections.find(section => section.id === selectedCuisine) ||
    filteredMenuSections.find(section => section.name === currentCuisineTitle) ||
    menuSections.find(section => section.id === selectedCuisine) ||
    menuSections.find(section => section.name === currentCuisineTitle);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (cuisineParam) {
      setTimeout(() => {
        const el = document.getElementById(`section-${cuisineParam}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }
  }, [cuisineParam]);

  useEffect(() => {
    const updateCurrentCuisineFromScroll = () => {
      if (selectedCuisine !== 'all') return;

      const sectionElements = Array.from(document.querySelectorAll('.menu-section'));
      if (!sectionElements.length) return;

      const stickyBar = document.querySelector('.menu-filters');
      const offset = (stickyBar?.getBoundingClientRect().height || 140) + 10;

      const firstSectionRect = sectionElements[0].getBoundingClientRect();
      if (firstSectionRect.top > offset) {
        setCurrentCuisineTitle('All Cuisines');
        return;
      }

      const visibleSection = sectionElements.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= offset && rect.bottom > offset;
      }) || sectionElements[sectionElements.length - 1];

      if (visibleSection) {
        const cuisineId = visibleSection.id.replace('section-', '');
        const cuisine = menuSections.find(section => section.id === cuisineId);
        if (cuisine) {
          setCurrentCuisineTitle(cuisine.name);
        }
      }
    };

    updateCurrentCuisineFromScroll();
    window.addEventListener('scroll', updateCurrentCuisineFromScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateCurrentCuisineFromScroll);
    };
  }, [menuSections, selectedCuisine]);

  useEffect(() => {
    if (selectedCuisine !== 'all') {
      const cuisine = menuSections.find(section => section.id === selectedCuisine);
      if (cuisine) {
        setCurrentCuisineTitle(cuisine.name);
      }
    } else {
      setCurrentCuisineTitle('All Cuisines');
    }
  }, [selectedCuisine, menuSections]);

  useEffect(() => {
    if (!cuisineParam || !menuSections.length) return;
    const cuisine = menuSections.find(section => section.id === cuisineParam);
    if (cuisine) {
      setSelectedCuisine(cuisineParam);
      setCurrentCuisineTitle(cuisine.name);
      const el = document.getElementById(`section-${cuisineParam}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [cuisineParam, menuSections]);

  const handleAdd = dish => {
    setPlate(prev => ({ ...prev, [dish.id]: (prev[dish.id] || 0) + 1 }));
    showToast(`${dish.name} added to plate!`);
  };

  const handleRemove = id => {
    setPlate(prev => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
  };

  useEffect(() => {
    if (isFilterPanelOpen) {
      setTempActiveCategory(activeCategory);
      setTempVegOnly(vegOnly);
      setTempNonVegOnly(nonVegOnly);
    }
  }, [isFilterPanelOpen, activeCategory, vegOnly, nonVegOnly]);

  const applyMobileFilters = () => {
    setActiveCategory(tempActiveCategory);
    setVegOnly(tempVegOnly);
    setNonVegOnly(tempNonVegOnly);
    setIsFilterPanelOpen(false);
  };

  const toggleMobileVeg = () => {
    setTempVegOnly(v => {
      if (!v) setTempNonVegOnly(false);
      return !v;
    });
  };

  const toggleMobileNonVeg = () => {
    setTempNonVegOnly(v => {
      if (!v) setTempVegOnly(false);
      return !v;
    });
  };

  return (
    <div className="menu-page">

      {/* ── Toast Notification ── */}
      {toast && (
        <div className="menu-toast">
          <Check size={16} />
          {toast}
        </div>
      )}

      {/* ── Hero ── */}
      <div className="menu-hero">
        <div className="menu-hero__collage">
          {heroImages.map((src, i) => (
            <div key={i} className="menu-hero__panel">
              <img src={src} alt="" className="menu-hero__panel-img" />
            </div>
          ))}
        </div>
        <div className="menu-hero__overlay" />
        <div className="menu-hero__content">
          <div className="section-tag" style={{ margin: '0 auto 10px' }}>🍽️ Customize Your Plate</div>
          <h1 className="menu-hero__title">
            Our <span className="text-gradient">Menu</span>
          </h1>
          <p className="menu-hero__subtitle">
            Handpick your favourite dishes and build a customised plate for your occasion
          </p>
        </div>
      </div>

      {/* ── Sticky Filters ── */}
      <div className="menu-filters">
        <div className="menu-filters__inner">
          {/* <div className="menu-filters__selects">
            <select
              className="menu-filter-select"
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              disabled={loadingLocations}
            >
              <option value=""> Service Location</option>
              {locations.map(loc => <option key={loc._id} value={loc.name}>{loc.name}</option>)}
            </select>

            <select
              className="menu-filter-select"
              value={selectedOccasion}
              onChange={e => setSelectedOccasion(e.target.value)}
              disabled={loadingOccasions}
            >
              <option value=""> Your Occasion</option>
              {occasions.map(o => <option key={o._id} value={o.name}>{o.name}</option>)}
            </select>

            <select
              className="menu-filter-select menu-filter-select--people"
              value={selectedPeople}
              onChange={e => setSelectedPeople(e.target.value)}
            >
              <option value="">👥 No. of People</option>
              {Array.from({ length: 50 }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
              ))}
            </select>
          </div> */}

        </div>

        {/* Cuisine & Category Tabs */}
        <div className="menu-filters__tabs">
          <div className="menu-filters__tabs-left">
            <div className="menu-filters__cuisine-title">
              {/* <span>Current Cuisine</span> */}
              <div className="menu-filters__cuisine-title-main">
                <span className="menu-filters__cuisine-emoji">
                  {selectedCuisine === 'all' ? '🍽️' : activeCuisineSection?.emoji}
                </span>
                <h2>{currentCuisineTitle}</h2>
                {selectedCuisine !== 'all' && activeCuisineSection && (
                  <span className="menu-filters__cuisine-count">
                    {activeCuisineSection.items.length} dish{activeCuisineSection.items.length !== 1 ? 'es' : ''}
                  </span>
                )}
              </div>
            </div>
            <div className="menu-filters__cuisine-tabs">
              <button
                onClick={() => {
                  setSelectedCuisine('all');
                  setCurrentCuisineTitle('All Cuisines');
                }}
                className={`menu-tab${selectedCuisine === 'all' ? ' menu-tab--active' : ''}`}
              >
                All Cuisines
              </button>
              {menuSections.map(section => (
                <button
                  key={section.id}
                  onClick={() => {
                    setSelectedCuisine(section.id);
                    setCurrentCuisineTitle(section.name);
                  }}
                  className={`menu-tab${selectedCuisine === section.id ? ' menu-tab--active' : ''}`}
                >
                  {section.emoji} {section.name}
                </button>
              ))}
            </div>
            
            {/* Category Filter */}
            {/* <div className="menu-filters__category-tabs">
              {menuFilterCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`menu-tab${activeCategory === cat.id ? ' menu-tab--active' : ''}`}
                >
                  {cat.label}
                </button>
              ))}
            </div> */}
          </div>
          <button 
            className={`menu-cart-btn ${totalItems > 0 ? 'menu-cart-btn--active' : ''}`}
              onClick={() => navigate('/view-menu-cart', { state: { plate, plateItems: allDishesMap, orderCategory: ORDER_CATEGORY, cartOrderCategory: CART_ORDER_CATEGORY } })}
          >
            <ShoppingBag size={18} />
            <span>My Plate</span>
            {totalItems > 0 && <span className="menu-cart-btn__badge">{totalItems}</span>}
          </button>
          <button
            className="menu-filter-icon-btn"
            type="button"
            onClick={() => setIsFilterPanelOpen(true)}
          >
            <Filter size={18} />
            Filters
          </button>
        </div>
      </div>

      {isFilterPanelOpen && (
        <>
          <div className="menu-filters-mobile-backdrop" onClick={() => setIsFilterPanelOpen(false)} />
          <div className="menu-filters-mobile-panel">
            <div className="menu-filters-mobile-panel__header">
              <div>
                <h3>Filter Menu</h3>
                <p>Select dietary and category filters for your customised menu.</p>
              </div>
              <button
                type="button"
                className="menu-filters-mobile-panel__close"
                onClick={() => setIsFilterPanelOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="menu-filters-mobile-panel__body">
              <div className="filter-group">
                <p>Category</p>
                <div className="filter-group__grid">
                  {menuFilterCategories.map(cat => (
                    <label
                      key={cat.id}
                      className={`filter-checkbox${tempActiveCategory === cat.id ? ' filter-checkbox--checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={tempActiveCategory === cat.id}
                        onChange={() => setTempActiveCategory(cat.id)}
                      />
                      <span>{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <p>Dietary</p>
                <label className="mobile-filter-toggle">
                  <input
                    type="checkbox"
                    checked={tempVegOnly}
                    onChange={toggleMobileVeg}
                  />
                  <span>Veg Only</span>
                </label>
                <label className="mobile-filter-toggle">
                  <input
                    type="checkbox"
                    checked={tempNonVegOnly}
                    onChange={toggleMobileNonVeg}
                  />
                  <span>Non-Veg Only</span>
                </label>
              </div>
            </div>

            <div className="menu-filters-mobile-panel__footer">
              <button
                type="button"
                className="btn-red menu-filters-mobile-apply"
                onClick={applyMobileFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}

{/* ── Menu Content ── */}
      <div className="menu-content">
      <div className="menu-content__inner">
        {loadingMenu ? (
          <div className="table-loading">
            <div className="loading-spinner"></div>
            <p>Loading menu...</p>
          </div>
) : (
        menuSections.length === 0 ? (
          <EmptyState />
        ) : (
          filteredMenuSections.length === 0 ? (
          <EmptyState />
        ) : (
          filteredMenuSections.map(section => (
            <CuisineSection
              key={section.id}
              section={section}
              filteredItems={section.filteredItems}
              selectedCuisine={selectedCuisine}
              plateMap={plate}
              onAdd={handleAdd}
              onRemove={handleRemove}
            />
          ))
        )
        )
      )}
      </div>
    </div>

      <FloatingCartButton
        plate={plate}
        plateItems={allDishesMap}
        orderCategory={ORDER_CATEGORY}
        cartOrderCategory={CART_ORDER_CATEGORY}
        totalItems={totalItems}
      />
    </div>
  );
}
