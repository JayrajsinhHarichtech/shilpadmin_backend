import express from "express";
import multer from "multer";
import path from "path";
import Dashboard from "../models/Dashboard.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });
router.get("/", async (req, res) => {
  try {
    const projects = await Dashboard.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, location } = req.body;
    const image = req.file ? req.file.filename : null;

    const project = new Dashboard({ name, location, image });
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Dashboard.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;