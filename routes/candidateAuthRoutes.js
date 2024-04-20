const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Candidate = require("../models/Candidate");
const isCandidateAuthenticated = require("../middleware/isCandidateAuthenticated");

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    let candidate = new Candidate({ email, password });
    await candidate.save();
    res.status(201).send({ message: "Candidate created successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error creating Candidate", error: error.message });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let candidate = await Candidate.findOne({ email });
    if (!candidate)
      return res.status(404).send({ message: "Candidate not found" });

    if (candidate.password !== password) {
      return res.status(401).send({ message: "Invalid password" });
    }

    // Generate a token
    const token = jwt.sign(
      { candidate: candidate._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    candidate.token = token;
    await candidate.save();
    res.send({
      token,
      candidateId: candidate._id,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
});
router.post("/logout", isCandidateAuthenticated, async (req, res) => {
  try {
    const candidateId = req.candidateId;
    const isCandidateFound = await Candidate.findOne({
      _id: candidateId,
    });
    if (!isCandidateFound) {
      res.status(404).send({ message: "Candidate Not Found" });
    }
    await Candidate.updateOne({ _id: candidateId }, { $unset: { token: "" } });
    res.status(200).send({ message: "Candidate Logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
