import express from 'express';
import { getJobSeekerDashboard, getEmployeeDashboard } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/jobseeker', authenticateToken, getJobSeekerDashboard);
router.get('/employee', authenticateToken, getEmployeeDashboard);

export default router;