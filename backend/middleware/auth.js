import jwt from 'jsonwebtoken';
import { Admin, Employee, JobSeeker } from '../models/index.js';

import dotenv from 'dotenv';

dotenv.config();

const auth = (userType) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.userType !== userType) {
        return res.status(403).json({ message: 'Access denied. Invalid user type' });
      }

      let user;
      switch (userType) {
        case 'admin':
          user = await Admin.findByPk(decoded.id);
          break;
        case 'employee':
          user = await Employee.findByPk(decoded.id);
          break;
        case 'jobseeker':
          user = await JobSeeker.findByPk(decoded.id);
          break;
        default:
          return res.status(400).json({ message: 'Invalid user type' });
      }

      if (!user) {
        return res.status(401).json({ message: `Token is not valid ${error}` });
      }

      req.user = user;
      req.userType = userType;
      next();
    } catch (error) {
      res.status(401).json({ message: 	`Token is not valid ${error}` });
    }
  };
};

// Admin-specific auth middleware
const adminAuth = auth('admin');

// Employee-specific auth middleware
const employeeAuth = auth('employee');

// JobSeeker-specific auth middleware
const jobSeekerAuth = auth('jobseeker');

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let user;
    switch (decoded.userType) {
      case 'admin':
        user = await Admin.findByPk(decoded.id);
        break;
      case 'employee':
        user = await Employee.findByPk(decoded.id);
        break;
      case 'jobseeker':
        user = await JobSeeker.findByPk(decoded.id);
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!user) {
      return res.status(401).json({ message: `Token is not valid ${error}` });
    }

    req.user = user;
    req.userType = decoded.userType;
    next();
  } catch (error) {
    res.status(401).json({ message: `Token is not valid ${error}` });
  }
};

export { auth, adminAuth, employeeAuth, jobSeekerAuth, authenticateToken };