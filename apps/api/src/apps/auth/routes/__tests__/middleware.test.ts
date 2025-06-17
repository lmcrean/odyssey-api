import request from 'supertest';
import app from '../../../../server';
import { AuthService } from '../../services/AuthService';
import { JWTPayload } from '../../types';

describe('Authentication Middleware', () => {
  let validAccessToken: string;
  let validRefreshToken: string;
  const timestamp = Date.now();
  const testUser = {
    email: `middlewaretest-${timestamp}@example.com`,
    password: 'MiddlewareTest123',
    confirmPassword: 'MiddlewareTest123',
    firstName: 'Middleware',
    lastName: 'Test'
  };
  
  beforeAll(async () => {
    // Register a user first
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    // Get valid tokens for testing
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    validAccessToken = loginResponse.body.data.accessToken;
    validRefreshToken = loginResponse.body.data.refreshToken;
  });

  describe('Token Validation', () => {
    it('should validate access tokens correctly', () => {
      const decoded = AuthService.verifyAccessToken(validAccessToken);
      
      expect(decoded).toBeTruthy();
      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('email');
      if (decoded) {
        expect(decoded.email).toBe(testUser.email);
      }
    });

    it('should validate refresh tokens correctly', () => {
      const decoded = AuthService.verifyRefreshToken(validRefreshToken);
      
      expect(decoded).toBeTruthy();
      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('email');
      if (decoded) {
        expect(decoded.email).toBe(testUser.email);
      }
    });

    it('should reject invalid access tokens', () => {
      const decoded = AuthService.verifyAccessToken('invalid-token');
      expect(decoded).toBeNull();
    });

    it('should reject invalid refresh tokens', () => {
      const decoded = AuthService.verifyRefreshToken('invalid-token');
      expect(decoded).toBeNull();
    });

    it('should reject malformed JWT tokens', () => {
      const decoded1 = AuthService.verifyAccessToken('malformed.jwt.token');
      const decoded2 = AuthService.verifyRefreshToken('malformed.jwt.token');
      
      expect(decoded1).toBeNull();
      expect(decoded2).toBeNull();
    });

    it('should reject empty tokens', () => {
      const decoded1 = AuthService.verifyAccessToken('');
      const decoded2 = AuthService.verifyRefreshToken('');
      
      expect(decoded1).toBeNull();
      expect(decoded2).toBeNull();
    });
  });

  describe('Token Generation', () => {
    it('should generate different tokens each time', () => {
      const mockUser = {
        id: 'test-user-id',
        email: testUser.email,
        firstName: 'Test',
        lastName: 'User',
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const tokens1 = AuthService.generateTokens(mockUser);
      const tokens2 = AuthService.generateTokens(mockUser);
      
      expect(tokens1.accessToken).not.toBe(tokens2.accessToken);
      expect(tokens1.refreshToken).not.toBe(tokens2.refreshToken);
    });

    it('should generate tokens with correct payload', () => {
      const decoded1 = AuthService.verifyAccessToken(validAccessToken);
      const decoded2 = AuthService.verifyRefreshToken(validRefreshToken);
      
      expect(decoded1).toBeTruthy();
      expect(decoded2).toBeTruthy();
      
      if (decoded1) {
        expect(decoded1.email).toBe(testUser.email);
        expect(decoded1).toHaveProperty('userId');
      }
      
      if (decoded2) {
        expect(decoded2.email).toBe(testUser.email);
        expect(decoded2).toHaveProperty('userId');
      }
    });
  });

  describe('Token Lifecycle', () => {
    it('should handle token refresh workflow', async () => {
      // Use refresh token to get new tokens
      const refreshResponse = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: validRefreshToken });

      expect(refreshResponse.status).toBe(200);
      expect(refreshResponse.body).toHaveProperty('success', true);
      expect(refreshResponse.body.data).toHaveProperty('accessToken');
      expect(refreshResponse.body.data).toHaveProperty('refreshToken');
      
      // New tokens should be different from original
      expect(refreshResponse.body.data.accessToken).not.toBe(validAccessToken);
      expect(refreshResponse.body.data.refreshToken).not.toBe(validRefreshToken);
    });

    it('should maintain user identity across token refresh', async () => {
      const refreshResponse = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: validRefreshToken });

      const newAccessToken = refreshResponse.body.data.accessToken;
      const decoded = AuthService.verifyAccessToken(newAccessToken);
      
      expect(decoded).toBeTruthy();
      if (decoded) {
        expect(decoded.email).toBe(testUser.email);
      }
    });
  });

  describe('Security Validations', () => {
    it('should not accept tokens with tampered payload', () => {
      // Create a token with tampered payload (this would fail signature verification)
      const tamperedToken = validAccessToken.slice(0, -10) + 'tampered123';
      const decoded = AuthService.verifyAccessToken(tamperedToken);
      
      expect(decoded).toBeNull();
    });

    it('should handle token expiry gracefully', () => {
      // Note: This test would require creating an expired token
      // For now, we'll test with an obviously invalid token
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxfQ.invalid';
      const decoded = AuthService.verifyAccessToken(expiredToken);
      
      expect(decoded).toBeNull();
    });
  });
}); 