export interface EndpointTest {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  sampleData?: any;
  requiresAuth?: boolean;
}

export interface TestResult {
  status: number | string;
  data: any;
  headers: any;
}

export interface AuthState {
  token: string;
  isAuthenticated: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
} 