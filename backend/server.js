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
`

// Endpoint : Get all requests

app.get('/api/requests', async (req, res) => {

  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// Endpoint : Get specific request

app.get('/api/requests/:id', async (req, res) => {
  try {

    const requestID = await Request.findById(req.params.id);

    if (!requestID) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(requestID);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Endpoint : Create a request

app.post('/api/requests', async (req, res) => {

  try {
    const { requestName, system, access, duration } = req.body;

    let risk = 'LOW';
    if (system.includes('Production') && (access === 'WRITE' || access === 'READ_WRITE')) {
      risk = 'HIGH';
    }
    const newRequest = new Request({ requestName, system, access, duration, risk });
    await newRequest.save();

    res.status(201).json(newRequest);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.patch('/api/requests/:id/manager-approval', async (req, res) => {
  try {

    const { decision } = req.body;

    const requestID = await Request.findById(req.params.id);

    requestID.managerApproval = decision;

    if (decision === 'APPROVED' && requestID.securityApproval === 'LOCKED') {
      requestID.securityApproval = 'PENDING';
      requestID.status = 'PENDING';
    } else {
      requestID.securityApproval = 'LOCKED';
      requestID.status = 'REJECTED';
    }

    if (!requestID) {
      return res.status(404).json({ error: 'Request not found' });
    }
    await requestID.save();
    res.json(requestID);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/requests/:id/security-approval', async (req, res) => {
  try {

    const { decision } = req.body;

    const requestID = await Request.findById(req.params.id);

    requestID.securityApproval = decision;

    if (decision === 'APPROVED') {
      requestID.status = 'APPROVED';
    } else {
      requestID.status = 'REJECTED';
      // requestID.securityApproval = 'LOCKED';
    }

    if (!requestID) {
      return res.status(404).json({ error: 'Request not found' });
    }

    await requestID.save();
    res.json(requestID);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/requests/:id', async (req, res) => {
  try {
    const deletedRequest = await Request.findByIdAndDelete(req.params.id);

    if (!deletedRequest) {
      return res.status(404).json({ error: 'Request to delete not found' });
    }
    console.log('Request deleted successfully', res, req.params.id);
    //res.json(deletedRequest);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
