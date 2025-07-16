import { validationResult } from 'express-validator';
import { Job, Application, Employee, JobSeeker, Boost } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

export const createJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      title, 
      description, 
      requirements, 
      location, 
      type, 
      salary, 
      category = 'General', 
      experience = 'Entry', 
      skills = [],
      applicationDeadline,
      isRemote = false
    } = req.body;

    // Handle company image upload
    let companyImagePath = null;
    if (req.file) {
      companyImagePath = `/uploads/company-images/${req.file.filename}`;
    }

    const processedRequirements = Array.isArray(requirements) 
      ? requirements 
      : (typeof requirements === 'string' ? requirements.split(',').map(req => req.trim()) : []);
    
    const processedSkills = Array.isArray(skills) 
      ? skills 
      : (typeof skills === 'string' ? skills.split(',').map(skill => skill.trim()) : []);

    const job = await Job.create({
      employeeId: req.user.id,
      title,
      description,
      requirements: processedRequirements,
      location,
      type,
      salary,
      category,
      experience,
      skills: processedSkills,
      applicationDeadline: applicationDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isRemote,
      companyImage: companyImagePath
    });

    const jobWithEmployee = await Job.findByPk(job.id, {
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'firstName', 'lastName', 'companyName']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      job: jobWithEmployee
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create job',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { search, location, type, category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = { status: 'Active' };
    let includeClause = [
      {
        model: Employee,
        as: 'employee',
        attributes: ['id', 'firstName', 'lastName', 'companyName', 'companyLocation']
      },
      {
         model: Boost,
         as: 'boosts',
         required: false,
         where: {
           status: 'Approved',
           [Op.and]: [
             { approvedDate: { [Op.lte]: new Date() } },
             { expiryDate: { [Op.gte]: new Date() } }
           ]
         },
         attributes: ['id', 'boostType', 'approvedDate', 'expiryDate']
       }
    ];

    // Add search conditions
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        sequelize.where(
          sequelize.cast(sequelize.col('skills'), 'TEXT'),
          { [Op.iLike]: `%${search}%` }
        )
      ];
    }

    if (location) {
      whereClause.location = { [Op.iLike]: `%${location}%` };
    }

    if (type) {
      whereClause.type = type;
    }

    if (category) {
      whereClause.category = category;
    }

    const jobs = await Job.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [
        ['createdAt', 'DESC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      jobs: jobs.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(jobs.count / limit),
        totalJobs: jobs.count,
        hasNext: page * limit < jobs.count,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id, {
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'firstName', 'lastName', 'companyName', 'companyEmail', 'companyPhone', 'companyLocation', 'companyWebsite', 'companyDescription']
      }]
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.views += 1;
    await job.save();

    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEmployeeJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const jobs = await Job.findAndCountAll({
      where: { employeeId: req.user.id },
      include: [
        {
          model: Application,
          as: 'applications',
          include: [{
            model: JobSeeker,
            as: 'jobSeeker',
            attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
          }]
        },
        {
          model: Boost,
          as: 'boosts',
          required: false,
          attributes: ['id', 'boostType', 'approvedDate', 'expiryDate', 'status', 'duration']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        ['createdAt', 'DESC']
      ]
    });

    res.json({
      success: true,
      jobs: jobs.rows,
      totalJobs: jobs.count,
      totalPages: Math.ceil(jobs.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, requirements, location, type, salary, category, experience, skills, status } = req.body;

    const job = await Job.findOne({
      where: { id, employeeId: req.user.id }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    await job.update({
      title,
      description,
      requirements: Array.isArray(requirements) ? requirements : requirements.split(',').map(req => req.trim()),
      location,
      type,
      salary,
      category,
      experience,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(skill => skill.trim()) : []),
      status
    });

    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findOne({
      where: { id, employeeId: req.user.id }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    await job.destroy();

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};