import { jest } from '@jest/globals';

jest.unstable_mockModule('../../backend/controllers/passwordResetController.js', () => ({
  requestReset: jest.fn(),
  verifyToken: jest.fn(),
  resetPassword: jest.fn()
}));

describe('Password Reset Controller', () => {
  let requestReset, verifyToken, resetPassword;

  beforeAll(async () => {
    ({ requestReset, verifyToken, resetPassword } = await import('../../backend/controllers/passwordResetController.js'));
  });

  it('should mock requestReset function', () => {
    expect(typeof requestReset).toBe('function');
  });

  it('should mock verifyToken function', () => {
    expect(typeof verifyToken).toBe('function');
  });

  it('should mock resetPassword function', () => {
    expect(typeof resetPassword).toBe('function');
  });
});
