import { validationResult } from 'express-validator';
import { BoostPlan } from '../models/index.js';
import { Op } from 'sequelize';

export const createBoostPlan = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      type,
      duration,
      price,
      features,
      visibilityMultiplier,
      description,
      badge,
      badgeColor,
      sortOrder
    } = req.body;

    const boostPlan = await BoostPlan.create({
      name,
      type,
      duration,
      price,
      features: features || [],
      visibilityMultiplier: visibilityMultiplier || 1.0,
      description,
      badge,
      badgeColor: badgeColor || 'blue',
      sortOrder: sortOrder || 0
    });

    res.status(201).json({
      success: true,
      message: 'Boost plan created successfully',
      boostPlan
    });
  } catch (error) {
    console.error('Create boost plan error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllBoostPlans = async (req, res) => {
  try {
    const { active } = req.query;
    
    const whereClause = {};
    if (active !== undefined) {
      whereClause.isActive = active === 'true';
    }

    const boostPlans = await BoostPlan.findAll({
      where: whereClause,
      order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']]
    });

    res.json({
      success: true,
      boostPlans
    });
  } catch (error) {
    console.error('Get boost plans error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBoostPlanById = async (req, res) => {
  try {
    const { id } = req.params;

    const boostPlan = await BoostPlan.findByPk(id);
    if (!boostPlan) {
      return res.status(404).json({ message: 'Boost plan not found' });
    }

    res.json({
      success: true,
      boostPlan
    });
  } catch (error) {
    console.error('Get boost plan error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateBoostPlan = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    const boostPlan = await BoostPlan.findByPk(id);
    if (!boostPlan) {
      return res.status(404).json({ message: 'Boost plan not found' });
    }

    await boostPlan.update(updateData);

    res.json({
      success: true,
      message: 'Boost plan updated successfully',
      boostPlan
    });
  } catch (error) {
    console.error('Update boost plan error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteBoostPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const boostPlan = await BoostPlan.findByPk(id);
    if (!boostPlan) {
      return res.status(404).json({ message: 'Boost plan not found' });
    }

    await boostPlan.destroy();

    res.json({
      success: true,
      message: 'Boost plan deleted successfully'
    });
  } catch (error) {
    console.error('Delete boost plan error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const toggleBoostPlanStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const boostPlan = await BoostPlan.findByPk(id);
    if (!boostPlan) {
      return res.status(404).json({ message: 'Boost plan not found' });
    }

    await boostPlan.update({ isActive: !boostPlan.isActive });

    res.json({
      success: true,
      message: `Boost plan ${boostPlan.isActive ? 'activated' : 'deactivated'} successfully`,
      boostPlan
    });
  } catch (error) {
    console.error('Toggle boost plan status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getActiveBoostPlansForEmployees = async (req, res) => {
  try {
    const boostPlans = await BoostPlan.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC'], ['price', 'ASC']]
    });

    res.json({
      success: true,
      boostPlans
    });
  } catch (error) {
    console.error('Get active boost plans error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};