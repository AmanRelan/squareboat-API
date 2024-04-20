const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Recruiter = require("../models/Recruiter");
const isRecruiterAuthenticated = require("../middleware/isRecruiterAuthenticated");

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    let recruiter = new Recruiter({ email, password });
    await recruiter.save();
    res.status(201).send({ message: "Recruiter created successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error creating Recruiter", error: error.message });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let recruiter = await Recruiter.findOne({ email });
    if (!recruiter)
      return res.status(404).send({ message: "Recruiter not found" });

    if (recruiter.password !== password) {
      return res.status(401).send({ message: "Invalid password" });
    }

    // Generate a token
    const token = jwt.sign(
      { recruiter: recruiter._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    recruiter.token = token;
    await recruiter.save();
    res.send({
      token,
      recruiterId: recruiter._id,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
});
router.post("/logout", isRecruiterAuthenticated, async (req, res) => {
  try {
    const recruiterId = req.recruiterId;
    const isRecruiterFound = await Recruiter.findOne({
      _id: recruiterId,
    });
    if (!isRecruiterFound) {
      res.status(404).send({message: "Recruiter Not Found"})
    }
    await Recruiter.updateOne({ _id: recruiterId }, { $unset: { token: "" } });
    res.status(200).send({message: "Recruiter Logged out successfully"});
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
