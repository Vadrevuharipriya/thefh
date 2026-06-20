import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useAccountProfile,
  useAccountAddresses,
  useUserOrders,
  useAccountLoyalty,
  useAccountReferral,
  useAccountPayments,
  useUpdateProfileMutation,
  useAddAddressMutation,
  useDeleteAddressMutation,
  useAddPaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} from '../../hooks/public/useAccount';
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
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editMode, setEditMode] = useState(false);

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

  const [paymentFormMode, setPaymentFormMode] = useState(null);
  const [editPaymentMethod, setEditPaymentMethod] = useState({ type: '', name: '', details: '' });
  const [editPaymentMethodIndex, setEditPaymentMethodIndex] = useState(null);

  const { data: profileData, isLoading: isLoadingProfile } = useAccountProfile();
  const { data: addressesData, isLoading: isLoadingAddresses } = useAccountAddresses();
  const { data: ordersData, isLoading: isLoadingOrders } = useUserOrders();
  const { data: loyaltyData, isLoading: isLoadingLoyalty } = useAccountLoyalty();
  const { data: referralData, isLoading: isLoadingReferral } = useAccountReferral();
  const { data: paymentsData, isLoading: isLoadingPayments } = useAccountPayments();

  const { mutateAsync: updateProfile } = useUpdateProfileMutation();
  const { mutateAsync: addAddress } = useAddAddressMutation();
  const { mutateAsync: deleteAddress } = useDeleteAddressMutation();
  const { mutateAsync: addPayment } = useAddPaymentMutation();
  const { mutateAsync: updatePayment } = useUpdatePaymentMutation();
  const { mutateAsync: deletePayment } = useDeletePaymentMutation();

  const loading = isLoadingProfile || isLoadingAddresses || isLoadingOrders || isLoadingLoyalty || isLoadingReferral || isLoadingPayments;

  useEffect(() => {
    if (profileData) {
      setUser(profileData);
      setName(profileData.name || '');
      setPhone(profileData.phone || '');
    }
  }, [profileData]);

  const addresses = Array.isArray(addressesData) ? addressesData : [];
  const orders = Array.isArray(ordersData) ? ordersData : [];
  const loyalty = loyaltyData || null;
  const referral = referralData || null;
  const paymentMethods = Array.isArray(paymentsData) ? paymentsData : [];

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    try {
      await addPayment(editPaymentMethod);
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
      await updatePayment({ index: editPaymentMethodIndex, data: editPaymentMethod });
      setPaymentFormMode(null);
      setEditPaymentMethodIndex(null);
      setEditPaymentMethod({ type: '', name: '', details: '' });
    } catch (error) {
      console.error('Failed to update payment method:', error);
    }
  };

  const handleDeletePaymentMethod = async (index) => {
    try {
      await deletePayment(index);
    } catch (error) {
      console.error('Failed to delete payment method:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name, phone });
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await addAddress(newAddress);
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
      await deleteAddress(index);
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
