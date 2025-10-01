import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import auth from "../middleware/auth.js";
import Commercial from "../models/Commercial.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Only images allowed"));
  },
});

router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !description || !image) {
      return res.status(400).json({ error: "Title, description, and image are required" });
    }

    const newCommercial = await Commercial.create({ title, description, image });
    res.status(201).json({ success: true, commercial: newCommercial });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create commercial" });
  }
});

router.put("/:id", auth, upload.single("file"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const updateData = { title, description };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const updated = await Commercial.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ error: "Commercial not found" });

    res.json({ success: true, commercial: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update commercial" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const commercials = await Commercial.find().sort({ createdAt: -1 });
    res.json(commercials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch commercials" });
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
