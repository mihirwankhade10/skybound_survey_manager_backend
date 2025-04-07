const Mission = require('../models/Mission');
const Drone = require('../models/Drone');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get first day of current month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Count missions for today
    const todayMissions = await Mission.countDocuments({
      startTime: { $gte: today }
    });
    
    // Count missions for current month
    const monthMissions = await Mission.countDocuments({
      startTime: { $gte: firstDayOfMonth }
    });
    
    // Count total missions
    const totalMissions = await Mission.countDocuments();
    
    // Count total drones
    const totalDrones = await Drone.countDocuments();
    
    // Count missions by status
    const completedMissions = await Mission.countDocuments({ status: 'Completed' });
    const ongoingMissions = await Mission.countDocuments({ status: 'In Progress' });
    const scheduledMissions = await Mission.countDocuments({ status: 'Scheduled' });
    const abortedMissions = await Mission.countDocuments({ status: 'Aborted' });
    
    res.status(200).json({
      success: true,
      data: {
        todayMissions,
        monthMissions,
        totalMissions,
        totalDrones,
        completedMissions,
        ongoingMissions,
        scheduledMissions,
        abortedMissions
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get recent missions (last 5)
// @route   GET /api/dashboard/recent
// @access  Private
exports.getRecentMissions = async (req, res) => {
  try {
    const missions = await Mission.find()
      .sort({ startTime: -1 })
      .limit(5)
      .populate('assignedDroneId', 'droneId model batteryLevel status');
    
    // Format the data for frontend consumption
    const formattedMissions = missions.map(mission => {
      return {
        id: mission._id,
        name: mission.name,
        startTime: mission.startTime,
        location: mission.location.address,
        status: mission.status,
        flightAltitude: mission.flightAltitude,
        sensorType: mission.sensorType,
        droneId: mission.assignedDroneId ? mission.assignedDroneId.droneId : null,
        droneModel: mission.assignedDroneId ? mission.assignedDroneId.model : null
      };
    });
    
    res.status(200).json({
      success: true,
      data: formattedMissions
    });
  } catch (err) {
    console.error('Error fetching recent missions:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get monthly mission activity
// @route   GET /api/dashboard/monthly-activity
// @access  Private
exports.getMonthlyActivity = async (req, res) => {
  try {
    // Get current year
    const currentYear = new Date().getFullYear();
    
    // Aggregate missions by month for the current year
    const monthlyData = await Mission.aggregate([
      {
        $match: {
          startTime: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$startTime" },
          completed: {
            $sum: {
              $cond: [{ $eq: ["$status", "Completed"] }, 1, 0]
            }
          },
          aborted: {
            $sum: {
              $cond: [{ $eq: ["$status", "Aborted"] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Map month numbers to month names
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    // Create an array with all months (even if no data)
    const monthlyActivity = months.map((month, index) => {
      const monthData = monthlyData.find(item => item._id === index + 1);
      return {
        month,
        completed: monthData ? monthData.completed : 0,
        aborted: monthData ? monthData.aborted : 0
      };
    });
    
    res.status(200).json({
      success: true,
      data: monthlyActivity
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
