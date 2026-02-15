const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
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
    worked: {
      type: Boolean,
      required: true
    },
    scoreAdjustment: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
