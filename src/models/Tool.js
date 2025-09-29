import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
  key: { type: String, required: true },
  title: String,
  description: String,
  enabled: { type: Boolean, default: true }
});

export default mongoose.model('Tool', toolSchema);
