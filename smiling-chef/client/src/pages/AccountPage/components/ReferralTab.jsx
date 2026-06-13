import { Copy } from 'lucide-react';

export default function ReferralTab({ referral, copyReferralCode }) {
  return (
    <div className="account-page__section">
      <h2>Refer & Earn</h2>
      <div className="account-page__referral-card">
        <div className="account-page__referral-code-row">
          <div className="account-page__referral-code">{referral?.referralCode || 'N/A'}</div>
          <button type="button" className="account-page__copy-btn" onClick={copyReferralCode}>
            <Copy size={16} />
          </button>
        </div>
        <p className="account-page__referral-desc">Share this code with friends. You and your friend get ₹100 off when they place their first order!</p>
        <p className="account-page__referral-earnings"><strong>Total Earnings:</strong> ₹{referral?.earnings || 0}</p>
      </div>
    </div>
  );
}