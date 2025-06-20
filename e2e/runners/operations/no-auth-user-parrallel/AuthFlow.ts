import { APIRequestContext } from '@playwright/test';
import { LoginRunner } from '../../auth/Login';
import { RegisterRunner } from '../../auth/Register';
import { RefreshTokenRunner } from '../../auth/RefreshToken';

export class AuthFlowOperation {
  private loginRunner: LoginRunner;
  private registerRunner: RegisterRunner;
  private refreshTokenRunner: RefreshTokenRunner;

  constructor(private request: APIRequestContext) {
    this.loginRunner = new LoginRunner(request);
    this.registerRunner = new RegisterRunner(request);
    this.refreshTokenRunner = new RefreshTokenRunner(request);
  }

  // === NON-AUTH VALIDATION TESTS (Testing Error Cases) ===

  // Login tests - validation errors only
  async runInvalidLogin() {
    return await this.loginRunner.runInvalidLogin();
  }

  async runLoginMissingCredentials() {
    return await this.loginRunner.runMissingCredentials();
  }

  // Register tests - validation errors only
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

  // Refresh token tests - error cases only
  async runInvalidRefreshToken() {
    return await this.refreshTokenRunner.runInvalidRefreshToken();
  }

  async runRefreshTokenMissingToken() {
    return await this.refreshTokenRunner.runMissingRefreshToken();
  }

  // Run all auth validation tests (error cases only)
  async runAllAuthValidationTests() {
    const results = {
      login: {
        invalid: await this.runInvalidLogin(),
        missingCredentials: await this.runLoginMissingCredentials()
      },
      register: {
        missingFields: await this.runRegistrationMissingFields(),
        invalidEmail: await this.runRegistrationInvalidEmail(),
        passwordMismatch: await this.runRegistrationPasswordMismatch(),
        weakPassword: await this.runRegistrationWeakPassword()
      },
      refreshToken: {
        invalid: await this.runInvalidRefreshToken(),
        missingToken: await this.runRefreshTokenMissingToken()
      }
    };

    return results;
  }
} 