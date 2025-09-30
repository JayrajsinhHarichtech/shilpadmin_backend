import express from "express";
import multer from "multer";
import path from "path";
import fs from   "fs";
import auth from "../middleware/auth.js";
import Banner from "../models/homepage.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

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

router.post("/", auth, upload.any(), (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);
  res.json({ msg: "Files received", body: req.body, files: req.files });
});

router.post("/", auth, upload.single("bannerImage"), async (req, res) => {
  try {
    const { aboutText } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!aboutText || !imageUrl) {
      return res.status(400).json({ error: "aboutText and bannerImage are required" });
    }

    await Banner.deleteMany();

    const newBanner = await Banner.create({ aboutText, imageUrl });
    res.status(201).json({ success: true, banner: newBanner });
  } catch (error) {
    console.error("Error saving homepage data:", error);
    res.status(500).json({ error: "Failed to save banner" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const bannerDoc = await Banner.findOne().sort({ createdAt: -1 });
    res.json(bannerDoc || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
