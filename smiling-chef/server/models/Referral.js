import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referralCode: { type: String, required: true, unique: true },
  referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  earnings: { type: Number, default: 0 }
});

export default mongoose.model('Referral', referralSchema);