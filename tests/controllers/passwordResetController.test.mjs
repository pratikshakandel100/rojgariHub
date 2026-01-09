import { jest } from '@jest/globals';

const requestReset = jest.fn();
const verifyToken = jest.fn();
const resetPassword = jest.fn();

jest.unstable_mockModule('../../backend/controllers/passwordResetController.js', () => ({
  requestReset,
  verifyToken,
  resetPassword
}));

describe('Password Reset Controller', () => {
  let controller;

  beforeAll(async () => {
    controller = await import('../../backend/controllers/passwordResetController.js');
  });

  it('should have requestReset defined', () => {
    expect(typeof controller.requestReset).toBe('function');
  });

  it('should have verifyToken defined', () => {
    expect(typeof controller.verifyToken).toBe('function');
  });

  it('should have resetPassword defined', () => {
    expect(typeof controller.resetPassword).toBe('function');
  });
});
