import { APIRequestContext } from '@playwright/test';
import { LoginRunner } from '../auth/Login';
import { RegisterRunner } from '../auth/Register';
import { LogoutRunner } from '../auth/Logout';
import { RefreshTokenRunner } from '../auth/RefreshToken';

export class AuthFlowOperation {
  private loginRunner: LoginRunner;
  private registerRunner: RegisterRunner;
  private logoutRunner: LogoutRunner;
  private refreshTokenRunner: RefreshTokenRunner;

  constructor(private request: APIRequestContext) {
    this.loginRunner = new LoginRunner(request);
    this.registerRunner = new RegisterRunner(request);
    this.logoutRunner = new LogoutRunner(request);
    this.refreshTokenRunner = new RefreshTokenRunner(request);
  }

  // Login tests
  async runValidLogin() {
    return await this.loginRunner.runValidLogin();
  }

  async runInvalidLogin() {
    return await this.loginRunner.runInvalidLogin();
  }

  async runLoginMissingCredentials() {
    return await this.loginRunner.runMissingCredentials();
  }

  // Register tests
  async runValidRegistration() {
    return await this.registerRunner.runValidRegistration();
  }

  async runRegistrationMissingFields() {
    return await this.registerRunner.runMissingRequiredFields();
  }

  async runRegistrationInvalidEmail() {
    return await this.registerRunner.runInvalidEmailFormat();
  }

  async runRegistrationPasswordMismatch() {
    return await this.registerRunner.runPasswordMismatch();
  }

  async runRegistrationWeakPassword() {
    return await this.registerRunner.runWeakPassword();
  }

  // Logout tests
  async runLogout() {
    return await this.logoutRunner.runLogout();
  }

  async runLogoutWithToken() {
    return await this.logoutRunner.runLogoutWithToken();
  }

  // Refresh token tests
  async runValidRefreshToken(refreshToken: string) {
    return await this.refreshTokenRunner.runValidRefreshToken(refreshToken);
  }

  async runInvalidRefreshToken() {
    return await this.refreshTokenRunner.runInvalidRefreshToken();
  }

  async runRefreshTokenMissingToken() {
    return await this.refreshTokenRunner.runMissingRefreshToken();
  }

  // Complete auth flow integration test
  async runCompleteAuthFlow() {
    // Step 1: Register a new user
    const registerResult = await this.runValidRegistration();
    const { accessToken, refreshToken } = registerResult.data.data;

    // Step 2: Test refresh token functionality
    const refreshResult = await this.runValidRefreshToken(refreshToken);
    const newTokens = refreshResult.data.data;

    // Step 3: Logout
    const logoutResult = await this.runLogout();

    return {
      register: registerResult,
      refresh: refreshResult,
      logout: logoutResult,
      tokens: {
        original: { accessToken, refreshToken },
        refreshed: newTokens
      }
    };
  }

  // Run all auth tests
  async runAllAuthTests() {
    const results = {
      login: {
        valid: await this.runValidLogin(),
        invalid: await this.runInvalidLogin(),
        missingCredentials: await this.runLoginMissingCredentials()
      },
      register: {
        valid: await this.runValidRegistration(),
        missingFields: await this.runRegistrationMissingFields(),
        invalidEmail: await this.runRegistrationInvalidEmail(),
        passwordMismatch: await this.runRegistrationPasswordMismatch(),
        weakPassword: await this.runRegistrationWeakPassword()
      },
      logout: {
        basic: await this.runLogout(),
        withToken: await this.runLogoutWithToken()
      },
      refreshToken: {
        invalid: await this.runInvalidRefreshToken(),
        missingToken: await this.runRefreshTokenMissingToken()
      }
    };

    return results;
  }
} 