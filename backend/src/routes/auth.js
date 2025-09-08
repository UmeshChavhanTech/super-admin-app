const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Role } = require("../models"); // include Role for associations

// POST /api/v1/auth/login
router.post("/login", async (req, res) => {
  try {
    console.log("📩 Login request body:", req.body); // Debug log

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user (include roles if you want role info)
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, through: { attributes: [] } }],
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    // Send response with token + basic user info (no password)
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.Roles ? user.Roles.map((r) => r.name) : [],
      },
    });
  } catch (err) {
    console.error("❌ Auth error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
