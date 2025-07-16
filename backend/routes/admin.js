import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getDashboardStats,
  getAllEmployees,
  getAllJobSeekers,
  getAllJobs,
  toggleUserStatus,
  deleteJob,
  updateJob,
  getAllCompanies,
  getCompanyById,
  toggleCompanyStatus,
  getAnalytics
} from '../controllers/adminController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard',auth("admin"), getDashboardStats);

router.get('/employees', auth("admin"), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim()
], getAllEmployees);

router.get('/job-seekers', auth("admin"), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim()
], getAllJobSeekers);

router.get('/jobs', auth("admin"), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim(),
  query('status').optional().isIn(['Active', 'Inactive', 'Closed'])
], getAllJobs);

router.put('/users/:userType/:userId/status', auth("admin"), [
  param('userType').isIn(['employee', 'jobseeker']),
  param('userId').isUUID(),
  body('isActive').isBoolean()
], toggleUserStatus);

router.delete('/jobs/:jobId', auth("admin"), [
  param('jobId').isUUID()
], deleteJob);

router.put('/jobs/:jobId', auth("admin"), [
  param('jobId').isUUID()
], updateJob);

router.get('/companies', auth("admin"), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim(),
  query('status').optional().isIn(['active', 'inactive'])
], getAllCompanies);

router.get('/companies/:companyId', auth("admin"), [
  param('companyId').isUUID()
], getCompanyById);

router.put('/companies/:companyId/status', auth("admin"), [
  param('companyId').isUUID(),
  body('isActive').isBoolean()
], toggleCompanyStatus);

router.get('/analytics', auth("admin"), [
  query('period').optional().isIn(['7', '30', '90', '365'])
], getAnalytics);

export default router;
