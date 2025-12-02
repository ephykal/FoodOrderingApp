const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const { logger } = require('../utils/logger')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }

};

module.exports = connectDB;