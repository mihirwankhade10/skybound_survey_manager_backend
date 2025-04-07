const Drone = require('../models/Drone');
const Mission = require('../models/Mission');

// @desc    Get all drones
// @route   GET /api/drones
// @access  Public
exports.getDrones = async (req, res) => {
  try {
    const drones = await Drone.find().populate('assignedMissionId');

    res.status(200).json({
      success: true,
      count: drones.length,
      data: drones
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single drone
// @route   GET /api/drones/:id
// @access  Public
exports.getDrone = async (req, res) => {
  try {
    const drone = await Drone.findById(req.params.id).populate('assignedMissionId');

    if (!drone) {
      return res.status(404).json({
        success: false,
        error: 'Drone not found'
      });
    }

    res.status(200).json({
      success: true,
      data: drone
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new drone
// @route   POST /api/drones
// @access  Private
exports.createDrone = async (req, res) => {
  try {
    const drone = await Drone.create(req.body);

    res.status(201).json({
      success: true,
      data: drone
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  }
};

// @desc    Update drone status
// @route   PUT /api/drones/:id/status
// @access  Private
exports.updateDroneStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a status'
      });
    }
    
    if (!['Idle', 'In Mission', 'Charging', 'Maintenance'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value'
      });
    }
    
    let drone = await Drone.findById(req.params.id);

    if (!drone) {
      return res.status(404).json({
        success: false,
        error: 'Drone not found'
      });
    }

    // Handle status change implications
    if (status !== drone.status) {
      // If changing from "In Mission" to another status
      if (drone.status === 'In Mission' && status !== 'In Mission') {
        // Update any assigned mission
        if (drone.assignedMissionId) {
          await Mission.findByIdAndUpdate(
            drone.assignedMissionId,
            { assignedDroneId: null, status: 'Scheduled' },
            { new: true }
          );
          drone.assignedMissionId = null;
        }
      }
      
      // If changing to "In Mission" from another status, require a mission ID
      if (status === 'In Mission' && drone.status !== 'In Mission') {
        if (!req.body.assignedMissionId) {
          return res.status(400).json({
            success: false,
            error: 'Mission ID is required when setting status to In Mission'
          });
        }
        
        // Verify the mission exists
        const mission = await Mission.findById(req.body.assignedMissionId);
        if (!mission) {
          return res.status(404).json({
            success: false,
            error: 'Mission not found'
          });
        }
        
        // Update mission with drone assignment
        await Mission.findByIdAndUpdate(
          req.body.assignedMissionId,
          { assignedDroneId: drone._id, status: 'In Progress' },
          { new: true }
        );
        
        drone.assignedMissionId = req.body.assignedMissionId;
      }
    }

    drone.status = status;
    await drone.save();

    res.status(200).json({
      success: true,
      data: drone
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  }
};
