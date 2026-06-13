import mongoose from 'mongoose';

const orderInquirySchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    mobile:        { type: String, required: true, trim: true },
    email:         { type: String, trim: true, lowercase: true },
    category:      { 
      type: String, 
      enum: ['customized-plate', 'bhaji-orders', 'chutney-pickle'], 
      default: 'customized-plate' 
    },
    status:        { type: String, enum: ['new', 'in-progress', 'resolved'], default: 'new' },
    
    // Customized Plate fields
    plateType:      { type: String, trim: true },
    quantity:       { type: Number },
    deliveryDate:   { type: String, trim: true },
    deliveryAddress:{ type: String, trim: true },
    specialInstructions: { type: String, trim: true },
    numberOfPeople: { type: String, trim: true },
    eventDate:      { type: String, trim: true },
    pincode:        { type: String, trim: true },
    occasion:       { type: String, trim: true },
    serviceTime:    { type: String, trim: true },
    plateItems:     { type: mongoose.Schema.Types.Mixed },
    
    // Bhaji Orders fields
    bhajiType:      { type: String, trim: true },
    deliveryTime:   { type: String, trim: true },
    
    // Chutney Pickle / Achhar fields
    productType:    { type: String, trim: true },
    spicePreference:{ type: String, trim: true },
    
    // ── OTP Delivery Verification Fields (for food orders) ──
    deliveryOtp:    { type: String },
    otpGeneratedAt: { type: Date },
    otpVerified:    { 
      type: Boolean, 
      default: false 
    },
    deliveredAt:    { type: Date }
  },
  { timestamps: true }
);

orderInquirySchema.index({ category: 1 });
orderInquirySchema.index({ createdAt: -1 });

export default mongoose.model('OrderInquiry', orderInquirySchema);