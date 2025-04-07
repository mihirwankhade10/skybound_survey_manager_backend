const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  missionId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Mission',
    required: true
  },
  droneId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Drone',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // Duration in minutes
    required: true
  },
  distance: {
    type: Number, // Distance covered in meters
    required: true
  },
  dataPointsCollected: {
    type: Number,
    required: true
  },
  surveyCoveragePercentage: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  status: {
    type: String,
    enum: ['Completed', 'Partial', 'Failed'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', ReportSchema);
