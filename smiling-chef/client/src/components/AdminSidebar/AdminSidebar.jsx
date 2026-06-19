import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import './AdminSidebar.scss';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/panel-user', icon: Users, label: 'Manage Panel User' },
  { to: '/admin/top-header-banner', icon: FileText, label: 'Manage Top Header Banner' },
  { to: '/admin/services', icon: Package, label: 'Manage Service Category' },
  { to: '/admin/occasion', icon: FileText, label: 'Manage Occasion' },
  { to: '/admin/events', icon: FileText, label: 'Manage Events' },
  { to: '/admin/meals', icon: FileText, label: 'Manage Meals' },
  { to: '/admin/cuisine', icon: FileText, label: 'Manage Cuisine' },
  { to: '/admin/items', icon: FileText, label: 'Manage Items' },
  { to: '/admin/location', icon: FileText, label: 'Manage Location' },
  { to: '/admin/website-pages', icon: FileText, label: 'Website Pages' },
  { to: '/admin/blog', icon: FileText, label: 'Our Blog' },
  { 
    label: 'All Inquiry', 
    icon: FileText, 
    submenu: [
      { to: '/admin/inquiries/halwai', label: 'Halwai/Chef/Caterers' },
      { to: '/admin/inquiries/general', label: 'General Inquiry' },
      { to: '/admin/inquiries/tiffin', label: 'Tiffin Services Inquiry' },
      { to: '/admin/inquiries/venue', label: 'Venue Inquiry' }
    ] 
  },
  { 
    label: 'Order Inquiry', 
    icon: Package, 
    submenu: [
      { to: '/admin/order-inquiry/customized-plate', label: 'Customized Plate' },
      { to: '/admin/order-inquiry/bhaji-orders', label: 'Bhaji Orders' },
      { to: '/admin/order-inquiry/chutney-pickle', label: 'Chutney Pickle / Achhar' }
    ] 
  },
  { 
    label: 'Master', 
    icon: Package, 
    submenu: [
      { to: '/admin/order-inquiry/manage-job-worker', label: 'Manage Job Worker' },
      { to: '/admin/order-inquiry/job-worker-rate', label: 'Job Worker Rate' },
      { to: '/admin/chef/new', label: 'Onboard Chef' }
    ]
  },
];

function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    const newOpenState = {};
    navItems.forEach(item => {
      if (item.submenu) {
        newOpenState[item.label] = item.submenu.some(sub => 
          location.pathname === sub.to || location.pathname.startsWith(sub.to)
        );
      }
    });
    setOpenDropdowns(newOpenState);
  }, [location.pathname]);

  // Restore scroll position on mount
  useEffect(() => {
  const savedScroll = localStorage.getItem('adminSidebarScroll');

  if (savedScroll && navRef.current) {
    requestAnimationFrame(() => {
      navRef.current.scrollTop = parseInt(savedScroll, 10);
    });
  }
}, [openDropdowns]);

  // Scroll to active submenu item after dropdowns open
  useEffect(() => {
    const savedScroll = localStorage.getItem('adminSidebarScroll');
    // Only scroll to active if no saved scroll position
    if (!savedScroll && navRef.current) {
      const activeElement = navRef.current.querySelector('.admin-sidebar__sublink.active');
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    }
  }, [openDropdowns]);

  // Save scroll position on scroll
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    
    const handleScroll = () => {
      localStorage.setItem('adminSidebarScroll', nav.scrollTop.toString());
    };
    
    nav.addEventListener('scroll', handleScroll);
    return () => nav.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (label) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem('adminSidebarScroll');
    navigate('/admin/login');
  };

  return (
    <>
      <button
        className="admin-sidebar__mobile-toggle"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={24} />
      </button>

      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="admin-sidebar__header">
          <h2>The Famous Halwai</h2>
          <p>Admin Panel</p>
          <button
            className="admin-sidebar__close"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-sidebar__nav" ref={navRef}>
          {navItems.map((item, index) => {
            const key = item.to || item.label || index;
            if (item.submenu) {
              const isOpen = openDropdowns[item.label] || false;
              return (
                <div key={key} className="admin-sidebar__dropdown">
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className={`admin-sidebar__link ${isOpen ? 'active' : ''}`}
                    aria-expanded={isOpen}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                    <ChevronDown 
                      size={16} 
                      style={{ 
                        marginLeft: 'auto', 
                        transform: isOpen ? 'rotate(180deg)' : 'none', 
                        transition: 'transform 0.2s' 
                      }}
                    />
                  </button>
                  {isOpen && (
                    <ul className="admin-sidebar__submenu">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.to}>
                          <NavLink
                            to={subItem.to}
                            className={({ isActive }) =>
                              `admin-sidebar__sublink ${isActive ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                          >
                            <span>{subItem.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            } else {
              return (
                <NavLink
                  key={key}
                  to={item.to}
                  className={({ isActive }) =>
                    `admin-sidebar__link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              );
            }
          })}
        </nav>

        <button className="admin-sidebar__logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>
    </>
  );
}

export default AdminSidebar;