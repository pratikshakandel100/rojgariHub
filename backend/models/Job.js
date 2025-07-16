import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Job = sequelize.define('Job', {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  requirements: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'),
    allowNull: false,
    defaultValue: 'Full-time'
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: true
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Closed', 'Draft'),
    allowNull: false,
    defaultValue: 'Active'
  },
  applicationDeadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isRemote: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  applicationsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  companyImage: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'jobs',
  timestamps: true
});

export default Job;