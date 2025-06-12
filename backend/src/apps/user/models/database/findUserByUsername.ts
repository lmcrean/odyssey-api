import { db } from '../../../../shared/db/init-sqlite';
import { UserWithoutPassword } from '../../types';
import { transformToUserWithoutPassword } from './transformations';

/**
 * Find user by username with lean validation
 * Returns UserWithoutPassword for public profile purposes
 */
export async function findUserByUsername(username: string): Promise<UserWithoutPassword | null> {
  try {
    // 1. ESSENTIAL VALIDATION ONLY
    if (!username?.trim()) {
      return null;
    }

    // 2. DATABASE QUERY
    const user = await db('users')
      .select('*')
      .where('username', username)
      .first();

    if (!user) {
      return null;
    }

    // 3. DATA TRANSFORMATION
    return transformToUserWithoutPassword(user);

  } catch (error) {
    console.error('Error finding user by username:', error);
    return null;
  }
}

 