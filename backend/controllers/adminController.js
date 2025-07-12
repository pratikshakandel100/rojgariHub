import { Employee, JobSeeker, Job, Application, Admin } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.count();
    const totalJobSeekers = await JobSeeker.count();
    const totalJobs = await Job.count();
    const totalApplications = await Application.count();
    const activeJobs = await Job.count({ where: { status: 'Active' } });
    const pendingApplications = await Application.count({ where: { status: 'Pending' } });

    const recentJobs = await Job.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['firstName', 'lastName', 'companyName']
      }]
    });

    const recentApplications = await Application.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['title']
        },
        {
          model: JobSeeker,
          as: 'jobSeeker',
          attributes: ['firstName', 'lastName', 'email']
        }
      ]
    });

    res.json({
      success: true,
      stats: {
        totalEmployees,
        totalJobSeekers,
        totalJobs,
        totalApplications,
        activeJobs,
        pendingApplications
      },
      recentJobs,
      recentApplications
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { companyName: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const employees = await Employee.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      employees: employees.rows,
      totalEmployees: employees.count,
      totalPages: Math.ceil(employees.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllJobSeekers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const jobSeekers = await JobSeeker.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      jobSeekers: jobSeekers.rows,
      totalJobSeekers: jobSeekers.count,
      totalPages: Math.ceil(jobSeekers.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (status) {
      whereClause.status = status;
    }

    const jobs = await Job.findAndCountAll({
      where: whereClause,
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['firstName', 'lastName', 'companyName', 'email']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
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

export const toggleUserStatus = async (req, res) => {
  try {
    const { userType, userId } = req.params;
    const { isActive } = req.body;

    let user;
    switch (userType) {
      case 'employee':
        user = await Employee.findByPk(userId);
        break;
      case 'jobseeker':
        user = await JobSeeker.findByPk(userId);
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ isActive });

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await Application.destroy({ where: { jobId } });
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

export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updateData = req.body;

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await job.update(updateData);

    res.json({
      success: true,
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      companyName: { [Op.ne]: null, [Op.ne]: '' }
    };
    
    if (search) {
      whereClause[Op.or] = [
        { companyName: { [Op.iLike]: `%${search}%` } },
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (status) {
      whereClause.isActive = status === 'active';
    }

    const companies = await Employee.findAndCountAll({
      where: whereClause,
      include: [{
        model: Job,
        as: 'jobs',
        attributes: ['id', 'title', 'status'],
        required: false
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] }
    });

    const companiesWithStats = companies.rows.map(company => ({
      id: company.id,
      name: company.companyName,
      contactPerson: `${company.firstName} ${company.lastName}`,
      email: company.email,
      phone: company.companyPhone || 'N/A',
      location: company.companyLocation || 'N/A',
      website: company.companyWebsite || 'N/A',
      description: company.companyDescription || 'N/A',
      employees: company.companyEmployees || 'N/A',
      totalJobs: company.jobs ? company.jobs.length : 0,
      activeJobs: company.jobs ? company.jobs.filter(job => job.status === 'Active').length : 0,
      status: company.isActive ? 'active' : 'inactive',
      joinedDate: company.createdAt,
      isActive: company.isActive
    }));

    res.json({
      success: true,
      companies: companiesWithStats,
      totalCompanies: companies.count,
      totalPages: Math.ceil(companies.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await Employee.findByPk(companyId, {
      include: [{
        model: Job,
        as: 'jobs',
        attributes: ['id', 'title', 'status', 'createdAt'],
        required: false
      }],
      attributes: { exclude: ['password'] }
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const companyData = {
      id: company.id,
      name: company.companyName,
      contactPerson: `${company.firstName} ${company.lastName}`,
      email: company.email,
      phone: company.companyPhone || 'N/A',
      location: company.companyLocation || 'N/A',
      website: company.companyWebsite || 'N/A',
      description: company.companyDescription || 'N/A',
      employees: company.companyEmployees || 'N/A',
      totalJobs: company.jobs ? company.jobs.length : 0,
      activeJobs: company.jobs ? company.jobs.filter(job => job.status === 'Active').length : 0,
      status: company.isActive ? 'active' : 'inactive',
      joinedDate: company.createdAt,
      isActive: company.isActive,
      jobs: company.jobs || []
    };

    res.json({
      success: true,
      company: companyData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const toggleCompanyStatus = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { isActive } = req.body;

    const company = await Employee.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    await company.update({ isActive });

    res.json({
      success: true,
      message: `Company ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const endDate = new Date();

    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);

    const { Boost } = await import('../models/index.js');

    const currentRevenue = await Boost.sum('netRevenue', {
      where: {
        status: { [Op.in]: ['Active', 'Expired'] },
        paymentStatus: 'Paid',
        createdAt: { [Op.between]: [startDate, endDate] }
      }
    }) || 0;

    const previousRevenue = await Boost.sum('netRevenue', {
      where: {
        status: { [Op.in]: ['Active', 'Expired'] },
        paymentStatus: 'Paid',
        createdAt: { [Op.between]: [previousStartDate, startDate] }
      }
    }) || 0;

    const revenueChange = previousRevenue > 0 ? 
      ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1) : 
      currentRevenue > 0 ? 100 : 0;

    const currentUsers = await Employee.count({
      where: {
        createdAt: { [Op.between]: [startDate, endDate] }
      }
    });

    const previousUsers = await Employee.count({
      where: {
        createdAt: { [Op.between]: [previousStartDate, startDate] }
      }
    });

    const usersChange = previousUsers > 0 ? 
      ((currentUsers - previousUsers) / previousUsers * 100).toFixed(1) : 
      currentUsers > 0 ? 100 : 0;

    const currentApplications = await Application.count({
      where: {
        createdAt: { [Op.between]: [startDate, endDate] }
      }
    });

    const previousApplications = await Application.count({
      where: {
        createdAt: { [Op.between]: [previousStartDate, startDate] }
      }
    });

    const applicationsChange = previousApplications > 0 ? 
      ((currentApplications - previousApplications) / previousApplications * 100).toFixed(1) : 
      currentApplications > 0 ? 100 : 0;

    const totalApplications = await Application.count();
    const acceptedApplications = await Application.count({
      where: { status: 'Accepted' }
    });
    const successRate = totalApplications > 0 ? 
      ((acceptedApplications / totalApplications) * 100).toFixed(1) : 0;

    const topJobs = await Job.findAll({
      include: [{
        model: Application,
        as: 'applications',
        attributes: []
      }],
      attributes: [
        'id',
        'title',
        [sequelize.fn('COUNT', sequelize.col('applications.id')), 'application_count']
      ],
      group: ['Job.id', 'Job.title'],
      order: [[sequelize.literal('application_count'), 'DESC']],
      limit: 4,
      subQuery: false
    });

    const topCompanies = await Employee.findAll({
      where: {
        companyName: { [Op.ne]: null, [Op.ne]: '' }
      },
      include: [{
        model: Job,
        as: 'jobs',
        include: [{
          model: Application,
          as: 'applications',
          attributes: []
        }],
        attributes: []
      }],
      attributes: [
        'id',
        'companyName',
        [sequelize.fn('COUNT', sequelize.col('jobs.id')), 'job_count'],
        [sequelize.fn('COUNT', sequelize.col('jobs.applications.id')), 'application_count']
      ],
      group: ['Employee.id', 'Employee.companyName'],
      order: [[sequelize.literal('application_count'), 'DESC']],
      limit: 4,
      subQuery: false
    });

    const jobsCreated = await Job.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    const applicationsCreated = await Application.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    const usersRegistered = await Employee.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    res.json({
      success: true,
      analytics: {
        summary: {
          revenue: {
            value: currentRevenue,
            change: revenueChange,
            formatted: `₹${currentRevenue.toLocaleString()}`
          },
          users: {
            value: currentUsers,
            change: usersChange
          },
          applications: {
            value: currentApplications,
            change: applicationsChange
          },
          successRate: {
            value: successRate,
            change: '+5'
          }
        },
        topJobs: topJobs.map(job => ({
          title: job.title,
          applications: parseInt(job.dataValues.application_count) || 0,
          views: Math.floor(Math.random() * 2000) + 500
        })),
        topCompanies: topCompanies.map(company => ({
          name: company.companyName,
          jobs: parseInt(company.dataValues.job_count) || 0,
          applications: parseInt(company.dataValues.application_count) || 0
        })),
        charts: {
          jobsCreated,
          applicationsCreated,
          usersRegistered
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};