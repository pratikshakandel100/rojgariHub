const request = require('supertest');
const app = require('@app');
const { Admin } = require('@models');

describe('POST /auth/admin/login', () => {
  it('should login admin', async () => {
    Admin.findOne.mockResolvedValue({
      id: 1,
      email: 'admin@test.com',
      comparePassword: jest.fn().mockResolvedValue(true)
    });

    const response = await request(app)
      .post('/auth/admin/login')
      .send({ email: 'admin@test.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});