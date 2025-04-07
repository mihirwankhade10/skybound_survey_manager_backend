const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Drone = require('../models/Drone');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected for seeding...'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Sample drone data
const drones = [
  {
    droneId: 'DJI-001',
    model: 'DJI Mavic 3',
    manufacturer: 'DJI',
    serialNumber: 'MAV3001234',
    purchaseDate: new Date('2024-01-15'),
    lastMaintenanceDate: new Date('2024-03-10'),
    status: 'Idle',
    batteryLevel: 95,
    maxFlightTime: 46, // minutes
    maxSpeed: 68, // km/h
    maxAltitude: 6000, // meters
    location: {
      type: 'Point',
      coordinates: [77.5946, 12.9716] // Bangalore coordinates
    },
    cameraSpecs: {
      resolution: '4K',
      focalLength: '24mm',
      sensorType: 'CMOS'
    },
    weight: 895, // grams
    dimensions: {
      length: 347,
      width: 283,
      height: 107
    }, // mm
    assignedMissionId: null
  },
  {
    droneId: 'DJI-002',
    model: 'DJI Phantom 4 Pro',
    manufacturer: 'DJI',
    serialNumber: 'PH4P002345',
    purchaseDate: new Date('2023-11-20'),
    lastMaintenanceDate: new Date('2024-02-15'),
    status: 'Idle',
    batteryLevel: 88,
    maxFlightTime: 30, // minutes
    maxSpeed: 72, // km/h
    maxAltitude: 6000, // meters
    location: {
      type: 'Point',
      coordinates: [77.6010, 12.9766] // Bangalore coordinates
    },
    cameraSpecs: {
      resolution: '4K',
      focalLength: '20mm',
      sensorType: 'CMOS'
    },
    weight: 1380, // grams
    dimensions: {
      length: 350,
      width: 350,
      height: 210
    }, // mm
    assignedMissionId: null
  },
  {
    droneId: 'AUS-001',
    model: 'Autel EVO II Pro',
    manufacturer: 'Autel Robotics',
    serialNumber: 'AEV2P003456',
    purchaseDate: new Date('2024-02-05'),
    lastMaintenanceDate: new Date('2024-03-25'),
    status: 'Idle',
    batteryLevel: 92,
    maxFlightTime: 40, // minutes
    maxSpeed: 72, // km/h
    maxAltitude: 7000, // meters
    location: {
      type: 'Point',
      coordinates: [77.5800, 12.9650] // Bangalore coordinates
    },
    cameraSpecs: {
      resolution: '6K',
      focalLength: '28.5mm',
      sensorType: 'CMOS'
    },
    weight: 1191, // grams
    dimensions: {
      length: 338,
      width: 303,
      height: 105
    }, // mm
    assignedMissionId: null
  },
  {
    droneId: 'SKY-001',
    model: 'Skydio 2+',
    manufacturer: 'Skydio',
    serialNumber: 'SKY2P004567',
    purchaseDate: new Date('2023-12-10'),
    lastMaintenanceDate: new Date('2024-03-05'),
    status: 'Charging',
    batteryLevel: 45,
    maxFlightTime: 27, // minutes
    maxSpeed: 58, // km/h
    maxAltitude: 4500, // meters
    location: {
      type: 'Point',
      coordinates: [77.5880, 12.9700] // Bangalore coordinates
    },
    cameraSpecs: {
      resolution: '4K',
      focalLength: '20mm',
      sensorType: 'CMOS'
    },
    weight: 800, // grams
    dimensions: {
      length: 223,
      width: 273,
      height: 74
    }, // mm
    assignedMissionId: null
  },
  {
    droneId: 'PAR-001',
    model: 'Parrot Anafi USA',
    manufacturer: 'Parrot',
    serialNumber: 'PAUS005678',
    purchaseDate: new Date('2023-10-15'),
    lastMaintenanceDate: new Date('2024-02-20'),
    status: 'Idle',
    batteryLevel: 85,
    maxFlightTime: 32, // minutes
    maxSpeed: 55, // km/h
    maxAltitude: 4500, // meters
    location: {
      type: 'Point',
      coordinates: [77.6100, 12.9550] // Bangalore coordinates
    },
    cameraSpecs: {
      resolution: '4K',
      focalLength: '24mm',
      sensorType: 'CMOS'
    },
    weight: 500, // grams
    dimensions: {
      length: 218,
      width: 183,
      height: 69
    }, // mm
    assignedMissionId: null
  },
  {
    droneId: 'YUN-001',
    model: 'Yuneec H520',
    manufacturer: 'Yuneec',
    serialNumber: 'YUH52006789',
    purchaseDate: new Date('2023-09-20'),
    lastMaintenanceDate: new Date('2024-01-15'),
    status: 'Maintenance',
    batteryLevel: 0,
    maxFlightTime: 28, // minutes
    maxSpeed: 70, // km/h
    maxAltitude: 5000, // meters
    location: {
      type: 'Point',
      coordinates: [77.5930, 12.9780] // Bangalore coordinates
    },
    cameraSpecs: {
      resolution: '4K',
      focalLength: '23mm',
      sensorType: 'CMOS'
    },
    weight: 1645, // grams
    dimensions: {
      length: 520,
      width: 457,
      height: 310
    }, // mm
    assignedMissionId: null
  },
  {
    droneId: 'DJI-003',
    model: 'DJI Matrice 300 RTK',
    manufacturer: 'DJI',
    serialNumber: 'DJM300007890',
    purchaseDate: new Date('2023-08-10'),
    lastMaintenanceDate: new Date('2024-03-01'),
    status: 'Idle',
    batteryLevel: 90,
    maxFlightTime: 55, // minutes
    maxSpeed: 83, // km/h
    maxAltitude: 7000, // meters
    location: {
      type: 'Point',
      coordinates: [77.6050, 12.9720] // Bangalore coordinates
    },
    cameraSpecs: {
      resolution: '4K',
      focalLength: '24mm',
      sensorType: 'CMOS'
    },
    weight: 6300, // grams
    dimensions: {
      length: 810,
      width: 670,
      height: 430
    }, // mm
    assignedMissionId: null
  },
  {
    droneId: 'AUS-002',
    model: 'Autel Dragonfish',
    manufacturer: 'Autel Robotics',
    serialNumber: 'AUDF008901',
    purchaseDate: new Date('2024-01-25'),
    lastMaintenanceDate: new Date('2024-03-20'),
    status: 'Idle',
    batteryLevel: 97,
    maxFlightTime: 120, // minutes
    maxSpeed: 108, // km/h
    maxAltitude: 6000, // meters
    location: {
      type: 'Point',
      coordinates: [77.5990, 12.9690] // Bangalore coordinates
    },
    cameraSpecs: {
      resolution: '4K',
      focalLength: '28mm',
      sensorType: 'CMOS'
    },
    weight: 3900, // grams
    dimensions: {
      length: 1340,
      width: 570,
      height: 420
    }, // mm
    assignedMissionId: null
  }
];

// Function to seed drones
const seedDrones = async () => {
  try {
    // Clear existing drones
    await Drone.deleteMany({});
    console.log('Cleared existing drone data');

    // Insert new drones
    const createdDrones = await Drone.insertMany(drones);
    console.log(`Successfully added ${createdDrones.length} drones to the database`);
    
    // Display the added drones
    console.log('\nAvailable drones:');
    createdDrones.forEach(drone => {
      console.log(`- ${drone.droneId}: ${drone.model} (Status: ${drone.status})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding drone data:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDrones();
