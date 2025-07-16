import express from 'express';
import { body, param, query } from 'express-validator';
import {
  sendPasswordResetEmail,
  resendPasswordResetEmail,
  verifyResetToken,
  resetPassword,
  getPasswordResetHistory
} from '../controllers/passwordResetController.js';
import { adminAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Send password reset email
router.post('/send-email',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail()
  ],
  validateRequest,
  sendPasswordResetEmail
);

// Resend password reset email
router.post('/resend-email',
  [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail()
  ],
  validateRequest,
  resendPasswordResetEmail
);

// Verify password reset token
router.get('/verify/:token',
  [
    param('token')
      .isLength({ min: 64, max: 64 })
      .withMessage('Invalid token format')
      .isAlphanumeric()
      .withMessage('Token must contain only alphanumeric characters')
  ],
  validateRequest,
  verifyResetToken
);

// Reset password with token
router.post('/reset',
  [
    body('token')
      .isLength({ min: 64, max: 64 })
      .withMessage('Invalid token format')
      .isAlphanumeric()
      .withMessage('Token must contain only alphanumeric characters'),
    body('newPassword')
      .isLength({ min: 6, max: 100 })
      .withMessage('Password must be between 6 and 100 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
  ],
  validateRequest,
  resetPassword
);

// Get password reset history (Admin only)
router.get('/admin/history',
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
    query('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email format'),
    query('userType')
      .optional()
      .isIn(['Admin', 'Employee', 'JobSeeker'])
      .withMessage('Invalid user type')
  ],
  validateRequest,
  getPasswordResetHistory
);

export default router;