import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  message: String,
  avatarUrl: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Testimonial', testimonialSchema);
