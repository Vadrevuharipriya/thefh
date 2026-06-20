import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  menuName: { type: String },
  filename: { type: String },
  metaTitle: { type: String },
  menuMetaTitle: { type: String },
  metaDesc: { type: String },
  image: { type: String },
  isCategory: { type: Boolean, default: true }, // Always true for services
  displayStatus: { type: String, enum: ['Approved', 'Pending'], default: 'Approved' },
  pageUrl: { type: String }
}, { timestamps: true });

export default mongoose.model('Service', ServiceSchema);
