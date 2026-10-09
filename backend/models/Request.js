const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  requestName: { type: String, required: true },
  system: { type: String, required: true },
  access: { type: String, enum: ['READ', 'WRITE', 'READ_WRITE'], required: true },
  duration: { type: Number, required: true },
  risk: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  managerApproval: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  securityApproval: { type: String, enum: ['LOCKED', 'PENDING', 'APPROVED', 'REJECTED'], default: 'LOCKED' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', RequestSchema);
