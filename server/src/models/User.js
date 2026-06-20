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

export default mongoose.model('User', userSchema);