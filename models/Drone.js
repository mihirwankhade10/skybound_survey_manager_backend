const mongoose = require('mongoose');

const DroneSchema = new mongoose.Schema({
  droneId: {
    type: String,
    required: [true, 'Please add a drone ID'],
    unique: true,
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Please add drone model']
  },
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    }
  },
  status: {
    type: String,
    enum: ['Idle', 'In Mission', 'Charging', 'Maintenance'],
    default: 'Idle'
  },
  assignedMissionId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Mission',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Drone', DroneSchema);
