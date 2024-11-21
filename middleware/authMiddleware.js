import jwt from "jsonwebtoken";
export const adminAuthMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized or no cookie present" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden, Entry denied" });
    }
    console.log("Admin is authenticated");
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export const userAuthMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.userToken;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized or no cookie present" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "user") {
      return res.status(403).json({ error: "Forbidden, Entry denied" });
    }
    console.log("User is authenticated");
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};
