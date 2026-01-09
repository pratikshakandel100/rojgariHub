import { jest } from '@jest/globals';

jest.unstable_mockModule('sequelize', () => ({
  Sequelize: class { constructor() {} },
  Op: {},
}));

// Shared mock model objects
const Employee = {
  count: jest.fn(),
  findAll: jest.fn(),
  hasMany: jest.fn(),
  belongsTo: jest.fn(),
  belongsToMany: jest.fn(),
  hasOne: jest.fn(),
};
const JobSeeker = {
  count: jest.fn(),
  findAll: jest.fn(),
  hasMany: jest.fn(),
  belongsTo: jest.fn(),
  belongsToMany: jest.fn(),
  hasOne: jest.fn(),
};
const Job = {
  count: jest.fn(),
  findAll: jest.fn(),
  hasMany: jest.fn(),
  belongsTo: jest.fn(),
  belongsToMany: jest.fn(),
  hasOne: jest.fn(),
};
const Application = {
  count: jest.fn(),
  findAll: jest.fn(),
  hasMany: jest.fn(),
  belongsTo: jest.fn(),
  belongsToMany: jest.fn(),
  hasOne: jest.fn(),
};
const Admin = class {};

jest.unstable_mockModule('../../backend/models/Employee.js', () => ({ default: Employee }));
jest.unstable_mockModule('../../backend/models/Job.js', () => ({ default: Job }));
jest.unstable_mockModule('../../backend/models/JobSeeker.js', () => ({ default: JobSeeker }));
jest.unstable_mockModule('../../backend/models/Application.js', () => ({ default: Application }));
jest.unstable_mockModule('../../backend/models/Admin.js', () => ({ default: Admin }));

jest.unstable_mockModule('../../backend/models/index.js', () => ({
  Employee,
  JobSeeker,
  Job,
  Application,
  Admin,
}));

describe('Admin Controller', () => {
  it('should return dashboard statistics', async () => {
    // Dynamically import after all mocks are set up
    const { getDashboardStats } = await import('../../backend/controllers/adminController.js');
    const { getMockReq, getMockRes } = await import('@jest-mock/express');

    const req = getMockReq();
    const { res } = getMockRes();

    // Optionally, set up return values for your mocks here

    await getDashboardStats(req, res);

    expect(res.json).toHaveBeenCalled();
  });
});