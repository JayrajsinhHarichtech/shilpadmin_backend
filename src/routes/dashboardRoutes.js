import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Dashboard from "../models/dashboard.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, location } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newProject = new Dashboard({ name, location, image });
    await newProject.save();

    res.status(200).json(newProject);
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const projects = await Dashboard.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id/image", upload.single("image"), async (req, res) => {
  try {
    const project = await Dashboard.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Not found" });

    project.image = `/uploads/${req.file.filename}`;
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Dashboard.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
