const express = require('express');
const { 
  getMissionStatus, 
  updateMissionStatus,
  getDroneTelemetry
} = require('../controllers/monitorController');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/:missionId')
  .get(getMissionStatus);

router.route('/:missionId/update')
  .post(protect, updateMissionStatus);

// Route for drone telemetry data
router.route('/drone/:droneId/telemetry')
  .get(getDroneTelemetry);

module.exports = router;
