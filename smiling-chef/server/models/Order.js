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
  createdAt: { type: Date, default: Date.now },
  
  // ── OTP Delivery Verification Fields ──────────────────────────
  deliveryOtp: { type: String },
  otpGeneratedAt: { type: Date },
  otpVerified: { 
    type: Boolean, 
    default: false 
  },
  deliveredAt: { type: Date }
});

export default mongoose.model('Order', orderSchema);