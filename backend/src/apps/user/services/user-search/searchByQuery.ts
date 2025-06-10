import { User } from '../../types';
import { searchUsers } from '../../models/database';

/**
 * Search users by query string
 */
export async function searchByQuery(query: string, limit: number = 20): Promise<User[]> {
  return await searchUsers(query, limit);
} 