import express from "express";
import multer from "multer";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

router.put("/me", authMiddleware, async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { new: true }
  ).select("-password");
  res.json(user);
});

router.put("/me/avatar", authMiddleware, upload.single("profileImage"), async (req, res) => {
  const imagePath = `/uploads/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profileImage: imagePath },
    { new: true }
  ).select("-password");
  res.json(user);
});

export default router;
