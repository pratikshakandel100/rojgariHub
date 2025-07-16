import express from 'express';
import { body, query, param } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  createJob,
  getJobs,
  getJobById,
  getEmployeeJobs,
  updateJob,
  deleteJob
} from '../controllers/jobController.js';
import { auth } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure company images directory exists
const createCompanyImagesDir = () => {
  const uploadDir = path.join(__dirname, '../uploads');
  const companyImagesDir = path.join(uploadDir, 'company-images');
  
  [uploadDir, companyImagesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createCompanyImagesDir();

// Configure multer for company image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/company-images');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = `company-${req.user.id}-${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

const router = express.Router();

router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim(),
  query('category').optional().trim(),
  query('location').optional().trim(),
  query('type').optional().isIn(['Full-time', 'Part-time', 'Contract', 'Internship']),
  query('experience').optional().isIn(['Entry', 'Mid', 'Senior', 'Executive']),
  query('isRemote').optional().isBoolean()
], getJobs);

router.get('/:id', [
  param('id').isUUID()
], getJobById);

router.post('/', auth('employee'), upload.single('companyImage'), [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('requirements').trim().isLength({ min: 5 }).withMessage('Requirements must be at least 5 characters'),
  body('location').trim().isLength({ min: 2, max: 100 }).withMessage('Location must be between 2 and 100 characters'),
  body('type').isIn(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']).withMessage('Invalid job type'),
  body('salary').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Salary must be between 1 and 100 characters'),
  body('category').optional().trim().isLength({ min: 2, max: 50 }),
  body('experience').optional().isIn(['Entry', 'Mid', 'Senior', 'Executive']),
  body('skills').optional(),
  body('applicationDeadline').optional().isISO8601(),
  body('isRemote').optional().isBoolean(),
  body('isFeatured').optional().isBoolean()
], createJob);

router.get('/employee/my-jobs', auth('employee'), getEmployeeJobs);

router.put('/:id', auth('employee'), [
  param('id').isUUID(),
  body('title').optional().trim().isLength({ min: 5, max: 200 }),
  body('description').optional().trim().isLength({ min: 50 }),
  body('requirements').optional().trim().isLength({ min: 20 }),
  body('location').optional().trim().isLength({ min: 2, max: 100 }),
  body('type').optional().isIn(['Full-time', 'Part-time', 'Contract', 'Internship']),
  body('category').optional().trim().isLength({ min: 2, max: 50 }),
  body('experience').optional().isIn(['Entry', 'Mid', 'Senior', 'Executive']),
  body('skills').optional().isArray({ min: 1 }),
  body('status').optional().isIn(['Active', 'Inactive', 'Closed']),
  body('applicationDeadline').optional().isISO8601(),
  body('isRemote').optional().isBoolean(),
  body('isFeatured').optional().isBoolean()
], updateJob);

router.delete('/:id', auth('employee'), [
  param('id').isUUID()
], deleteJob);

// Serve company images
router.get('/company-images/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/company-images', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    res.sendFile(filePath);
  } catch (error) {
    console.error('Serve company image error:', error);
    res.status(500).json({ message: 'Failed to serve image' });
  }
});

export default router;
