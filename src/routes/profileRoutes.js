import express from "express";
import multer from "multer";
import Profile from "../models/profile.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("avatar"), async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.avatar = `/uploads/${req.file.filename}`;
    }

    const profile = new Profile(data);
    await profile.save();

    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
