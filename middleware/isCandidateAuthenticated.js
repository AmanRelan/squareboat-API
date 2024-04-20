const jwt = require("jsonwebtoken");
const Candidate = require("../models/Candidate");

const isCandidateAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .send({ message: "Access Denied: No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const isCandidateFound = await Candidate.findOne({
      _id: decoded.candidate,
    });
    if (!isCandidateFound) {
      res.status(404).send({message: "The user does not exist"});
    }
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid Token" });
  }
};

module.exports = isCandidateAuthenticated;
