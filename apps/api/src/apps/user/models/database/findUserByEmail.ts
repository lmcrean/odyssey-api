import { db } from '../../../../shared/db/init-sqlite';
import { User } from '../../types';
import { transformToUser } from './transformations';

/**
 * Find user by email with lean validation
 * Returns User with password for authentication purposes
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    // 1. ESSENTIAL VALIDATION ONLY
    if (!email?.trim()) {
      return null;
    }

    // 2. DATABASE QUERY
    const user = await db('users')
      .select('*')
      .where('email', email)
      .first();

    if (!user) {
      return null;
    }

    // 3. DATA TRANSFORMATION
    return transformToUser(user);

  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

 