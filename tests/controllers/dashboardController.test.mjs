import { jest } from '@jest/globals';


jest.unstable_mockModule('sequelize', () => ({
  Sequelize: class { constructor() {} },
  Op: {
    in: Symbol('in'),
    or: Symbol('or'),
    overlap: Symbol('overlap'),
    gte: Symbol('gte'),
    notIn: Symbol('notIn'),
    iLike: Symbol('iLike'),
    and: Symbol('and'),
  },
  literal: (str) => str,
}));


const Application = {
  count: jest.fn(),
  findAll: jest.fn(),
};
const Job = {
  count: jest.fn(),
  findAll: jest.fn(),
};
const Employee = {};
const JobSeeker = {};
const Boost = {};


jest.unstable_mockModule('../../backend/models/Application.js', () => ({ default: Application }));
jest.unstable_mockModule('../../backend/models/Job.js', () => ({ default: Job }));
jest.unstable_mockModule('../../backend/models/Employee.js', () => ({ default: Employee }));
jest.unstable_mockModule('../../backend/models/JobSeeker.js', () => ({ default: JobSeeker }));
jest.unstable_mockModule('../../backend/models/Boost.js', () => ({ default: Boost }));
jest.unstable_mockModule('../../backend/models/index.js', () => ({
  Application,
  Job,
  Employee,
  JobSeeker,
  Boost,
}));


jest.unstable_mockModule('../../backend/config/database.js', () => ({
  default: { literal: (str) => str }
}));

describe('Dashboard Controller', () => {
  it('should return job seeker dashboard data', async () => {
    const { getJobSeekerDashboard } = await import('../../backend/controllers/dashboardController.js');
    const { getMockReq, getMockRes } = await import('@jest-mock/express');

    // Setup mock request and response
    const req = getMockReq({
      userType: 'jobseeker',
      user: {
        id: 1,
        profileViews: 5,
        profileViewsThisWeek: 2,
        skills: ['JavaScript'],
        experience: 'Mid'
      }
    });
    const { res } = getMockRes();

    // Mock Application.count and findAll
    Application.count.mockResolvedValue(2);
    Application.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    Job.findAll.mockResolvedValue([{ id: 10 }, { id: 11 }]);

    await getJobSeekerDashboard(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      stats: expect.any(Object),
      recentApplications: expect.any(Array),
      recommendedJobs: expect.any(Array)
    }));
  });

  it('should return employee dashboard data', async () => {
    const { getEmployeeDashboard } = await import('../../backend/controllers/dashboardController.js');
    const { getMockReq, getMockRes } = await import('@jest-mock/express');

    // Setup mock request and response
    const req = getMockReq({
      userType: 'employee',
      user: { id: 2 }
    });
    const { res } = getMockRes();

    // Mock Job.count and Application.count/findAll
    Job.count.mockResolvedValue(3);
    Application.count.mockResolvedValue(5);
    Application.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    await getEmployeeDashboard(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      stats: expect.any(Object),
      recentApplications: expect.any(Array)
    }));
  });
});