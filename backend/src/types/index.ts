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
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
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

export * from './user.js';
export * from './message.js'; 