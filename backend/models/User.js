const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true
  },

  dietPreference: {
    type: String,
    enum: ["veg", "vegan", "nonveg", "eggetarian"],
    required: true
  },

  lifestyle: {
    type: String,
    enum: ["sedentary", "lightly_active", "moderately_active", "very_active"],
    required: true
  },

  allergies: {
    type: [String],
    enum: ["nuts", "dairy", "gluten", "shellfish", "soy", "eggs"],
    default: []
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
