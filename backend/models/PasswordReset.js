import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import crypto from 'crypto';

const PasswordReset = sequelize.define('PasswordReset', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  userType: {
    type: DataTypes.ENUM('Admin', 'Employee', 'JobSeeker'),
    allowNull: false
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  usedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'password_resets',
  timestamps: true,
  hooks: {
    beforeCreate: (passwordReset) => {
      // Generate secure random token
      passwordReset.token = crypto.randomBytes(32).toString('hex');
      // Set expiry to 1 hour from now
      passwordReset.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    }
  }
});

// Instance method to check if token is expired
PasswordReset.prototype.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Instance method to mark token as used
PasswordReset.prototype.markAsUsed = function() {
  this.isUsed = true;
  this.usedAt = new Date();
  return this.save();
};

export default PasswordReset;