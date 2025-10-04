import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

// Routes
import authRoutes from "./src/routes/auth.js";
import bannerRoutes from "./src/routes/homepage.js";
import testimonialsRoutes from "./src/routes/testimonialRoutes.js";
import toolsRoutes from "./src/routes/tools.js";
import aboutUsRoutes from "./src/routes/aboutus.js";
import commercialRoutes from "./src/routes/commercialRoutes.js";
import residentialRoutes from "./src/routes/residentialRoutes.js"; 
import plotsRoutes from "./src/routes/plotsRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import Projecttree from "./src/routes/ProjecttreeRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";

dotenv.config();

const app = express();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/tools", toolsRoutes);
app.use("/api/ai", toolsRoutes);    
app.use("/api/aboutus", aboutUsRoutes);
app.use("/api/commercials", commercialRoutes);
app.use("/api/residentials", residentialRoutes); 
app.use("/api/plots", plotsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/project-tree", Projecttree);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shilp-admin";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));

