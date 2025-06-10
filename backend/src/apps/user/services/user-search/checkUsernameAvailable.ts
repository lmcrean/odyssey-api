import { checkUsernameExists } from '../../models/database';

/**
 * Check if username is available
 */
export async function checkUsernameAvailability(username: string): Promise<boolean> {
  const exists = await checkUsernameExists(username);
  return !exists;
} 