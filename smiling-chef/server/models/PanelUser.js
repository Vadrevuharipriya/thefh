import mongoose from 'mongoose';

const panelUserSchema = new mongoose.Schema(
  {
    contactName: { type: String, required: true, trim: true },
    mobilePhone: { type: String, required: true, trim: true },
    emailAddress: { type: String, trim: true, lowercase: true },
    username: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    designation: { type: String, trim: true },
    status: {
      type: String,
      enum: ['Non-Approve', 'Approved', 'Hold'],
      default: 'Non-Approve'
    },
    role: { type: String, enum: ['Admin', 'Panel User'], default: 'Panel User' }
  },
  { timestamps: true }
);

panelUserSchema.index({ status: 1 });
panelUserSchema.index({ createdAt: -1 });

export default mongoose.model('PanelUser', panelUserSchema);