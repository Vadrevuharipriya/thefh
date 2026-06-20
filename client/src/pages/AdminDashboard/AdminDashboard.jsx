import { useMemo } from 'react';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { Package, FileText, Users, TrendingUp } from 'lucide-react';
import { useProducts } from '../../hooks/public/useProducts';
import { useBlogs } from '../../hooks/public/useBlogs';
import { useAdminEnquiries } from '../../hooks/admin/useAdminEnquiry';
import './AdminDashboard.scss';

export default function AdminDashboard() {
  const { data: productsData, isLoading: loadingProducts } = useProducts();
  const { data: blogsData, isLoading: loadingBlogs } = useBlogs();
  const { data: enquiriesData, isLoading: loadingEnquiries } = useAdminEnquiries();

  const loading = loadingProducts || loadingBlogs || loadingEnquiries;

  const normalizeCount = (resp) => {
    if (!resp) return 0;
    if (Array.isArray(resp)) return resp.length;
    if (Array.isArray(resp.data)) return resp.data.length;
    return 0;
  };

  const stats = useMemo(() => ({
    products: normalizeCount(productsData),
    blogs: normalizeCount(blogsData),
    enquiries: normalizeCount(enquiriesData)
  }), [productsData, blogsData, enquiriesData]);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.products,
      icon: Package,
      color: '#C1272D',
      change: '+0% from last month'
    },
    {
      title: 'Total Blogs',
      value: stats.blogs,
      icon: FileText,
      color: '#DA9100',
      change: '+0% from last month'
    },
    {
      title: 'Total Enquiries',
      value: stats.enquiries,
      icon: Users,
      color: '#10b981',
      change: '+0% from last month'
    }
  ];

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <main className="admin-dashboard__main">
        <header className="admin-dashboard__header">
          <h1>Dashboard</h1>
          <p>Welcome to The Famous Halwai Admin Panel</p>
        </header>

        <div className="admin-dashboard__stats">
          {statCards.map((card) => (
            <div key={card.title} className="stat-card">
              <div
                className="stat-card__icon"
                style={{ backgroundColor: `${card.color}15`, color: card.color }}
              >
                <card.icon size={24} />
              </div>
              <div className="stat-card__content">
                <h3>{loading ? '...' : card.value}</h3>
                <p>{card.title}</p>
                <span className="stat-card__change">
                  <TrendingUp size={14} />
                  {card.change}
                </span>
              </div>
            </div>
          ))}
        </div>

          <div className="admin-dashboard__quick-actions">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <a href="/admin/items" className="quick-action-card">
              <Package size={32} />
              <span>Manage Items</span>
            </a>
            <a href="/admin/blog" className="quick-action-card">
              <FileText size={32} />
              <span>Manage Blogs</span>
            </a>
            <a href="/admin/enquiries" className="quick-action-card">
              <Users size={32} />
              <span>View Enquiries</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}