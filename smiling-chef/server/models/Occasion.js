import mongoose from 'mongoose';

const OccasionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pageUrl: { type: String, required: true },
  image: { type: String },
  innerHeader: { type: String },
  metaTitle: { type: String },
  metaKeyword: { type: String },
  metaDesc: { type: String },
  pageDescription: { type: String },
  startingPrice: { type: String },
  pricingEnabled: { type: Boolean, default: false },
  displayStatus: { type: String, enum: ['Approved', 'Pending'], default: 'Pending' },
}, { timestamps: true });

export default mongoose.model('Occasion', OccasionSchema);