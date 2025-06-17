import { Request, Response } from 'express';
import { AuthService } from '../../services/AuthService';
import { LoginRequest } from '../../types';

export class LoginController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password }: LoginRequest = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Email and password are required'
        });
      }

      // Attempt login
      const user = await AuthService.login({ email, password });
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication failed',
          message: 'Invalid email or password'
        });
      }

      // Generate tokens
      const { accessToken, refreshToken } = AuthService.generateTokens(user);

      res.json({
        success: true,
        data: {
          user,
          accessToken,
          refreshToken
        },
        message: 'Login successful'
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to authenticate user'
      });
    }
  }
} 