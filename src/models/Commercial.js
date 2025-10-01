import mongoose from "mongoose";
  
  const commercialSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      image: { type: String },
    },
    { timestamps: true }
  );
  
  export default mongoose.model("commercial", commercialSchema);
  