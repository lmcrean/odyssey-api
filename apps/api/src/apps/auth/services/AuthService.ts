import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthUser, LoginRequest, RegisterRequest, JWTPayload } from '../types';
import { findUserByEmail, createUser, findUserById } from '../../user/models';
import { User } from '../../user/types';
import { v4 as uuidv4 } from 'uuid';

// Simple in-memory store for testing (replace with actual database)
const userStore = new Map<string, { user: AuthUser; hashedPassword: string }>();

export class AuthService {
  private static JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
  private static JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
  private static JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  static async register(userData: RegisterRequest): Promise<AuthUser> {
    // Check if user already exists in database
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const hashedPassword = await bcryptjs.hash(userData.password, 12);
    
    // Create user in database
    const dbUser = await createUser({
      id: uuidv4(),
      email: userData.email,
      password: hashedPassword,
      username: userData.email.split('@')[0] + Date.now(), // Generate username from email
      firstName: userData.firstName || '',
      lastName: userData.lastName || ''
    });

    // Convert database user to AuthUser format
    const user: AuthUser = {
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      isEmailVerified: false,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt
    };

    console.log('User registered in database with ID:', user.id);
    
    return user;
  }

  static async login(credentials: LoginRequest): Promise<AuthUser | null> {
    // Find user in database
    const dbUser = await findUserByEmail(credentials.email);
    if (!dbUser) {
      return null;
    }

    // Verify password
    const isValidPassword = await bcryptjs.compare(credentials.password, dbUser.password);
    if (!isValidPassword) {
      return null;
    }

    // Convert database user to AuthUser format
    const user: AuthUser = {
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      isEmailVerified: false,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt
    };

    return user;
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

    // Get user from database instead of using mock data
    const dbUser = await findUserById(payload.userId);
    if (!dbUser) {
      throw new Error('User not found');
    }

    // Convert database user to AuthUser format
    const user: AuthUser = {
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      isEmailVerified: false,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt
    };

    return this.generateTokens(user);
  }

  // Helper method to clear store for testing
  static clearUserStore() {
    userStore.clear();
  }
} 