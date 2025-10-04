import mongoose from "mongoose";

const DashboardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String },
});

export default mongoose.model("Dashboard", DashboardSchema);
