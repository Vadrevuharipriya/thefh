import mongoose from 'mongoose';

const ChefSchema = new mongoose.Schema({
  firebaseId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  role: { type: String },
  city: { type: String },
  experience: { type: Number },
  rating: { type: Number },
  events: { type: Number },
  followers: { type: Number },
  image: { type: String },
  bio: { type: String },
  awards: [{ label: String, icon: String }],
  serviceTypes: [String],
  cuisines: [String],
  experienceTags: [String],
  ratingBreakdown: {
    5: Number,
    4: Number,
    3: Number,
    2: Number,
    1: Number
  },
  totalRatings: { type: Number },
  displayStatus: { type: String, enum: ['Approved', 'Pending'], default: 'Approved' },
  profile: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.model('Chef', ChefSchema);