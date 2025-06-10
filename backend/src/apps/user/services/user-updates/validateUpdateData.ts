import { UpdateUserRequest } from '../../types';
import { checkUsernameExists, findUserById } from '../../models/database';

/**
 * Validate user update data
 */
export async function validateUpdateData(userId: string, updates: UpdateUserRequest): Promise<void> {
  // Validate website URL
  if (updates.profileWebsite && !isValidUrl(updates.profileWebsite)) {
    throw new Error('Invalid website URL');
  }

  // Validate username format
  if (updates.username && !isValidUsername(updates.username)) {
    throw new Error('Invalid username format');
  }

  // Check username availability if changing
  if (updates.username) {
    const currentUser = await findUserById(userId);
    if (currentUser && currentUser.username !== updates.username) {
      const usernameExists = await checkUsernameExists(updates.username);
      if (usernameExists) {
        throw new Error('Username is already taken');
      }
    }
  }
}

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate username format
 */
function isValidUsername(username: string): boolean {
  // Username should be 3-30 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
} 