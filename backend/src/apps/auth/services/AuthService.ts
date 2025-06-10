import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthUser, LoginRequest, RegisterRequest } from '../types';

export class AuthService {
  private static JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
  private static JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
  private static JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  static async register(userData: RegisterRequest): Promise<AuthUser> {
    // TODO: Check if user already exists in database
    // TODO: Hash password and save user to database
    
    // Mock implementation for now
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user: AuthUser = {
      id: `user_${Date.now()}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // TODO: Save user to database
    console.log('User registered with hashed password:', hashedPassword);
    
    return user;
  }

  static async login(credentials: LoginRequest): Promise<AuthUser | null> {
    // TODO: Find user by email in database
    // TODO: Compare password with stored hash
    
    // Mock implementation for now
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
      email: user.email
    };

    const accessToken = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    });

    const refreshToken = jwt.sign(payload, this.JWT_REFRESH_SECRET, {
      expiresIn: this.JWT_REFRESH_EXPIRES_IN
    });

    return { accessToken, refreshToken };
  }

  static verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, this.JWT_REFRESH_SECRET);
    } catch (error) {
      return null;
    }
  }

  static async refreshTokens(refreshToken: string) {
    const payload = this.verifyRefreshToken(refreshToken);
    
    if (!payload || typeof payload === 'string') {
      throw new Error('Invalid refresh token');
    }

    // TODO: Get user from database
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
} 