const jwt = require("jsonwebtoken");
const Recruiter = require('../models/Recruiter')

const isRecruiterAuthenticated = async(req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .send({ message: "Access Denied: No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const isRecruiterFound = await Recruiter.findOne({ _id: decoded.recruiter });
    if(!isRecruiterFound){
      console.log("Recruiter not found");
    }
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid Token" });
  }
};

module.exports = isRecruiterAuthenticated;
