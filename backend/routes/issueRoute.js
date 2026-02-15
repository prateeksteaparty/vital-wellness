const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/issues", async (req, res) => {
  try {
    const { text, userDetails, feedbacks } = req.body;

    if (!text || !userDetails) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // ✅ Make sure userDetails includes userId
    const mlResponse = await axios.post(
      "http://localhost:8000/predict",
      {
        text,
        userDetails: {
          userId: userDetails.userId,  // ✅ Pass userId to ML server
          gender: userDetails.gender,
          dietPreference: userDetails.dietPreference,
          lifestyle: userDetails.lifestyle,
          allergies: userDetails.allergies || []
        },
        feedbacks: feedbacks || []
      }
    );

    res.json({
      message: "ML recommendations received",
      recommendations: mlResponse.data.recommendations
    });

  } catch (error) {
    console.error("Issue route error:", error.response?.data || error.message);
    res.status(500).json({ message: "ML server error" });
  }
});

module.exports = router;