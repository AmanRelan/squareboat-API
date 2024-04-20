const express = require("express");
const router = express.Router();
const isRecruiterAuthenticated = require("../middleware/isRecruiterAuthenticated");
const Job = require("../models/Job");

router.post("/job", isRecruiterAuthenticated, async (req, res) => {
  try {
    const { jobTitle, jobDescription } = req.body;
    const recruiterId = req.recruiterId;
    let newJob = new Job({
      jobTitle,
      jobDescription,
      recruiterId: recruiterId,
    });
    await newJob.save();
    res.status(201).send({ message: "Job created successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error posting Job", error: error.message });
  }
});

router.get("/applicants/:jobId", isRecruiterAuthenticated, async (req, res) => {
  try {
    const { jobId } = req.params;
    const isJobFound = await Job.findOne({ _id: jobId });
    if(!isJobFound){
      res.status(404).send({message: "The job you are trying to search is not found"});
    }
    res.status(200).send({message: "Here are the applicants found for the job you are searching for", applicants: isJobFound.applicants})
  } catch (error) {
    res
      .status(500)
      .send({ message: `Error getting Applicants:- ${error.message}` });
  }
});

module.exports = router;
