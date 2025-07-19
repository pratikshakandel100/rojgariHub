const request = require('supertest');
const app = require('../../app');
const { Admin } = require('../../models/index');

jest.mock('../../models/index');

describe('POST /auth/admin/login', () => {
  it('logs in admin with valid credentials', async () => {
    Admin.findOne.mockResolvedValue({
      id: '1',
      email: 'admin@test.com',
      comparePassword: jest.fn().mockResolvedValue(true)
    });

    const res = await request(app)
      .post('/auth/admin/login')
      .send({ email: 'admin@test.com', password: 'password123' })
      .expect(200);

    expect(res.body.token).toBeDefined();
  });
});