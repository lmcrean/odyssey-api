import { User, UpdateUserData, PublicProfile } from '../types';
import { UserModel } from '../models/UserModel';

export class UserService {
  /**
   * Get user's full profile (authenticated user viewing their own profile)
   */
  static async getUserProfile(userId: string): Promise<User | null> {
    return await UserModel.findById(userId);
  }

  /**
   * Get public user profile (for viewing other users)
   */
  static async getPublicUserProfile(identifier: string): Promise<PublicProfile | null> {
    let user: User | null = null;
    
    // Try to find by username first, then by ID
    if (identifier.match(/^[a-zA-Z0-9_]{3,30}$/)) {
      user = await UserModel.findByUsername(identifier);
    } else {
      user = await UserModel.findById(identifier);
    }
    
    if (!user) return null;

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatarUrl: user.avatarUrl,
      isPrivate: user.isPrivate || false,
      createdAt: user.createdAt
    };
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updates: UpdateUserData): Promise<User | null> {
    // Validate profile data
    if (updates.website && !this.isValidUrl(updates.website)) {
      throw new Error('Invalid website URL');
    }

    if (updates.username && !this.isValidUsername(updates.username)) {
      throw new Error('Invalid username format');
    }

    // Check username availability if changing
    if (updates.username) {
      const currentUser = await UserModel.findById(userId);
      if (currentUser && currentUser.username !== updates.username) {
        const usernameExists = await UserModel.checkUsernameExists(updates.username);
        if (usernameExists) {
          throw new Error('Username is already taken');
        }
      }
    }

    return await UserModel.update(userId, updates);
  }

  /**
   * Search users
   */
  static async searchUsers(query: string, limit: number = 20): Promise<User[]> {
    return await UserModel.searchUsers(query, limit);
  }

  /**
   * Get user by username (public profile)
   */
  static async getUserByUsername(username: string): Promise<PublicProfile | null> {
    const user = await UserModel.findByUsername(username);
    if (!user) return null;

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      bio: user.bio,
      location: user.location,
      website: user.website,
      avatarUrl: user.avatarUrl,
      isPrivate: user.isPrivate || false,
      createdAt: user.createdAt
    };
  }

  /**
   * Check if username is available
   */
  static async checkUsernameAvailability(username: string): Promise<boolean> {
    const exists = await UserModel.checkUsernameExists(username);
    return !exists;
  }

  // Private helper methods
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private static isValidUsername(username: string): boolean {
    // Username should be 3-30 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    return usernameRegex.test(username);
  }
} 