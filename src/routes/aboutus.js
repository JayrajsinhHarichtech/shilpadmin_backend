import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import AboutUs from "../models/aboutus.js";
import auth from "../middleware/auth.js"; 

const router = express.Router();

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const about = await AboutUs.findOne();
    res.json(about || {});
  } catch (err) {
    res.status(500).json({ message: "Error fetching About Us data", error: err.message });
  }
});

router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { whoWeAre, vision, mission } = req.body;
    let values = req.body.values;

    if (typeof values === "string") {
      try {
        values = JSON.parse(values);
      } catch {
        values = [values];
      }
    }

    let about = await AboutUs.findOne();
    const imagePath = req.file ? `/uploads/${req.file.filename}` : about?.image;

    if (about) {
      about.whoWeAre = whoWeAre;
      about.vision = vision;
      about.mission = mission;
      about.values = values;
      about.image = imagePath;
      await about.save();
    } else {
      about = new AboutUs({
        whoWeAre,
        vision,
        mission,
        values,
        image: imagePath,
      });
      await about.save();
    }

    res.json({ message: "About Us saved successfully", about });
  } catch (err) {
    res.status(500).json({ message: "Error saving About Us", error: err.message });
  }
});

export default router;
