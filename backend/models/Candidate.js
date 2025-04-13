const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    experience: {
      type: String,
      enum: ["1 Year", "2 Years", "3 Years", "4 Years", "5 Years", "6+ Years"],
      required: true,
    },
    skills: { type: [String], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
