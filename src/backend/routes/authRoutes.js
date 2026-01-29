import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    console.log("🔍 Checking if email already exists:", email);
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      console.error("🚨 Email already in use:", email);
      return res.status(400).json({ error: "Email already in use" });
    }

    console.log("🔒 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      watchlist: [],
      portfolio: [],
    });
    await user.save();

    console.log("✅ User registered successfully:", user.username);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("🔥 Registration Error:", error.message);
    res.status(500).json({ error: "Error registering user" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("🔍 Looking up user by email:", email);
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      console.error("🚨 User Not Found:", email);
      return res.status(404).json({ error: "Invalid email or password" });
    }

    console.log("🔒 Stored Hashed Password:", user.password);
    console.log("🔒 Entered Password:", password);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.error("🚨 Password Mismatch for Email:", email);
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("✅ Login Successful for:", user.username);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("🔥 Login Error:", error.message);
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/user", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("🚨 Invalid Authorization Header:", authHeader);
    return res
      .status(401)
      .json({ error: "Unauthorized: Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log("🔍 Verifying Token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      console.error("🚨 Decoding Error:", decoded);
      return res.status(401).json({ error: "Invalid token: Missing userId" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.error("🚨 User Not Found for Token:", decoded.userId);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ User Retrieved Successfully:", user.username);
    res.status(200).json({ user });
  } catch (error) {
    console.error("🔥 Token Verification Error:", error.message);
    res.status(401).json({ error: "Invalid token" });
  }
});

router.post("/save-assets", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { watchlist, portfolio } = req.body;
    user.watchlist = watchlist;
    user.portfolio = portfolio;
    await user.save();

    return res.status(200).json({ message: "Assets saved successfully!" });
  } catch (error) {
    console.error("🔥 Error saving assets:", error.message);
    return res.status(500).json({ error: "Failed to save assets" });
  }
});

router.get("/fetch-assets", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select(
      "watchlist portfolio"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res
      .status(200)
      .json({ watchlist: user.watchlist, portfolio: user.portfolio });
  } catch (error) {
    console.error("🔥 Error fetching assets:", error.message);
    return res.status(500).json({ error: "Failed to fetch assets" });
  }
});

export default router;
