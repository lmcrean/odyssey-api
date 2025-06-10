import { User, UpdateUserRequest } from '../../types';
import { updateUser } from '../../models/database';
import { validateUpdateData } from './validateUpdateData';

/**
 * Update user profile with validation
 */
export async function updateUserProfile(userId: string, updates: UpdateUserRequest): Promise<User | null> {
  // Validate the update data first
  await validateUpdateData(userId, updates);

  // Update the user in database
  return await updateUser(userId, updates);
} 