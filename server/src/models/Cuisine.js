import mongoose from 'mongoose';

const cuisineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  shortDescription: { type: String, trim: true },
  image: { type: String, trim: true },
  displayStatus: { type: String, enum: ['Approved', 'Pending'], default: 'Approved' }
}, { timestamps: true });

export default mongoose.model('Cuisine', cuisineSchema);
