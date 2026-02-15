const mongoose = require("mongoose");

const savedRecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    nutrientName: {
      type: String,
      required: true
    },
    confidence: Number,
    food_sources: String,
    description: String,

    // ✅ ADD THESE
        feedback: {
      type: String,
      enum: ["worked", "did_not_work", null],
      default: null
    },
    feedbackAt: Date

  },
  { timestamps: true }
);



module.exports = mongoose.model(
  "SavedRecommendation",
  savedRecommendationSchema
);
