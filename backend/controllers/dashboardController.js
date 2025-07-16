import { Application, Job, Employee, JobSeeker, Boost } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

export const getJobSeekerDashboard = async (req, res) => {
  try {
    if (req.userType !== 'jobseeker') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only job seekers can access this endpoint.'
      });
    }
    
    const jobSeekerId = req.user.id;
    
    const totalApplications = await Application.count({
      where: { jobSeekerId }
    });
    
    const pendingApplications = await Application.count({
      where: { 
        jobSeekerId,
        status: 'Pending'
      }
    });
    
    const acceptedApplications = await Application.count({
      where: { 
        jobSeekerId,
        status: { [Op.in]: ['Shortlisted', 'Hired'] }
      }
    });
    
    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);
    
    const applicationsThisWeek = await Application.count({
      where: {
        jobSeekerId,
        createdAt: {
          [Op.gte]: thisWeekStart
        }
      }
    });
    
    const profileViews = req.user.profileViews || 0;
    const profileViewsThisWeek = req.user.profileViewsThisWeek || 0;
    
    const recentApplications = await Application.findAll({
      where: { jobSeekerId },
      include: [{
        model: Job,
        as: 'job',
        attributes: ['id', 'title', 'location', 'type', 'salary'],
        include: [{
          model: Employee,
          as: 'employee',
          attributes: ['companyName']
        }]
      }],
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    
    const userSkills = req.user.skills || [];
    const userExperience = req.user.experience || 'Entry';
    
    let recommendedJobs = [];
    const includeClause = [
      {
        model: Employee,
        as: 'employee',
        attributes: ['companyName']
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
    
    const orderClause = [
      ['createdAt', 'DESC']
    ];
    
    if (userSkills.length > 0) {
      recommendedJobs = await Job.findAll({
        where: {
          status: 'Active',
          [Op.or]: [
            {
              skills: {
                [Op.overlap]: userSkills
              }
            },
            {
              experience: userExperience
            }
          ],
          id: {
            [Op.notIn]: sequelize.literal(`(
              SELECT "jobId" FROM applications 
              WHERE "jobSeekerId" = '${jobSeekerId}'
            )`)
          }
        },
        include: includeClause,
        order: orderClause,
        limit: 5
      });
    } else {
      recommendedJobs = await Job.findAll({
        where: {
          status: 'Active',
          id: {
            [Op.notIn]: sequelize.literal(`(
              SELECT "jobId" FROM applications 
              WHERE "jobSeekerId" = '${jobSeekerId}'
            )`)
          }
        },
        include: includeClause,
        order: orderClause,
        limit: 5
      });
    }
    
    const stats = {
      totalApplications,
      pendingApplications,
      acceptedApplications,
      applicationsThisWeek,
      profileViews,
      profileViewsThisWeek,
      interviewCalls: acceptedApplications
    };
    
    res.json({
      success: true,
      stats,
      recentApplications,
      recommendedJobs
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
};

export const getEmployeeDashboard = async (req, res) => {
  try {
    if (req.userType !== 'employee') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only employees can access this endpoint.'
      });
    }
    
    const employeeId = req.user.id;
    
    const totalJobs = await Job.count({
      where: { employeeId }
    });
    
    const activeJobs = await Job.count({
      where: { 
        employeeId,
        status: 'Active'
      }
    });
    
    const totalApplications = await Application.count({
      where: { employeeId }
    });
    
    const pendingApplications = await Application.count({
      where: { 
        employeeId,
        status: 'Pending'
      }
    });
    
    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);
    
    const applicationsThisWeek = await Application.count({
      where: {
        employeeId,
        createdAt: {
          [Op.gte]: thisWeekStart
        }
      }
    });
    
    const recentApplications = await Application.findAll({
      where: { employeeId },
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'location', 'type', 'salary']
        },
        {
          model: JobSeeker,
          as: 'jobSeeker',
          attributes: ['id', 'firstName', 'lastName', 'email', 'experience']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    
    const stats = {
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      applicationsThisWeek
    };
    
    res.json({
      success: true,
      stats,
      recentApplications
    });
  } catch (error) {
    console.error('Error fetching employee dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
};