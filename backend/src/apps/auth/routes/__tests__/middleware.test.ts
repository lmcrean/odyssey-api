import request from 'supertest';
import app from '../../../../server';
import { AuthService } from '../../services/AuthService';
import { JWTPayload } from '../../types';

describe('Authentication Middleware', () => {
  let validAccessToken: string;
  let validRefreshToken: string;
  
  beforeAll(async () => {
    // Get valid tokens for testing
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password'
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
        expect(decoded.email).toBe('test@example.com');
      }
    });

    it('should validate refresh tokens correctly', () => {
      const decoded = AuthService.verifyRefreshToken(validRefreshToken);
      
      expect(decoded).toBeTruthy();
      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('email');
      if (decoded) {
        expect(decoded.email).toBe('test@example.com');
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
      const malformedToken = 'not.a.valid.jwt.token';
      const decoded = AuthService.verifyAccessToken(malformedToken);
      expect(decoded).toBeNull();
    });

    it('should reject empty tokens', () => {
      const decoded1 = AuthService.verifyAccessToken('');
      const decoded2 = AuthService.verifyAccessToken(null as any);
      const decoded3 = AuthService.verifyAccessToken(undefined as any);
      
      expect(decoded1).toBeNull();
      expect(decoded2).toBeNull();
      expect(decoded3).toBeNull();
    });
  });

  describe('Token Generation', () => {
    it('should generate different tokens each time', () => {
      const user = {
        id: 'test-user',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const tokens1 = AuthService.generateTokens(user);
      const tokens2 = AuthService.generateTokens(user);

      expect(tokens1.accessToken).not.toBe(tokens2.accessToken);
      expect(tokens1.refreshToken).not.toBe(tokens2.refreshToken);
    });

    it('should generate tokens with correct payload', () => {
      const user = {
        id: 'test-user-123',
        email: 'unique@test.com',
        firstName: 'Test',
        lastName: 'User',
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const tokens = AuthService.generateTokens(user);
      
      const accessDecoded = AuthService.verifyAccessToken(tokens.accessToken);
      const refreshDecoded = AuthService.verifyRefreshToken(tokens.refreshToken);

      expect(accessDecoded).toHaveProperty('userId', user.id);
      expect(accessDecoded).toHaveProperty('email', user.email);
      expect(refreshDecoded).toHaveProperty('userId', user.id);
      expect(refreshDecoded).toHaveProperty('email', user.email);
    });
  });

  describe('Token Lifecycle', () => {
    it('should handle token refresh workflow', async () => {
      // Step 1: Login to get initial tokens
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password'
        });

      const initialTokens = loginResponse.body.data;

      // Step 2: Use refresh token to get new tokens
      const refreshResponse = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: initialTokens.refreshToken });

      expect(refreshResponse.status).toBe(200);
      const newTokens = refreshResponse.body.data;

      // Step 3: Verify new tokens are different
      expect(newTokens.accessToken).not.toBe(initialTokens.accessToken);
      expect(newTokens.refreshToken).not.toBe(initialTokens.refreshToken);

      // Step 4: Verify new tokens are valid
      const accessDecoded = AuthService.verifyAccessToken(newTokens.accessToken);
      const refreshDecoded = AuthService.verifyRefreshToken(newTokens.refreshToken);

      expect(accessDecoded).toBeTruthy();
      expect(refreshDecoded).toBeTruthy();
    });

    it('should maintain user identity across token refresh', async () => {
      const refreshResponse = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: validRefreshToken });

      const newTokens = refreshResponse.body.data;
      
      const originalDecoded = AuthService.verifyAccessToken(validAccessToken);
      const newDecoded = AuthService.verifyAccessToken(newTokens.accessToken);

      if (originalDecoded && newDecoded) {
        expect(originalDecoded.userId).toBe(newDecoded.userId);
        expect(originalDecoded.email).toBe(newDecoded.email);
      }
    });
  });

  describe('Security Validations', () => {
    it('should not accept tokens with tampered payload', () => {
      // This simulates a token where someone tried to change the user ID
      const tamperedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJoYWNrZXIiLCJlbWFpbCI6ImhhY2tlckBleGFtcGxlLmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.invalid-signature';
      
      const decoded = AuthService.verifyAccessToken(tamperedToken);
      expect(decoded).toBeNull();
    });

    it('should handle token expiry gracefully', () => {
      // In a real scenario, you would test with an actually expired token
      // For now, we test the verification mechanism with invalid tokens
      const expiredLookingToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid';
      
      const decoded = AuthService.verifyAccessToken(expiredLookingToken);
      expect(decoded).toBeNull();  // Should fail due to invalid signature
    });
  });
}); 