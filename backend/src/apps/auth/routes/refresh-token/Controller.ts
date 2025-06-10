import { Request, Response } from 'express';
import { AuthService } from '../../services/AuthService';
import { RefreshTokenRequest } from '../../types';

export class RefreshTokenController {
  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken }: RefreshTokenRequest = req.body;

      // Validate input
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Refresh token is required'
        });
      }

      // Refresh tokens
      const tokens = await AuthService.refreshTokens(refreshToken);

      res.json({
        success: true,
        data: tokens,
        message: 'Tokens refreshed successfully'
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      
      if (error.message === 'Invalid refresh token') {
        return res.status(401).json({
          success: false,
          error: 'Authentication failed',
          message: 'Invalid or expired refresh token'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to refresh tokens'
      });
    }
  }
} 