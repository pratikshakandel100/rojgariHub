jest.mock('../models', () => ({
  Admin: {
    findOne: jest.fn(),
    create: jest.fn()
  },
  Job: {
    findAndCountAll: jest.fn()
  },
  // Add other models here
}));