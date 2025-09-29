import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  aboutText: { type: String, required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
