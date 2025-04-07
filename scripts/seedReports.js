const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Mission = require('../models/Mission');
const Report = require('../models/Report');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Seed reports
const seedReports = async () => {
  try {
    // Clear existing reports
    await Report.deleteMany();
    console.log('Cleared existing report data');
    
    // Get completed missions
    const completedMissions = await Mission.find({ status: 'Completed' });
    
    if (completedMissions.length === 0) {
      console.log('No completed missions found. Please run seedMissions.js first.');
      process.exit(1);
    }
    
    // Create reports for each completed mission
    const reports = [];
    
    for (const mission of completedMissions) {
      // Calculate random values for report metrics
      const startTime = new Date(mission.startTime);
      const duration = Math.floor(Math.random() * 60) + 30; // 30-90 minutes
      const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
      const distance = Math.floor(Math.random() * 5000) + 1000; // 1-6 km in meters
      const dataPoints = Math.floor(Math.random() * 5000) + 1000; // 1000-6000 data points
      const coverage = Math.floor(Math.random() * 30) + 70; // 70-100% coverage
      
      reports.push({
        missionId: mission._id,
        droneId: mission.assignedDroneId || completedMissions[0].assignedDroneId, // Use first mission's drone if none assigned
        startTime,
        endTime,
        duration,
        distance,
        dataPointsCollected: dataPoints,
        surveyCoveragePercentage: coverage,
        status: Math.random() > 0.2 ? 'Completed' : 'Partial' // 80% completed, 20% partial
      });
    }
    
    // Insert reports
    await Report.insertMany(reports);
    
    console.log(`Successfully added ${reports.length} reports to the database`);
    
    // Display report info
    console.log('\nAvailable reports:');
    for (let i = 0; i < reports.length; i++) {
      const mission = completedMissions[i];
      console.log(`- Report for "${mission.name}" (Coverage: ${reports[i].surveyCoveragePercentage}%, Status: ${reports[i].status})`);
    }
    
    mongoose.connection.close();
    
  } catch (err) {
    console.error('Error seeding reports:', err);
    process.exit(1);
  }
};

// Run the seed function
console.log('MongoDB Connected for seeding reports...');
seedReports();
