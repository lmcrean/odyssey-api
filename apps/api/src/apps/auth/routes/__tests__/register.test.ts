import request from 'supertest';
import app from '../../../../server';

describe('POST /api/auth/register', () => {
  // Use unique timestamps to avoid email conflicts between test runs
  const timestamp = Date.now();
  const validUser = {
    email: `test-${timestamp}@register.com`,
    password: 'ValidPass123',
    confirmPassword: 'ValidPass123',
    firstName: 'Test',
    lastName: 'User'
  };

  describe('Successful Registration', () => {
    it('should register a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      
      // Check user data structure
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user).toHaveProperty('email', validUser.email);
      expect(response.body.data.user).toHaveProperty('firstName', validUser.firstName);
      expect(response.body.data.user).toHaveProperty('lastName', validUser.lastName);
      expect(response.body.data.user).toHaveProperty('isEmailVerified');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should register a user with minimal required fields', async () => {
      const minimalUser = {
        email: `minimal-${timestamp + 1}@register.com`,
        password: 'MinimalPass123',
        confirmPassword: 'MinimalPass123',
        firstName: 'Minimal',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(minimalUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.user).toHaveProperty('email', minimalUser.email);
      expect(response.body.data.user).toHaveProperty('firstName', minimalUser.firstName);
      expect(response.body.data.user).toHaveProperty('lastName', minimalUser.lastName);
    });
  });

  describe('Validation Errors', () => {
    it('should reject registration with missing email', async () => {
      const invalidUser = {
        password: 'ValidPass123',
        confirmPassword: 'ValidPass123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('message', 'Email, password, and confirmPassword are required');
    });

    it('should reject registration with missing password', async () => {
      const invalidUser = {
        email: 'test@example.com',
        confirmPassword: 'ValidPass123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Validation error');
    });

    it('should reject registration with invalid email format', async () => {
      const invalidUser = {
        email: 'invalid-email',
        password: 'ValidPass123',
        confirmPassword: 'ValidPass123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('message', 'Invalid email format');
    });

    it('should reject registration when passwords do not match', async () => {
      const invalidUser = {
        email: 'test@mismatch.com',
        password: 'ValidPass123',
        confirmPassword: 'DifferentPass123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('message', 'Passwords do not match');
    });

    it('should reject registration with weak password', async () => {
      const invalidUser = {
        email: 'test@weakpass.com',
        password: 'weak',
        confirmPassword: 'weak'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body.message).toBe('Password must be at least 6 characters long');
    });

    it('should reject registration with password missing numbers', async () => {
      const invalidUser = {
        email: 'test@nonum.com',
        password: 'NoNumbersPass',
        confirmPassword: 'NoNumbersPass'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    });
  });

  describe('Token Generation', () => {
    it('should generate valid JWT tokens upon registration', async () => {
      const uniqueUser = {
        email: `token-test-${Date.now()}@register.com`,
        password: 'ValidPass123',
        confirmPassword: 'ValidPass123',
        firstName: 'Token',
        lastName: 'Test'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(uniqueUser);

      expect(response.status).toBe(201);
      
      const { accessToken, refreshToken } = response.body.data;
      
      // Check that tokens are strings and not empty
      expect(typeof accessToken).toBe('string');
      expect(typeof refreshToken).toBe('string');
      expect(accessToken.length).toBeGreaterThan(0);
      expect(refreshToken.length).toBeGreaterThan(0);
      
      // Tokens should be different
      expect(accessToken).not.toBe(refreshToken);
    });
  });
}); 