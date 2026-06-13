import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    tag:           { type: String, trim: true },
    title:         { type: String, required: true, trim: true },
    titleAccent:   { type: String, trim: true },
    subtitle:      { type: String, trim: true },
    image:         { type: String, trim: true },
    rating:        { type: Number, default: 4.9 },
    reviews:       { type: Number, default: 0 },
    link:          { type: String, trim: true },
    sortOrder:     { type: Number, default: 0 },
    displayStatus: { type: String, enum: ['Approved', 'Pending'], default: 'Approved' }
  },
  { timestamps: true }
);

bannerSchema.set('toJSON', { virtuals: true });
bannerSchema.set('toObject', { virtuals: true });

export default mongoose.model('Banner', bannerSchema);
