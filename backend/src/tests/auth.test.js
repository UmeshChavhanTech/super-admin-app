const request = require('supertest');
const { sequelize } = require('../models');
const app = require('../app');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth API', () => {
  it('should login with valid credentials', async () => {
    // First create a user
    const User = require('../models').User;
    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
  });
  
  it('should not login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });
});