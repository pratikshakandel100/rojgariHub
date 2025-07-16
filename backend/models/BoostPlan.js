import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BoostPlan = sequelize.define('BoostPlan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Basic', 'Standard', 'Premium', 'Enterprise'),
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duration in days'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  features: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  visibilityMultiplier: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: false,
    defaultValue: 1.0,
    comment: 'How much visibility boost this plan provides (e.g., 2.0 = 2x visibility)'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Order in which plans are displayed'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  badge: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Badge text like "Most Popular", "Best Value"'
  },
  badgeColor: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'blue',
    comment: 'Badge color theme'
  }
}, {
  tableName: 'boost_plans',
  timestamps: true
});

export default BoostPlan;