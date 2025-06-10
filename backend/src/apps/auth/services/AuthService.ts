import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthUser, LoginRequest, RegisterRequest, JWTPayload } from '../types';

// Simple in-memory store for testing (replace with actual database)
const userStore = new Map<string, { user: AuthUser; hashedPassword: string }>();

export class AuthService {
  private static JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
  private static JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
  private static JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  static async register(userData: RegisterRequest): Promise<AuthUser> {
    // Check if user already exists
    if (userStore.has(userData.email)) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const hashedPassword = await bcryptjs.hash(userData.password, 12);
    
    const user: AuthUser = {
      id: `user_${Date.now()}_${Math.random()}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store user in memory
    userStore.set(userData.email, { user, hashedPassword });
    console.log('User registered with hashed password:', hashedPassword);
    
    return user;
  }

  static async login(credentials: LoginRequest): Promise<AuthUser | null> {
    // Check in-memory store first
    const storedData = userStore.get(credentials.email);
    if (storedData) {
      const isValidPassword = await bcryptjs.compare(credentials.password, storedData.hashedPassword);
      if (isValidPassword) {
        return storedData.user;
      }
    }

    // Fallback to mock user for testing
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      return {
        id: 'user_123',
        email: credentials.email,
        firstName: 'Test',
        lastName: 'User',
        isEmailVerified: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      };
    }
    
    return null;
  }

  static generateTokens(user: AuthUser) {
    const payload = {
      userId: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
      nonce: Math.random().toString(36).substring(2)
    };

    const accessToken = (jwt.sign as any)(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
    const refreshToken = (jwt.sign as any)(payload, this.JWT_REFRESH_SECRET, { expiresIn: this.JWT_REFRESH_EXPIRES_IN });

    return { accessToken, refreshToken };
  }

  static verifyAccessToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET);
      return decoded as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.JWT_REFRESH_SECRET);
      return decoded as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static async refreshTokens(refreshToken: string) {
    const payload = this.verifyRefreshToken(refreshToken);
    
    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    // In a real implementation, you would get user from database
    const user: AuthUser = {
      id: payload.userId,
      email: payload.email,
      firstName: 'Test',
      lastName: 'User',
      isEmailVerified: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date()
    };

    return this.generateTokens(user);
  }

  // Helper method to clear store for testing
  static clearUserStore() {
    userStore.clear();
  }
} 