import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Menu, X, Phone, ChevronRight, User } from 'lucide-react';
import axios from 'axios';
import { slugify } from '../../utils/slugify';
import tfhLogo from '../../assets/logo/tfh-logo.svg';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.scss';

const services = [
  'Chef or Halwai',
  'Bhaji Box',
  'Customize Menu',
  'Cloud Kitchen',
  'Homemade Aachar',
  'Fresh Chutney',
];

const SERVICE_ITEM_LINKS = {
  'Chef or Halwai': '/enquiry',
  'Bhaji Box': '/bhaji',
  'Customize Menu': '/our-menu',
  'Cloud Kitchen': '/cloud-kitchen',
  'Homemade Aachar': '/pickle-achhar',
  'Fresh Chutney': '/chutney-services',
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [occasions, setOccasions] = useState([]);
  const [loadingOccasions, setLoadingOccasions] = useState(true);
  const { user, openAuthModal } = useAuth();
  const closeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetchOccasions = async () => {
      try {
        const res = await axios.get('/api/occasions');
        setOccasions(res.data);
      } catch (err) {
        console.error('Failed to fetch occasions:', err);
      } finally {
        setLoadingOccasions(false);
      }
    };
    fetchOccasions();


  }, []);

  const open = (name) => { clearTimeout(closeTimer.current); setOpenDropdown(name); };
  const close = () => { closeTimer.current = setTimeout(() => setOpenDropdown(null), 200); };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.1)]'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2.5">
            <img src={tfhLogo} alt="TFH" className="h-10 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2">
            <div className="relative" onMouseEnter={() => open('occasion')} onMouseLeave={close}>
              <button
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-body font-semibold rounded-xl transition-all duration-200 ${
                  openDropdown === 'occasion' ? 'bg-cream text-brand-red' : 'text-gray-700 hover:bg-cream hover:text-brand-red'
                }`}
              >
                Occasion
                <ChevronDown size={14} className={`transition-transform ${openDropdown === 'occasion' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'occasion' && (
                <div
                  className="mega-dropdown absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-glass border border-border z-50 p-4 w-56 max-h-[80vh] overflow-y-auto"
                  onMouseLeave={close}
                >
                  <p className="text-xs font-heading font-bold uppercase tracking-widest text-gray-400 mb-3 px-1">
                    Browse by Occasion
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {loadingOccasions ? (
                      <p className="px-3 py-2 text-sm text-gray-500">Loading...</p>
                    ) : occasions.map((occ) => (
                      <Link
                        key={occ._id}
                        to={`/services/${slugify(occ.name)}`}
                        onClick={close}
                        className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-cream hover:text-brand-red rounded-lg transition-all duration-150 group font-body"
                      >
                        {occ.name}
                        <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" onMouseEnter={() => open('services')} onMouseLeave={close}>
              <button
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-body font-semibold rounded-xl transition-all duration-200 ${
                  openDropdown === 'services' ? 'bg-cream text-brand-red' : 'text-gray-700 hover:bg-cream hover:text-brand-red'
                }`}
              >
                Our Services
                <ChevronDown size={14} className={`transition-transform ${openDropdown === 'services' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'services' && (
                <div
                  className="services-dropdown absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-glass border border-border z-50 w-56 py-2 max-h-[80vh] overflow-y-auto"
                  onMouseLeave={close}
                >
                  <div className="flex flex-col">
                    {services.map((item) => {
                      const to = SERVICE_ITEM_LINKS[item];
                      return to ? (
                        <Link
                          key={item}
                          to={to}
                          onClick={close}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-cream hover:text-brand-red transition-colors font-body"
                        >
                          <ChevronRight size={12} className="text-gray-400 mr-2" />
                          {item}
                        </Link>
                      ) : (
                        <span
                          key={item}
                          className="flex items-center px-4 py-2 text-sm text-gray-400 font-body"
                        >
                          <ChevronRight size={12} className="text-gray-300 mr-2" />
                          {item}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

{[
              { label: 'Partner with Us', to: '/partner' },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="px-4 py-2 text-sm font-body font-semibold text-gray-700 hover:bg-cream hover:text-brand-red rounded-xl transition-all duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right CTAs */}
          <div className="flex items-center gap-3">
             {/* <a
               href="tel:+918926262675"
               className="hidden md:flex items-center gap-1.5 text-sm font-heading font-bold text-gray-700 hover:text-brand-red transition-colors"
             >
               <Phone size={15} className="text-brand-red" />
               +91-89262 62675
             </a> */}
              {user ? (
                <Link
                  to="/account"
                  className="hidden lg:inline-flex items-center justify-center w-9 h-9 rounded-full bg-brand-red text-white shadow-md hover:bg-brand-red-dark transition-all duration-200"
                  aria-label="My Account"
                >
                  <User size={18} />
                </Link>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="hidden lg:inline-flex items-center gap-2 text-sm font-body font-semibold text-brand-red bg-cream hover:bg-cream-dark rounded-xl transition-all duration-200 px-4 py-2"
                >
                  Login/Signup
                </button>
             )}
             <Link
               to="/enquiry"
               className="hidden lg:inline-flex items-center gap-2 bg-red-gradient text-white px-5 py-2.5 rounded text-sm font-heading font-bold shadow-red hover:shadow-[0_8px_24px_rgba(193,39,45,0.5)] hover:-translate-y-0.5 transition-all duration-200"
             >
               Book Now
             </Link>
             <button
               className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-cream transition-colors"
               onClick={() => setMobileOpen(!mobileOpen)}
             >
               {mobileOpen ? <X size={22} /> : <Menu size={22} />}
             </button>
           </div>
        </div>
      </div>

{/* Mobile Menu */}
       {mobileOpen && (
         <MobileMenu
           onClose={() => setMobileOpen(false)}
           occasions={occasions}
           loadingOccasions={loadingOccasions}
           openAuthModal={openAuthModal}
           user={user}
         />
       )}
     </header>
   );
}

function MobileMenu({ onClose, occasions, loadingOccasions, openAuthModal, user }) {
  const [occasionsOpen, setOccasionsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const toggleOccasions = () => {
    setOccasionsOpen(!occasionsOpen);
    if (!occasionsOpen) setServicesOpen(false);
  };

  const toggleServices = () => {
    setServicesOpen(!servicesOpen);
    if (!servicesOpen) setOccasionsOpen(false);
  };

  return (
    <div className="mobile-menu lg:hidden bg-white border-t border-border shadow-glass">
      <div className="px-5 py-4 space-y-1 max-h-[80vh] overflow-y-auto">

        {/* Occasions accordion */}
        <button
          className="w-full flex items-center justify-between px-2 py-3 text-sm font-semibold text-gray-700 hover:text-brand-red font-body transition-colors"
          onClick={toggleOccasions}
        >
          Occasions
          {occasionsOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        {occasionsOpen && (
          <div className="pl-3 pb-1 grid grid-cols-2 gap-0.5">
            {loadingOccasions ? (
              <p className="text-xs text-gray-500">Loading...</p>
            ) : occasions.map((occ) => (
              <Link
                key={occ._id}
                to={`/services/${slugify(occ.name)}`}
                onClick={onClose}
                className="px-2 py-2 text-xs font-body text-gray-600 hover:text-brand-red transition-colors rounded-lg hover:bg-cream"
              >
                {occ.name}
              </Link>
            ))}
          </div>
        )}

        {/* Our Services accordion */}
        <button
          className="w-full flex items-center justify-between px-2 py-3 text-sm font-semibold text-gray-700 hover:text-brand-red font-body transition-colors"
          onClick={toggleServices}
        >
          Our Services
          {servicesOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        {servicesOpen && (
          <div className="pl-3 pb-1 space-y-0.5">
            {services.map((item) => {
              const to = SERVICE_ITEM_LINKS[item];
              return to ? (
                <Link
                  key={item}
                  to={to}
                  onClick={onClose}
                  className="block px-3 py-2 text-sm font-body text-gray-600 hover:text-brand-red hover:bg-cream rounded-lg transition-colors"
                >
                  {item}
                </Link>
              ) : (
                <span key={item} className="block px-3 py-2 text-sm font-body text-gray-400">
                  {item}
                </span>
              );
            })}
          </div>
        )}

        {/* Regular links */}
        {[
          { label: 'Partner with Us', to: '/partner' },
          { label: 'Book Halwai & Chefs', to: '/enquiry' },
        ].map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            onClick={onClose}
            className="block px-2 py-3 text-sm font-semibold text-gray-700 hover:text-brand-red font-body transition-colors"
          >
            {label}
          </Link>
        ))}

        {/* Phone */}
        <a
          href="tel:+918926262675"
          className="flex items-center gap-2 px-2 py-3 text-sm font-heading font-bold text-gray-700 hover:text-brand-red transition-colors"
        >
          <Phone size={14} className="text-brand-red" />
          +91-89262 62675
        </a>

        {/* CTA */}
        <div className="pt-2 pb-1 space-y-2">
          {user ? (
            <Link to="/account" onClick={onClose} className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-red text-white shadow-md hover:bg-brand-red-dark transition-colors" aria-label="My Account">
              <User size={18} />
            </Link>
          ) : (
            <button
              onClick={() => {
                onClose();
                openAuthModal();
              }}
              className="block w-full text-center px-4 py-2.5 text-sm font-heading font-semibold text-brand-red bg-cream hover:bg-cream-dark rounded-full transition-colors"
            >
              Login/Signup
            </button>
          )}
          <Link to="/enquiry" onClick={onClose} className="block bg-red-gradient text-white text-center px-4 py-3 rounded-full text-sm font-heading font-bold shadow-red">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
