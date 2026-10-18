const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Request = require('./models/Request');
require('dotenv').config();

const PORT = process.env.PORT || 3000;


console.log('Mongo URI:', process.env.MONGO_URI);

const app = express();

app.use(cors());
app.use(express.json());

const dbURI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Successfully connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB Connection Failed! Error details:", err.message);
    // Safely exit or retry connection instead of letting Node crash unexpectedly
    process.exit(1);
  }
};

connectDB();

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend Running'
  });
});
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});


module.exports = app; 
