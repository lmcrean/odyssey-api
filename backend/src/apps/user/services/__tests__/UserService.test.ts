import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { UserService } from '../UserService';
import { UserModel } from '../../models/User';
import { 
  User, 
  UpdateUserRequest, 
  DEFAULT_PROFILE_PICTURE,
  CLOUDINARY_CONFIG 
} from '../../types';

// Mock the UserModel
vi.mock('../../models/User');

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    profileName: 'Test User',
    profileBio: 'Test bio',
    profilePicture: 'https://res.cloudinary.com/demo/image/upload/v123/profile-pictures/testuser.jpg',
    profileLocation: 'Test City',
    profileWebsite: 'https://testuser.com',
    profilePrivate: false,
    postsCount: 5,
    followersCount: 100,
    followingCount: 50,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    lastActiveAt: new Date('2024-01-03')
  };

  describe('getUserProfile', () => {
    it('should return user profile with Cloudinary profile picture', async () => {
      vi.mocked(UserModel.findById).mockResolvedValue(mockUser);

      const result = await UserService.getUserProfile('test-user-id');

      expect(result).toEqual(mockUser);
      expect(result?.profilePicture).toContain('cloudinary.com');
      expect(UserModel.findById).toHaveBeenCalledWith('test-user-id');
    });

    it('should return null if user not found', async () => {
      vi.mocked(UserModel.findById).mockResolvedValue(null);

      const result = await UserService.getUserProfile('non-existent-id');

      expect(result).toBeNull();
    });

    it('should handle user with default profile picture', async () => {
      const userWithDefaultPicture = {
        ...mockUser,
        profilePicture: DEFAULT_PROFILE_PICTURE
      };
      vi.mocked(UserModel.findById).mockResolvedValue(userWithDefaultPicture);

      const result = await UserService.getUserProfile('test-user-id');

      expect(result?.profilePicture).toBe(DEFAULT_PROFILE_PICTURE);
    });
  });

  describe('getPublicUserProfile', () => {
    it('should return public profile without sensitive data', async () => {
      vi.mocked(UserModel.getPublicProfile).mockResolvedValue({
        ...mockUser,
        // Remove sensitive fields that should not be in public profile
      });

      const result = await UserService.getPublicUserProfile('test-user-id');

      expect(result).toBeDefined();
      expect(result?.id).toBe('test-user-id');
      expect(result?.username).toBe('testuser');
      expect(result?.profilePicture).toContain('cloudinary.com');
      expect(result?.postsCount).toBe(5);
      expect(result?.followersCount).toBe(100);
      
      // Should not contain sensitive fields
      expect('email' in (result || {})).toBe(false);
    });
  });

  describe('updateUserProfile', () => {
    describe('Cloudinary profile picture updates', () => {
      it('should update profile picture with Cloudinary URL', async () => {
        const updateData: UpdateUserRequest = {
          profilePicture: 'https://res.cloudinary.com/demo/image/upload/v456/profile-pictures/newpic.jpg'
        };

        const updatedUser = { ...mockUser, ...updateData };
        vi.mocked(UserModel.updateUser).mockResolvedValue(updatedUser);
        vi.mocked(UserModel.findById).mockResolvedValue(mockUser);

        const result = await UserService.updateUserProfile('test-user-id', updateData);

        expect(result?.profilePicture).toBe(updateData.profilePicture);
        expect(result?.profilePicture).toContain('cloudinary.com');
      });

      it('should handle default profile picture assignment', async () => {
        const updateData: UpdateUserRequest = {
          profilePicture: DEFAULT_PROFILE_PICTURE
        };

        const updatedUser = { ...mockUser, profilePicture: DEFAULT_PROFILE_PICTURE };
        vi.mocked(UserModel.updateUser).mockResolvedValue(updatedUser);
        vi.mocked(UserModel.findById).mockResolvedValue(mockUser);

        const result = await UserService.updateUserProfile('test-user-id', updateData);

        expect(result?.profilePicture).toBe(DEFAULT_PROFILE_PICTURE);
      });

      it('should handle removing profile picture (set to null)', async () => {
        const updateData: UpdateUserRequest = {
          profilePicture: undefined
        };

        const updatedUser = { ...mockUser, profilePicture: undefined };
        vi.mocked(UserModel.updateUser).mockResolvedValue(updatedUser);
        vi.mocked(UserModel.findById).mockResolvedValue(mockUser);

        const result = await UserService.updateUserProfile('test-user-id', updateData);

        expect(result?.profilePicture).toBeUndefined();
      });
    });

    describe('Profile data validation', () => {
      it('should validate website URL', async () => {
        const updateData: UpdateUserRequest = {
          profileWebsite: 'invalid-url'
        };

        await expect(
          UserService.updateUserProfile('test-user-id', updateData)
        ).rejects.toThrow('Invalid website URL');
      });

      it('should accept valid website URL', async () => {
        const updateData: UpdateUserRequest = {
          profileWebsite: 'https://validwebsite.com'
        };

        const updatedUser = { ...mockUser, ...updateData };
        vi.mocked(UserModel.updateUser).mockResolvedValue(updatedUser);
        vi.mocked(UserModel.findById).mockResolvedValue(mockUser);

        const result = await UserService.updateUserProfile('test-user-id', updateData);

        expect(result?.profileWebsite).toBe('https://validwebsite.com');
      });

      it('should validate username format', async () => {
        const updateData: UpdateUserRequest = {
          username: 'invalid username with spaces'
        };

        await expect(
          UserService.updateUserProfile('test-user-id', updateData)
        ).rejects.toThrow('Invalid username format');
      });

      it('should accept valid username', async () => {
        const updateData: UpdateUserRequest = {
          username: 'valid_username123'
        };

        const updatedUser = { ...mockUser, username: 'valid_username123' };
        vi.mocked(UserModel.updateUser).mockResolvedValue(updatedUser);
        vi.mocked(UserModel.findById).mockResolvedValue(mockUser);
        vi.mocked(UserModel.isUsernameAvailable).mockResolvedValue(true);

        const result = await UserService.updateUserProfile('test-user-id', updateData);

        expect(result?.username).toBe('valid_username123');
      });
    });

    describe('Username availability checking', () => {
      it('should check username availability when changing username', async () => {
        const updateData: UpdateUserRequest = {
          username: 'newusername'
        };

        vi.mocked(UserModel.findById).mockResolvedValue(mockUser);
        vi.mocked(UserModel.isUsernameAvailable).mockResolvedValue(true);
        vi.mocked(UserModel.updateUser).mockResolvedValue({ ...mockUser, username: 'newusername' });

        await UserService.updateUserProfile('test-user-id', updateData);

        expect(UserModel.isUsernameAvailable).toHaveBeenCalledWith('newusername');
      });

      it('should throw error if username is taken', async () => {
        const updateData: UpdateUserRequest = {
          username: 'takenusername'
        };

        vi.mocked(UserModel.findById).mockResolvedValue(mockUser);
        vi.mocked(UserModel.isUsernameAvailable).mockResolvedValue(false);

        await expect(
          UserService.updateUserProfile('test-user-id', updateData)
        ).rejects.toThrow('Username is already taken');
      });

      it('should not check availability if username unchanged', async () => {
        const updateData: UpdateUserRequest = {
          username: 'testuser' // Same as current username
        };

        vi.mocked(UserModel.findById).mockResolvedValue(mockUser);
        vi.mocked(UserModel.updateUser).mockResolvedValue(mockUser);

        await UserService.updateUserProfile('test-user-id', updateData);

        expect(UserModel.isUsernameAvailable).not.toHaveBeenCalled();
      });
    });

    describe('Profile privacy settings', () => {
      it('should update profile privacy setting', async () => {
        const updateData: UpdateUserRequest = {
          profilePrivate: true
        };

        const updatedUser = { ...mockUser, profilePrivate: true };
        vi.mocked(UserModel.updateUser).mockResolvedValue(updatedUser);
        vi.mocked(UserModel.findById).mockResolvedValue(mockUser);

        const result = await UserService.updateUserProfile('test-user-id', updateData);

        expect(result?.profilePrivate).toBe(true);
      });
    });
  });

  describe('searchUsers', () => {
    it('should return search results with Cloudinary profile pictures', async () => {
      const searchResults = [
        {
          ...mockUser,
          id: 'user1',
          username: 'john_doe',
          profileName: 'John Doe',
          profilePicture: 'https://res.cloudinary.com/demo/image/upload/v123/profile-pictures/john.jpg'
        },
        {
          ...mockUser,
          id: 'user2',
          username: 'jane_smith',
          profileName: 'Jane Smith',
          profilePicture: DEFAULT_PROFILE_PICTURE
        }
      ];

      vi.mocked(UserModel.searchUsers).mockResolvedValue(searchResults);

      const result = await UserService.searchUsers('john');

      expect(result).toHaveLength(2);
      expect(result[0].profilePicture).toContain('cloudinary.com');
      expect(result[1].profilePicture).toBe(DEFAULT_PROFILE_PICTURE);
    });
  });

  describe('getUserByUsername', () => {
    it('should find user by username and return public profile', async () => {
      vi.mocked(UserModel.findByUsername).mockResolvedValue(mockUser);

      const result = await UserService.getUserByUsername('testuser');

      expect(result).toBeDefined();
      expect(result?.username).toBe('testuser');
      expect(result?.profilePicture).toContain('cloudinary.com');
      expect(UserModel.findByUsername).toHaveBeenCalledWith('testuser');
    });
  });

  describe('checkUsernameAvailability', () => {
    it('should return true for available username', async () => {
      vi.mocked(UserModel.isUsernameAvailable).mockResolvedValue(true);

      const result = await UserService.checkUsernameAvailability('available_username');

      expect(result).toBe(true);
    });

    it('should return false for taken username', async () => {
      vi.mocked(UserModel.isUsernameAvailable).mockResolvedValue(false);

      const result = await UserService.checkUsernameAvailability('taken_username');

      expect(result).toBe(false);
    });
  });

  describe('updateSocialCounts', () => {
    it('should update social counts for unified user model', async () => {
      const counts = {
        postsCount: 10,
        followersCount: 200,
        followingCount: 75
      };

      vi.mocked(UserModel.updateSocialCounts).mockResolvedValue();

      await UserService.updateSocialCounts('test-user-id', counts);

      expect(UserModel.updateSocialCounts).toHaveBeenCalledWith('test-user-id', counts);
    });

    it('should handle partial social count updates', async () => {
      const counts = {
        postsCount: 15
      };

      vi.mocked(UserModel.updateSocialCounts).mockResolvedValue();

      await UserService.updateSocialCounts('test-user-id', counts);

      expect(UserModel.updateSocialCounts).toHaveBeenCalledWith('test-user-id', counts);
    });
  });

  describe('updateLastActive', () => {
    it('should update last active timestamp', async () => {
      vi.mocked(UserModel.updateLastActive).mockResolvedValue();

      await UserService.updateLastActive('test-user-id');

      expect(UserModel.updateLastActive).toHaveBeenCalledWith('test-user-id');
    });
  });

  describe('deleteUserAccount', () => {
    it('should delete user account', async () => {
      vi.mocked(UserModel.deleteUser).mockResolvedValue(true);

      const result = await UserService.deleteUserAccount('test-user-id');

      expect(result).toBe(true);
      expect(UserModel.deleteUser).toHaveBeenCalledWith('test-user-id');
    });
  });
}); 