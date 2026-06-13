import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function AddressesTab({ addresses, newAddress, setNewAddress, showAddAddress, setShowAddAddress, handleAddAddress, handleDeleteAddress }) {
  return (
    <div className="account-page__section">
      <div className="account-page__section-header">
        <h2>Address Book</h2>
        <button className="account-page__btn account-page__btn--primary" onClick={() => setShowAddAddress(true)}>
          <Plus size={16} />
          Add Address
        </button>
      </div>
      {showAddAddress && (
        <form onSubmit={handleAddAddress} className="account-page__form">
          <div className="account-page__field">
            <label>Label (Home/Work)</label>
            <input type="text" value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} placeholder="Home" />
          </div>
          <div className="account-page__field">
            <label>Full Name</label>
            <input type="text" value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} required />
          </div>
          <div className="account-page__field">
            <label>Phone</label>
            <input type="tel" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} required />
          </div>
          <div className="account-page__field">
            <label>Address</label>
            <textarea value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} required />
          </div>
          <div className="account-page__row">
            <div className="account-page__field">
              <label>City</label>
              <input type="text" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} required />
            </div>
            <div className="account-page__field">
              <label>State</label>
              <input type="text" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} required />
            </div>
            <div className="account-page__field">
              <label>Pincode</label>
              <input type="text" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} required />
            </div>
          </div>
          <div className="account-page__actions">
            <button type="submit" className="account-page__btn account-page__btn--primary">Add Address</button>
            <button type="button" className="account-page__btn" onClick={() => setShowAddAddress(false)}>Cancel</button>
          </div>
        </form>
      )}
      <div className="account-page__addresses">
        {addresses.length === 0 ? (
          <p>No addresses added yet.</p>
        ) : (
          addresses.map((addr, index) => (
            <div key={index} className="account-page__address-card">
              <div className="account-page__address-top">
                <span className="account-page__address-label">{addr.label}</span>
                <button className="account-page__delete-btn" onClick={() => handleDeleteAddress(index)}>
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="account-page__address-name">{addr.name}</div>
              <div>{addr.address}</div>
              <div>{addr.city}, {addr.state} - {addr.pincode}</div>
              <div className="account-page__address-phone">Phone: {addr.phone}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}