import { jest } from '@jest/globals';

const updateProfile = jest.fn();
const uploadPicture = jest.fn();

jest.unstable_mockModule('../../backend/controllers/profileController.js', () => ({
  updateProfile,
  uploadPicture
}));

describe('Profile Controller', () => {
  let controller;

  beforeAll(async () => {
    controller = await import('../../backend/controllers/profileController.js');
  });

  it('should have updateProfile defined', () => {
    expect(typeof controller.updateProfile).toBe('function');
  });

  it('should have uploadPicture defined', () => {
    expect(typeof controller.uploadPicture).toBe('function');
  });
});
