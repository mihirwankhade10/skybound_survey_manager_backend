const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a mission name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
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
    },
    address: {
      type: String,
      required: [true, 'Please add an address']
    }
  },
  startTime: {
    type: Date,
    required: [true, 'Please add a start time']
  },
  recurrenceType: {
    type: String,
    enum: ['Once', 'Daily', 'Weekly', 'Monthly'],
    default: 'Once'
  },
  flightPath: {
    type: [{
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }],
    required: [true, 'Please add flight path coordinates']
  },
  flightAltitude: {
    type: Number,
    required: [true, 'Please add flight altitude in meters']
  },
  patternType: {
    type: String,
    enum: ['Grid', 'Crosshatch', 'Perimeter'],
    required: [true, 'Please specify pattern type']
  },
  sensorType: {
    type: String,
    enum: ['RGB', 'Thermal', 'Multispectral', 'LiDAR'],
    required: [true, 'Please specify sensor type']
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Aborted'],
    default: 'Scheduled'
  },
  assignedDroneId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Drone'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Mission', MissionSchema);
