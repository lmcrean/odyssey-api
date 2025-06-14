import { db } from '../../../../shared/db/init-sqlite';
import { User } from '../../types';
import { transformToUser } from './transformations';

/**
 * Find user by ID with lean validation
 * Enhanced function with essential checks only
 */
export async function findUserById(id: string): Promise<User | null> {
  try {
    // 1. ESSENTIAL VALIDATION ONLY
    if (!id?.trim()) {
      return null;
    }

    // 2. DATABASE QUERY
    const user = await db('users')
      .select('*')
      .where('id', id)
      .first();

    if (!user) {
      return null;
    }

    // 3. DATA TRANSFORMATION
    return transformToUser(user);

  } catch (error) {
    console.error('Error finding user by ID:', error);
    return null;
  }
}

 