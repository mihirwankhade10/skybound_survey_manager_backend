const Mission = require('../models/Mission');
const Drone = require('../models/Drone');

// @desc    Get all missions
// @route   GET /api/missions
// @access  Public
exports.getMissions = async (req, res) => {
  try {
    const missions = await Mission.find().populate('assignedDroneId');

    res.status(200).json({
      success: true,
      count: missions.length,
      data: missions
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single mission
// @route   GET /api/missions/:id
// @access  Public
exports.getMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id).populate('assignedDroneId');

    if (!mission) {
      return res.status(404).json({
        success: false,
        error: 'Mission not found'
      });
    }

    res.status(200).json({
      success: true,
      data: mission
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new mission
// @route   POST /api/missions
// @access  Private
exports.createMission = async (req, res) => {
  try {
    // Add user to req.body if auth is implemented
    // req.body.user = req.user.id;

    // Check if drone is assigned and update its status
    if (req.body.assignedDroneId) {
      const drone = await Drone.findById(req.body.assignedDroneId);
      
      if (!drone) {
        return res.status(404).json({
          success: false,
          error: 'Drone not found'
        });
      }
      
      // Update drone status if it's available
      if (drone.status === 'Idle' || drone.status === 'Charging') {
        drone.status = 'In Mission';
        drone.assignedMissionId = req.body._id;
        await drone.save();
      } else {
        return res.status(400).json({
          success: false,
          error: 'Drone is unavailable for mission assignment'
        });
      }
    }

    const mission = await Mission.create(req.body);

    res.status(201).json({
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

// @desc    Update mission
// @route   PUT /api/missions/:id
// @access  Private
exports.updateMission = async (req, res) => {
  try {
    let mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({
        success: false,
        error: 'Mission not found'
      });
    }

    // Handle drone reassignment if needed
    if (req.body.assignedDroneId && req.body.assignedDroneId !== mission.assignedDroneId) {
      // Release previous drone if one was assigned
      if (mission.assignedDroneId) {
        const previousDrone = await Drone.findById(mission.assignedDroneId);
        if (previousDrone) {
          previousDrone.status = 'Idle';
          previousDrone.assignedMissionId = null;
          await previousDrone.save();
        }
      }

      // Assign new drone
      const newDrone = await Drone.findById(req.body.assignedDroneId);
      if (!newDrone) {
        return res.status(404).json({
          success: false,
          error: 'New drone not found'
        });
      }
      
      if (newDrone.status === 'Idle' || newDrone.status === 'Charging') {
        newDrone.status = 'In Mission';
        newDrone.assignedMissionId = mission._id;
        await newDrone.save();
      } else {
        return res.status(400).json({
          success: false,
          error: 'New drone is unavailable for mission assignment'
        });
      }
    }

    mission = await Mission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

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

// @desc    Delete mission
// @route   DELETE /api/missions/:id
// @access  Private
exports.deleteMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({
        success: false,
        error: 'Mission not found'
      });
    }

    // Release assigned drone if any
    if (mission.assignedDroneId) {
      const drone = await Drone.findById(mission.assignedDroneId);
      if (drone) {
        drone.status = 'Idle';
        drone.assignedMissionId = null;
        await drone.save();
      }
    }

    await mission.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
