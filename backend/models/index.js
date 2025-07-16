import sequelize from '../config/database.js';
import Admin from './Admin.js';
import Employee from './Employee.js';
import JobSeeker from './JobSeeker.js';
import Job from './Job.js';
import Application from './Application.js';
import Boost from './Boost.js';
import BoostPlan from './BoostPlan.js';
import PasswordReset from './PasswordReset.js';
import Notification from './Notification.js';
import SavedJob from './SavedJob.js';

Employee.hasMany(Job, {
  foreignKey: 'employeeId',
  as: 'jobs'
});

Job.belongsTo(Employee, {
  foreignKey: 'employeeId',
  as: 'employee'
});

JobSeeker.hasMany(Application, {
  foreignKey: 'jobSeekerId',
  as: 'applications'
});

Application.belongsTo(JobSeeker, {
  foreignKey: 'jobSeekerId',
  as: 'jobSeeker'
});

Job.hasMany(Application, {
  foreignKey: 'jobId',
  as: 'applications'
});

Application.belongsTo(Job, {
  foreignKey: 'jobId',
  as: 'job'
});

Employee.hasMany(Application, {
  foreignKey: 'employeeId',
  as: 'receivedApplications'
});

Application.belongsTo(Employee, {
  foreignKey: 'employeeId',
  as: 'employer'
});

// Boost relationships
Employee.hasMany(Boost, {
  foreignKey: 'employeeId',
  as: 'boosts'
});

Boost.belongsTo(Employee, {
  foreignKey: 'employeeId',
  as: 'employee'
});

Job.hasMany(Boost, {
  foreignKey: 'jobId',
  as: 'boosts'
});

Boost.belongsTo(Job, {
  foreignKey: 'jobId',
  as: 'job'
});

BoostPlan.hasMany(Boost, {
  foreignKey: 'boostPlanId',
  as: 'boosts'
});

Boost.belongsTo(BoostPlan, {
  foreignKey: 'boostPlanId',
  as: 'boostPlan'
});

// Notification relationships
Admin.hasMany(Notification, {
  foreignKey: 'recipientId',
  constraints: false,
  scope: {
    recipientType: 'admin'
  },
  as: 'notifications'
});

Employee.hasMany(Notification, {
  foreignKey: 'recipientId',
  constraints: false,
  scope: {
    recipientType: 'employee'
  },
  as: 'notifications'
});

JobSeeker.hasMany(Notification, {
  foreignKey: 'recipientId',
  constraints: false,
  scope: {
    recipientType: 'jobseeker'
  },
  as: 'notifications'
});

// SavedJob relationships
JobSeeker.hasMany(SavedJob, {
  foreignKey: 'jobSeekerId',
  as: 'savedJobs'
});

SavedJob.belongsTo(JobSeeker, {
  foreignKey: 'jobSeekerId',
  as: 'jobSeeker'
});

Job.hasMany(SavedJob, {
  foreignKey: 'jobId',
  as: 'savedByUsers'
});

SavedJob.belongsTo(Job, {
  foreignKey: 'jobId',
  as: 'job'
});

const models = {
  Admin,
  Employee,
  JobSeeker,
  Job,
  Application,
  Boost,
  PasswordReset,
  Notification,
  SavedJob,
  sequelize
};

export default models;
export {
  sequelize,
  Admin,
  Employee,
  JobSeeker,
  Job,
  Application,
  Boost,
  BoostPlan,
  PasswordReset,
  Notification,
  SavedJob
};