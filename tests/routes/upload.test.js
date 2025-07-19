const request = require('supertest');
const app = require('../../app');
const path = require('path');
const fs = require('fs');

describe('POST /upload/profile-picture', () => {
  it('uploads a profile picture', async () => {
    const testImage = path.join(__dirname, '../fixtures/test-image.jpg');
    
    const res = await request(app)
      .post('/upload/profile-picture')
      .attach('profilePicture', testImage)
      .expect(200);

    expect(res.body.profilePicture).toMatch(/\/uploads\/profile-pictures\//);
  });
});