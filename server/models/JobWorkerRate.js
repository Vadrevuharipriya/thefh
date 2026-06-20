import mongoose from 'mongoose';

const jobWorkerRateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rate: { type: Number, required: true },
  displayStatus: {
    type: String,
    enum: ['Approved', 'Pending'],
    default: 'Pending'
  },
});

const JobWorkerRate = mongoose.model('JobWorkerRate', jobWorkerRateSchema);

export default JobWorkerRate;