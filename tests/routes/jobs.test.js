// Add this at the top if you're still having issues
jest.mock('@models', () => ({
  Job: {
    findAndCountAll: jest.fn().mockResolvedValue({
      rows: [],
      count: 0
    })
  }
}));

const request = require('supertest');
const app = require('@app'); // This should now work
const { Job } = require('@models');