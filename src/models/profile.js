import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    mobile: { type: String, required: true, trim: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    address: { type: String, required: true },
    avatar: { type: String, default: "" }
  },
  { timestamps: true }
);

delete mongoose.connection.models['User']; 

const Profile = mongoose.model("User", profileSchema);

export default Profile;
