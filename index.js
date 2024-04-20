require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');
const recruiterAuthRoutes = require('./routes/recruiterAuthRoutes');
const recruiterJobRoutes = require("./routes/recruiterJobRoutes");

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || "";



app.use('/auth/recruiter', recruiterAuthRoutes);
app.use("/recruiter", recruiterJobRoutes);


//DATABASE Connection
mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log("connected to the DATABASE");
  })
  .catch((error) => {
    console.log(`There is this error connecting to the Database- ${error} `);
  });

//Server Creation
app.listen(PORT, () =>{ console.log(`Finally Listening on PORT- ${PORT}`)});
