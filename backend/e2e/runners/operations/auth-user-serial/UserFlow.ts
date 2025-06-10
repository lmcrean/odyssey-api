import { APIRequestContext } from '@playwright/test';
import { GetUserProfileRunner } from '../../user/GetUserProfile';
import { UpdateProfileRunner } from '../../user/UpdateProfile';
import { GetPublicProfileRunner } from '../../user/GetPublicProfile';
import { SearchUsersRunner } from '../../user/SearchUsers';
import { CheckUsernameRunner } from '../../user/CheckUsername';

export class UserFlowOperation {
  private getUserProfileRunner: GetUserProfileRunner;
  private updateProfileRunner: UpdateProfileRunner;
  private getPublicProfileRunner: GetPublicProfileRunner;
  private searchUsersRunner: SearchUsersRunner;
  private checkUsernameRunner: CheckUsernameRunner;

  constructor(private request: APIRequestContext) {
    this.getUserProfileRunner = new GetUserProfileRunner(request);
    this.updateProfileRunner = new UpdateProfileRunner(request);
    this.getPublicProfileRunner = new GetPublicProfileRunner(request);
    this.searchUsersRunner = new SearchUsersRunner(request);
    this.checkUsernameRunner = new CheckUsernameRunner(request);
  }

  // === AUTH-REQUIRED TESTS (Database State Changes) ===

  // Get User Profile tests - with valid authentication
  async runGetUserProfileWithAuth(authToken: string) {
    return await this.getUserProfileRunner.runWithValidAuth(authToken);
  }

  // Update Profile tests - authenticated operations
  async runValidProfileUpdate(authToken: string, updateData: any) {
    return await this.updateProfileRunner.runValidUpdate(authToken, updateData);
  }

  async runProfileUpdateDuplicateUsername(authToken: string) {
    return await this.updateProfileRunner.runWithDuplicateUsername(authToken);
  }

  // Search Users tests - with valid queries (may require auth in future)
  async runValidUserSearch(query: string, limit?: number) {
    return await this.searchUsersRunner.runValidSearch(query, limit);
  }

  // Check Username tests - authenticated checks for availability
  async runCheckAvailableUsername(username: string) {
    return await this.checkUsernameRunner.runWithAvailableUsername(username);
  }

  async runCheckTakenUsername(username: string) {
    return await this.checkUsernameRunner.runWithTakenUsername(username);
  }

  // Complete user flow integration test
  async runCompleteUserFlow(authToken: string) {
    // Step 1: Get user profile
    const profileResult = await this.runGetUserProfileWithAuth(authToken);
    const originalProfile = profileResult.data.data;

    // Step 2: Check username availability
    const newUsername = `updated_user_${Date.now()}`;
    const usernameCheck = await this.runCheckAvailableUsername(newUsername);

    // Step 3: Update profile with new username
    const updateData = {
      username: newUsername,
      bio: 'Updated bio through integration test',
      location: 'Test Location'
    };
    const updateResult = await this.runValidProfileUpdate(authToken, updateData);

    // Step 4: Get updated profile
    const updatedProfileResult = await this.runGetUserProfileWithAuth(authToken);

    // Step 5: Get public profile to verify changes
    const publicProfileResult = await this.getPublicProfileRunner.runWithUsername(newUsername);

    // Step 6: Search for the updated user
    const searchResult = await this.runValidUserSearch(newUsername);

    return {
      originalProfile: profileResult,
      usernameCheck,
      profileUpdate: updateResult,
      updatedProfile: updatedProfileResult,
      publicProfile: publicProfileResult,
      searchResult,
      flow: {
        username: newUsername,
        updateData,
        originalUsername: originalProfile.username
      }
    };
  }

  // Test user profile operations with authentication
  async runAuthenticatedUserProfileTests(authToken: string) {
    const results = {
      getProfile: await this.runGetUserProfileWithAuth(authToken),
      updateProfile: await this.runValidProfileUpdate(authToken, {
        bio: 'Updated bio for testing',
        location: 'Test Location'
      }),
      usernameAvailability: await this.runCheckAvailableUsername(`available_${Date.now()}`),
      search: await this.runValidUserSearch('test', 5)
    };

    return results;
  }

  // Test operations that change user state (requires isolation)
  async runUserStateChangeTests(authToken: string) {
    const timestamp = Date.now();
    const testUsername = `test_state_${timestamp}`;
    
    const results = {
      // Check username is available
      checkAvailable: await this.runCheckAvailableUsername(testUsername),
      
      // Update profile with new username
      updateProfile: await this.runValidProfileUpdate(authToken, {
        username: testUsername,
        bio: `State change test ${timestamp}`
      }),
      
      // Verify username is now taken
      checkTaken: await this.runCheckTakenUsername(testUsername),
      
      // Search for the updated user
      searchUser: await this.runValidUserSearch(testUsername)
    };

    return results;
  }
} 