import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String },
  displayStatus: { type: String, enum: ['Approved', 'Pending'], default: 'Approved' }
}, { timestamps: true });

export default mongoose.model('Location', LocationSchema);