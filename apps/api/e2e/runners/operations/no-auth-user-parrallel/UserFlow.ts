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

  // === NON-AUTH TESTS (Testing Validation & Public Endpoints) ===

  // Get User Profile tests - testing auth failures
  async runGetUserProfileWithoutAuth() {
    return await this.getUserProfileRunner.runWithoutAuth();
  }

  async runGetUserProfileWithInvalidAuth() {
    return await this.getUserProfileRunner.runWithInvalidAuth();
  }

  // Update Profile tests - testing auth failures & validation
  async runProfileUpdateWithoutAuth(updateData: any) {
    return await this.updateProfileRunner.runWithoutAuth(updateData);
  }

  async runProfileUpdateEmptyUsername(authToken: string) {
    return await this.updateProfileRunner.runWithEmptyUsername(authToken);
  }

  async runProfileUpdateInvalidFormat(authToken: string) {
    return await this.updateProfileRunner.runWithInvalidUsernameFormat(authToken);
  }

  async runProfileUpdateInvalidWebsite(authToken: string) {
    return await this.updateProfileRunner.runWithInvalidWebsiteURL(authToken);
  }

  // Get Public Profile tests - no auth required
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

  // Search Users tests - testing validation errors (no auth required)
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

  // Check Username tests - no auth required for validation
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

  // Run all non-auth user tests
  async runAllNonAuthUserTests() {
    const results = {
      profile: {
        withoutAuth: await this.runGetUserProfileWithoutAuth(),
        withInvalidAuth: await this.runGetUserProfileWithInvalidAuth()
      },
      updateProfile: {
        withoutAuth: await this.runProfileUpdateWithoutAuth({ username: 'test' }),
        emptyUsername: await this.runProfileUpdateEmptyUsername('fake-token'),
        invalidFormat: await this.runProfileUpdateInvalidFormat('fake-token'),
        invalidWebsite: await this.runProfileUpdateInvalidWebsite('fake-token')
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