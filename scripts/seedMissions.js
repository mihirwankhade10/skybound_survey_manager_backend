const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Mission = require('../models/Mission');
const Drone = require('../models/Drone');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Function to get random drone IDs
const getRandomDroneIds = async (count) => {
  try {
    // Get available drones (Idle or Charging)
    const drones = await Drone.find({ 
      status: { $in: ['Idle', 'Charging'] } 
    }).select('_id');
    
    if (drones.length === 0) {
      console.log('No available drones found. Please run seedDrones.js first.');
      process.exit(1);
    }
    
    // Shuffle and take the requested count
    const shuffled = [...drones].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length)).map(drone => drone._id);
  } catch (err) {
    console.error('Error getting drone IDs:', err);
    process.exit(1);
  }
};

// Seed missions
const seedMissions = async () => {
  try {
    // Clear existing missions
    await Mission.deleteMany();
    console.log('Cleared existing mission data');
    
    // Get some drone IDs for assignment
    const droneIds = await getRandomDroneIds(5);
    
    // Create missions with different statuses
    const missions = [
      // Scheduled missions
      {
        name: 'Solar Farm Inspection',
        location: {
          type: 'Point',
          coordinates: [77.6010, 12.9780], // Bangalore
          address: 'Solar Farm, Bangalore, India'
        },
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        recurrenceType: 'Once',
        flightPath: [
          { type: 'Point', coordinates: [77.6010, 12.9780] },
          { type: 'Point', coordinates: [77.6020, 12.9790] },
          { type: 'Point', coordinates: [77.6030, 12.9785] },
          { type: 'Point', coordinates: [77.6015, 12.9775] }
        ],
        flightAltitude: 50,
        patternType: 'Grid',
        sensorType: 'RGB',
        status: 'Scheduled',
        assignedDroneId: droneIds[0]
      },
      {
        name: 'Construction Site Mapping',
        location: {
          type: 'Point',
          coordinates: [77.5946, 12.9716], // Bangalore
          address: 'Construction Site, Bangalore, India'
        },
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        recurrenceType: 'Weekly',
        flightPath: [
          { type: 'Point', coordinates: [77.5946, 12.9716] },
          { type: 'Point', coordinates: [77.5956, 12.9726] },
          { type: 'Point', coordinates: [77.5966, 12.9721] },
          { type: 'Point', coordinates: [77.5951, 12.9711] }
        ],
        flightAltitude: 40,
        patternType: 'Crosshatch',
        sensorType: 'LiDAR',
        status: 'Scheduled',
        assignedDroneId: droneIds[1]
      },
      
      // In Progress missions
      {
        name: 'Agricultural Field Survey',
        location: {
          type: 'Point',
          coordinates: [77.5800, 12.9500], // Bangalore
          address: 'Agricultural Field, Bangalore, India'
        },
        startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        recurrenceType: 'Monthly',
        flightPath: [
          { type: 'Point', coordinates: [77.5800, 12.9500] },
          { type: 'Point', coordinates: [77.5810, 12.9510] },
          { type: 'Point', coordinates: [77.5820, 12.9505] },
          { type: 'Point', coordinates: [77.5805, 12.9495] }
        ],
        flightAltitude: 30,
        patternType: 'Grid',
        sensorType: 'Multispectral',
        status: 'In Progress',
        assignedDroneId: droneIds[2]
      },
      
      // Completed missions
      {
        name: 'Roof Inspection',
        location: {
          type: 'Point',
          coordinates: [77.6100, 12.9800], // Bangalore
          address: 'Commercial Building, Bangalore, India'
        },
        startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        recurrenceType: 'Once',
        flightPath: [
          { type: 'Point', coordinates: [77.6100, 12.9800] },
          { type: 'Point', coordinates: [77.6110, 12.9810] },
          { type: 'Point', coordinates: [77.6120, 12.9805] },
          { type: 'Point', coordinates: [77.6105, 12.9795] }
        ],
        flightAltitude: 20,
        patternType: 'Perimeter',
        sensorType: 'RGB',
        status: 'Completed',
        assignedDroneId: droneIds[3]
      },
      {
        name: 'Power Line Inspection',
        location: {
          type: 'Point',
          coordinates: [77.5700, 12.9400], // Bangalore
          address: 'Power Station, Bangalore, India'
        },
        startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        recurrenceType: 'Monthly',
        flightPath: [
          { type: 'Point', coordinates: [77.5700, 12.9400] },
          { type: 'Point', coordinates: [77.5710, 12.9410] },
          { type: 'Point', coordinates: [77.5720, 12.9405] },
          { type: 'Point', coordinates: [77.5705, 12.9395] }
        ],
        flightAltitude: 35,
        patternType: 'Perimeter',
        sensorType: 'Thermal',
        status: 'Completed',
        assignedDroneId: droneIds[4]
      },
      {
        name: 'Wildlife Monitoring',
        location: {
          type: 'Point',
          coordinates: [77.5850, 12.9550], // Bangalore
          address: 'Wildlife Sanctuary, Bangalore, India'
        },
        startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        recurrenceType: 'Weekly',
        flightPath: [
          { type: 'Point', coordinates: [77.5850, 12.9550] },
          { type: 'Point', coordinates: [77.5860, 12.9560] },
          { type: 'Point', coordinates: [77.5870, 12.9555] },
          { type: 'Point', coordinates: [77.5855, 12.9545] }
        ],
        flightAltitude: 60,
        patternType: 'Grid',
        sensorType: 'Thermal',
        status: 'Completed',
        assignedDroneId: null // No drone assigned (for testing)
      },
      
      // Aborted mission
      {
        name: 'Forest Fire Assessment',
        location: {
          type: 'Point',
          coordinates: [77.6050, 12.9650], // Bangalore
          address: 'Forest Reserve, Bangalore, India'
        },
        startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        recurrenceType: 'Once',
        flightPath: [
          { type: 'Point', coordinates: [77.6050, 12.9650] },
          { type: 'Point', coordinates: [77.6060, 12.9660] },
          { type: 'Point', coordinates: [77.6070, 12.9655] },
          { type: 'Point', coordinates: [77.6055, 12.9645] }
        ],
        flightAltitude: 70,
        patternType: 'Crosshatch',
        sensorType: 'Thermal',
        status: 'Aborted',
        assignedDroneId: null // No drone assigned (for testing)
      }
    ];
    
    // Insert missions
    await Mission.insertMany(missions);
    
    console.log(`Successfully added ${missions.length} missions to the database`);
    
    // Display mission names and statuses
    console.log('\nAvailable missions:');
    missions.forEach(mission => {
      console.log(`- ${mission.name} (Status: ${mission.status})`);
    });
    
    mongoose.connection.close();
    
  } catch (err) {
    console.error('Error seeding missions:', err);
    process.exit(1);
  }
};

// Run the seed function
console.log('MongoDB Connected for seeding missions...');
seedMissions();
