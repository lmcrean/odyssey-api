import { Request, Response } from 'express';
import { AuthService } from '../../services/AuthService';
import { ValidationService } from '../../services/ValidationService';
import { RegisterRequest } from '../../types';

export class RegisterController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, confirmPassword, firstName, lastName }: RegisterRequest = req.body;

      // Validate input
      if (!email || !password || !confirmPassword) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Email, password, and confirmPassword are required'
        });
      }

      // Validate email format
      if (!ValidationService.validateEmail(email)) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Invalid email format'
        });
      }

      // Validate password match
      if (!ValidationService.validatePasswordMatch(password, confirmPassword)) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Passwords do not match'
        });
      }

      // Validate password strength
      const passwordValidation = ValidationService.validatePassword(password);
      if (!passwordValidation.valid) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: passwordValidation.message
        });
      }

      // Register user
      const user = await AuthService.register({
        email,
        password,
        confirmPassword,
        firstName,
        lastName
      });

      // Generate tokens
      const { accessToken, refreshToken } = AuthService.generateTokens(user);

      res.status(201).json({
        success: true,
        data: {
          user,
          accessToken,
          refreshToken
        },
        message: 'User registered successfully'
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to register user'
      });
    }
  }
} 