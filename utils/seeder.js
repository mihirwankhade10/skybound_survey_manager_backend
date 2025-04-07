const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Drone = require('../models/Drone');
const Mission = require('../models/Mission');
const Report = require('../models/Report');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Sample data - Users
const users = [
  {
    name: 'Admin User',
    email: 'admin@skybound.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'John Operator',
    email: 'john@skybound.com',
    password: 'password123',
    role: 'user'
  }
];

// Sample data - Drones
const drones = [
  {
    droneId: 'SKY-D1001',
    model: 'SkyScout X1',
    batteryLevel: 95,
    location: {
      type: 'Point',
      coordinates: [73.8567, 18.5204]  // Pune, India
    },
    status: 'Idle'
  },
  {
    droneId: 'SKY-D1002',
    model: 'SkyScout X2',
    batteryLevel: 87,
    location: {
      type: 'Point',
      coordinates: [72.8777, 19.0760]  // Mumbai, India
    },
    status: 'Charging'
  },
  {
    droneId: 'SKY-D1003',
    model: 'SkyScout Pro',
    batteryLevel: 100,
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.6139]  // Delhi, India
    },
    status: 'Idle'
  }
];

// Sample data - Missions
const missions = [
  {
    name: 'Farm Survey Alpha',
    location: {
      type: 'Point',
      coordinates: [73.8567, 18.5204],
      address: 'Farm Area, Pune Rural, Maharashtra, India'
    },
    startTime: new Date('2025-04-15T10:00:00'),
    recurrenceType: 'Once',
    flightPath: [
      { type: 'Point', coordinates: [73.856, 18.520] },
      { type: 'Point', coordinates: [73.858, 18.522] },
      { type: 'Point', coordinates: [73.859, 18.524] },
      { type: 'Point', coordinates: [73.857, 18.523] }
    ],
    flightAltitude: 120, // meters
    patternType: 'Grid',
    sensorType: 'Multispectral',
    status: 'Scheduled'
  },
  {
    name: 'Urban Construction Survey',
    location: {
      type: 'Point',
      coordinates: [72.8777, 19.0760],
      address: 'Construction Site, Mumbai, Maharashtra, India'
    },
    startTime: new Date('2025-04-10T09:30:00'),
    recurrenceType: 'Weekly',
    flightPath: [
      { type: 'Point', coordinates: [72.8777, 19.0760] },
      { type: 'Point', coordinates: [72.8780, 19.0763] },
      { type: 'Point', coordinates: [72.8783, 19.0766] },
      { type: 'Point', coordinates: [72.8780, 19.0769] }
    ],
    flightAltitude: 80, // meters
    patternType: 'Crosshatch',
    sensorType: 'RGB',
    status: 'Completed'
  },
  {
    name: 'Solar Panel Inspection',
    location: {
      type: 'Point',
      coordinates: [77.2090, 28.6139],
      address: 'Solar Farm, Delhi NCR, India'
    },
    startTime: new Date('2025-04-12T14:00:00'),
    recurrenceType: 'Monthly',
    flightPath: [
      { type: 'Point', coordinates: [77.2090, 28.6139] },
      { type: 'Point', coordinates: [77.2093, 28.6142] },
      { type: 'Point', coordinates: [77.2096, 28.6145] },
      { type: 'Point', coordinates: [77.2093, 28.6148] }
    ],
    flightAltitude: 50, // meters
    patternType: 'Perimeter',
    sensorType: 'Thermal',
    status: 'In Progress'
  }
];

// Sample Reports
const reports = [
  {
    missionId: null, // Will be updated after missions are created
    droneId: null, // Will be updated after drones are created
    startTime: new Date('2025-04-10T09:30:00'),
    endTime: new Date('2025-04-10T10:45:00'),
    duration: 75, // minutes
    distance: 3200, // meters
    dataPointsCollected: 1450,
    surveyCoveragePercentage: 98,
    status: 'Completed'
  }
];

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Drone.deleteMany();
    await Mission.deleteMany();
    await Report.deleteMany();
    
    console.log('Data cleared...');

    // Create new data
    const createdUsers = await User.create(users);
    const createdDrones = await Drone.create(drones);
    
    // Set a drone to be assigned to a mission
    const missionWithDrone = { ...missions[2], assignedDroneId: createdDrones[2]._id };
    missions[2] = missionWithDrone;
    
    // Update the drone's status and mission
    await Drone.findByIdAndUpdate(
      createdDrones[2]._id, 
      { 
        status: 'In Mission',
        assignedMissionId: null // Will be updated when mission is created
      }
    );
    
    const createdMissions = await Mission.create(missions);
    
    // Update the drone with the mission ID
    await Drone.findByIdAndUpdate(
      createdDrones[2]._id,
      { assignedMissionId: createdMissions[2]._id }
    );
    
    // Update report with mission and drone IDs
    reports[0].missionId = createdMissions[1]._id;
    reports[0].droneId = createdDrones[1]._id;
    
    await Report.create(reports);
    
    console.log('Sample data imported!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Drone.deleteMany();
    await Mission.deleteMany();
    await Report.deleteMany();
    
    console.log('Data destroyed!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Determine which action to perform
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use -i to import data or -d to destroy data');
  process.exit();
}
