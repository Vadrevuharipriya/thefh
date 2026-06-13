import mongoose from 'mongoose';

const websitePageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  url: { type: String, trim: true },
  metaTitle: { type: String, trim: true },
  metaDescription: { type: String, trim: true },
  pageType: { 
    type: String, 
    enum: ['static', 'dynamic', 'blog', 'service', 'category', 'other'], 
    default: 'static' 
  },
  displayStatus: { type: String, enum: ['Approved', 'Pending'], default: 'Approved' },
  content: { type: String },
  featuredImage: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model('WebsitePage', websitePageSchema);
