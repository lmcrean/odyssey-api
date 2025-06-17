import { db } from '../../../../shared/db/init-sqlite';
import { UserWithoutPassword } from '../../types';
import { transformToUserWithoutPassword } from './transformations';

/**
 * Search users by query string with lean validation
 * Enhanced function with essential checks only
 */
export async function searchUsers(query: string, limit: number = 10): Promise<UserWithoutPassword[]> {
  try {
    // 1. ESSENTIAL VALIDATION ONLY
    if (!query?.trim()) {
      return [];
    }

    if (limit <= 0 || limit > 100) {
      limit = 10; // Sensible default and max limit
    }

    // 2. DATABASE SEARCH
    const users = await db('users')
      .where('username', 'like', `%${query}%`)
      .orWhere('firstName', 'like', `%${query}%`)
      .orWhere('lastName', 'like', `%${query}%`)
      .limit(limit)
      .select('*');

    // 3. DATA TRANSFORMATION
    return users.map(user => transformToUserWithoutPassword(user));

  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}

 