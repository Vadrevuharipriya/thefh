import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, trim: true },
    metaTitle: { type: String, trim: true },
    metaKeyword: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    content: { type: String, trim: true },
    image: { type: String, trim: true },
    category: { type: String, trim: true },
    author: { type: String, default: 'The Famous Halwai Team', trim: true },
    date: { type: Date, default: Date.now },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Blog', blogSchema);