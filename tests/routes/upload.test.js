const request = require('supertest');
const app = require('../../app');  // Make sure this path is correct
const path = require('path');

jest.mock('../../models');

describe('File Upload', () => {
  it('should upload a file', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('file', path.join(__dirname, 'test-file.txt'));
    expect(res.status).toBe(200);
  });
});