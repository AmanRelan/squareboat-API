const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Candidate = require("../models/Candidate");
const isCandidateAuthenticated = require("../middleware/isCandidateAuthenticated");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Recruiter = require("../models/Recruiter");

const transporter = nodemailer.createTransport({
  host: "smtp.test.email",
  // port: 465,
  port: 567,
  secure: false,
  auth: {
    user: "random@test.com",
    pass: "randomPassword",
  },
});

router.get("/jobs", isCandidateAuthenticated, async (req, res) => {
  try {
    const jobs = await Job.find({});
    res
      .status(200)
      .send({ message: "Found all these jobs for the user", jobs });
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error Getting Jobs", error: error.message });
  }
});

router.post("/applyJob", isCandidateAuthenticated, async (req, res) => {
  try {
    const { jobId } = req.body;

    // Getting user id
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(403)
        .send({ message: "Missing User Login Information" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const foundCandidate = await Candidate.findOne({
      _id: decoded.candidate,
    });

    if (!foundCandidate) {
      res.status(404).send({ message: "The candidate could not be found" });
    }

    // Searching for Job
    const foundJob = await Job.findById(jobId);
    if (!foundJob) {
      res
        .status(404)
        .send({ message: "The job you are looking for could not be found" });
    }

    if (foundCandidate.appliedJobs.includes(jobId)) {
      res
        .status(400)
        .send({ message: "You have already applied for this job" });
    } 
    
    foundCandidate.appliedJobs.push(jobId);
    await foundCandidate.save();
    await transporter.sendMail({
      from: 'hiring@website.com',
      to: foundCandidate.email,
      subject: "Job Application Confirmation",
      text: "User has successfully applied to the job"
    })
    
    foundJob.applicants.push(foundCandidate._id);
    await foundJob.save();
    
    const recruiter = Recruiter.findById(foundJob.recruiterId);
    await transporter.sendMail({
      from: "hiring@website.com",
      to: recruiter.email,
      subject: "User Applied to a job",
      text: "This is to inform you that a user has applied to a job you listed.",
    });
  
    res.status(200).send({message: "Job successfully applied for."})
  } catch (error) {
    res
      .status(400)
      .send({ message: "Error Applying to the Job", error: error.message });
  }
});

router.get('/appliedJobs', isCandidateAuthenticated, async(req,res)=> {
  try {

    // Getting user id
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(403)
        .send({ message: "Missing User Login Information" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const foundCandidate = await Candidate.findOne({
      _id: decoded.candidate,
    });

    if (!foundCandidate) {
      res.status(404).send({ message: "The candidate could not be found" });
    }
    res.status(200).send({message: "Here is the information about the applied jobs of the candidate", jobsFound: foundCandidate.appliedJobs});
  } catch(error) {
    res.status(400).send({ message: "Error Finding Applied jobs for the user", error: error.message})
  }

});

module.exports = router;
