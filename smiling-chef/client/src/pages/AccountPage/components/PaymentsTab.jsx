import { Plus, Edit, Trash2 } from 'lucide-react';

export default function PaymentsTab({ paymentMethods, paymentFormMode, editPaymentMethod, setPaymentFormMode, setEditPaymentMethodIndex, setEditPaymentMethod, handleAddPaymentMethod, handleUpdatePaymentMethod, handleDeletePaymentMethod }) {
  return (
    <div className="account-page__section">
      <h2>Payment Methods</h2>
      <div className="account-page__section-header">
        <button className="account-page__btn account-page__btn--primary" type="button" onClick={() => {
          setPaymentFormMode('add');
          setEditPaymentMethodIndex(null);
          setEditPaymentMethod({ type: '', name: '', details: '' });
        }}>
          <Plus size={16} />
          Add Payment Method
        </button>
      </div>

      {paymentFormMode !== null && (
        <form onSubmit={paymentFormMode === 'add' ? handleAddPaymentMethod : handleUpdatePaymentMethod} className="account-page__form">
          <div className="account-page__field">
            <label>Type</label>
            <select value={editPaymentMethod.type} onChange={(e) => setEditPaymentMethod({ ...editPaymentMethod, type: e.target.value })} required>
              <option value="">Select Type</option>
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI</option>
              <option value="netbanking">Net Banking</option>
            </select>
          </div>
          <div className="account-page__field">
            <label>Name on Account/Card</label>
            <input type="text" value={editPaymentMethod.name} onChange={(e) => setEditPaymentMethod({ ...editPaymentMethod, name: e.target.value })} required />
          </div>
          <div className="account-page__field">
            <label>Details</label>
            <input type="text" value={editPaymentMethod.details} onChange={(e) => setEditPaymentMethod({ ...editPaymentMethod, details: e.target.value })} placeholder="For UPI: xxx@upi, for Card: last 4 digits" />
          </div>
          <div className="account-page__actions">
            <button type="submit" className="account-page__btn account-page__btn--primary">{paymentFormMode === 'add' ? 'Add' : 'Save'}</button>
            <button type="button" className="account-page__btn" onClick={() => {
              setPaymentFormMode(null);
              setEditPaymentMethodIndex(null);
              setEditPaymentMethod({ type: '', name: '', details: '' });
            }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="account-page__payment-methods">
        {paymentMethods.length === 0 ? (
          <p>No payment methods added yet.</p>
        ) : (
          paymentMethods.map((pm, index) => (
            <div key={index} className="account-page__payment-card">
              <div className="account-page__payment-header">
                <strong>{pm.type === 'card' ? 'Credit/Debit Card' : pm.type === 'upi' ? 'UPI' : 'Net Banking'}</strong>
                <div className="account-page__payment-actions">
                  <button className="account-page__edit-btn" type="button" onClick={() => {
                    setPaymentFormMode('edit');
                    setEditPaymentMethodIndex(index);
                    setEditPaymentMethod(pm);
                  }}>
                    <Edit size={16} />
                  </button>
                  <button className="account-page__delete-btn" type="button" onClick={() => handleDeletePaymentMethod(index)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p><strong>Name:</strong> {pm.name}</p>
              <p><strong>Details:</strong> {pm.details}</p>
              {pm.isDefault && <span className="account-page__default-badge">Default</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}