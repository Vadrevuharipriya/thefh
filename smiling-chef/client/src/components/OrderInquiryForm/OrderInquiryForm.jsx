import { useState, useEffect } from 'react';
import { CheckCircle, MessageCircle, ArrowLeft, Plus, Minus, Trash2, ShoppingBag, Download } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { COMMON_CART_ORDER_CATEGORY, writeCartItems, writeCartPlate, clearAllCarts } from '../../utils/cartStorage';
import './OrderInquiryForm.scss';

const LOCATIONS = ['Delhi NCR', 'Noida', 'Gurugram', 'Faridabad', 'Ghaziabad', 'Lucknow', 'Jaipur', 'Chandigarh', 'Dehradun', 'Other'];
const PEOPLE_OPTIONS = ['10', '25', '50', '75', '100', '150', '200', '300', '500', '1000', '2000+'];
const WHATSAPP_URL = 'https://wa.me/918926262675?text=Hello! I am looking for Customized Menu %26 Catering Services.';

export default function OrderInquiryForm({ plateData, orderCategory, plateSummary, cartOrderCategory = COMMON_CART_ORDER_CATEGORY }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const maxDateObj = new Date();
  maxDateObj.setDate(maxDateObj.getDate() + 30);
  const maxDate = maxDateObj.toISOString().split('T')[0];

  const [plate, setPlate] = useState(plateData || {});
  const [allItemsMap, setAllItemsMap] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [occasions, setOccasions] = useState([]);
  const [loadingOccasions, setLoadingOccasions] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [inquiryId, setInquiryId] = useState(null);

  const [form, setForm] = useState({
    location: '',
    occasion: '',
    numberOfPeople: '',
    eventDate: '',
    serviceTime: '',
    fullName: user?.name || '',
    contactNumber: user?.phone || '',
    email: user?.email || '',
    pincode: '',
    deliveryAddress: '',
    specialRequirements: plateSummary || '',
  });

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleDownloadPDF = async (e) => {
    e.preventDefault();
    if (!pdfUrl) return;
    
    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error('Failed to fetch PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'quotation.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download error:', err);
      alert('Failed to download PDF. Please try again.');
    }
  };

  useEffect(() => {
    if (user?.email) setForm(prev => ({ ...prev, email: user.email }));
    if (user?.name) setForm(prev => ({ ...prev, fullName: user.name }));
    if (user?.phone) setForm(prev => ({ ...prev, contactNumber: user.phone }));
  }, [user]);

  const plateEntries = Object.entries(plate).filter(([, count]) => count > 0);

  useEffect(() => {
    const fetchOccasions = async () => {
      try {
        const res = await fetch('/api/occasions?t=' + Date.now());
        if (res.ok) {
          const data = await res.json();
          setOccasions(data);
        }
      } catch (err) {
        console.error('Failed to fetch occasions:', err);
      } finally {
        setLoadingOccasions(false);
      }
    };
    fetchOccasions();
  }, []);

  useEffect(() => {
    const plateIds = Object.keys(plate);
    if (plateIds.length === 0) {
      setAllItemsMap({});
      return;
    }

    const knownPlateIds = Object.keys(allItemsMap);
    const hasAllItems = plateIds.length > 0 && plateIds.every(id => id in allItemsMap);
    if (hasAllItems) {
      return;
    }

    const fetchPlateItems = async () => {
      try {
        const requests = plateIds.map(id =>
          fetch(`/api/products/${id}`).then(res => res.json()).catch(() => null)
        );
        const results = await Promise.all(requests);
        const map = { ...allItemsMap };
        results.forEach((product, index) => {
          const id = plateIds[index];
          if (product && product._id) {
            map[id] = {
              id,
              name: product.name,
              price: product.price,
              image: product.image,
              veg: product.vegType === 'Vegetarian',
              cuisineName: product.cuisine?.name || product.cuisineName || 'N/A',
              menuCategory: product.menuCategory || 'main',
              category: product.menuCategory || 'main',
              type: 'dish'
            };
          }
        });
        setAllItemsMap(map);
      } catch (error) {
        console.error('Failed to fetch plate items:', error);
      }
    };

    fetchPlateItems();
  }, [plate]);

  const summary = (() => {
    let subtotal = 0;
    let totalItemsCount = 0;

    plateEntries.forEach(([id, count]) => {
      const item = allItemsMap[id];
      if (item) {
        subtotal += (item.price || 0) * count;
        totalItemsCount += count;
      }
    });

    const multiplier = form.numberOfPeople ? Number(form.numberOfPeople) : 1;
    subtotal = subtotal * multiplier;
    totalItemsCount = totalItemsCount * multiplier;

    const discount = subtotal > 1000 ? 200 : 0;
    const platformFee = 8;
    const gst = Math.round((subtotal - discount) * 0.18);
    const totalPayable = subtotal - discount + platformFee + gst;

    return {
      subtotal,
      totalItems: totalItemsCount,
      totalPlates: form.numberOfPeople ? Number(form.numberOfPeople) : plateEntries.length,
      discount,
      platformFee,
      gst,
      totalPayable
    };
  })();

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

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    setLoading(true);
    setError('');

    const missingFields = [];
    if (!form.location) missingFields.push('Location');
    if (!form.occasion) missingFields.push('Occasion');
    if (!form.eventDate) missingFields.push('Event Date');

    if (!user && !form.email?.trim()) missingFields.push('Email');

    if (missingFields.length > 0) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const currentPlates = Object.entries(plate).filter(([, count]) => count > 0);
      const plateSummaryText = currentPlates.map(([id, count]) => {
        const item = allItemsMap[id];
        return item ? `${item.name} x ${count}` : `Item x ${count}`;
      }).join(', ') || plateSummary || 'Customized Plate';

      const payload = {
        name: form.fullName,
        phone: form.contactNumber,
        mobile: form.contactNumber,
        email: user?.email || form.email,
        deliveryAddress: form.deliveryAddress || form.location,
        category: orderCategory,
        eventDate: form.eventDate,
        numberOfPeople: form.numberOfPeople,
        pincode: form.pincode,
        occasion: form.occasion,
        serviceTime: form.serviceTime,
        specialInstructions: form.specialRequirements,
        plateItems: currentPlates.map(([id, count]) => ({
          ...allItemsMap[id],
          quantity: count
        })),
      };

      const response = await fetch('/api/order-inquiry', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit enquiry');
      }

      const data = await response.json();
      setInquiryId(data.inquiry._id);
      setPdfUrl(`/api/order-inquiry/${data.inquiry._id}/quotation`);
      setPlate({});
      setAllItemsMap({});
      clearAllCarts();
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit enquiry. Please try again.');
      setLoading(false);
    }
  };

if (submitted) {
    return (
      <div className="order-success-modal-overlay">
        <div className="order-success-modal">
          <div className="order-success-check-wrapper">
            <CheckCircle size={48} className="order-success-check-icon" />
          </div>
          <h2 className="order-success-heading">Dear {form.fullName}</h2>
          <p className="order-success-message">
            Thank You! We have received your request. Our representative will contact you shortly.
          </p>
          {pdfUrl && (
            <button 
              type="button"
              onClick={handleDownloadPDF}
              className="order-success-download-btn"
            >
              <Download size={18} />
              Download Order Details
            </button>
          )}
          <Link to="/" className="order-success-btn">Go to Homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="vmc-page">
      <div className="vmc-container">
        <header className="vmc-top-bar">
          <button type="button" onClick={() => navigate('/view-menu-cart', { state: { plate, plateItems: allItemsMap, orderCategory, cartOrderCategory } })} className="vmc-back-link">
            <ArrowLeft size={18} /> Back
          </button>
        </header>

        <div className="vmc-layout">
          <form id="order-form" className="vmc-list-card" onSubmit={handleSubmit} noValidate>
            <div className="order-inquiry-form__content">
              <div className="order-inquiry-form__section">
                <div className="order-inquiry-form__section-title">Event Detail</div>

<div className="order-inquiry-form__row">
                   <div className="order-inquiry-form__group">
                     <label className="order-inquiry-form__label">Select location <span className="req">*</span></label>
                     <select
                       className="order-inquiry-form__select"
                       value={form.location}
                       onChange={(e) => set('location', e.target.value)}
                     >
                       <option value="">Choose location...</option>
                       {LOCATIONS.map(loc => (
                         <option key={loc} value={loc}>{loc}</option>
                       ))}
                     </select>
                   </div>

                   <div className="order-inquiry-form__group">
                     <label className="order-inquiry-form__label">Select occasion <span className="req">*</span></label>
                     <select
                       className="order-inquiry-form__select"
                       value={form.occasion}
                       onChange={(e) => set('occasion', e.target.value)}
                       disabled={loadingOccasions}
                     >
                       <option value="">Choose occasion...</option>
                       {occasions.map(occ => (
                         <option key={occ._id} value={occ.name}>{occ.name}</option>
                       ))}
                     </select>
                   </div>
                 </div>

                 <div className="order-inquiry-form__row">
                   <div className="order-inquiry-form__group">
                     <label className="order-inquiry-form__label">No of people <span className="req">*</span></label>
                     <select
                       className="order-inquiry-form__select"
                       value={form.numberOfPeople}
                       onChange={(e) => set('numberOfPeople', e.target.value)}
                     >
                       <option value="">Select number...</option>
                       {PEOPLE_OPTIONS.map(opt => (
                         <option key={opt} value={opt}>{opt}</option>
                       ))}
                     </select>
                  </div>

<div className="order-inquiry-form__group">
                     <label className="order-inquiry-form__label">Select date <span className="req">*</span></label>
                     <input
                       type="date"
                       className="order-inquiry-form__input order-inquiry-form__input--date"
                       min={today}
                       max={maxDate}
                       value={form.eventDate}
                       onChange={(e) => set('eventDate', e.target.value)}
                     />
                   </div>
                </div>

                <div className="order-inquiry-form__row">
                  <div className="order-inquiry-form__group">
                    <label className="order-inquiry-form__label">Service time (optional)</label>
                    <select
                      className="order-inquiry-form__select"
                      value={form.serviceTime}
                      onChange={(e) => set('serviceTime', e.target.value)}
                    >
                      <option value="">Select time (24:00)</option>
                      {Array.from({ length: 48 }, (_, i) => {
                        const h = Math.floor(i / 2);
                        const m = i % 2 === 0 ? '00' : '30';
                        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                      }).map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="order-inquiry-form__section">
                {/* <div className="order-inquiry-form__section-title">Please share details</div> */}

                <div className="order-inquiry-form__row">
                  <div className="order-inquiry-form__group">
                    <label className="order-inquiry-form__label">Full name <span className="req">*</span></label>
                    <input
                      type="text"
                      className="order-inquiry-form__input"
                      placeholder="Full name"
                      value={form.fullName}
                      onChange={(e) => set('fullName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="order-inquiry-form__group">
                    <label className="order-inquiry-form__label">Contact number <span className="req">*</span></label>
                    <input
                      type="tel"
                      className="order-inquiry-form__input"
                      placeholder="Contact number"
                      value={form.contactNumber}
                      onChange={(e) => set('contactNumber', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="order-inquiry-form__row">
                  {!(user && user.email) && (
                    <div className="order-inquiry-form__group">
                      <label className="order-inquiry-form__label">Email address<span className="req">*</span></label>
                      <input
                        type="email"
                        className="order-inquiry-form__input"
                        placeholder="Email address"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div className="order-inquiry-form__group">
                    <label className="order-inquiry-form__label">Enter Pincode</label>
                    <input
                      type="text"
                      className="order-inquiry-form__input"
                      placeholder="Enter Pincode"
                      value={form.pincode}
                      onChange={(e) => set('pincode', e.target.value)}
                    />
                  </div>
                </div>

                <div className="order-inquiry-form__row order-inquiry-form__row--full">
                  <div className="order-inquiry-form__group">
                    <label className="order-inquiry-form__label">Enter full address</label>
                    <textarea
                      className="order-inquiry-form__textarea"
                      placeholder="Enter full address"
                      value={form.deliveryAddress}
                      onChange={(e) => set('deliveryAddress', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>

                <div className="order-inquiry-form__row order-inquiry-form__row--full">
                  <div className="order-inquiry-form__group">
                    <label className="order-inquiry-form__label">Any special requirement</label>
                    <textarea
                      className="order-inquiry-form__textarea"
                      placeholder="any special requirement"
                      value={form.specialRequirements}
                      onChange={(e) => set('specialRequirements', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>

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

<button type="submit" form="order-form" className="vmc-summary-card__btn" disabled={loading}>
                 {loading ? 'Submitting...' : 'Continue'}
               </button>
               {error && (
                 <p className="order-inquiry-form__error" style={{ color: '#ef4444', marginTop: '0.75rem' }}>{error}</p>
               )}
             </div>
           </aside>
        </div>
      </div>
    </div>
  );
}
