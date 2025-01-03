import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
export const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized or no cookie present" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden, Entry denied becuase role is not admin" });
    }
    const user = await userModel.findOne({ email: decoded.email });
    console.log("Admin is authenticated");
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

export const userAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.userToken;
    
    if (!token) {
      return res.status(401).json({ error: "Unauthorized or no cookie present" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "user") {
      return res.status(403).json({ error: "Forbidden, Entry denied" });
    }
    console.log("decoded",decoded);
    const user = await userModel.findById(decoded.userId);
    console.log("User is authenticated",user);
    req.user = user;
    console.log(user);
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};
