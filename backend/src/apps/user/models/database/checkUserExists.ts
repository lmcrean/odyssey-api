import { db } from '../../../../shared/db/init-sqlite';

/**
 * Check if a user exists by username with lean validation
 * Enhanced function with essential checks only
 */
export async function checkUsernameExists(username: string): Promise<boolean> {
  try {
    // 1. ESSENTIAL VALIDATION ONLY
    if (!username?.trim()) {
      return false;
    }

    // 2. DATABASE QUERY
    const user = await db('users').where({ username }).first();
    return !!user;

  } catch (error) {
    console.error('Error checking username existence:', error);
    return false;
  }
}

/**
 * Check if a user exists by email with lean validation
 * Enhanced function with essential checks only
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    // 1. ESSENTIAL VALIDATION ONLY
    if (!email?.trim()) {
      return false;
    }

    // 2. DATABASE QUERY
    const user = await db('users').where({ email }).first();
    return !!user;

  } catch (error) {
    console.error('Error checking email existence:', error);
    return false;
  }
} 