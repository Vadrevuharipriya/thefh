import mongoose from 'mongoose';

const ServiceCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  menuName: { type: String },
  filename: { type: String, unique: true, sparse: true },
  metaTitle: { type: String },
  menuMetaTitle: { type: String },
  metaDesc: { type: String },
  image: { type: String },
  isCategory: { type: Boolean, default: true },
  displayStatus: { type: String, enum: ['Approved', 'Pending'], default: 'Approved' },
  pageUrl: { type: String }
}, { timestamps: true });

export default mongoose.model('ServiceCategory', ServiceCategorySchema);
