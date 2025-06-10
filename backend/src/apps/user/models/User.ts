import { User, CreateUserRequest, UpdateUserRequest } from '../types';
import db from '../../../shared/db/init-sqlite';

export class UserModel {
  /**
   * Create a new user with unified profile fields
   */
  static async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const now = new Date();
      const userId = this.generateId();
      
      // Insert user into database
      await db('users').insert({
        id: userId,
        email: userData.email,
        password: userData.password,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        created_at: now,
        updated_at: now
      });

      // Fetch the created user
      const newUser = await this.findById(userId);
      if (!newUser) {
        throw new Error('User not found after creation');
      }

      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  /**
   * Find user by ID with all profile fields
   */
  static async findById(id: string): Promise<User | null> {
    try {
      const user = await db('users')
        .select('*')
        .where('id', id)
        .first();

      if (!user) return null;

      // Convert snake_case to camelCase for TypeScript
      return {
        ...user,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      };
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  /**
   * Find user by username
   */
  static async findByUsername(username: string): Promise<User | null> {
    try {
      const user = await db('users')
        .select('*')
        .where('username', username)
        .first();

      if (!user) return null;

      // Convert snake_case to camelCase for TypeScript
      return {
        ...user,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      };
    } catch (error) {
      console.error('Error finding user by username:', error);
      return null;
    }
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await db('users')
        .select('*')
        .where('email', email)
        .first();

      if (!user) return null;

      // Convert snake_case to camelCase for TypeScript
      return {
        ...user,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      };
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  /**
   * Update user profile (unified user + profile fields)
   */
  static async updateUser(id: string, updates: UpdateUserRequest): Promise<User | null> {
    try {
      const updatedAt = new Date();
      
      await db('users')
        .where('id', id)
        .update({
          ...updates,
          updated_at: updatedAt
        });

      return await this.findById(id);
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  /**
   * Search users by username or profile name
   */
  static async searchUsers(query: string, limit: number = 20): Promise<User[]> {
    try {
      const users = await db('users')
        .select('*')
        .where('username', 'like', `%${query}%`)
        .orWhere('firstName', 'like', `%${query}%`)
        .orWhere('lastName', 'like', `%${query}%`)
        .limit(limit);

      // Convert snake_case to camelCase for TypeScript
      return users.map(user => ({
        ...user,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }));
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  /**
   * Get user's public profile (excluding sensitive data)
   */
  static async getPublicProfile(id: string): Promise<Omit<User, 'email'> | null> {
    try {
      const user = await db('users')
        .select('id', 'username', 'firstName', 'lastName', 'avatar', 'created_at', 'updated_at')
        .where('id', id)
        .first();

      if (!user) return null;

      // Convert snake_case to camelCase for TypeScript
      return {
        ...user,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      };
    } catch (error) {
      console.error('Error getting public profile:', error);
      return null;
    }
  }

  /**
   * Update user's last active timestamp
   */
  static async updateLastActive(id: string): Promise<void> {
    try {
      await db('users')
        .where('id', id)
        .update({ updated_at: new Date() });
    } catch (error) {
      console.error('Error updating last active:', error);
    }
  }

  /**
   * Delete user account
   */
  static async deleteUser(id: string): Promise<boolean> {
    try {
      const deletedCount = await db('users')
        .where('id', id)
        .del();

      return deletedCount > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  /**
   * Check if username is available
   */
  static async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const user = await db('users')
        .select('id')
        .where('username', username)
        .first();

      return !user;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  }

  /**
   * Update user's social counts (posts, followers, following)
   */
  static async updateSocialCounts(
    id: string, 
    counts: { postsCount?: number; followersCount?: number; followingCount?: number }
  ): Promise<void> {
    try {
      await db('users')
        .where('id', id)
        .update(counts);
    } catch (error) {
      console.error('Error updating social counts:', error);
    }
  }

  /**
   * Generate a unique ID for new users
   */
  private static generateId(): string {
    return require('crypto').randomUUID();
  }
} 