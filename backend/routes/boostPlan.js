import express from 'express';
import { body, param } from 'express-validator';
import {
  createBoostPlan,
  getAllBoostPlans,
  getBoostPlanById,
  updateBoostPlan,
  deleteBoostPlan,
  toggleBoostPlanStatus,
  getActiveBoostPlansForEmployees
} from '../controllers/boostPlanController.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

router.get('/active', getActiveBoostPlansForEmployees);

router.post('/create',
  adminAuth,
  [
    body('name')
      .notEmpty()
      .withMessage('Plan name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Plan name must be between 2 and 100 characters'),
    body('type')
      .isIn(['Basic', 'Standard', 'Premium', 'Enterprise'])
      .withMessage('Invalid boost type'),
    body('duration')
      .isInt({ min: 1, max: 365 })
      .withMessage('Duration must be between 1 and 365 days'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('visibilityMultiplier')
      .optional()
      .isFloat({ min: 1.0, max: 10.0 })
      .withMessage('Visibility multiplier must be between 1.0 and 10.0'),
    body('features')
      .optional()
      .isArray()
      .withMessage('Features must be an array'),
    body('sortOrder')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Sort order must be a non-negative integer')
  ],
  validateRequest,
  createBoostPlan
);

router.get('/admin/all',
  adminAuth,
  getAllBoostPlans
);

router.get('/:id',
  adminAuth,
  [
    param('id').isUUID().withMessage('Invalid boost plan ID')
  ],
  validateRequest,
  getBoostPlanById
);

router.put('/:id',
  adminAuth,
  [
    param('id').isUUID().withMessage('Invalid boost plan ID'),
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Plan name must be between 2 and 100 characters'),
    body('type')
      .optional()
      .isIn(['Basic', 'Standard', 'Premium', 'Enterprise'])
      .withMessage('Invalid boost type'),
    body('duration')
      .optional()
      .isInt({ min: 1, max: 365 })
      .withMessage('Duration must be between 1 and 365 days'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('visibilityMultiplier')
      .optional()
      .isFloat({ min: 1.0, max: 10.0 })
      .withMessage('Visibility multiplier must be between 1.0 and 10.0'),
    body('features')
      .optional()
      .isArray()
      .withMessage('Features must be an array')
  ],
  validateRequest,
  updateBoostPlan
);

router.delete('/:id',
  adminAuth,
  [
    param('id').isUUID().withMessage('Invalid boost plan ID')
  ],
  validateRequest,
  deleteBoostPlan
);

router.put('/:id/toggle-status',
  adminAuth,
  [
    param('id').isUUID().withMessage('Invalid boost plan ID')
  ],
  validateRequest,
  toggleBoostPlanStatus
);

export default router;