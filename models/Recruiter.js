const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Recruiter = mongoose.model("Recruiter", recruiterSchema);
module.exports = Recruiter;