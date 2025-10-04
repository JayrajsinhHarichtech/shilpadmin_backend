import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    message: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);
