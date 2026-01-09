process.env.JWT_SECRET = 'testsecret';
process.env.JWT_EXPIRE = '1h';

import { jest } from '@jest/globals';


jest.unstable_mockModule('sequelize', () => ({
  Sequelize: class { constructor() {} },
  Op: {},
}));


const JobSeeker = {
  findOne: jest.fn(),
  create: jest.fn(),
};
const Admin = class {};
const Employee = {};

jest.unstable_mockModule('../../backend/models/JobSeeker.js', () => ({ default: JobSeeker }));
jest.unstable_mockModule('../../backend/models/Admin.js', () => ({ default: Admin }));
jest.unstable_mockModule('../../backend/models/Employee.js', () => ({ default: Employee }));
jest.unstable_mockModule('../../backend/models/index.js', () => ({
  JobSeeker,
  Admin,
  Employee,
}));

describe('Auth Controller', () => {
  it('should login job seeker successfully', async () => {
    const { jobSeekerLogin } = await import('../../backend/controllers/authController.js');
    const { getMockReq, getMockRes } = await import('@jest-mock/express');

    const req = getMockReq({ body: { email: 'test@example.com', password: 'password123' } });
    const { res } = getMockRes();

    JobSeeker.findOne.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'hashedpassword',
      comparePassword: jest.fn().mockResolvedValue(true),
      toJSON: () => ({ id: 1, email: 'test@example.com' }),
      save: jest.fn(),
    });

    await jobSeekerLogin(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  // Add more tests for register, logout, etc.
});