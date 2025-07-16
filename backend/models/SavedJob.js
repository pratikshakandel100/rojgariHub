import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SavedJob = sequelize.define('SavedJob', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  jobSeekerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'job_seekers',
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
  savedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'saved_jobs',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['jobSeekerId', 'jobId']
    }
  ]
});

export default SavedJob;