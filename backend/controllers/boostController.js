import { Boost, Job, Employee, BoostPlan } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

// Function to update expired boosts
export const updateExpiredBoosts = async () => {
  try {
    const now = new Date();
    
    // Update boosts that have passed their expiry date
    const expiredBoosts = await Boost.update(
      { 
        status: 'Expired',
        remainingDays: 0
      },
      {
        where: {
          status: 'Active',
          expiryDate: { [Op.lt]: now }
        }
      }
    );
    
    // Update remaining days for active boosts
    const activeBoosts = await Boost.findAll({
      where: {
        status: 'Active',
        expiryDate: { [Op.gte]: now }
      }
    });
    
    for (const boost of activeBoosts) {
      const remainingDays = Math.ceil((boost.expiryDate - now) / (1000 * 60 * 60 * 24));
      await boost.update({ remainingDays: Math.max(0, remainingDays) });
    }
    
    console.log(`Updated ${expiredBoosts[0]} expired boosts and ${activeBoosts.length} active boosts`);
    return { expiredCount: expiredBoosts[0], activeCount: activeBoosts.length };
  } catch (error) {
    console.error('Update expired boosts error:', error);
    throw error;
  }
};

// Create a new boost request
export const createBoost = async (req, res) => {
  try {
    const { jobId, boostPlanId, paymentMethod } = req.body;
    const employeeId = req.user.id;

    // Validate that the job exists and belongs to the employee
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employeeId !== employeeId) {
      return res.status(403).json({ message: 'You can only boost your own jobs' });
    }

    // Validate that the boost plan exists and is active
    const boostPlan = await BoostPlan.findByPk(boostPlanId);
    if (!boostPlan) {
      return res.status(404).json({ message: 'Boost plan not found' });
    }

    if (!boostPlan.isActive) {
      return res.status(400).json({ message: 'Selected boost plan is not available' });
    }

    // Check if there's already an active boost for this job
    const existingBoost = await Boost.findOne({
      where: {
        jobId,
        status: ['Pending', 'Active']
      }
    });

    if (existingBoost) {
      return res.status(400).json({ message: 'This job already has an active boost request' });
    }

    // Calculate price based on boost plan
    const totalPrice = boostPlan.price;
    const platformFee = totalPrice * 0.1; // 10% platform fee
    const netRevenue = totalPrice - platformFee;

    const boost = await Boost.create({
      employeeId,
      jobId,
      boostPlanId,
      boostType: boostPlan.type,
      duration: boostPlan.duration,
      price: totalPrice,
      platformFee,
      netRevenue,
      paymentMethod,
      expiryDate: new Date(Date.now() + boostPlan.duration * 24 * 60 * 60 * 1000)
    });

    res.status(201).json({
      message: 'Boost request created successfully',
      boost
    });
  } catch (error) {
    console.error('Create boost error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all boosts for admin
export const getAllBoosts = async (req, res) => {
  try {
    // Update expired boosts before fetching
    await updateExpiredBoosts();
    
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) {
      whereClause.status = status;
    }

    const boosts = await Boost.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['title', 'location', 'type'],
          where: search ? {
            title: { [Op.iLike]: `%${search}%` }
          } : undefined
        },
        {
          model: Employee,
          as: 'employee',
          attributes: ['firstName', 'lastName', 'companyName', 'email']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      boosts: boosts.rows,
      totalCount: boosts.count,
      totalPages: Math.ceil(boosts.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Get all boosts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get boosts for specific employee
export const getEmployeeBoosts = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { employeeId };
    if (status) {
      whereClause.status = status;
    }

    const boosts = await Boost.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['title', 'location', 'type']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      boosts: boosts.rows,
      totalCount: boosts.count,
      totalPages: Math.ceil(boosts.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Get employee boosts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve boost (Admin only)
export const approveBoost = async (req, res) => {
  try {
    const { id } = req.params;

    const boost = await Boost.findByPk(id);
    if (!boost) {
      return res.status(404).json({ message: 'Boost not found' });
    }

    if (boost.status !== 'Pending') {
      return res.status(400).json({ message: 'Boost is not in pending status' });
    }

    // Calculate expiry date based on duration
    const approvedDate = new Date();
    const expiryDate = new Date(approvedDate);
    expiryDate.setDate(expiryDate.getDate() + boost.duration);

    // Calculate financial data
    const platformFeeRate = 0.10; // 10% platform fee
    const platformFee = boost.price * platformFeeRate;
    const netRevenue = boost.price - platformFee;

    await boost.update({
      status: 'Active', // Change to Active instead of Approved
      approvedDate: approvedDate,
      expiryDate: expiryDate,
      paymentStatus: 'Paid',
      platformFee: platformFee,
      netRevenue: netRevenue,
      remainingDays: boost.duration
    });

    res.json({ 
      message: 'Boost approved and activated successfully', 
      boost,
      financialData: {
        totalPrice: boost.price,
        platformFee: platformFee,
        netRevenue: netRevenue
      }
    });
  } catch (error) {
    console.error('Approve boost error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reject boost (Admin only)
export const rejectBoost = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const boost = await Boost.findByPk(id);
    if (!boost) {
      return res.status(404).json({ message: 'Boost not found' });
    }

    if (boost.status !== 'Pending') {
      return res.status(400).json({ message: 'Boost is not in pending status' });
    }

    await boost.update({
      status: 'Rejected',
      rejectedDate: new Date(),
      rejectionReason,
      paymentStatus: 'Refunded'
    });

    res.json({ message: 'Boost rejected successfully', boost });
  } catch (error) {
    console.error('Reject boost error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get financial analytics for admin
export const getFinancialAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

    // Total revenue from active and expired boosts
    const totalRevenue = await Boost.sum('netRevenue', {
      where: {
        status: { [Op.in]: ['Active', 'Expired'] },
        paymentStatus: 'Paid',
        createdAt: { [Op.gte]: startDate }
      }
    });

    // Monthly revenue
    const monthlyRevenue = await Boost.sum('netRevenue', {
      where: {
        status: { [Op.in]: ['Active', 'Expired'] },
        paymentStatus: 'Paid',
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    // Active boosts count
    const activeBoosts = await Boost.count({
      where: { status: 'Active' }
    });

    // Pending boosts count
    const pendingBoosts = await Boost.count({
      where: { status: 'Pending' }
    });

    // Revenue by boost type
    const revenueByType = await Boost.findAll({
      attributes: [
        'boostType',
        [sequelize.fn('SUM', sequelize.col('netRevenue')), 'totalRevenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        status: { [Op.in]: ['Active', 'Expired'] },
        paymentStatus: 'Paid',
        createdAt: { [Op.gte]: startDate }
      },
      group: ['boostType']
    });

    // Calculate additional metrics
    const totalPlatformFees = await Boost.sum('platformFee', {
      where: {
        status: { [Op.in]: ['Active', 'Expired'] },
        paymentStatus: 'Paid',
        createdAt: { [Op.gte]: startDate }
      }
    });

    const refundedAmount = await Boost.sum('price', {
      where: {
        paymentStatus: 'Refunded',
        createdAt: { [Op.gte]: startDate }
      }
    });

    const averageBoostPrice = await Boost.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('price')), 'avgPrice']
      ],
      where: {
        status: { [Op.in]: ['Active', 'Expired'] },
        paymentStatus: 'Paid',
        createdAt: { [Op.gte]: startDate }
      }
    });

    const approvalRate = await Boost.count({
      where: {
        status: { [Op.in]: ['Active', 'Expired'] },
        createdAt: { [Op.gte]: startDate }
      }
    }) / Math.max(await Boost.count({
      where: {
        createdAt: { [Op.gte]: startDate }
      }
    }), 1) * 100;

    res.json({
      totalRevenue: totalRevenue || 0,
      monthlyRevenue: monthlyRevenue || 0,
      activeBoosts,
      pendingBoosts,
      revenueByType,
      totalPlatformFees: totalPlatformFees || 0,
      refundedAmount: refundedAmount || 0,
      averageBoostPrice: parseFloat(averageBoostPrice?.dataValues?.avgPrice || 0),
      approvalRate: Math.round(approvalRate * 100) / 100
    });
  } catch (error) {
    console.error('Get financial analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update boost views and click rate
export const updateBoostStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { views, clickRate } = req.body;

    const boost = await Boost.findByPk(id);
    if (!boost) {
      return res.status(404).json({ message: 'Boost not found' });
    }

    await boost.update({ views, clickRate });

    res.json({ message: 'Boost stats updated successfully', boost });
  } catch (error) {
    console.error('Update boost stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get boost by ID
export const getBoostById = async (req, res) => {
  try {
    const { id } = req.params;

    const boost = await Boost.findByPk(id, {
      include: [
        {
          model: Job,
          as: 'job',
          attributes: ['title', 'location', 'jobType', 'description']
        },
        {
          model: Employee,
          as: 'employee',
          attributes: ['firstName', 'lastName', 'companyName', 'email']
        }
      ]
    });

    if (!boost) {
      return res.status(404).json({ message: 'Boost not found' });
    }

    res.json({ boost });
  } catch (error) {
    console.error('Get boost by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Process refund
export const processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { refundReason } = req.body;

    const boost = await Boost.findByPk(id);
    if (!boost) {
      return res.status(404).json({ message: 'Boost not found' });
    }

    if (boost.paymentStatus === 'Refunded') {
      return res.status(400).json({ message: 'Boost already refunded' });
    }

    await boost.update({
      paymentStatus: 'Refunded',
      status: 'Rejected',
      rejectionReason: refundReason || 'Refund processed by admin'
    });

    res.json({ message: 'Refund processed successfully', boost });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};