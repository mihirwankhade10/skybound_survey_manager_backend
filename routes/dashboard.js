const express = require('express');
const { getStats, getRecentMissions, getMonthlyActivity } = require('../controllers/dashboard');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard data endpoints
 */

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     todayMissions:
 *                       type: number
 *                     monthMissions:
 *                       type: number
 *                     totalMissions:
 *                       type: number
 *                     totalDrones:
 *                       type: number
 *                     completedMissions:
 *                       type: number
 *                     ongoingMissions:
 *                       type: number
 *                     scheduledMissions:
 *                       type: number
 *                     abortedMissions:
 *                       type: number
 *       401:
 *         description: Not authorized
 */
router.get('/stats', protect, getStats);

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Get recent missions
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent missions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Not authorized
 */
router.get('/recent', protect, getRecentMissions);

/**
 * @swagger
 * /api/dashboard/monthly-activity:
 *   get:
 *     summary: Get monthly mission activity
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly activity data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                       completed:
 *                         type: number
 *                       aborted:
 *                         type: number
 *       401:
 *         description: Not authorized
 */
router.get('/monthly-activity', protect, getMonthlyActivity);

module.exports = router;
