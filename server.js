import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import authRoutes from "./src/routes/auth.js";
import bannerRoutes from "./src/routes/homepage.js";
import profileRoutes from "./src/routes/profile.js";
import projectsRoutes from "./src/routes/projects.js";
import testimonialsRoutes from "./src/routes/testimonials.js";
import toolsRoutes from "./src/routes/tools.js";

dotenv.config();
const app = express();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir));

app.use("/api/auth", authRoutes);
app.use("/api/banner", bannerRoutes); 
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/tools", toolsRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
