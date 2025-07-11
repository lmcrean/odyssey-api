export class ValidationService {
  static validateEmail(email: string): boolean {
    // More comprehensive email regex that rejects consecutive dots and other edge cases
    const emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
    return emailRegex.test(email) && email.length > 0;
  }

  static validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 6) {
      return { valid: false, message: 'Password must be at least 6 characters long' };
    }

    if (password.length > 128) {
      return { valid: false, message: 'Password must be less than 128 characters' };
    }

    // Check for at least one uppercase, one lowercase, and one number (optional)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return { 
        valid: false, 
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
      };
    }

    return { valid: true };
  }

  static validatePasswordMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  static validateName(name: string): boolean {
    return name.length >= 1 && name.length <= 50;
  }

  static sanitizeInput(input: string): string {
    return input.trim();
  }
} 