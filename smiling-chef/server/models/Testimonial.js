import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  handle: { type: String, trim: true },
  text: { type: String, required: true, trim: true },
  time: { type: String, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  avatar: { type: String, trim: true },
  reviewUrl: { type: String, trim: true },
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);
