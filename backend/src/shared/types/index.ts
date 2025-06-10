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
import { Request } from 'express';
import { User } from '../../apps/user/types';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    userId?: string; // For backward compatibility
  };
}

export * from '../../apps/user/types';
export * from '../../apps/chat/types';

export interface AdvancedDatabaseConfig {
  // Advanced database configuration options
  connectionPool?: {
    min: number;
    max: number;
    idleTimeoutMillis: number;
    createTimeoutMillis: number;
    acquireTimeoutMillis: number;
  };
  retryOptions?: {
    maxRetries: number;
    retryDelay: number;
    backoffFactor: number;
  };
  monitoring?: {
    enabled: boolean;
    metricsInterval: number;
    logQueries: boolean;
  };
}

export interface DatabaseHealth {
  status: 'healthy' | 'unhealthy';
  responseTime: number;
  timestamp: string;
  details?: {
    connectionPool?: {
      total: number;
      idle: number;
      active: number;
    };
    lastError?: string;
  };
}

// Health check types
export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version?: string;
  environment?: string;
}

export interface HelloResponse {
  message: string;
  timestamp: string;
  version?: string;
}

export interface CorsCheckResponse {
  cors: {
    origin: string | boolean;
    methods: string[];
    allowedHeaders: string[];
    credentials: boolean;
  };
  timestamp: string;
}

// Database-specific response types
export interface HelloDbResponse {
  message: string;
  timestamp: string;
  database: {
    type: string;
    status: 'connected' | 'disconnected';
  };
}

export interface DatabaseHealthResponse {
  status: 'healthy' | 'unhealthy';
  database: {
    type: string;
    responseTime: number;
    connectionStatus: 'connected' | 'disconnected';
  };
  timestamp: string;
} 