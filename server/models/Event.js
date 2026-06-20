import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    slug:          { type: String, required: true, unique: true, lowercase: true },
    image:         { type: String, trim: true },
    date:          { type: String, trim: true },
    description:   { type: String, trim: true },
    displayStatus: {
      type:         String,
      enum:         ['Approved', 'Pending', 'Hold'],
      default:      'Pending'
    },
    displayOrder:  { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
