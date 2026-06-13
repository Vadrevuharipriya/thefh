import { Star } from 'lucide-react';

export default function LoyaltyTab({ loyalty }) {
  return (
    <div className="account-page__section">
      <h2>Loyalty Rewards</h2>
      <div className="account-page__loyalty-card">
        <div className="account-page__loyalty-top">
          <div className="account-page__loyalty-icon-wrap">
            <Star size={28} />
          </div>
          <div>
            <div className="account-page__loyalty-points">{loyalty?.points || 0} Points</div>
            <p className="account-page__loyalty-meta">Total Earned: {loyalty?.totalEarned || 0} | Redeemed: {loyalty?.totalRedeemed || 0}</p>
          </div>
        </div>
        <p className="account-page__loyalty-desc">Earn 1 point for every ₹100 spent. Redeem points for discounts on future orders.</p>
      </div>
    </div>
  );
}