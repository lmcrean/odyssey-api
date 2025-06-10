import { User, DatabaseUser } from '../types';
// Import the new modular database functions
import { 
  findUserById, 
  findUserByEmail, 
  findUserByUsername,
  createUser,
  updateUser,
  searchUsers,
  checkUsernameExists
} from './database';

/**
 * Legacy UserModel class that delegates to the new modular functions
 * This maintains backward compatibility while using the new architecture
 */
export class UserModel {
  // Legacy compatibility method - no longer needed with new architecture
  static async initializeTable() {
    // This is now handled by the individual database functions
    console.log('UserModel.initializeTable() is deprecated - table initialization is handled by individual functions');
  }

  static async findById(id: string): Promise<DatabaseUser | null> {
    return await findUserById(id);
  }

  static async findByEmail(email: string): Promise<DatabaseUser | null> {
    return await findUserByEmail(email);
  }

  static async findByUsername(username: string): Promise<User | null> {
    return await findUserByUsername(username);
  }

  static async create(userData: {
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username?: string;
  }): Promise<User> {
    return await createUser(userData);
  }

  static async update(id: string, updateData: Partial<{
    firstName: string;
    lastName: string;
    username: string;
    bio: string;
    location: string;
    website: string;
    avatarUrl: string;
    isPrivate: boolean;
  }>): Promise<User | null> {
    return await updateUser(id, updateData);
  }

  static async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    return await searchUsers(query, limit);
  }

  static async checkUsernameExists(username: string): Promise<boolean> {
    return await checkUsernameExists(username);
  }

  // Helper method for creating users (used by auth service)
  static async createUser(userData: {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    // Generate a simple ID for SQLite
    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    return await createUser({
      id,
      email: userData.email,
      password: userData.password, // Already hashed by auth service
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username
    });
  }
} 