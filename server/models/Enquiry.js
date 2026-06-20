import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    phone:         { type: String, required: true, trim: true },
    email:         { type: String, trim: true, lowercase: true },
    service:       { type: String, trim: true },
    location:      { type: String, trim: true },
    date:          { type: String, trim: true },
    message:       { type: String, trim: true },
    enquiryType:   {
      type: String,
      enum: ['halwai-chef-caterers', 'general', 'tiffin-services', 'venue'],
      default: 'general'
    },
    orderCategory: {
      type: String,
      enum: ['', 'customized-plate', 'bhaji-orders', 'chutney-pickle'],
      default: ''
    },
    status:        { type: String, enum: ['new', 'in-progress', 'resolved'], default: 'new' },
    numberOfPeople: { type: String, trim: true },
    eventDate:      { type: String, trim: true },
    serviceTime:    { type: String, trim: true },
    pincode:        { type: String, trim: true },
    occasion:       { type: String, trim: true },
    
    // ── OTP Delivery Verification Fields (for food orders only) ──
    deliveryOtp:   { type: String },
    otpGeneratedAt: { type: Date },
    otpVerified:   { 
      type: Boolean, 
      default: false 
    },
    deliveredAt:   { type: Date }
  },
  { timestamps: true }
);

enquirySchema.index({ enquiryType: 1 });
enquirySchema.index({ orderCategory: 1 });
enquirySchema.index({ createdAt: -1 });

export default mongoose.model('Enquiry', enquirySchema);