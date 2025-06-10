import { User } from './User';

// Database user includes password for auth operations
export interface DatabaseUser extends User {
  password: string;
} 