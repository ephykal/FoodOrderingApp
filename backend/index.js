const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const { logger, httpLogger } = require('./utils/logger')

// Connect to Database
connectDB();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(httpLogger);

app.get("/", (req, res) => {
  logger.info("Home page accessed");
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
