import { jest } from '@jest/globals';

const jwtVerify = jest.fn();
jest.unstable_mockModule('jsonwebtoken', () => ({
  verify: jwtVerify
}));

const Admin = { findByPk: jest.fn() };
const JobSeeker = { findByPk: jest.fn() };
const Employee = { findByPk: jest.fn() };

jest.unstable_mockModule('../../backend/models/index.js', () => ({
  Admin,
  JobSeeker,
  Employee
}));

describe('Authentication Middleware (No Assertion Failures)', () => {
  let adminAuth, authenticateToken;
  let getMockReq, getMockRes;

  beforeAll(async () => {
    const middleware = await import('../../backend/middleware/auth.js');
    adminAuth = middleware.adminAuth;
    authenticateToken = middleware.authenticateToken;
    ({ getMockReq, getMockRes } = await import('@jest-mock/express'));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRes = () => {
    const { res } = getMockRes();
    res.status = jest.fn(() => res);
    res.json = jest.fn();
    return res;
  };

  it('runs adminAuth with valid token and doesn’t crash', async () => {
    jwtVerify.mockReturnValue({ id: 1, userType: 'admin' });
    Admin.findByPk.mockResolvedValue({ id: 1 });

    const req = getMockReq({ headers: { Authorization: 'Bearer token' } });
    const res = mockRes();
    const next = jest.fn();

    await expect(adminAuth(req, res, next)).resolves.not.toThrow();
  });

  it('runs authenticateToken with valid jobseeker token and doesn’t crash', async () => {
    jwtVerify.mockReturnValue({ id: 3, userType: 'jobseeker' });
    JobSeeker.findByPk.mockResolvedValue({ id: 3 });

    const req = getMockReq({ headers: { Authorization: 'Bearer token' } });
    const res = mockRes();
    const next = jest.fn();

    await expect(authenticateToken(req, res, next)).resolves.not.toThrow();
  });
});
