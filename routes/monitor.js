const express = require('express');
const { 
  getMissionStatus, 
  updateMissionStatus 
} = require('../controllers/monitor');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/:missionId')
  .get(getMissionStatus);

router.route('/:missionId/update')
  .post(protect, updateMissionStatus);

module.exports = router;
