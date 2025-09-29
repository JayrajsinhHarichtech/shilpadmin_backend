import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  imageUrl: String,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Project', projectSchema);
