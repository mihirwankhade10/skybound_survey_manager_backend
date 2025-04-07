const express = require('express');
const { 
  getReports, 
  getReportByMission 
} = require('../controllers/reports');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/')
  .get(getReports);

router.route('/:missionId')
  .get(getReportByMission);

module.exports = router;
