const Report = require('../models/Report');
const Mission = require('../models/Mission');
const Drone = require('../models/Drone');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Public
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate({
        path: 'missionId',
        select: 'name location startTime status sensorType flightAltitude'
      })
      .populate({
        path: 'droneId',
        select: 'droneId model'
      });

    // Format the data for frontend consumption
    const formattedReports = reports.map(report => {
      return {
        id: report._id,
        missionName: report.missionId ? report.missionId.name : 'Unknown Mission',
        missionId: report.missionId ? report.missionId._id : null,
        location: report.missionId ? report.missionId.location.address : 'Unknown Location',
        droneId: report.droneId ? report.droneId.droneId : 'Unknown Drone',
        droneModel: report.droneId ? report.droneId.model : 'Unknown Model',
        startTime: report.startTime,
        endTime: report.endTime,
        duration: report.duration,
        distance: report.distance,
        dataPointsCollected: report.dataPointsCollected,
        surveyCoveragePercentage: report.surveyCoveragePercentage,
        status: report.status,
        createdAt: report.createdAt
      };
    });

    res.status(200).json({
      success: true,
      count: formattedReports.length,
      data: formattedReports
    });
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get report by mission ID
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
        select: 'name location startTime status sensorType flightAltitude'
      })
      .populate({
        path: 'droneId',
        select: 'droneId model'
      });
    
    if (!report) {
      // If no report exists, create a placeholder response
      return res.status(200).json({
        success: true,
        data: {
          missionName: mission.name,
          missionId: mission._id,
          location: mission.location.address,
          status: 'No Report Available',
          message: 'No report has been generated for this mission yet.'
        }
      });
    }
    
    // Format the report data
    const formattedReport = {
      id: report._id,
      missionName: report.missionId ? report.missionId.name : 'Unknown Mission',
      missionId: report.missionId ? report.missionId._id : null,
      location: report.missionId ? report.missionId.location.address : 'Unknown Location',
      droneId: report.droneId ? report.droneId.droneId : 'Unknown Drone',
      droneModel: report.droneId ? report.droneId.model : 'Unknown Model',
      startTime: report.startTime,
      endTime: report.endTime,
      duration: report.duration,
      distance: report.distance,
      dataPointsCollected: report.dataPointsCollected,
      surveyCoveragePercentage: report.surveyCoveragePercentage,
      status: report.status,
      createdAt: report.createdAt,
      // Add additional report details as needed
      sensorType: mission.sensorType,
      flightAltitude: mission.flightAltitude
    };
    
    res.status(200).json({
      success: true,
      data: formattedReport
    });
  } catch (err) {
    console.error('Error fetching report by mission:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Generate a new report for a mission
// @route   POST /api/reports/generate/:missionId
// @access  Private
exports.generateReport = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.missionId);
    
    if (!mission) {
      return res.status(404).json({
        success: false,
        error: 'Mission not found'
      });
    }
    
    // Check if mission is completed
    if (mission.status !== 'Completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot generate report for a mission that is not completed'
      });
    }
    
    // Check if report already exists
    const existingReport = await Report.findOne({ missionId: mission._id });
    
    if (existingReport) {
      return res.status(400).json({
        success: false,
        error: 'A report already exists for this mission'
      });
    }
    
    // Calculate random values for report metrics
    const startTime = new Date(mission.startTime);
    const duration = Math.floor(Math.random() * 60) + 30; // 30-90 minutes
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
    const distance = Math.floor(Math.random() * 5000) + 1000; // 1-6 km in meters
    const dataPoints = Math.floor(Math.random() * 5000) + 1000; // 1000-6000 data points
    const coverage = Math.floor(Math.random() * 30) + 70; // 70-100% coverage
    
    // Create a new report
    const newReport = await Report.create({
      missionId: mission._id,
      droneId: mission.assignedDroneId,
      startTime,
      endTime,
      duration,
      distance,
      dataPointsCollected: dataPoints,
      surveyCoveragePercentage: coverage,
      status: Math.random() > 0.2 ? 'Completed' : 'Partial' // 80% completed, 20% partial
    });
    
    res.status(201).json({
      success: true,
      data: newReport
    });
  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Download a report (simulated)
// @route   GET /api/reports/:reportId/download
// @access  Public
exports.downloadReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId)
      .populate('missionId')
      .populate('droneId');
    
    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }
    
    // In a real application, this would generate a PDF or other document
    // For this simulation, we'll just return a success message
    res.status(200).json({
      success: true,
      message: 'Report download initiated',
      data: {
        reportId: report._id,
        missionName: report.missionId ? report.missionId.name : 'Unknown Mission',
        format: 'PDF',
        size: '2.4 MB',
        downloadUrl: `/api/reports/${report._id}/download`
      }
    });
  } catch (err) {
    console.error('Error downloading report:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
