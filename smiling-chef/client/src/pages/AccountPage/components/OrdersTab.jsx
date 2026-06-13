import { useNavigate } from 'react-router-dom';

export default function OrdersTab({ orders }) {
  const navigate = useNavigate();

  const goToOrderDetails = (order) => navigate(`/account/orders/${order._id}`, { state: { order } });

  return (
    <div className="account-page__section">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          <p className="account-page__orders-count">Showing all {orders.length} order{orders.length !== 1 ? 's' : ''}</p>
          <div className="account-page__orders">
            {orders.map((order) => {
              const categoryLabels = {
                'customized-plate': 'Customized Plate',
                'bhaji-orders': 'Bhaji Orders',
                'chutney-pickle': 'Chutney / Pickle'
              };
              const status = (order.status || 'pending').replace(/_/g, ' ');
              const statusLabel =
                status === 'delivered' ? 'Order Delivered' :
                status === 'cancelled' ? 'Order Cancelled' :
                status === 'pending' ? 'Order Pending' :
                status.charAt(0).toUpperCase() + status.slice(1);

              const date = order.createdAt ? new Date(order.createdAt) : (order.date ? new Date(order.date) : null);
              const dateStr = date
                ? date.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                : '';

              const items = (order.items && order.items.length > 0)
                ? order.items
                : [{ name: 'Order details not available', quantity: 1, price: null }];

              const restaurantName =
                order.restaurantName ||
                order.vendor ||
                categoryLabels[order.category] ||
                order.category ||
                'Order';

              const itemCount = items.length;
              const total = order.total ?? 0;

              const normalizeItemName = (item) => {
                const rawName = item?.name?.toString()?.trim();
                const isGeneric = rawName && /customi(s|z)ed[- ]?plate/i.test(rawName);
                const fallback = order.productType || order.plateType || order.bhajiType || order.specialInstructions || order.category || rawName;
                return !rawName || isGeneric ? fallback : rawName;
              };

              return (
                <div
                  key={order._id}
                  className="account-page__swiggy-card"
                >
                  {/* ── Top bar: status + order meta ── */}
                  <div className="account-page__swiggy-top">
                    <div className={`account-page__swiggy-status account-page__swiggy-status--${order.status || 'pending'}`}>
                      <span className="account-page__swiggy-status-dot" />
                      {statusLabel}
                    </div>
                    <div className="account-page__swiggy-meta">
                      <span className="account-page__swiggy-order-num">
                        # {order.orderNumber || order._id}
                        <button
                          type="button"
                          className="account-page__swiggy-copy-btn"
                          onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(order.orderNumber || order._id); }}
                          title="Copy order number"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        </button>
                      </span>
                      <span className="account-page__swiggy-meta-detail">
                        {itemCount} item{itemCount !== 1 ? 's' : ''} &bull; ₹{total} &bull; {dateStr}
                      </span>
                    </div>
                  </div>

                  {/* ── Restaurant + items ── */}
                  <div className="account-page__swiggy-body">
                    <div className="account-page__swiggy-restaurant">
                      {order.restaurantLogo ? (
                        <img src={order.restaurantLogo} alt={restaurantName} className="account-page__swiggy-logo" />
                      ) : (
                        <div className="account-page__swiggy-logo-placeholder">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
                        </div>
                      )}
                      <span className="account-page__swiggy-restaurant-name">{restaurantName}</span>
                      <span className="account-page__swiggy-item-count">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                    </div>

                    <div className="account-page__swiggy-items">
                      {items.map((item, i) => (
                        <div key={i} className="account-page__swiggy-item">
                          <div className="account-page__swiggy-item-left">
                            {item.isVeg !== undefined ? (
                              <span className={`account-page__swiggy-veg-dot ${item.isVeg ? 'account-page__swiggy-veg-dot--veg' : 'account-page__swiggy-veg-dot--nonveg'}`} />
                            ) : null}
                            <span className="account-page__swiggy-item-name">{normalizeItemName(item)}</span>
                          </div>
                          {item.price != null && (
                            <span className="account-page__swiggy-item-price">₹{item.price}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Footer: Reorder + View Details ── */}
                  <div className="account-page__swiggy-footer">
                    <button
                      type="button"
                      className="account-page__swiggy-btn account-page__swiggy-btn--reorder"
                      onClick={(e) => { e.stopPropagation(); goToOrderDetails(order); }}
                    >
                      Reorder
                    </button>
                    <button
                      type="button"
                      className="account-page__swiggy-btn account-page__swiggy-btn--details"
                      onClick={() => goToOrderDetails(order)}
                    >
                      View Order Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}