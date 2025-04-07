const express = require('express');
const { 
  getDrones, 
  getDrone, 
  createDrone, 
  updateDroneStatus,
  getAvailableDrones
} = require('../controllers/drones');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/')
  .get(getDrones)
  .post(protect, createDrone);

router.route('/available')
  .get(protect, getAvailableDrones);

router.route('/:id')
  .get(getDrone);

router.route('/:id/status')
  .put(protect, updateDroneStatus);

module.exports = router;
