import { User, CreateUserRequest, UpdateUserRequest, PublicUserProfile, UserSearchResult } from '../types';
import { UserModel } from '../models/User';

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
  static async getPublicUserProfile(userId: string): Promise<PublicUserProfile | null> {
    const user = await UserModel.getPublicProfile(userId);
    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      profileName: user.profileName,
      profileBio: user.profileBio,
      profilePicture: user.profilePicture,
      profileLocation: user.profileLocation,
      profileWebsite: user.profileWebsite,
      postsCount: user.postsCount || 0,
      followersCount: user.followersCount || 0,
      followingCount: user.followingCount || 0,
      createdAt: user.createdAt,
      lastActiveAt: user.lastActiveAt
    };
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updates: UpdateUserRequest): Promise<User | null> {
    // Validate profile data
    if (updates.profileWebsite && !this.isValidUrl(updates.profileWebsite)) {
      throw new Error('Invalid website URL');
    }

    if (updates.username && !this.isValidUsername(updates.username)) {
      throw new Error('Invalid username format');
    }

    // Check username availability if changing
    if (updates.username) {
      const currentUser = await UserModel.findById(userId);
      if (currentUser && currentUser.username !== updates.username) {
        const isAvailable = await UserModel.isUsernameAvailable(updates.username);
        if (!isAvailable) {
          throw new Error('Username is already taken');
        }
      }
    }

    return await UserModel.updateUser(userId, updates);
  }

  /**
   * Search users
   */
  static async searchUsers(query: string, limit: number = 20): Promise<UserSearchResult[]> {
    const users = await UserModel.searchUsers(query, limit);
    
    return users.map(user => ({
      id: user.id,
      username: user.username,
      profileName: user.profileName,
      profilePicture: user.profilePicture,
      profileBio: user.profileBio,
      followersCount: user.followersCount || 0
    }));
  }

  /**
   * Get user by username (public profile)
   */
  static async getUserByUsername(username: string): Promise<PublicUserProfile | null> {
    const user = await UserModel.findByUsername(username);
    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      profileName: user.profileName,
      profileBio: user.profileBio,
      profilePicture: user.profilePicture,
      profileLocation: user.profileLocation,
      profileWebsite: user.profileWebsite,
      postsCount: user.postsCount || 0,
      followersCount: user.followersCount || 0,
      followingCount: user.followingCount || 0,
      createdAt: user.createdAt,
      lastActiveAt: user.lastActiveAt
    };
  }

  /**
   * Check if username is available
   */
  static async checkUsernameAvailability(username: string): Promise<boolean> {
    return await UserModel.isUsernameAvailable(username);
  }

  /**
   * Update user's last active timestamp
   */
  static async updateLastActive(userId: string): Promise<void> {
    await UserModel.updateLastActive(userId);
  }

  /**
   * Delete user account
   */
  static async deleteUserAccount(userId: string): Promise<boolean> {
    return await UserModel.deleteUser(userId);
  }

  /**
   * Update social counts (called by other services like posts, follows)
   */
  static async updateSocialCounts(
    userId: string, 
    counts: { postsCount?: number; followersCount?: number; followingCount?: number }
  ): Promise<void> {
    await UserModel.updateSocialCounts(userId, counts);
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