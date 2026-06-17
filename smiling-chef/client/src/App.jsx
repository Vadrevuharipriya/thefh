import { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import AuthModal from './components/AuthModal/AuthModal';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import './App.scss';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Give the page a moment to render before scrolling to the element
      const timer = setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function AppContent() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');
  const isAccountRoute = pathname.startsWith('/account');
  
const hidePartnerCTA = [

    "/our-menu",
    "/about",
    "/services/:occasion",
    "/enquiry",
    "/partner",
    "/partner/register",
    "/our-packages",
    "/cloud-kitchen",
    "/bhaji",
    "/venue", "/city", "/locations",
    "/chutney-services",
    "/pickle-achhar",
    "/tiffin-services",
    "/city/:slug", "/locations/:slug",
    "/professionals",
    "/professionals/:slug",
    "/testimonials",
    "/view-menu-cart",
    "/blog",
    "/blog/:slug"
  ].some(
    p => pathname === p || pathname.startsWith(p + '/')
  );

  const hideFooterMobile = pathname === '/view-menu-cart' || pathname === '/enquiry';
  const hideFooterPage = pathname === '/view-menu-cart' || pathname === '/enquiry';

  const hideWhatsAppOnMobilePaths = [
    '/our-menu',
    '/bhaji',
    '/chutney-services',
    '/pickle-achhar',
  ];

  const hideWhatsAppOnMobile = hideWhatsAppOnMobilePaths.some(p => pathname === p || pathname.startsWith(p + '/'));

  return (
    <div className="app-layout">
      {!isAdminRoute && <Navbar />}
      <div className="app-layout__content">
        <AppRoutes />
      </div>
      {!isAdminRoute && !isAccountRoute && !hideFooterPage && <Footer showPartnerCTA={!hidePartnerCTA} hideOnMobile={hideFooterMobile} />}
      {!isAdminRoute && !isAccountRoute && <WhatsAppButton hideOnMobile={hideWhatsAppOnMobile} />}
      <AuthModal />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
