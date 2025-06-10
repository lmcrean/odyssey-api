import { db } from '../../../../shared/db/init-sqlite';

/**
 * Check if a user exists by username
 */
export async function checkUsernameExists(username: string): Promise<boolean> {
  try {
    // Ensure the table exists
    const tableExists = await db.schema.hasTable('users');
    if (!tableExists) {
      console.log('⚠️  Users table not found - this should be created by init-sqlite.ts first');
      return false;
    }

    const user = await db('users').where({ username }).first();
    return !!user;
  } catch (error) {
    console.error('Error checking username existence:', error);
    return false;
  }
}

/**
 * Check if a user exists by email
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    // Ensure the table exists
    const tableExists = await db.schema.hasTable('users');
    if (!tableExists) {
      console.log('⚠️  Users table not found - this should be created by init-sqlite.ts first');
      return false;
    }

    const user = await db('users').where({ email }).first();
    return !!user;
  } catch (error) {
    console.error('Error checking email existence:', error);
    return false;
  }
} 