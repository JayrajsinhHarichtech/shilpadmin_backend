import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import authRoutes from "./src/routes/auth.js";
import bannerRoutes from "./src/routes/homepage.js";
import projectsRoutes from "./src/routes/projects.js";
import testimonialsRoutes from "./src/routes/testimonials.js";
import toolsRoutes from "./src/routes/tools.js";
import aboutUsRoutes from "./src/routes/aboutus.js";
import commercialRoutes from "./src/routes/commercialRoutes.js";
import residentialRoutes from "./src/routes/residentialRoutes.js"; 
import plotsRoutes from "./src/routes/plotsRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";

dotenv.config();

const app = express();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.use("/api/auth", authRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/tools", toolsRoutes);
app.use("/api/aboutus", aboutUsRoutes);
app.use("/api/commercials", commercialRoutes);
app.use("/api/residentials", residentialRoutes); 
app.use("/api/plots", plotsRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shilp-admin";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
