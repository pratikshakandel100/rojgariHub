import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  recipientId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  recipientType: {
    type: DataTypes.ENUM('admin', 'employee', 'jobseeker'),
    allowNull: false
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  senderType: {
    type: DataTypes.ENUM('admin', 'employee', 'jobseeker'),
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM(
      'application_received',
      'application_approved',
      'application_rejected',
      'job_posted',
      'profile_viewed',
      'system_message'
    ),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  relatedEntityId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  relatedEntityType: {
    type: DataTypes.ENUM('job', 'application', 'user'),
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'notifications',
  timestamps: true
});

export default Notification;