const express = require("express");
const router = express.Router();
const isRecruiterAuthenticated = require("../middleware/isRecruiterAuthenticated");
const Job = require("../models/Job");
const jwt = require("jsonwebtoken");

router.post("/job", isRecruiterAuthenticated, async (req, res) => {
  try {
    const { jobTitle, jobDescription } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).send({ message: "Missing Recruiter Details" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let newJob = new Job({
      jobTitle,
      jobDescription,
      recruiterId: decoded.recruiter,
    });
    await newJob.save();
    res.status(201).send({ message: "Job created successfully" });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error posting Job", error: error.message });
  }
});

module.exports = router;
