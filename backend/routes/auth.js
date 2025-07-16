import express from 'express';
import { body } from 'express-validator';
import {
  adminLogin,
  employeeLogin,
  jobSeekerLogin,
  employeeRegister,
  jobSeekerRegister,
  getProfile
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/admin/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], adminLogin);

router.post('/employee/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], employeeLogin);

router.post('/job-seeker/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], jobSeekerLogin);

router.post('/employee/register', [
  body('firstName').trim().isLength({ min: 2, max: 50 }),
  body('lastName').trim().isLength({ min: 2, max: 50 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  body('phone').isMobilePhone('any', { strictMode: false }),
  body('companyName').trim().isLength({ min: 2, max: 100 })
], employeeRegister);

router.post('/job-seeker/register', [
  body('firstName').trim().isLength({ min: 2, max: 50 }),
  body('lastName').trim().isLength({ min: 2, max: 50 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  body('phone').isMobilePhone('any', { strictMode: false })
], jobSeekerRegister);

router.get('/profile', authenticateToken, getProfile);

export default router;