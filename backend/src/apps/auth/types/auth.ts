export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  };
  message?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

// JWT payload interface for proper typing
export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp?: number;
  nonce?: string;
} 