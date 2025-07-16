import express from 'express';
import { param } from 'express-validator';
import {
  uploadFiles,
  uploadProfilePicture,
  uploadResume,
  deleteProfilePicture,
  deleteResume,
  getFileInfo,
  serveFile
} from '../controllers/uploadController.js';
import { auth, authenticateToken } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Upload profile picture
router.post('/profile-picture',
  authenticateToken,
  uploadFiles,
  uploadProfilePicture
);

// Upload resume (JobSeeker only)
router.post('/resume',
  authenticateToken,
  uploadFiles,
  uploadResume
);

// Delete profile picture
router.delete('/profile-picture',
  authenticateToken,
  deleteProfilePicture
);

// Delete resume
router.delete('/resume',
  authenticateToken,
  deleteResume
);

// Get file info
router.get('/info/:fileType',
  authenticateToken,
  [
    param('fileType')
      .isIn(['profilePicture', 'resume'])
      .withMessage('File type must be profilePicture or resume')
  ],
  validateRequest,
  getFileInfo
);

// Serve uploaded files
router.get('/files/:fileType/:filename',
  [
    param('fileType')
      .isIn(['profile-pictures', 'resumes'])
      .withMessage('Invalid file type'),
    param('filename')
      .matches(/^[a-zA-Z0-9-_.]+$/)
      .withMessage('Invalid filename format')
  ],
  validateRequest,
  serveFile
);

export default router;