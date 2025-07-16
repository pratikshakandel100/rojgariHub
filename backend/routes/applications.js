import express from 'express';
import { body, param, query } from 'express-validator';
import {
  applyForJob,
  getJobSeekerApplications,
  getEmployeeApplications,
  updateApplicationStatus,
  withdrawApplication
} from '../controllers/applicationController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/apply', auth('jobseeker'), [
  body('jobId').isUUID(),
  body('coverLetter').optional().trim().isLength({ max: 1000 }),
  body('resume').optional().isURL()
], applyForJob);

router.get('/job-seeker/my-applications', auth('jobseeker'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['Pending', 'Reviewed', 'Accepted', 'Rejected', 'Withdrawn', 'Shortlisted', 'Hired'])
], getJobSeekerApplications);

router.get('/employee/received-applications', auth('employee'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['Pending', 'Reviewed', 'Accepted', 'Rejected', 'Withdrawn', 'Shortlisted', 'Hired']),
  query('jobId').optional().isUUID()
], getEmployeeApplications);

router.put('/:id/status', auth('employee'), [
  param('id').isUUID(),
  body('status').isIn(['Pending', 'Reviewed', 'Accepted', 'Rejected', 'Withdrawn', 'Shortlisted', 'Hired']),
  body('notes').optional().trim().isLength({ max: 500 })
], updateApplicationStatus);

router.delete('/:id/withdraw', auth('jobseeker'), [
  param('id').isUUID()
], withdrawApplication);

export default router;