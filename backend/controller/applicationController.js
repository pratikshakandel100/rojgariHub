import { validationResult } from 'express-validator';
import { Application, Job, Employee, JobSeeker } from '../models/index.js';
import { Op } from 'sequelize';
import { createNotification } from './notificationController.js';

export const applyForJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user has uploaded a resume
    const jobSeeker = await JobSeeker.findByPk(req.user.id);
    if (!jobSeeker || !jobSeeker.resume) {
      return res.status(400).json({ 
        message: 'Please upload your resume first on your profile before applying for jobs.',
        requiresResume: true 
      });
    }

    const { jobId, coverLetter } = req.body;

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'Active') {
      return res.status(400).json({ message: 'Job is not active' });
    }

    const existingApplication = await Application.findOne({
      where: {
        jobId,
        jobSeekerId: req.user.id
      }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = await Application.create({
      jobId,
      jobSeekerId: req.user.id,
      employeeId: job.employeeId,
      coverLetter,
      resume: req.user.resume
    });

    job.applicationsCount += 1;
    await job.save();

    const applicationWithDetails = await Application.findByPk(application.id, {
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'location', 'type', 'salary']
        },
        {
          model: JobSeeker,
          as: 'jobSeeker',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        }
      ]
    });

    await createNotification(
      job.employeeId,
      'employee',
      'application_received',
      'New Job Application',
      `${req.user.firstName} ${req.user.lastName} has applied for your job: ${job.title}`,
      req.user.id,
      'jobseeker',
      application.id,
      'application'
    );

    res.status(201).json({
      success: true,
      application: applicationWithDetails
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getJobSeekerApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { jobSeekerId: req.user.id };
    if (status) {
      whereClause.status = status;
    }

    const applications = await Application.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'location', 'type', 'salary', 'status'],
          include: [{
            model: Employee,
            as: 'employee',
            attributes: ['id', 'firstName', 'lastName', 'companyName']
          }]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      applications: applications.rows,
      totalApplications: applications.count,
      totalPages: Math.ceil(applications.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEmployeeApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, jobId } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { employeeId: req.user.id };
    if (status) {
      whereClause.status = status;
    }
    if (jobId) {
      whereClause.jobId = jobId;
    }

    const applications = await Application.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'location', 'type', 'salary']
        },
        {
          model: JobSeeker,
          as: 'jobSeeker',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'experience', 'skills', 'resume', 'profilePicture', 'location']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      applications: applications.rows,
      totalApplications: applications.count,
      totalPages: Math.ceil(applications.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, notes } = req.body;

    const application = await Application.findOne({
      where: {
        id,
        employeeId: req.user.id
      }
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found or unauthorized' });
    }

    await application.update({
      status,
      notes,
      reviewedAt: new Date(),
      reviewedBy: req.user.id
    });

    const updatedApplication = await Application.findByPk(application.id, {
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'location', 'type', 'salary']
        },
        {
          model: JobSeeker,
          as: 'jobSeeker',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        }
      ]
    });

    if (status === 'Accepted' || status === 'Rejected') {
      const notificationType = status === 'Accepted' ? 'application_approved' : 'application_rejected';
      const notificationTitle = status === 'Accepted' ? 'Application Approved!' : 'Application Update';
      const notificationMessage = status === 'Accepted' 
        ? `Congratulations! Your application for ${updatedApplication.job.title} has been approved.`
        : `Your application for ${updatedApplication.job.title} has been reviewed.`;
      
      await createNotification(
        application.jobSeekerId,
        'jobseeker',
        notificationType,
        notificationTitle,
        notificationMessage,
        req.user.id,
        'employee',
        application.id,
        'application'
      );
    }

    res.json({
      success: true,
      application: updatedApplication
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findOne({
      where: {
        id,
        jobSeekerId: req.user.id
      }
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found or unauthorized' });
    }

    if (application.status === 'Accepted' || application.status === 'Rejected') {
      return res.status(400).json({ message: 'Cannot withdraw application that has been processed' });
    }

    await application.update({ status: 'Withdrawn' });

    const job = await Job.findByPk(application.jobId);
    if (job && job.applicationsCount > 0) {
      job.applicationsCount -= 1;
      await job.save();
    }

    res.json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};