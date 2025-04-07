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
    console.error('Error fetching mission status:', err);
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
    console.error('Error updating mission status:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  }
};

// @desc    Get drone telemetry data
// @route   GET /api/monitor/drone/:droneId/telemetry
// @access  Public
exports.getDroneTelemetry = async (req, res) => {
  try {
    const drone = await Drone.findOne({ droneId: req.params.droneId });

    if (!drone) {
      return res.status(404).json({
        success: false,
        error: 'Drone not found'
      });
    }

    // Find active mission for this drone
    const activeMission = await Mission.findOne({ 
      assignedDroneId: drone._id,
      status: 'In Progress'
    });

    // Generate simulated telemetry data
    const telemetryData = {
      droneId: drone.droneId,
      batteryLevel: drone.batteryLevel,
      status: drone.status,
      // Simulated data
      altitude: activeMission ? activeMission.flightAltitude + (Math.random() * 2 - 1) : 0,
      speed: Math.floor(Math.random() * 10) + 5, // 5-15 m/s
      heading: Math.floor(Math.random() * 360), // 0-359 degrees
      coordinates: drone.location.coordinates,
      signalStrength: Math.floor(Math.random() * 30) + 70, // 70-100%
      temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
      humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
      windSpeed: Math.floor(Math.random() * 10) + 2, // 2-12 m/s
      windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
      missionProgress: activeMission ? Math.floor(Math.random() * 100) : 0,
      estimatedTimeRemaining: activeMission ? Math.floor(Math.random() * 30) + 'min' : 'N/A'
    };

    res.status(200).json({
      success: true,
      data: telemetryData
    });
  } catch (err) {
    console.error('Error fetching drone telemetry:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
