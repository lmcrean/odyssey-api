import { User, UpdateUserRequest, PublicProfile } from '../types';
// Import the new modular functions
import { getUserProfile, getPublicUserProfile, getUserByUsername } from './user-retrieval';
import { updateUserProfile } from './user-updates';
import { searchByQuery, checkUsernameAvailability } from './user-search';

export class UserService {
  /**
   * Get user's full profile (authenticated user viewing their own profile)
   */
  static async getUserProfile(userId: string): Promise<User | null> {
    return await getUserProfile(userId);
  }

  /**
   * Get public user profile (for viewing other users)
   */
  static async getPublicUserProfile(identifier: string): Promise<PublicProfile | null> {
    return await getPublicUserProfile(identifier);
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updates: UpdateUserRequest): Promise<User | null> {
    return await updateUserProfile(userId, updates);
  }

  /**
   * Search users
   */
  static async searchUsers(query: string, limit: number = 20): Promise<User[]> {
    return await searchByQuery(query, limit);
  }

  /**
   * Get user by username (public profile)
   */
  static async getUserByUsername(username: string): Promise<PublicProfile | null> {
    return await getUserByUsername(username);
  }

  /**
   * Check if username is available
   */
  static async checkUsernameAvailability(username: string): Promise<boolean> {
    return await checkUsernameAvailability(username);
  }
} 