import { describe, it, expect, vi } from 'vitest';
import { validateUpdateData } from '../validateUpdateData';
import { checkUsernameExists, findUserById } from '../../../models/database';

// Mock the database functions
vi.mock('../../../models/database', () => ({
  checkUsernameExists: vi.fn(),
  findUserById: vi.fn()
}));

describe('validateUpdateData', () => {
  it('should throw error for invalid website URL', async () => {
    const updates = { profileWebsite: 'invalid-url' };

    await expect(validateUpdateData('user-id', updates))
      .rejects.toThrow('Invalid website URL');
  });

  it('should throw error for invalid username format', async () => {
    const updates = { username: 'a' }; // Too short

    await expect(validateUpdateData('user-id', updates))
      .rejects.toThrow('Invalid username format');
  });

  it('should throw error for taken username', async () => {
    const updates = { username: 'taken_username' };
    
    (findUserById as any).mockResolvedValue({
      id: 'user-id',
      username: 'old_username'
    });
    (checkUsernameExists as any).mockResolvedValue(true);

    await expect(validateUpdateData('user-id', updates))
      .rejects.toThrow('Username is already taken');
  });

  it('should not throw error for valid data', async () => {
    const updates = {
      profileWebsite: 'https://example.com',
      username: 'valid_username'
    };
    
    (findUserById as any).mockResolvedValue({
      id: 'user-id',
      username: 'old_username'
    });
    (checkUsernameExists as any).mockResolvedValue(false);

    await expect(validateUpdateData('user-id', updates))
      .resolves.not.toThrow();
  });
}); 