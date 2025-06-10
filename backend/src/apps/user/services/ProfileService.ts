import db from '../../../shared/db/init-sqlite';
import { User, UpdateUserRequest } from '../types';

export class ProfileService {
  static async getUserProfile(userId: string): Promise<User | null> {
    try {
      const user = await db('users')
        .select('*')
        .where('id', userId)
        .first();

      return user || null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  static async updateUserProfile(userId: string, updateData: UpdateUserRequest): Promise<User> {
    try {
      const updatedAt = new Date();
      
      await db('users')
        .where('id', userId)
        .update({
          ...updateData,
          updatedAt
        });

      const updatedUser = await this.getUserProfile(userId);
      
      if (!updatedUser) {
        throw new Error('User not found after update');
      }

      return updatedUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  static async createUserProfile(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const now = new Date();
      const [userId] = await db('users')
        .insert({
          ...userData,
          createdAt: now,
          updatedAt: now
        })
        .returning('id');

      const newUser = await this.getUserProfile(userId);
      
      if (!newUser) {
        throw new Error('User not found after creation');
      }

      return newUser;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }
} 