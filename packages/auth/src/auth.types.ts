export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
  industry: string;
  website?: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  company: Company;
  expiresAt: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface JwtSettings {
  secretKey: string;
  issuer: string;
  audience: string;
  expirationMinutes: number;
  refreshTokenExpirationDays: number;
}

import { User } from './user.types';
import { Company } from './company.types';