import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Employee, JobSeeker } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure upload directories exist
const createUploadDirs = () => {
  const uploadDir = path.join(__dirname, '../uploads');
  const profilePicsDir = path.join(uploadDir, 'profile-pictures');
  const resumesDir = path.join(uploadDir, 'resumes');
  
  [uploadDir, profilePicsDir, resumesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    if (file.fieldname === 'profilePicture') {
      uploadPath = path.join(__dirname, '../uploads/profile-pictures');
    } else if (file.fieldname === 'resume') {
      uploadPath = path.join(__dirname, '../uploads/resumes');
    } else {
      uploadPath = path.join(__dirname, '../uploads');
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = `${req.user.id}-${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'profilePicture') {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for profile pictures'), false);
    }
  } else if (file.fieldname === 'resume') {
    // Allow only PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for resumes'), false);
    }
  } else {
    cb(new Error('Invalid field name'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Middleware for handling multiple file types
export const uploadFiles = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]);

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.files || !req.files.profilePicture) {
      return res.status(400).json({ message: 'No profile picture file uploaded' });
    }

    const file = req.files.profilePicture[0];
    const filePath = `/uploads/profile-pictures/${file.filename}`;

    // Update user profile with new profile picture path
    let user;
    if (req.userType === 'employee') {
      user = await Employee.findByPk(req.user.id);
    } else if (req.userType === 'jobseeker') {
      user = await JobSeeker.findByPk(req.user.id);
    }

    if (!user) {
      // Clean up uploaded file
      fs.unlinkSync(file.path);
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old profile picture if exists
    if (user.profilePicture) {
      const oldFilePath = path.join(__dirname, '../', user.profilePicture);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Update user with new profile picture path
    await user.update({ profilePicture: filePath });

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePicture: filePath,
      fileInfo: {
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    
    // Clean up uploaded file on error
    if (req.files && req.files.profilePicture) {
      const file = req.files.profilePicture[0];
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
    
    res.status(500).json({ message: 'Failed to upload profile picture' });
  }
};

// Upload resume (JobSeeker only)
export const uploadResume = async (req, res) => {
  try {
    if (req.userType !== 'jobseeker') {
      return res.status(403).json({ message: 'Only job seekers can upload resumes' });
    }

    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: 'No resume file uploaded' });
    }

    const file = req.files.resume[0];
    const filePath = `/uploads/resumes/${file.filename}`;

    // Update job seeker profile with new resume path
    const jobSeeker = await JobSeeker.findByPk(req.user.id);
    if (!jobSeeker) {
      // Clean up uploaded file
      fs.unlinkSync(file.path);
      return res.status(404).json({ message: 'Job seeker not found' });
    }

    // Delete old resume if exists
    if (jobSeeker.resume) {
      const oldFilePath = path.join(__dirname, '../', jobSeeker.resume);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Update job seeker with new resume path
    await jobSeeker.update({ resume: filePath });

    res.json({
      message: 'Resume uploaded successfully',
      resume: filePath,
      fileInfo: {
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    
    // Clean up uploaded file on error
    if (req.files && req.files.resume) {
      const file = req.files.resume[0];
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
    
    res.status(500).json({ message: 'Failed to upload resume' });
  }
};

// Delete profile picture
export const deleteProfilePicture = async (req, res) => {
  try {
    let user;
    if (req.userType === 'employee') {
      user = await Employee.findByPk(req.user.id);
    } else if (req.userType === 'jobseeker') {
      user = await JobSeeker.findByPk(req.user.id);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.profilePicture) {
      return res.status(400).json({ message: 'No profile picture to delete' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../', user.profilePicture);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Update user profile
    await user.update({ profilePicture: null });

    res.json({ message: 'Profile picture deleted successfully' });
  } catch (error) {
    console.error('Delete profile picture error:', error);
    res.status(500).json({ message: 'Failed to delete profile picture' });
  }
};

// Delete resume
export const deleteResume = async (req, res) => {
  try {
    if (req.userType !== 'jobseeker') {
      return res.status(403).json({ message: 'Only job seekers can delete resumes' });
    }

    const jobSeeker = await JobSeeker.findByPk(req.user.id);
    if (!jobSeeker) {
      return res.status(404).json({ message: 'Job seeker not found' });
    }

    if (!jobSeeker.resume) {
      return res.status(400).json({ message: 'No resume to delete' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../', jobSeeker.resume);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Update job seeker profile
    await jobSeeker.update({ resume: null });

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Failed to delete resume' });
  }
};

// Get file info
export const getFileInfo = async (req, res) => {
  try {
    const { fileType } = req.params; // 'profilePicture' or 'resume'

    let user;
    if (req.userType === 'employee') {
      user = await Employee.findByPk(req.user.id);
    } else if (req.userType === 'jobseeker') {
      user = await JobSeeker.findByPk(req.user.id);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let filePath;
    if (fileType === 'profilePicture') {
      filePath = user.profilePicture;
    } else if (fileType === 'resume' && req.userType === 'jobseeker') {
      filePath = user.resume;
    } else {
      return res.status(400).json({ message: 'Invalid file type' });
    }

    if (!filePath) {
      return res.status(404).json({ message: `No ${fileType} found` });
    }

    const fullPath = path.join(__dirname, '../', filePath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    const stats = fs.statSync(fullPath);
    
    res.json({
      filePath,
      size: stats.size,
      uploadedAt: stats.birthtime,
      lastModified: stats.mtime
    });
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({ message: 'Failed to get file info' });
  }
};

// Serve uploaded files
export const serveFile = (req, res) => {
  try {
    const { fileType, filename } = req.params;
    
    let filePath;
    if (fileType === 'profile-pictures') {
      filePath = path.join(__dirname, '../uploads/profile-pictures', filename);
    } else if (fileType === 'resumes') {
      filePath = path.join(__dirname, '../uploads/resumes', filename);
    } else {
      return res.status(400).json({ message: 'Invalid file type' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error('Serve file error:', error);
    res.status(500).json({ message: 'Failed to serve file' });
  }
};