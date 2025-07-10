import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { Admin, Employee, JobSeeker } from '../models/index.js';

const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

export const adminLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin.id, 'admin');

    res.json({
      success: true,
      token,
      user: { ...admin.toJSON(), role: 'admin' },
      userType: 'admin'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const employeeLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const employee = await Employee.findOne({ where: { email } });
    if (!employee) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await employee.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    employee.lastLogin = new Date();
    await employee.save();

    const token = generateToken(employee.id, 'employee');

    res.json({
      success: true,
      token,
      user: { ...employee.toJSON(), role: 'employee' },
      userType: 'employee'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const jobSeekerLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const jobSeeker = await JobSeeker.findOne({ where: { email } });
    if (!jobSeeker) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await jobSeeker.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    jobSeeker.lastLogin = new Date();
    await jobSeeker.save();

    const token = generateToken(jobSeeker.id, 'jobseeker');

    res.json({
      success: true,
      token,
      user: { ...jobSeeker.toJSON(), role: 'jobseeker' },
      userType: 'jobseeker'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const employeeRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, phone, companyName } = req.body;

    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee already exists' });
    }

    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      companyName
    });

    res.status(201).json({
      success: true,
      message: 'Employee registration successful. Please login to continue.',
      user: { id: employee.id, email: employee.email, role: 'employee' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const jobSeekerRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, phone } = req.body;

    const existingJobSeeker = await JobSeeker.findOne({ where: { email } });
    if (existingJobSeeker) {
      return res.status(400).json({ message: 'Job seeker already exists' });
    }

    const jobSeeker = await JobSeeker.create({
      firstName,
      lastName,
      email,
      password,
      phone
    });

    res.status(201).json({
      success: true,
      message: 'Job seeker registration successful. Please login to continue.',
      user: { id: jobSeeker.id, email: jobSeeker.email, role: 'jobseeker' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
      userType: req.userType
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};