import mongoose from 'mongoose';

const loyaltySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  totalRedeemed: { type: Number, default: 0 },
  transactions: [{
    type: { type: String, enum: ['earned', 'redeemed'] },
    amount: Number,
    description: String,
    date: { type: Date, default: Date.now }
  }]
});

export default mongoose.model('Loyalty', loyaltySchema);