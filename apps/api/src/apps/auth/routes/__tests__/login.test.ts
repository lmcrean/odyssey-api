import request from 'supertest';
import app from '../../../../server';

describe('POST /api/auth/login', () => {
  const timestamp = Date.now();
  // Create unique credentials for each test run
  const validCredentials = {
    email: `logintest-${timestamp}@example.com`,
    password: 'ValidPass123'
  };

  const invalidCredentials = {
    email: 'wrong@example.com',
    password: 'wrongpassword'
  };

  // Create a user before running login tests
  beforeAll(async () => {
    // Register the user that we'll use for login tests
    await request(app)
      .post('/api/auth/register')
      .send({
        email: validCredentials.email,
        password: validCredentials.password,
        confirmPassword: validCredentials.password,
        firstName: 'Login',
        lastName: 'Test'
      });
  });

  describe('Successful Login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(validCredentials);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      
      // Check user data structure
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user).toHaveProperty('email', validCredentials.email);
      expect(response.body.data.user).toHaveProperty('firstName');
      expect(response.body.data.user).toHaveProperty('lastName');
      expect(response.body.data.user).toHaveProperty('isEmailVerified');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should generate valid JWT tokens upon login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(validCredentials);

      expect(response.status).toBe(200);
      
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

  describe('Failed Login', () => {
    it('should reject login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidCredentials);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Authentication failed');
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should reject login with correct email but wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: validCredentials.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Authentication failed');
      expect(response.body).toHaveProperty('message', 'Invalid email or password');
    });

    it('should reject login with missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('message', 'Email and password are required');
    });

    it('should reject login with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('message', 'Email and password are required');
    });

    it('should reject login with empty credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Validation error');
      expect(response.body).toHaveProperty('message', 'Email and password are required');
    });

    it('should reject login with null credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: null,
          password: null
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Validation error');
    });
  });

  describe('Multiple Login Attempts', () => {
    it('should handle multiple successful logins', async () => {
      const login1 = await request(app)
        .post('/api/auth/login')
        .send(validCredentials);

      const login2 = await request(app)
        .post('/api/auth/login')
        .send(validCredentials);

      expect(login1.status).toBe(200);
      expect(login2.status).toBe(200);
      
      // Each login should generate different tokens
      expect(login1.body.data.accessToken).not.toBe(login2.body.data.accessToken);
      expect(login1.body.data.refreshToken).not.toBe(login2.body.data.refreshToken);
    });

    it('should handle mixed valid and invalid login attempts', async () => {
      const validLogin = await request(app)
        .post('/api/auth/login')
        .send(validCredentials);

      const invalidLogin = await request(app)
        .post('/api/auth/login')
        .send(invalidCredentials);

      const anotherValidLogin = await request(app)
        .post('/api/auth/login')
        .send(validCredentials);

      expect(validLogin.status).toBe(200);
      expect(invalidLogin.status).toBe(401);
      expect(anotherValidLogin.status).toBe(200);
    });
  });
}); 