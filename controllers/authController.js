import userModel from "../models/userModel.js";
import { signinSchema, signUpSchema } from "../zodSchema/authSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isValid = signUpSchema.safeParse({ name, email, password });
    if (!isValid.success) {
      return res.status(400).json({ error: isValid.error.errors });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const token = jwt.sign({ email, role: "user" }, process.env.JWT_SECRET, { expiresIn: "15d" });

    const user = await new userModel({ name, email, password: hashedPassword });
    user.save();

   res.cookie("userToken", token, {
     httpOnly: true, // Prevents JavaScript access
     secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS)
     sameSite: "lax", // Helps prevent CSRF
     maxAge:60* 24 * 60 * 60 * 1000,
   });
    
    
    res.status(201).json({ message: "User created successfully", user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isValid = signinSchema.safeParse({ email, password });
    if (!isValid.success) {
      return res.status(400).json({ error: isValid.error.errors });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15d" });

   res.cookie("userToken", token, {
     httpOnly: true, // Prevents JavaScript access
     secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS)
     sameSite: "lax", // Helps prevent CSRF
     maxAge:60* 24 * 60 * 60 * 1000,
   });

    // Send success response with user details and token
    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const adminSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const isValid = signUpSchema.safeParse({ name, email, password });
    if (!isValid.success) {
      return res.status(400).json({ error: isValid.error.errors });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = new userModel({ name, email, password: hashedPassword, role: "admin" });
    await admin.save();

    const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "15d" });

    // Set the token in a cookie
    res.cookie("adminToken", token, {
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS)
      sameSite: "lax", // Helps prevent CSRF
      maxAge: 60*24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Admin created successfully",
      user: admin,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const adminSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate the input using the schema (you may want different validation for admin)
    const isValid = signinSchema.safeParse({ email, password });
    if (!isValid.success) {
      return res.status(400).json({ error: isValid.error.errors });
    }

    const admin = await userModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (admin.role !== "admin") {
      return res.status(403).json({ error: "Access denied, not an admin" });
    }

    const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: "15d" });

    // Set the token in a cookie
    res.cookie("adminToken", token, {
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS)
      sameSite: "lax", // Helps prevent CSRF
      maxAge: 60*24 * 60 * 60 * 1000,
    });

  

    res.status(200).json({
      message: "Login successful",
      user: admin,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
