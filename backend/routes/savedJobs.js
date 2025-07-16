import express from 'express';
import { body, param, query } from 'express-validator';
import {
  saveJob,
  unsaveJob,
  getSavedJobs,
  checkIfJobSaved
} from '../controllers/savedJobController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/save', auth('jobseeker'), [
  body('jobId').isUUID().withMessage('Valid job ID is required')
], saveJob);

router.delete('/unsave/:jobId', auth('jobseeker'), [
  param('jobId').isUUID().withMessage('Valid job ID is required')
], unsaveJob);

router.get('/my-saved-jobs', auth('jobseeker'), [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], getSavedJobs);

router.get('/check/:jobId', auth('jobseeker'), [
  param('jobId').isUUID().withMessage('Valid job ID is required')
], checkIfJobSaved);

export default router;