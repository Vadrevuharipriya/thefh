import { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import HomePage from '../pages/HomePage/HomePage';
import OccasionPage from '../pages/OccasionPage/OccasionPage';
import MenuPage from '../pages/MenuPage/MenuPage';
import AboutPage from '../pages/AboutPage/AboutPage';
import EnquiryPage from '../pages/EnquiryPage/EnquiryPage';
import TestimonialsPage from '../pages/TestimonialsPage/TestimonialsPage';
import PartnerPage from '../pages/PartnerPage/PartnerPage';
import PartnerRegisterPage from '../pages/PartnerRegisterPage/PartnerRegisterPage';
import PackagesPage from '../pages/PackagesPage/PackagesPage';
import CloudKitchenPage from '../pages/CloudKitchenPage/CloudKitchenPage';

import AccountPage from '../pages/AccountPage/AccountPage';
import OrderDetailsPage from '../pages/OrderDetailsPage/OrderDetailsPage';
import BhajiPage from '../pages/BhajiPage/BhajiPage';
import VenuePage from '../pages/VenuePage/VenuePage';
import ChutneysPage from '../pages/ChutneysPage/ChutneysPage';
import PicklePage from '../pages/PicklePage/PicklePage';
import TiffinPage from '../pages/TiffinPage/TiffinPage';
import CityPage from '../pages/CityPage/CityPage';
import ProfessionalsPage from '../pages/ProfessionalsPage/ProfessionalsPage';
import ChefDetailPage from '../pages/ChefDetailPage/ChefDetailPage';
import ViewMenuCartPage from '../pages/ViewMenuCartPage/ViewMenuCartPage';
import BlogPage from '../pages/BlogPage/BlogPage';
import BlogDetailPage from '../pages/BlogDetailPage/BlogDetailPage';
import AdminLoginPage from '../pages/AdminLoginPage/AdminLoginPage';
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard';
import AdminCuisinePage from '../pages/AdminDashboard/AdminCuisinePage';
import AdminCuisineMenuPage from '../pages/AdminDashboard/AdminCuisineMenuPage';
import AdminCuisineFormPage from '../pages/AdminDashboard/AdminCuisineFormPage';
import AdminBannerPage from '../pages/AdminDashboard/AdminBannerPage';
import AdminEventsPage from '../pages/AdminDashboard/AdminEventsPage';
import AdminBlogPage from '../pages/AdminDashboard/AdminBlogPage';
import PlaceholderAdminPage from '../pages/AdminDashboard/PlaceholderAdminPage';
import AdminOccasionPage from '../pages/AdminDashboard/AdminOccasionPage';
import AdminOccasionFormPage from '../pages/AdminDashboard/AdminOccasionFormPage';
import AdminMealsPage from '../pages/AdminDashboard/AdminMealsPage';
import AdminMealsFormPage from '../pages/AdminDashboard/AdminMealsFormPage';
import AdminMealSchedulePage from '../pages/AdminDashboard/AdminMealSchedulePage';
import AdminMealScheduleFormPage from '../pages/AdminDashboard/AdminMealScheduleFormPage';
import AdminProductsPage from '../pages/AdminDashboard/AdminProductsPage';
import AdminLocationsPage from '../pages/AdminDashboard/AdminLocationsPage';
import AdminWebsitePagesPage from '../pages/AdminDashboard/AdminWebsitePagesPage';
import AdminPanelUsersPage from '../pages/AdminDashboard/AdminPanelUsersPage';
import AdminEnquiriesPage from '../pages/AdminDashboard/AdminEnquiriesPage';
import AdminInquiryCategoryPage from '../pages/AdminDashboard/AdminInquiryCategoryPage';
import AdminOrderInquiryCategoryPage from '../pages/AdminDashboard/AdminOrderInquiryCategoryPage';
import AdminServicesPage from '../pages/AdminDashboard/AdminServicesPage';
import AdminServiceFormPage from '../pages/AdminDashboard/AdminServiceFormPage';
import AdminJobWorkerPage from '../pages/AdminDashboard/AdminJobWorkerPage';
import AdminJobWorkerProfilePage from '../pages/AdminDashboard/AdminJobWorkerProfilePage';
import AdminJobWorkerBookingDetailsPage from '../pages/AdminDashboard/AdminJobWorkerBookingDetailsPage';
import AdminJobWorkerRatePage from '../pages/AdminDashboard/AdminJobWorkerRatePage';
import AdminReferralCodePage from '../pages/AdminDashboard/AdminReferralCodePage';
import AdminChefPage from '../pages/AdminDashboard/AdminChefPage';
import GoogleCallbackPage from '../pages/GoogleCallbackPage';

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        const data = await response.json();
        setIsAuthenticated(response.ok && data?.data?.role === 'admin');
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"                      element={<HomePage />} />
      <Route path="/our-menu"              element={<MenuPage />} />
      <Route path="/about"                 element={<AboutPage />} />
      <Route path="/services/:occasion"    element={<OccasionPage />} />
      <Route path="/enquiry"               element={<EnquiryPage />} />
      <Route path="/partner"               element={<PartnerPage />} />
      <Route path="/partner/register"      element={<PartnerRegisterPage />} />
      <Route path="/our-packages"          element={<PackagesPage />} />
      <Route path="/cloud-kitchen"         element={<CloudKitchenPage />} />
      <Route path="/bhaji"                 element={<BhajiPage />} />
      <Route path="/venue"                 element={<VenuePage />} />
      <Route path="/chutney-services"      element={<ChutneysPage />} />
      <Route path="/pickle-achhar"         element={<PicklePage />} />
      <Route path="/tiffin-services"       element={<TiffinPage />} />
      <Route path="/city/:slug"            element={<CityPage />} />
      <Route path="/professionals"         element={<ProfessionalsPage />} />
      <Route path="/professionals/:slug"   element={<ChefDetailPage />} />
      <Route path="/testimonials"        element={<TestimonialsPage />} />
      <Route path="/view-menu-cart"    element={<ViewMenuCartPage />} />
      <Route path="/blog"              element={<BlogPage />} />
      <Route path="/blog/:slug"        element={<BlogDetailPage />} />
      {/* /login now redirects to home — login is handled via modal */}
      <Route path="/login"             element={<Navigate to="/" replace />} />
      <Route path="/account"           element={<AccountPage />} />
      <Route path="/account/orders/:orderId" element={<OrderDetailsPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/panel-user" element={<ProtectedRoute><AdminPanelUsersPage /></ProtectedRoute>} />
      <Route path="/admin/top-header-banner" element={<ProtectedRoute><AdminBannerPage /></ProtectedRoute>} />
        <Route path="/admin/service-category" element={<ProtectedRoute><AdminServicesPage /></ProtectedRoute>} />
        <Route path="/admin/services/new" element={<ProtectedRoute><AdminServiceFormPage /></ProtectedRoute>} />
        <Route path="/admin/services/edit/:id" element={<ProtectedRoute><AdminServiceFormPage /></ProtectedRoute>} />
        <Route path="/admin/services/view/:id" element={<ProtectedRoute><AdminServiceFormPage /></ProtectedRoute>} />
        <Route path="/admin/services" element={<ProtectedRoute><AdminServicesPage /></ProtectedRoute>} />
       <Route path="/admin/occasion" element={<ProtectedRoute><AdminOccasionPage /></ProtectedRoute>} />
       <Route path="/admin/occasion/new" element={<ProtectedRoute><AdminOccasionFormPage /></ProtectedRoute>} />
       <Route path="/admin/occasion/edit/:id" element={<ProtectedRoute><AdminOccasionFormPage /></ProtectedRoute>} />
       <Route path="/admin/events" element={<ProtectedRoute><AdminEventsPage /></ProtectedRoute>} />
       <Route path="/admin/meals" element={<ProtectedRoute><AdminMealsPage /></ProtectedRoute>} />
       <Route path="/admin/meals/new" element={<ProtectedRoute><AdminMealsFormPage /></ProtectedRoute>} />
       <Route path="/admin/meals/edit/:id" element={<ProtectedRoute><AdminMealsFormPage /></ProtectedRoute>} />
       <Route path="/admin/meals/:mealId/schedule" element={<ProtectedRoute><AdminMealSchedulePage /></ProtectedRoute>} />
       <Route path="/admin/meals/:mealId/schedule/new" element={<ProtectedRoute><AdminMealScheduleFormPage /></ProtectedRoute>} />
       <Route path="/admin/meals/:mealId/schedule/edit/:scheduleId" element={<ProtectedRoute><AdminMealScheduleFormPage /></ProtectedRoute>} />

<Route path="/admin/cuisine" element={<ProtectedRoute><AdminCuisinePage /></ProtectedRoute>} />
        <Route path="/admin/cuisine/new" element={<ProtectedRoute><AdminCuisineFormPage /></ProtectedRoute>} />
        <Route path="/admin/cuisine/:id" element={<ProtectedRoute><AdminCuisineFormPage /></ProtectedRoute>} />
        <Route path="/admin/cuisine/:cuisineId/menu" element={<ProtectedRoute><AdminCuisineMenuPage /></ProtectedRoute>} />
        <Route path="/admin/items" element={<ProtectedRoute><AdminProductsPage /></ProtectedRoute>} />
        <Route path="/admin/location" element={<ProtectedRoute><AdminLocationsPage /></ProtectedRoute>} />
       <Route path="/admin/website-pages" element={<ProtectedRoute><AdminWebsitePagesPage /></ProtectedRoute>} />
       <Route path="/admin/blog" element={<ProtectedRoute><AdminBlogPage /></ProtectedRoute>} />
       <Route path="/admin/blogs" element={<ProtectedRoute><AdminBlogPage /></ProtectedRoute>} />
       <Route path="/admin/all-inquiry" element={<ProtectedRoute><AdminEnquiriesPage /></ProtectedRoute>} />
        <Route path="/admin/inquiries/halwai" element={<ProtectedRoute><AdminInquiryCategoryPage category="halwai" /></ProtectedRoute>} />
        <Route path="/admin/inquiries/general" element={<ProtectedRoute><AdminInquiryCategoryPage category="general" /></ProtectedRoute>} />
        <Route path="/admin/inquiries/tiffin" element={<ProtectedRoute><AdminInquiryCategoryPage category="tiffin" /></ProtectedRoute>} />
        <Route path="/admin/inquiries/venue" element={<ProtectedRoute><AdminInquiryCategoryPage category="venue" /></ProtectedRoute>} />
        <Route path="/admin/order-inquiry/customized-plate" element={<ProtectedRoute><AdminOrderInquiryCategoryPage category="customized-plate" /></ProtectedRoute>} />
        <Route path="/admin/order-inquiry/bhaji-orders" element={<ProtectedRoute><AdminOrderInquiryCategoryPage category="bhaji-orders" /></ProtectedRoute>} />
        <Route path="/admin/order-inquiry/chutney-pickle" element={<ProtectedRoute><AdminOrderInquiryCategoryPage category="chutney-pickle" /></ProtectedRoute>} />
        <Route path="/admin/order-inquiry/manage-job-worker" element={<ProtectedRoute><AdminJobWorkerPage /></ProtectedRoute>} />
        <Route path="/admin/order-inquiry/manage-job-worker/new" element={<ProtectedRoute><AdminJobWorkerProfilePage /></ProtectedRoute>} />
        <Route path="/admin/order-inquiry/manage-job-worker/:workerId/bookings" element={<ProtectedRoute><AdminJobWorkerBookingDetailsPage /></ProtectedRoute>} />
        <Route path="/admin/order-inquiry/manage-job-worker/:workerId" element={<ProtectedRoute><AdminJobWorkerProfilePage /></ProtectedRoute>} />
        <Route path="/admin/order-inquiry/job-worker-rate" element={<ProtectedRoute><AdminJobWorkerRatePage /></ProtectedRoute>} />
        <Route path="/admin/order-inquiry/manage-referral-code" element={<ProtectedRoute><AdminReferralCodePage /></ProtectedRoute>} />
        <Route path="/admin/chef/new" element={<ProtectedRoute><AdminChefPage /></ProtectedRoute>} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
    </Routes>
  );
}
