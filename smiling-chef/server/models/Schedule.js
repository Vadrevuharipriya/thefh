import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
  meal: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal', required: true },
  scheduleTime: { type: String, required: true },
  displayStatus: { type: String, enum: ['Approved', 'Pending'], default: 'Pending' },
}, { timestamps: true });

export default mongoose.model('Schedule', ScheduleSchema);