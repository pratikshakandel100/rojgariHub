import express from 'express';
import { body } from 'express-validator';
import {
  getUserProfile,
  updateEmployeeProfile,
  updateJobSeekerProfile,
  updateAdminProfile,
  updateProfile,
  changePassword
} from '../controllers/profileController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/', authenticateToken, getUserProfile);

// Unified update profile endpoint
router.put('/', authenticateToken, [
  // Common fields
  body('firstName').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 50 }),
  body('lastName').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 50 }),
  body('phone').optional({ values: 'falsy' }).isMobilePhone(),
  
  // Employee-specific fields
  body('companyName').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 100 }),
  body('companyEmail').optional({ values: 'falsy' }).isEmail(),
  body('companyPhone').optional({ values: 'falsy' }).isMobilePhone(),
  body('companyLocation').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 100 }),
  body('companyWebsite').optional({ values: 'falsy' }).isURL(),
  body('companyDescription').optional({ values: 'falsy' }).trim().isLength({ max: 1000 }),
  body('companyFounded').optional({ values: 'falsy' }).trim(),
  body('companyEmployees').optional({ values: 'falsy' }).trim(),
  
  // Job seeker-specific fields
  body('dateOfBirth').optional({ values: 'falsy' }).isISO8601(),
  body('location').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 100 }),
  body('bio').optional({ values: 'falsy' }).trim().isLength({ max: 500 }),
  body('experience').optional({ values: 'falsy' }).trim(),
  body('skills').optional({ values: 'falsy' }).isArray(),
  body('education').optional({ values: 'falsy' }).isArray(),
  body('workExperience').optional({ values: 'falsy' }).isArray(),
  body('hobbies').optional({ values: 'falsy' }).isArray(),
  body('portfolio').optional({ values: 'falsy' }).isURL(),
  body('linkedin').optional({ values: 'falsy' }).isURL(),
  body('github').optional({ values: 'falsy' }).isURL(),
  body('instagram').optional({ values: 'falsy' }).isURL(),
  body('facebook').optional({ values: 'falsy' }).isURL(),
  body('expectedSalary').optional({ values: 'falsy' }).isNumeric(),
  body('jobPreferences').optional({ values: 'falsy' }).isArray()
], updateProfile);

router.put('/employee', authenticateToken, [
  body('firstName').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 50 }),
  body('lastName').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 50 }),
  body('phone').optional({ values: 'falsy' }).isMobilePhone(),
  body('companyName').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 100 }),
  body('companyEmail').optional({ values: 'falsy' }).isEmail(),
  body('companyPhone').optional({ values: 'falsy' }).isMobilePhone(),
  body('companyLocation').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 100 }),
  body('companyWebsite').optional({ values: 'falsy' }).isURL(),
  body('companyDescription').optional({ values: 'falsy' }).trim().isLength({ max: 1000 }),
  body('companyFounded').optional({ values: 'falsy' }).trim(),
  body('companyEmployees').optional({ values: 'falsy' }).trim()
], updateEmployeeProfile);

router.put('/job-seeker', authenticateToken, [
  body('firstName').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 50 }),
  body('lastName').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 50 }),
  body('phone').optional({ values: 'falsy' }).isMobilePhone(),
  body('dateOfBirth').optional({ values: 'falsy' }).isISO8601(),
  body('location').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 100 }),
  body('bio').optional({ values: 'falsy' }).trim().isLength({ max: 500 }),
  body('experience').optional({ values: 'falsy' }).trim(),
  body('skills').optional({ values: 'falsy' }).isArray(),
  body('education').optional({ values: 'falsy' }).isArray(),
  body('workExperience').optional({ values: 'falsy' }).isArray(),
  body('hobbies').optional({ values: 'falsy' }).isArray(),
  body('portfolio').optional({ values: 'falsy' }).isURL(),
  body('linkedin').optional({ values: 'falsy' }).isURL(),
  body('github').optional({ values: 'falsy' }).isURL(),
  body('instagram').optional({ values: 'falsy' }).isURL(),
  body('facebook').optional({ values: 'falsy' }).isURL(),
  body('expectedSalary').optional({ values: 'falsy' }).isNumeric(),
  body('jobPreferences').optional({ values: 'falsy' }).isArray()
], updateJobSeekerProfile);

router.put('/admin', authenticateToken, [
  body('firstName').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 50 }),
  body('lastName').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 50 }),
  body('phone').optional({ values: 'falsy' }).isMobilePhone(),
  body('permissions').optional({ values: 'falsy' }).isArray()
], updateAdminProfile);

router.put('/change-password', authenticateToken, [
  body('currentPassword').isLength({ min: 6 }),
  body('newPassword').isLength({ min: 6 }),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match new password');
    }
    return true;
  })
], changePassword);

export default router;