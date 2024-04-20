const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String },
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;
