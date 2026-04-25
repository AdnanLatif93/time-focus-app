const mongoose = require('mongoose');
const { MONGO_URI } = require('./index');

const connectDB = async () => {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  await mongoose.connect(MONGO_URI);

  console.log('MongoDB connected');
};

module.exports = connectDB;
