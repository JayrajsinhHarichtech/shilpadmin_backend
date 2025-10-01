import mongoose from "mongoose";

const dashboardSchema = new mongoose.Schema({
  name: String,
  location: String,
  image: String,
});

export default mongoose.model("Dashboard", dashboardSchema);
