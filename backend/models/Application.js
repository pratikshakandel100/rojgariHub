import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'jobs',
      key: 'id'
    }
  },
  jobSeekerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'job_seekers',
      key: 'id'
    }
  },
  employeeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Reviewed', 'Accepted', 'Rejected', 'Withdrawn', 'Shortlisted', 'Hired'),
    allowNull: false,
    defaultValue: 'Pending'
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reviewedBy: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'applications',
  timestamps: true
});

export default Application;