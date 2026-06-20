import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  ShoppingBag,
  CreditCard,
  Gift,
  Star,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';
import ProfileTab from './components/ProfileTab';
import AddressesTab from './components/AddressesTab';
import OrdersTab from './components/OrdersTab';
import LoyaltyTab from './components/LoyaltyTab';
import ReferralTab from './components/ReferralTab';
import PaymentsTab from './components/PaymentsTab';
import { useAuth } from '../../contexts/AuthContext';
import './AccountPage.scss';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loyalty, setLoyalty] = useState(null);
  const [referral, setReferral] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [newAddress, setNewAddress] = useState({
    label: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editPaymentMethodIndex, setEditPaymentMethodIndex] = useState(null);
  const [paymentFormMode, setPaymentFormMode] = useState(null);
  const [editPaymentMethod, setEditPaymentMethod] = useState({
    type: '',
    name: '',
    details: ''
  });

  const navigate = useNavigate();
  const { user: authUser, logout: authLogout } = useAuth();

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    setLoading(true);
    try {
      const [
        profileRes,
        addressesRes,
        ordersRes,
        loyaltyRes,
        referralRes,
        paymentsRes
      ] = await Promise.allSettled([
        fetch('/api/account/profile'),
        fetch('/api/account/addresses'),
        fetch('/api/account/orders'),
        fetch('/api/account/loyalty'),
        fetch('/api/account/referral'),
        fetch('/api/account/payments')
      ]);

      const safeJson = async (promiseResult) => {
        if (promiseResult.status === 'fulfilled') {
          try {
            return await promiseResult.value.json();
          } catch (error) {
            console.warn('Failed to parse JSON response:', error);
            return null;
          }
        }
        return null;
      };

      const profileData = await safeJson(profileRes);
      const addressesData = (await safeJson(addressesRes)) || [];
      const ordersData = (await safeJson(ordersRes)) || [];
      const loyaltyData = await safeJson(loyaltyRes);
      const referralData = await safeJson(referralRes);
      const paymentsData = (await safeJson(paymentsRes)) || [];

      setUser(profileData || null);
      setName(profileData?.name || '');
      setPhone(profileData?.phone || '');
      setAddresses(Array.isArray(addressesData) ? addressesData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setLoyalty(loyaltyData);
      setReferral(referralData);
      setPaymentMethods(Array.isArray(paymentsData) ? paymentsData : []);
    } catch (error) {
      console.error('Failed to fetch account data:', error);
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(storedUser);
      setName(storedUser?.name || '');
      setPhone(storedUser?.phone || '');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/account/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editPaymentMethod)
      });
      const data = await res.json();
      setPaymentMethods(data);
      setPaymentFormMode(null);
      setEditPaymentMethodIndex(null);
      setEditPaymentMethod({ type: '', name: '', details: '' });
    } catch (error) {
      console.error('Failed to add payment method:', error);
    }
  };

  const handleUpdatePaymentMethod = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/account/payments/${editPaymentMethodIndex}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editPaymentMethod)
      });
      const data = await res.json();
      setPaymentMethods(data);
      setPaymentFormMode(null);
      setEditPaymentMethodIndex(null);
      setEditPaymentMethod({ type: '', name: '', details: '' });
    } catch (error) {
      console.error('Failed to update payment method:', error);
    }
  };

  const handleDeletePaymentMethod = async (index) => {
    try {
      const res = await fetch(`/api/account/payments/${index}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      setPaymentMethods(data);
    } catch (error) {
      console.error('Failed to delete payment method:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone })
      });
      const data = await res.json();
      setUser(data);
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAddress)
      });
      const data = await res.json();
      setAddresses(data);
      setNewAddress({
        label: '',
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
      });
      setShowAddAddress(false);
    } catch (error) {
      console.error('Failed to add address:', error);
    }
  };

  const handleDeleteAddress = async (index) => {
    try {
      const res = await fetch(`/api/account/addresses/${index}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      setAddresses(data);
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const copyReferralCode = () => {
    if (referral?.referralCode) {
      navigator.clipboard.writeText(referral.referralCode);
    }
  };

  const handleLogout = () => {
    authLogout();
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Personal Info', icon: User },
    { id: 'addresses', label: 'Address Book', icon: MapPin },
    { id: 'orders', label: 'Order History', icon: ShoppingBag },
    { id: 'loyalty', label: 'Loyalty Rewards', icon: Star },
    { id: 'referral', label: 'Refer & Earn', icon: Gift },
    { id: 'payments', label: 'Payments', icon: CreditCard }
  ];

  if (loading) {
    return (
      <div className="account-page">
        <div className="account-page__loading">
          <div className="account-page__loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <div className="account-page__inner">
        <h1 className="account-page__welcome">Welcome back : {user?.name || 'Customer'}</h1>

        <div className="account-page__layout">
          <aside className="account-page__sidebar">
            <div className="account-page__sidebar-title">My Account</div>
            <div className="account-page__nav-list">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`account-page__nav-item ${activeTab === tab.id ? 'account-page__nav-item--active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <button onClick={handleLogout} className="account-page__nav-item account-page__nav-item--logout" type="button">
              <LogOut size={18} />
              Logout
            </button>
          </aside>

          <div className="account-page__content">
             {activeTab === 'profile' && (
               <ProfileTab
                 user={user}
                 name={name}
                 phone={phone}
                 setName={setName}
                 setPhone={setPhone}
                 editMode={editMode}
                 setEditMode={setEditMode}
                 handleUpdateProfile={handleUpdateProfile}
               />
             )}

             {activeTab === 'addresses' && (
               <AddressesTab
                 addresses={addresses}
                 newAddress={newAddress}
                 setNewAddress={setNewAddress}
                 showAddAddress={showAddAddress}
                 setShowAddAddress={setShowAddAddress}
                 handleAddAddress={handleAddAddress}
                 handleDeleteAddress={handleDeleteAddress}
               />
             )}

             {activeTab === 'orders' && (
               <OrdersTab orders={orders} />
             )}

             {activeTab === 'loyalty' && (
               <LoyaltyTab loyalty={loyalty} />
             )}

             {activeTab === 'referral' && (
               <ReferralTab referral={referral} copyReferralCode={copyReferralCode} />
             )}

             {activeTab === 'payments' && (
               <PaymentsTab
                 paymentMethods={paymentMethods}
                 paymentFormMode={paymentFormMode}
                 editPaymentMethod={editPaymentMethod}
                 setPaymentFormMode={setPaymentFormMode}
                 setEditPaymentMethodIndex={setEditPaymentMethodIndex}
                 setEditPaymentMethod={setEditPaymentMethod}
                 handleAddPaymentMethod={handleAddPaymentMethod}
                 handleUpdatePaymentMethod={handleUpdatePaymentMethod}
                 handleDeletePaymentMethod={handleDeletePaymentMethod}
               />
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
