import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Testimonial from "../models/Testimonial.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads/testimonials");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, designation, message } = req.body;
    const newTestimonial = new Testimonial({
      name,
      designation,
      message,
      image: req.file ? `/uploads/testimonials/${req.file.filename}` : null,
    });
    await newTestimonial.save();
    res.json(newTestimonial);
  } catch (err) {
    res.status(500).json({ error: "Failed to create testimonial" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ error: "Not found" });

    if (testimonial.image) {
      const filePath = path.join(process.cwd(), testimonial.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await testimonial.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
});

export default router;
