import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Boost = sequelize.define('Boost', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  employeeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id'
    }
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'jobs',
      key: 'id'
    }
  },
  boostPlanId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'boost_plans',
      key: 'id'
    }
  },
  boostType: {
    type: DataTypes.ENUM('Basic', 'Standard', 'Premium'),
    allowNull: false,
    defaultValue: 'Basic'
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
  platformFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  netRevenue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Active', 'Expired', 'Rejected', 'Approved'),
    allowNull: false,
    defaultValue: 'Pending'
  },
  paymentStatus: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Failed', 'Refunded'),
    allowNull: false,
    defaultValue: 'Pending'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  submittedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  approvedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rejectedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  clickRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  remainingDays: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'boosts',
  timestamps: true
});

export default Boost;