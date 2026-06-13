import { useState } from 'react';
import { Edit } from 'lucide-react';

export default function ProfileTab({ user, name, phone, setName, setPhone, editMode, setEditMode, handleUpdateProfile }) {
  return (
    <div className="account-page__section">
      <h2>Personal Information</h2>
      {editMode ? (
        <form onSubmit={handleUpdateProfile} className="account-page__form">
          <div className="account-page__field">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="account-page__field">
            <label>Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="account-page__actions">
            <button type="submit" className="account-page__btn account-page__btn--primary">
              Save Changes
            </button>
            <button type="button" className="account-page__btn" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="account-page__info">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Phone:</strong> {user?.phone || 'Not added'}</p>
          <button className="account-page__btn account-page__btn--primary" onClick={() => setEditMode(true)}>
            <Edit size={16} />
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}