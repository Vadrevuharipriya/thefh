import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const paymentMethodSchema = new mongoose.Schema({
  type: { type: String, enum: ['card', 'upi', 'netbanking'], required: true },
  name: { type: String, required: true },
  details: { type: String },
  isDefault: { type: Boolean, default: false }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, required: true, unique: true },
  items: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: addressSchema,
  paymentMethod: paymentMethodSchema,
  createdAt: { type: Date, default: Date.now }
});

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

const referralSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referralCode: { type: String, required: true, unique: true },
  referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  earnings: { type: Number, default: 0 }
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    addresses: [addressSchema],
    paymentMethods: [paymentMethodSchema]
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
export const Order = mongoose.model('Order', orderSchema);
export const Loyalty = mongoose.model('Loyalty', loyaltySchema);
export const Referral = mongoose.model('Referral', referralSchema);