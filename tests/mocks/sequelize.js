const mockModel = {
  findOne: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  count: jest.fn()
};

module.exports = {
  sequelize: {
    define: () => mockModel,
    fn: jest.fn(),
    col: jest.fn(),
    literal: jest.fn()
  },
  Admin: mockModel,
  Job: mockModel,
  // Add other models here
};