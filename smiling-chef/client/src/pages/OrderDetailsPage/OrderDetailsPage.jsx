import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, ShoppingBag, Clock } from 'lucide-react';
import './OrderDetailsPage.scss';

const getAuthToken = () => localStorage.getItem('userToken') || localStorage.getItem('token');

const parseAmount = (value) => {
  if (value == null || value === '') return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const normalized = value.replace(/[^\d.-]/g, '');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const formatAmount = (value) => {
  const amount = parseAmount(value);
  return `₹${amount.toFixed(0)}`;
};

const extractQuantityFromName = (name) => {
  if (!name || typeof name !== 'string') return null;
  const match = name.match(/x\s*(\d+)$/i);
  return match ? Number(match[1]) : null;
};

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);

  const orderItems = useMemo(() => {
    if (!order || !Array.isArray(order.items)) return [];
    return order.items;
  }, [order]);

  const normalizeItemName = (item) => {
    const rawName = item?.name?.toString()?.trim();
    const normalizedCategory = order?.category ? order.category.toString().trim() : '';
    const isGenericCategoryName = rawName && normalizedCategory && rawName.toLowerCase() === normalizedCategory.toLowerCase();
    const isCustomizedPlate = rawName && /customi(s|z)ed[- ]?plate/i.test(rawName);
    const fallback = order?.productType || order?.plateType || order?.bhajiType || order?.specialInstructions || order?.category || rawName;
    if (!rawName || isGenericCategoryName || isCustomizedPlate) return fallback;
    return rawName;
  };

  const totalPlates = useMemo(
    () => orderItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0),
    [orderItems]
  );

  const subtotal = useMemo(
    () => order?.subtotal ?? orderItems.reduce((sum, item) => {
      const itemPrice = parseAmount(item.price ?? item.amount ?? 0);
      const itemQuantity = Number(item.quantity ?? extractQuantityFromName(item.name) ?? 1) || 1;
      return sum + itemPrice * itemQuantity;
    }, 0),
    [order, orderItems]
  );

  const onlineDiscount = parseAmount(order?.discount ?? order?.onlineDiscount ?? 0);
  const platformFee = parseAmount(order?.platformFee ?? order?.fee ?? 0);
  const gst = parseAmount(order?.gst ?? order?.tax ?? 0);
  const total = parseAmount(order?.total ?? order?.grandTotal) || subtotal - onlineDiscount + platformFee + gst;

  const status = (order?.status || 'pending').replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  const orderDate = order?.createdAt ? new Date(order.createdAt) : order?.date ? new Date(order.date) : null;
  const deliveryAddressText = order?.deliveryAddress
    ? typeof order.deliveryAddress === 'string'
      ? order.deliveryAddress
      : order.deliveryAddress.address || order.deliveryAddress.label || `${order.deliveryAddress.name || ''} ${order.deliveryAddress.address || ''}`.trim()
    : order?.address || order?.location || 'Address not available';
  const paymentText = order?.paymentMethod?.name || order?.paymentType || order?.payment || null;

  useEffect(() => {
    if (order) return;

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = getAuthToken();
        const response = await fetch('/api/account/orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        const found = Array.isArray(data)
          ? data.find((item) => item._id === orderId || item.orderNumber === orderId)
          : null;

        if (found) {
          setOrder(found);
        } else {
          setError('Order not found.');
        }
      } catch (fetchError) {
        console.error(fetchError);
        setError('Unable to load order details at the moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [order, orderId]);

  if (loading) {
    return (
      <main className="order-details-page">
        <div className="order-details-page__loading">Loading order details...</div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="order-details-page">
        <div className="order-details-page__detail-header">
          <button type="button" className="order-details-page__back-button" onClick={() => navigate('/account')}>
            <ArrowLeft size={16} /> Back to orders
          </button>
        </div>
        <div className="order-details-page__empty-state">
          <p>{error || 'Order details are not available.'}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="order-details-page">
      <div className="order-details-page__detail-header">
        <button type="button" className="order-details-page__back-button" onClick={() => navigate('/account')}>
          <ArrowLeft size={16} /> Back to orders
        </button>
        <div className="order-details-page__header-title">
          <h1>Order #{order.orderNumber || order._id}</h1>
        </div>
      </div>

      <div className="order-details-page__grid">
        <section className="order-details-page__main-card">
          <div className="order-details-page__order-summary-top">
            <div>
              <h2>Order Details</h2>
              <p className="order-details-page__subtext">{orderDate ? orderDate.toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date unavailable'}</p>
            </div>
          </div>

          <div className="order-details-page__info-row">
            <div className="order-details-page__info-block">
              <span>Delivery address</span>
              <p>{deliveryAddressText}</p>
            </div>
            {paymentText && (
              <div className="order-details-page__info-block">
                <span>Payment</span>
                <p>{paymentText}</p>
              </div>
            )}
          </div>

          <div className="order-details-page__items-table">
            <div className="order-details-page__items-header">
              <span>ITEMS</span>
              <span>QUANTITY</span>
              <span>PRICE</span>
            </div>
            {orderItems.map((item, index) => {
              const nameQuantity = extractQuantityFromName(item.name);
              const rawQuantity = item.quantity ?? 1;
              const quantity = nameQuantity ?? rawQuantity;
              const unitPrice = parseAmount(item.price ?? item.amount ?? 0);
              const calculatedPrice = unitPrice > 0
                ? unitPrice
                : (nameQuantity != null && parseAmount(rawQuantity) > 0 && rawQuantity !== nameQuantity
                    ? parseAmount(rawQuantity)
                    : 0);

              return (
                <div key={index} className="order-details-page__item-row">
                  <div className="order-details-page__item-title">
                    <div className="order-details-page__item-thumb">
                      {item.image ? <img src={item.image} alt={item.name || 'Item'} /> : <div className="order-details-page__item-placeholder" />}
                    </div>
                    <span>{normalizeItemName(item) || 'Unnamed item'}</span>
                  </div>
                  <div>{quantity}</div>
                  <div>{formatAmount(calculatedPrice * quantity)}</div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="order-details-page__sidebar-card">
          <div className="order-details-page__summary-header">
            <h2>Order Summary</h2>
          </div>
          <div className="order-details-page__summary-row">
            <span>Total Plates</span>
            <strong>{totalPlates}</strong>
          </div>
          <div className="order-details-page__summary-row">
            <span>Total Items</span>
            <strong>{orderItems.length}</strong>
          </div>
          <div className="order-details-page__summary-row">
            <span>Subtotal</span>
            <strong>{formatAmount(subtotal)}</strong>
          </div>
          <div className="order-details-page__summary-row">
            <span>Online Discount</span>
            <strong className="order-details-page__summary-negative">-{formatAmount(onlineDiscount)}</strong>
          </div>
          <div className="order-details-page__summary-row">
            <span>Platform Fee</span>
            <strong>{formatAmount(platformFee)}</strong>
          </div>
          <div className="order-details-page__summary-row">
            <span>GST (18%)</span>
            <strong>{formatAmount(gst)}</strong>
          </div>
          <div className="order-details-page__summary-divider" />
          <div className="order-details-page__summary-total">
            <span>Total</span>
            <strong>{formatAmount(total)}</strong>
          </div>
          <button type="button" className="order-details-page__reorder-btn" onClick={() => navigate('/account')}>
            Reorder
          </button>
        </aside>
      </div>
    </main>
  );
}
