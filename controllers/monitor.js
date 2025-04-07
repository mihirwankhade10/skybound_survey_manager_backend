const Mission = require('../models/Mission');
const Drone = require('../models/Drone');

// @desc    Get mission status for monitoring
// @route   GET /api/monitor/:missionId
// @access  Public
exports.getMissionStatus = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.missionId).populate('assignedDroneId');

    if (!mission) {
      return res.status(404).json({
        success: false,
        error: 'Mission not found'
      });
    }

    // Simulated data for real-time monitoring (in a real app this would come from the drone)
    const monitoringData = {
      missionId: mission._id,
      name: mission.name,
      status: mission.status,
      currentLocation: mission.status === 'In Progress' ? 
        mission.flightPath[Math.floor(Math.random() * mission.flightPath.length)] : 
        mission.location,
      progress: mission.status === 'In Progress' ? 
        Math.floor(Math.random() * 100) : 
        (mission.status === 'Completed' ? 100 : 0),
      batteryLevel: mission.assignedDroneId ? mission.assignedDroneId.batteryLevel : null,
      droneInfo: mission.assignedDroneId ? {
        droneId: mission.assignedDroneId.droneId,
        model: mission.assignedDroneId.model,
        status: mission.assignedDroneId.status
      } : null,
      estimatedTimeRemaining: mission.status === 'In Progress' ? 
        Math.floor(Math.random() * 30) + 'min' : 
        'N/A',
      // Generate some random telemetry data
      telemetry: {
        altitude: mission.flightAltitude + (Math.random() * 2 - 1), // slight variation
        speed: Math.floor(Math.random() * 10) + 5, // 5-15 m/s
        heading: Math.floor(Math.random() * 360) // 0-359 degrees
      }
    };

    res.status(200).json({
      success: true,
      data: monitoringData
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update mission status (simulation)
// @route   POST /api/monitor/:missionId/update
// @access  Private
exports.updateMissionStatus = async (req, res) => {
  try {
    const { 
      status, 
      currentLocation, 
      progress, 
      batteryLevel 
    } = req.body;

    let mission = await Mission.findById(req.params.missionId);

    if (!mission) {
      return res.status(404).json({
        success: false,
        error: 'Mission not found'
      });
    }

    // Update mission status if provided
    if (status && ['Scheduled', 'In Progress', 'Completed', 'Aborted'].includes(status)) {
      mission.status = status;
    }

    // Update current location if provided
    if (currentLocation && currentLocation.coordinates) {
      // Add point to flight path if not already there
      const exists = mission.flightPath.some(point => 
        point.coordinates[0] === currentLocation.coordinates[0] && 
        point.coordinates[1] === currentLocation.coordinates[1]
      );
      
      if (!exists) {
        mission.flightPath.push({
          type: 'Point',
          coordinates: currentLocation.coordinates
        });
      }
    }

    await mission.save();

    // Update drone battery level if provided and drone is assigned
    if (batteryLevel !== undefined && mission.assignedDroneId) {
      await Drone.findByIdAndUpdate(
        mission.assignedDroneId,
        { batteryLevel },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      data: mission
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  }
};
