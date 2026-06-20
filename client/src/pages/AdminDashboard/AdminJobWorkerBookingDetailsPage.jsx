import { useNavigate, useParams } from 'react-router-dom';
import { useAdminChefBookings, useAdminChefById } from '../../hooks/admin/useAdminChef';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './AdminJobWorkerPage.scss';

function formatDateTime(value) {
  if (!value) return '-';
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toLocaleString();
    }
    return value;
  }
  return String(value);
}

export default function AdminJobWorkerBookingDetailsPage() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const { data: bookingsData, isLoading: loadingBookings, isError: isBookingsError } = useAdminChefBookings(workerId);
  const { data: chefData } = useAdminChefById(workerId);

  const bookings = Array.isArray(bookingsData) ? bookingsData : [];
  const workerName = chefData?.name || 'Chef';
  const loading = loadingBookings;
  const error = isBookingsError ? 'Failed to load booking details.' : '';

  return (
    <div className="admin-dashboard admin-job-workers">
      <AdminSidebar />
      <main className="admin-job-workers__content">
        <div className="admin-job-workers__header">
          <div>
            <h1>Booking detail</h1>
            <p>Bookings for {workerName}</p>
          </div>
          <div className="admin-job-workers__actions">
            <button className="btn-secondary" onClick={() => navigate(`/admin/order-inquiry/manage-job-worker/${workerId}`)}>
              Back to profile
            </button>
          </div>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <div className="admin-job-workers__table-wrap">
          <table className="admin-job-workers__table">
            <thead>
              <tr>
                <th>S. NO</th>
                <th>CLIENT</th>
                <th>EVENT TYPE</th>
                <th>DATE & TIME</th>
                <th>GUEST</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="loading">Loading...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={7} className="empty-state">No bookings found</td></tr>
              ) : (
                bookings.map((booking, index) => (
                  <tr key={booking.id || index}>
                    <td>#{String(index + 1).padStart(2, '0')}</td>
                    <td>{booking.client || '-'}</td>
                    <td>{booking.eventType || '-'}</td>
                    <td>{formatDateTime(booking.date)}{booking.time ? ` ${booking.time}` : ''}</td>
                    <td>{booking.guest || '-'}</td>
                    <td>{booking.amount != null ? `₹${booking.amount}` : '-'}</td>
                    <td>{booking.status || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
