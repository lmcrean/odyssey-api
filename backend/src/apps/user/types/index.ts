export * from './user';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatarUrl?: string;
  isPrivate?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Database user includes password for auth operations
export interface DatabaseUser extends User {
  password: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatarUrl?: string;
  isPrivate?: boolean;
}

export interface PublicProfile {
  id: string;
  firstName: string;
  lastName: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatarUrl?: string;
  isPrivate: boolean;
  createdAt: Date;
} 