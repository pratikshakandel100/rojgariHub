module.exports = {
  sequelize: {
    define: jest.fn(() => ({
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      count: jest.fn()
    })),
    fn: jest.fn(),
    col: jest.fn(),
    literal: jest.fn()
  },
  Admin: {
    findOne: jest.fn(),
    create: jest.fn()
  },
  Job: {
    findAndCountAll: jest.fn()
  }
};