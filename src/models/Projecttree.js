import mongoose from "mongoose";

const projectTreeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "projectTree", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("projectTree", projectTreeSchema);
