const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3000;

mongoose.connect()

app.listen(PORT)