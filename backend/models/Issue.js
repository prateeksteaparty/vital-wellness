import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    symptomsText: {
      type: String,
      required: true,
    },

    extractedSymptoms: [String], // optional later (nlp)

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Issue", issueSchema);
