const request = require('supertest');
const app = require('../../app');
const { Job } = require('../../models');

jest.mock('../../models/index');

describe('GET /jobs', () => {
  it('returns paginated jobs', async () => {
    Job.findAndCountAll.mockResolvedValue({
      rows: [{ id: '1', title: 'Backend Developer' }],
      count: 1
    });

    const res = await request(app)
      .get('/jobs?page=1&limit=10')
      .expect(200);

    expect(res.body.jobs[0].title).toBe('Backend Developer');
  });
});