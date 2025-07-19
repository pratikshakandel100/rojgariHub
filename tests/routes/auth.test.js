const request = require('supertest');
const app = require('../../app');
const { Admin } = require('../../models');

jest.mock('../../models');

describe('Auth Controller', () => {
  it('should login admin', async () => {
    Admin.findOne.mockResolvedValue({
      id: 1,
      email: 'admin@test.com',
      comparePassword: jest.fn().mockResolvedValue(true)
    });

    const res = await request(app)
      .post('/auth/admin/login')
      .send({ email: 'admin@test.com', password: 'password' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});