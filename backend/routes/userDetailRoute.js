const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { authenticateUser, generateToken } = require("../controllers/authController");
const { normalizeDiet } = require("../utils/normalize")


// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  try {
    let {
      name,
      gender,
      dietPreference,
      lifestyle,
      allergies = [],
      email,
      password
    } = req.body;

    // Normalize diet
    const normalizedDiet = normalizeDiet(dietPreference);
    if (!normalizedDiet) {
      return res.status(400).json({ message: "Invalid diet preference" });
    }

    // Normalize allergies
    const allowedAllergies = ["nuts", "dairy", "gluten", "shellfish", "soy", "eggs"];
    allergies = allergies.filter(a => allowedAllergies.includes(a));

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      gender,
      dietPreference: normalizedDiet, // 
      lifestyle,
      allergies,
      email,
      password: hashedPassword
    });

res.status(201).json({
  message: "User registered successfully",
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    gender: user.gender,
    dietPreference: user.dietPreference, // ✅ normalized
    lifestyle: user.lifestyle,
    allergies: user.allergies
  }
});


  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ================= SIGNIN =================
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authenticateUser(email, password);
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

res.json({
  message: "Login successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    gender: user.gender,
    dietPreference: user.dietPreference,
    lifestyle: user.lifestyle,
    allergies: user.allergies
  }
});


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= GET USER DETAILS =================
router.get("/details/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
