import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { 
      type: String, 
      required: true, 
      enum: ['pickle', 'bhaji', 'chutney', 'other', 'menu_item'],
      lowercase: true 
    },
    menuCategory: { 
      type: String, 
      enum: ['breakfast', 'main', 'starters', 'bbq', 'desserts', 'soups', 'breads', 'state-special'] 
    },
    cuisine: { type: mongoose.Schema.Types.ObjectId, ref: 'Cuisine' },
    description: { type: String, trim: true },
    image: { type: String, trim: true },
    vegType: { type: String, enum: ['Vegetarian', 'Non-Vegetarian'] },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ category: 1, name: 1 });

export default mongoose.model('Product', productSchema);
