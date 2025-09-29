import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  if (process.env.NODE_ENV === "development") {
    console.log("Auth skipped (development mode)");
    return next();
  }

  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token not valid" });
  }
}
