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

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.error('MongoDB connection failed', error));

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend Running'
  });
});
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
