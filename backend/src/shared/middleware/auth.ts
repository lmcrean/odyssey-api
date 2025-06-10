import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../apps/auth/services/AuthService';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      message: 'Access token is required'
    });
  }

  const decoded = AuthService.verifyAccessToken(token);
  
  if (!decoded || typeof decoded === 'string') {
    return res.status(403).json({
      success: false,
      error: 'Authentication failed',
      message: 'Invalid or expired access token'
    });
  }

  req.user = {
    userId: decoded.userId,
    email: decoded.email
  };

  next();
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const decoded = AuthService.verifyAccessToken(token);
    
    if (decoded && typeof decoded !== 'string') {
      req.user = {
        userId: decoded.userId,
        email: decoded.email
      };
    }
  }

  next();
}; 