import { describe, it, expect, vi } from 'vitest';
import { checkUsernameAvailability } from '../checkUsernameAvailable';
import { checkUsernameExists } from '../../../models/database';

// Mock the database function
vi.mock('../../../models/database', () => ({
  checkUsernameExists: vi.fn()
}));

describe('checkUsernameAvailability', () => {
  it('should return true when username is available', async () => {
    (checkUsernameExists as any).mockResolvedValue(false);

    const result = await checkUsernameAvailability('available_username');

    expect(result).toBe(true);
  });

  it('should return false when username is taken', async () => {
    (checkUsernameExists as any).mockResolvedValue(true);

    const result = await checkUsernameAvailability('taken_username');

    expect(result).toBe(false);
  });
}); 