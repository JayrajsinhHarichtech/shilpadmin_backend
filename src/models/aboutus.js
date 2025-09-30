import mongoose from "mongoose";

const aboutUsSchema = new mongoose.Schema({
  whoWeAre: { type: String, required: true },
  vision: { type: String, required: true },
  mission: { type: String, required: true },
  values: [{ type: String }],
  image: { type: String } 
});

export default mongoose.model("AboutUs", aboutUsSchema);
