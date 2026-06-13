import mongoose from 'mongoose';

const MealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shortDescription: { type: String },
  isCategory: { type: Boolean, default: false }, // true for Breakfast/Lunch/Snacks/Dinner
  displayStatus: { type: String, enum: ['Approved', 'Pending'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Meal', MealSchema);