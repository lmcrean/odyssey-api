import { User } from '../../types';
import { findUserById } from '../../models/database';

/**
 * Get user's full profile (authenticated user viewing their own profile)
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  const user = await findUserById(userId);
  if (!user) return null;
  
  // Remove password from response
  const { password, ...publicUser } = user;
  return publicUser;
} 