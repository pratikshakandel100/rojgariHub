import { validationResult } from 'express-validator';
import { SavedJob, Job, Employee, Boost } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

export const saveJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { jobId } = req.body;
    const jobSeekerId = req.user.id;

    const existingSavedJob = await SavedJob.findOne({
      where: { jobSeekerId, jobId }
    });

    if (existingSavedJob) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    const savedJob = await SavedJob.create({
      jobSeekerId,
      jobId
    });

    res.status(201).json({
      message: 'Job saved successfully',
      savedJob
    });
  } catch (error) {
    console.error('Error saving job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const unsaveJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { jobId } = req.params;
    const jobSeekerId = req.user.id;

    const savedJob = await SavedJob.findOne({
      where: { jobSeekerId, jobId }
    });

    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    await savedJob.destroy();

    res.json({ message: 'Job unsaved successfully' });
  } catch (error) {
    console.error('Error unsaving job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const jobSeekerId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: savedJobs } = await SavedJob.findAndCountAll({
      where: { jobSeekerId },
      include: [
        {
          model: Job,
          as: 'job',
          where: { status: 'Active' },
          include: [
            {
              model: Employee,
              as: 'employee',
              attributes: ['id', 'companyName', 'companyLogo']
            }
          ]
        }
      ],
      order: [
        ['savedAt', 'DESC']
      ],
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      savedJobs: savedJobs.map(savedJob => ({
        id: savedJob.id,
        savedAt: savedJob.savedAt,
        job: {
          id: savedJob.job.id,
          title: savedJob.job.title,
          description: savedJob.job.description,
          location: savedJob.job.location,
          type: savedJob.job.type,
          salary: savedJob.job.salary,
          category: savedJob.job.category,
          experience: savedJob.job.experience,
          skills: savedJob.job.skills,
          isRemote: savedJob.job.isRemote,
          createdAt: savedJob.job.createdAt,
          company: savedJob.job.employee.companyName,
          companyLogo: savedJob.job.employee.companyLogo
        }
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const checkIfJobSaved = async (req, res) => {
  try {
    const { jobId } = req.params;
    const jobSeekerId = req.user.id;

    const savedJob = await SavedJob.findOne({
      where: { jobSeekerId, jobId }
    });

    res.json({ isSaved: !!savedJob });
  } catch (error) {
    console.error('Error checking if job is saved:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};