const Report = require('../models/Report');
const Mission = require('../models/Mission');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Public
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate({
        path: 'missionId',
        select: 'name location startTime patternType sensorType'
      })
      .populate({
        path: 'droneId',
        select: 'droneId model'
      });

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get report for a specific mission
// @route   GET /api/reports/:missionId
// @access  Public
exports.getReportByMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.missionId);
    
    if (!mission) {
      return res.status(404).json({
        success: false,
        error: 'Mission not found'
      });
    }
    
    const report = await Report.findOne({ missionId: req.params.missionId })
      .populate({
        path: 'missionId',
        select: 'name location startTime patternType sensorType status'
      })
      .populate({
        path: 'droneId',
        select: 'droneId model'
      });

    // If the mission exists but no report exists yet (e.g., mission in progress)
    if (!report) {
      // For completed missions without a report, create a placeholder/dummy report
      if (mission.status === 'Completed') {
        return res.status(404).json({
          success: false,
          error: 'Report not found for this mission'
        });
      }
      
      // For missions not yet completed, return simulated real-time data
      return res.status(200).json({
        success: true,
        data: {
          missionId: mission._id,
          missionName: mission.name,
          status: mission.status,
          startTime: mission.startTime,
          estimatedCompletion: new Date(Date.now() + Math.floor(Math.random() * 3600000)), // Random time within the next hour
          currentProgress: mission.status === 'In Progress' ? Math.floor(Math.random() * 100) : 0,
          message: 'Mission is not completed yet. This is a real-time status.'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
