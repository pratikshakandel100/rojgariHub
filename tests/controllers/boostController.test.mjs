process.env.JWT_SECRET = 'testsecret';
process.env.JWT_EXPIRE = '1h';

import { jest } from '@jest/globals';

// Mock sequelize and any shared dependencies
jest.unstable_mockModule('sequelize', () => ({
  Sequelize: class { constructor() {} },
  Op: {},
}));

// Mock models used in boostController
const Job = {
  findByPk: jest.fn(),
};
const Employee = {
  findByPk: jest.fn(),
};
const Boost = {
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  sum: jest.fn(),
  count: jest.fn(),
  findAndCountAll: jest.fn(),
};
const BoostPlan = {
  findByPk: jest.fn(),
};

// Mock model files and index
jest.unstable_mockModule('../../backend/models/Job.js', () => ({ default: Job }));
jest.unstable_mockModule('../../backend/models/Employee.js', () => ({ default: Employee }));
jest.unstable_mockModule('../../backend/models/Boost.js', () => ({ default: Boost }));
jest.unstable_mockModule('../../backend/models/BoostPlan.js', () => ({ default: BoostPlan }));
jest.unstable_mockModule('../../backend/models/index.js', () => ({
  Job,
  Employee,
  Boost,
  BoostPlan,
}));

describe('Boost Controller', () => {
  it('should create a boost successfully', async () => {
    const { createBoost } = await import('../../backend/controllers/boostController.js');
    const { getMockReq, getMockRes } = await import('@jest-mock/express');

    // Setup mock request and response
    const req = getMockReq({
      body: { jobId: 1, boostPlanId: 2, paymentMethod: 'card' },
      user: { id: 10, role: 'employee' }
    });
    const { res } = getMockRes();

    // Mock Job.findByPk to simulate finding a job
    Job.findByPk.mockResolvedValue({ id: 1, employeeId: 10 });

    // Mock BoostPlan.findByPk to simulate finding a boost plan
    BoostPlan.findByPk.mockResolvedValue({ id: 2, isActive: true, price: 100, type: 'Premium', duration: 7 });

    // Mock Boost.findOne to simulate no existing boost
    Boost.findOne.mockResolvedValue(null);

    // Mock Boost.create to simulate boost creation
    Boost.create.mockResolvedValue({ id: 123, jobId: 1 });

    await createBoost(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.any(String),
      boost: expect.objectContaining({ id: 123, jobId: 1 })
    }));
  });

  // Add more tests for error cases, permissions, etc.
});