import express from 'express';
import { body, param, query } from 'express-validator';
import {
  createBoost,
  getAllBoosts,
  getEmployeeBoosts,
  approveBoost,
  rejectBoost,
  getFinancialAnalytics,
  updateBoostStats,
  getBoostById,
  processRefund
} from '../controllers/boostController.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Create a new boost request (Employee only)
router.post('/create',
  auth('employee'),
  [
    body('jobId')
      .notEmpty()
      .withMessage('Job ID is required')
      .isUUID()
      .withMessage('Invalid job ID format'),
    body('boostPlanId')
      .notEmpty()
      .withMessage('Boost plan ID is required')
      .isUUID()
      .withMessage('Boost plan ID must be a valid UUID'),
    body('paymentMethod')
      .optional()
      .isString()
      .withMessage('Payment method must be a string')
  ],
  validateRequest,
  createBoost
);

// Get all boosts (Admin only)
router.get('/admin/all',
  adminAuth,
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('status')
      .optional()
      .isIn(['Pending', 'Active', 'Expired', 'Rejected', 'Approved'])
      .withMessage('Invalid status'),
    query('search')
      .optional()
      .isString()
      .withMessage('Search must be a string')
  ],
  validateRequest,
  getAllBoosts
);

// Get boosts for current employee
router.get('/my-boosts',
  auth('employee'),
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('status')
      .optional()
      .isIn(['Pending', 'Active', 'Expired', 'Rejected', 'Approved'])
      .withMessage('Invalid status')
  ],
  validateRequest,
  getEmployeeBoosts
);

// Get boost by ID
router.get('/:id',
  auth('employee'),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid boost ID format')
  ],
  validateRequest,
  getBoostById
);

// Approve boost (Admin only)
router.put('/:id/approve',
  adminAuth,
  [
    param('id')
      .isUUID()
      .withMessage('Invalid boost ID format')
  ],
  validateRequest,
  approveBoost
);

// Reject boost (Admin only)
router.put('/:id/reject',
  adminAuth,
  [
    param('id')
      .isUUID()
      .withMessage('Invalid boost ID format'),
    body('rejectionReason')
      .notEmpty()
      .withMessage('Rejection reason is required')
      .isLength({ min: 10, max: 500 })
      .withMessage('Rejection reason must be between 10 and 500 characters')
  ],
  validateRequest,
  rejectBoost
);

// Process refund (Admin only)
router.put('/:id/refund',
  adminAuth,
  [
    param('id')
      .isUUID()
      .withMessage('Invalid boost ID format'),
    body('refundReason')
      .optional()
      .isString()
      .withMessage('Refund reason must be a string')
  ],
  validateRequest,
  processRefund
);

// Update boost statistics
router.put('/:id/stats',
  auth('employee'),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid boost ID format'),
    body('views')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Views must be a non-negative integer'),
    body('clickRate')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('Click rate must be between 0 and 100')
  ],
  validateRequest,
  updateBoostStats
);

// Get financial analytics (Admin only)
router.get('/admin/analytics',
  adminAuth,
  [
    query('period')
      .optional()
      .isInt({ min: 1, max: 365 })
      .withMessage('Period must be between 1 and 365 days')
  ],
  validateRequest,
  getFinancialAnalytics
);

export default router;