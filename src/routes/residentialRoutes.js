import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Residential from "../models/residential.js";
import auth from "../middleware/auth.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-")),
});

const fileFilter = (_req, file, cb) => {
  const allowed = /\.(jpe?g|png|webp|svg)$/i;
  if (allowed.test(file.originalname)) cb(null, true);
  else cb(new Error("Only images are allowed (jpeg/jpg/png/webp/svg)"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}); 

const deleteLocalFile = (relativePath) => {
  if (!relativePath) return;
  const cleaned = relativePath.replace(/^\//, "");
  const full = path.join(process.cwd(), cleaned);
  if (fs.existsSync(full)) {
    try {
      fs.unlinkSync(full);
    } catch (e) {
      console.error("Failed to delete file:", full, e);
    }
  }
};

router.get("/", async (_req, res) => {
  try {
    const items = await Residential.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doc = await Residential.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description)
      return res.status(400).json({ error: "Title and description required" });

    const imagePath = req.file ? `uploads/${req.file.filename}` : null;
    const newDoc = await Residential.create({
      title,
      description,
      image: imagePath,
    });
    res.status(201).json(newDoc);
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ error: "Failed to create" });
  }
});

router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const doc = await Residential.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Not found" });

    if (req.file && doc.image) {
      deleteLocalFile(doc.image);
    }

    const imagePath = req.file ? `uploads/${req.file.filename}` : doc.image;
    doc.title = title ?? doc.title;
    doc.description = description ?? doc.description;
    doc.image = imagePath;
    await doc.save();

    res.json(doc);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const removed = await Commercial.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: "Commercial not found" });

    if (removed.image) {
      const imagePath = path.join(process.cwd(), removed.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete commercial" });
  }
});

export default router;