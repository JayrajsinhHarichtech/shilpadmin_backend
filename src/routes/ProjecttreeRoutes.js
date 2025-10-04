import express from "express";
import mongoose from "mongoose";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const projectTreeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectTree", default: null },
});

projectTreeSchema.virtual("children", {
  ref: "ProjectTree",
  localField: "_id",
  foreignField: "parentId",
});

const ProjectTree = mongoose.model("ProjectTree", projectTreeSchema);

router.get("/", async (req, res) => {
  try {
    const nodes = await ProjectTree.find().lean();
    const buildTree = (nodes, parentId = null) =>
      nodes
        .filter((n) => String(n.parentId) === String(parentId))
        .map((n) => ({ ...n, children: buildTree(nodes, n._id) }));

    res.json(buildTree(nodes));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch project tree" });
  }
});

router.post("/", upload.none(), async (req, res) => {
  try {
    const { name, parentId } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const newNode = new ProjectTree({ name, parentId: parentId || null });
    await newNode.save();
    res.json(newNode);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create project node" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ProjectTree.deleteOne({ _id: id });
    res.json({ message: "Node deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete node" });
  }
});

export default router;
