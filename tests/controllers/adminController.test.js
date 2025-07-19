const { getDashboardStats } = require('../../backend/controllers/adminController');
const { Job, Employee, Application } = require('../../backend/models');
const { mockRequest, mockResponse } = require('@jest-mock/express');

jest.mock('@models');

describe('Admin Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches dashboard stats', async () => {
    Job.count.mockResolvedValue(100);
    Employee.count.mockResolvedValue(50);
    Application.count.mockResolvedValue(200);

    const req = mockRequest();
    const res = mockResponse();

    await getDashboardStats(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      stats: expect.objectContaining({
        totalJobs: 100,
        totalEmployees: 50
      })
    });
  });
});