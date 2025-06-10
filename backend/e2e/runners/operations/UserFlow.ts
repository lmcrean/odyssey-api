import { APIRequestContext } from '@playwright/test';
import { GetUserProfileRunner } from '../user/GetUserProfile';
import { UpdateProfileRunner } from '../user/UpdateProfile';
import { GetPublicProfileRunner } from '../user/GetPublicProfile';
import { SearchUsersRunner } from '../user/SearchUsers';
import { CheckUsernameRunner } from '../user/CheckUsername';

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

  // Get User Profile tests
  async runGetUserProfileWithAuth(authToken: string) {
    return await this.getUserProfileRunner.runWithValidAuth(authToken);
  }

  async runGetUserProfileWithoutAuth() {
    return await this.getUserProfileRunner.runWithoutAuth();
  }

  async runGetUserProfileWithInvalidAuth() {
    return await this.getUserProfileRunner.runWithInvalidAuth();
  }

  // Update Profile tests
  async runValidProfileUpdate(authToken: string, updateData: any) {
    return await this.updateProfileRunner.runValidUpdate(authToken, updateData);
  }

  async runProfileUpdateWithoutAuth(updateData: any) {
    return await this.updateProfileRunner.runWithoutAuth(updateData);
  }

  async runProfileUpdateEmptyUsername(authToken: string) {
    return await this.updateProfileRunner.runWithEmptyUsername(authToken);
  }

  async runProfileUpdateDuplicateUsername(authToken: string) {
    return await this.updateProfileRunner.runWithDuplicateUsername(authToken);
  }

  async runProfileUpdateInvalidFormat(authToken: string) {
    return await this.updateProfileRunner.runWithInvalidUsernameFormat(authToken);
  }

  async runProfileUpdateInvalidWebsite(authToken: string) {
    return await this.updateProfileRunner.runWithInvalidWebsiteURL(authToken);
  }

  // Get Public Profile tests
  async runGetPublicProfileByUsername(username: string) {
    return await this.getPublicProfileRunner.runWithUsername(username);
  }

  async runGetPublicProfileByUserId(userId: string) {
    return await this.getPublicProfileRunner.runWithUserId(userId);
  }

  async runGetPublicProfileNonexistent() {
    return await this.getPublicProfileRunner.runWithNonexistentUser();
  }

  async runGetPublicProfileWithoutIdentifier() {
    return await this.getPublicProfileRunner.runWithoutIdentifier();
  }

  // Search Users tests
  async runValidUserSearch(query: string, limit?: number) {
    return await this.searchUsersRunner.runValidSearch(query, limit);
  }

  async runUserSearchWithoutQuery() {
    return await this.searchUsersRunner.runWithoutQuery();
  }

  async runUserSearchEmptyQuery() {
    return await this.searchUsersRunner.runWithEmptyQuery();
  }

  async runUserSearchShortQuery() {
    return await this.searchUsersRunner.runWithShortQuery();
  }

  async runUserSearchExcessiveLimit() {
    return await this.searchUsersRunner.runWithExcessiveLimit();
  }

  async runUserSearchCustomLimit() {
    return await this.searchUsersRunner.runWithCustomLimit();
  }

  // Check Username tests
  async runCheckAvailableUsername(username: string) {
    return await this.checkUsernameRunner.runWithAvailableUsername(username);
  }

  async runCheckTakenUsername(username: string) {
    return await this.checkUsernameRunner.runWithTakenUsername(username);
  }

  async runCheckShortUsername() {
    return await this.checkUsernameRunner.runWithShortUsername();
  }

  async runCheckLongUsername() {
    return await this.checkUsernameRunner.runWithLongUsername();
  }

  async runCheckInvalidUsernameChars() {
    return await this.checkUsernameRunner.runWithInvalidCharacters();
  }

  async runCheckValidUsernameFormat() {
    return await this.checkUsernameRunner.runWithValidFormat();
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
    const publicProfileResult = await this.runGetPublicProfileByUsername(newUsername);

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

  // Run all user tests
  async runAllUserTests() {
    const results = {
      profile: {
        withoutAuth: await this.runGetUserProfileWithoutAuth(),
        withInvalidAuth: await this.runGetUserProfileWithInvalidAuth()
      },
      updateProfile: {
        withoutAuth: await this.runProfileUpdateWithoutAuth({ username: 'test' }),
        emptyUsername: await this.runProfileUpdateEmptyUsername('fake-token'),
        invalidFormat: await this.runProfileUpdateInvalidFormat('fake-token')
      },
      publicProfile: {
        nonexistent: await this.runGetPublicProfileNonexistent(),
        withoutIdentifier: await this.runGetPublicProfileWithoutIdentifier()
      },
      search: {
        withoutQuery: await this.runUserSearchWithoutQuery(),
        emptyQuery: await this.runUserSearchEmptyQuery(),
        shortQuery: await this.runUserSearchShortQuery(),
        excessiveLimit: await this.runUserSearchExcessiveLimit(),
        customLimit: await this.runUserSearchCustomLimit()
      },
      checkUsername: {
        shortUsername: await this.runCheckShortUsername(),
        longUsername: await this.runCheckLongUsername(),
        invalidChars: await this.runCheckInvalidUsernameChars(),
        validFormat: await this.runCheckValidUsernameFormat()
      }
    };

    return results;
  }
} 