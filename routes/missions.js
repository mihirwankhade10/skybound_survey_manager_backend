const express = require('express');
const { 
  getMissions, 
  getMission, 
  createMission, 
  updateMission, 
  deleteMission 
} = require('../controllers/missions');

const router = express.Router();

const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Missions
 *   description: Mission management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Mission:
 *       type: object
 *       required:
 *         - name
 *         - location
 *         - startTime
 *         - flightPath
 *         - flightAltitude
 *         - patternType
 *         - sensorType
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *           description: Mission name
 *         location:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [Point]
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *             address:
 *               type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         recurrenceType:
 *           type: string
 *           enum: [Once, Daily, Weekly, Monthly]
 *         flightPath:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [Point]
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *         flightAltitude:
 *           type: number
 *         patternType:
 *           type: string
 *           enum: [Grid, Crosshatch, Perimeter]
 *         sensorType:
 *           type: string
 *           enum: [RGB, Thermal, Multispectral, LiDAR]
 *         status:
 *           type: string
 *           enum: [Scheduled, In Progress, Completed, Aborted]
 *         assignedDroneId:
 *           type: string
 *           description: Reference to a Drone
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/missions:
 *   get:
 *     summary: Get all missions
 *     tags: [Missions]
 *     responses:
 *       200:
 *         description: List of all missions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Mission'
 *   post:
 *     summary: Create a new mission
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mission'
 *     responses:
 *       201:
 *         description: Mission created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 */
router.route('/')
  .get(getMissions)
  .post(protect, createMission);

/**
 * @swagger
 * /api/missions/{id}:
 *   get:
 *     summary: Get a single mission
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Mission ID
 *     responses:
 *       200:
 *         description: Mission details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Mission'
 *       404:
 *         description: Mission not found
 *   put:
 *     summary: Update a mission
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Mission ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mission'
 *     responses:
 *       200:
 *         description: Mission updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Mission not found
 *   delete:
 *     summary: Delete a mission
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Mission ID
 *     responses:
 *       200:
 *         description: Mission deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Mission not found
 */
router.route('/:id')
  .get(getMission)
  .put(protect, updateMission)
  .delete(protect, deleteMission);

module.exports = router;
