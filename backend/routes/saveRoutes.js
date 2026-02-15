const express = require("express");
const User = require("../models/User");
const SavedRecommendation = require("../models/SavedRecommendation");
const sendMail = require("../utils/sendMail");

const router = express.Router();

// ---------------- SAVE RECOMMENDATION ----------------
router.post("/save", async (req, res) => {
  try {
    const {
      userId,
      nutrientName,
      confidence,
      food_sources,
      description
    } = req.body;

    if (!userId || !nutrientName) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const exists = await SavedRecommendation.findOne({
      userId,
      nutrientName
    });
    if (exists) {
      return res.json({ message: "Already saved" });
    }

    const saved = await SavedRecommendation.create({
      userId,
      nutrientName,
      confidence,
      food_sources,
      description
    });

    // 🔔 EMAIL AFTER DELAY (10s TEST)
// 🔔 EMAIL AFTER DELAY (10s TEST)
setTimeout(async () => {
  try {
    console.log("📨 Preparing detailed recommendation email for:", user.email);

    // Fetch recent saved recommendations (last 5)
    const recent = await SavedRecommendation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    if (!recent.length) return;

    const recommendationsHTML = recent.map(r => `
      <div style="margin-bottom: 16px;">
        <h4 style="margin: 0; color: #065f46;">
          ${r.nutrientName}
          <span style="font-size: 13px; color: #059669;">
            (${Math.round(r.confidence)}% confidence)
          </span>
        </h4>
        <p style="margin: 6px 0; font-size: 14px;">
          ${r.description || "Supports overall wellness."}
        </p>
        <p style="margin: 4px 0; font-size: 13px; color: #374151;">
          <strong>Food sources you can include:</strong><br/>
          ${r.food_sources}
        </p>
      </div>
    `).join("");

    await sendMail({
      to: user.email,
      subject: "Your Vital Wellness Summary & Food Guide 🌿",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          
          <h2 style="color: #065f46;">Hi ${user.name} 👋</h2>

          <p>
            Based on your recent activity on <strong>Vital</strong>, we’ve prepared
            a quick wellness summary for you.
          </p>

          <hr />

          <h3 style="color: #065f46;">Your Profile</h3>
          <ul style="font-size: 14px;">
            <li><strong>Diet:</strong> ${user.dietPreference}</li>
            <li><strong>Allergies:</strong> ${user.allergies?.length ? user.allergies.join(", ") : "None"}</li>
          </ul>

          <hr />

          <h3 style="color: #065f46;">Your Saved Recommendations</h3>

          ${recommendationsHTML}

          <hr />

          <p style="font-size: 14px;">
            These recommendations were generated based on:
            <ul>
              <li>Your symptoms & queries</li>
              <li>Your dietary preferences</li>
              <li>Your past feedback</li>
            </ul>
          </p>

          <p>
            👉 You can give feedback anytime to help us improve future suggestions.
          </p>

          <a
            href="https://vital-wellness.vercel.app/recommendations"
            style="
              display: inline-block;
              padding: 10px 16px;
              background: #10b981;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin: 12px 0;
              font-weight: bold;
            "
          >
            View & Give Feedback
          </a>

          <p style="font-size: 12px; color: #555; margin-top: 24px;">
            This is a wellness support summary, not a medical diagnosis.
          </p>

          <p>– Team Vital 🌿</p>
        </div>
      `
    });

    console.log("✅ Detailed recommendation email sent to:", user.email);

  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
}, 10000);


    res.json({ message: "Recommendation saved successfully" });

  } catch (err) {
    console.error("Save route error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- GET SAVED RECOMMENDATIONS ----------------
router.get("/saved/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const saved = await SavedRecommendation.find({ userId })
      .sort({ createdAt: -1 });

    res.json(saved);
  } catch (err) {
    console.error("Fetch saved error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
