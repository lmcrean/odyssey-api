import { db } from '../../../../shared/db/init-sqlite';

/**
 * Delete user by ID with lean validation
 * Enhanced function with essential checks only
 */
export async function deleteUser(id: string): Promise<boolean> {
  try {
    // 1. ESSENTIAL VALIDATION ONLY
    if (!id?.trim()) {
      return false;
    }

    // 2. DATABASE DELETE
    const deletedCount = await db('users')
      .where('id', id)
      .del();

    return deletedCount > 0;

  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
} 