// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Error Types
export interface ApiError {
  message: string;
  statusCode: number;
  details?: any;
}

// Database Types
export interface DatabaseConfig {
  client: string;
  connection: {
    filename?: string;
    connectionString?: string;
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
    ssl?: {
      rejectUnauthorized: boolean;
    };
  };
  useNullAsDefault?: boolean;
}

// Request/Response Extensions
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    [key: string]: any;
  };
}

export * from '../../apps/user/types';
export * from '../../apps/chat/types'; 