import { db } from '../../../../shared/db/init-sqlite';

/**
 * Delete user by ID
 */
export async function deleteUser(id: string): Promise<boolean> {
  try {
    // Ensure the table exists
    const tableExists = await db.schema.hasTable('users');
    if (!tableExists) {
      console.log('⚠️  Users table not found - this should be created by init-sqlite.ts first');
      return false;
    }

    const deletedCount = await db('users')
      .where('id', id)
      .del();

    return deletedCount > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
} 