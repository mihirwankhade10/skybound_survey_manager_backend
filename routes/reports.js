const express = require('express');
const { 
  getReports, 
  getReportByMission,
  generateReport,
  downloadReport
} = require('../controllers/reportsController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/')
  .get(getReports);

router.route('/:missionId')
  .get(getReportByMission);

// Generate a new report for a mission
router.route('/generate/:missionId')
  .post(protect, generateReport);

// Download a report
router.route('/:reportId/download')
  .get(downloadReport);

module.exports = router;
