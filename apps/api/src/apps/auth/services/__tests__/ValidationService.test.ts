import { ValidationService } from '../ValidationService';

describe('ValidationService', () => {
  describe('Email Validation', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test123.com',
        'a@b.co'
      ];

      validEmails.forEach(email => {
        expect(ValidationService.validateEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'test@',
        'test.domain.com',
        'test@domain',
        '',
        'test@@domain.com',
        'test@domain..com'
      ];

      invalidEmails.forEach(email => {
        const result = ValidationService.validateEmail(email);
        if (result === true) {
          console.log(`Email "${email}" incorrectly validated as true`);
        }
        expect(result).toBe(false);
      });
    });
  });

  describe('Password Validation', () => {
    it('should validate strong passwords', () => {
      const strongPasswords = [
        'StrongPass123',
        'MyPassword1',
        'Secure123Pass',
        'Valid1Password'
      ];

      strongPasswords.forEach(password => {
        const result = ValidationService.validatePassword(password);
        expect(result.valid).toBe(true);
        expect(result.message).toBeUndefined();
      });
    });

    it('should reject passwords that are too short', () => {
      const shortPasswords = ['12345', 'Test1', 'Ab1'];

      shortPasswords.forEach(password => {
        const result = ValidationService.validatePassword(password);
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Password must be at least 6 characters long');
      });
    });

    it('should reject passwords that are too long', () => {
      const longPassword = 'A'.repeat(129) + '1a'; // 131 characters
      const result = ValidationService.validatePassword(longPassword);
      
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Password must be less than 128 characters');
    });

    it('should reject passwords without uppercase letters', () => {
      const passwords = ['password123', 'weakpass1', 'lowercase123'];

      passwords.forEach(password => {
        const result = ValidationService.validatePassword(password);
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      });
    });

    it('should reject passwords without lowercase letters', () => {
      const passwords = ['PASSWORD123', 'STRONGPASS1', 'UPPERCASE123'];

      passwords.forEach(password => {
        const result = ValidationService.validatePassword(password);
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      });
    });

    it('should reject passwords without numbers', () => {
      const passwords = ['PasswordWithoutNumber', 'StrongPass', 'ValidPassword'];

      passwords.forEach(password => {
        const result = ValidationService.validatePassword(password);
        expect(result.valid).toBe(false);
        expect(result.message).toBe('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      });
    });

    it('should handle edge cases', () => {
      // Exactly minimum length with all requirements
      const minValidPassword = 'Pass1a';
      const result1 = ValidationService.validatePassword(minValidPassword);
      expect(result1.valid).toBe(true);

      // Exactly maximum length with all requirements
      const maxValidPassword = 'A'.repeat(125) + '1a'; // 127 characters
      const result2 = ValidationService.validatePassword(maxValidPassword);
      expect(result2.valid).toBe(true);

      // Empty password
      const result3 = ValidationService.validatePassword('');
      expect(result3.valid).toBe(false);
    });
  });

  describe('Password Match Validation', () => {
    it('should validate matching passwords', () => {
      const testCases = [
        ['password123', 'password123'],
        ['StrongPass1', 'StrongPass1'],
        ['', ''],
        ['Complex@Pass123', 'Complex@Pass123']
      ];

      testCases.forEach(([pass1, pass2]) => {
        expect(ValidationService.validatePasswordMatch(pass1, pass2)).toBe(true);
      });
    });

    it('should reject non-matching passwords', () => {
      const testCases = [
        ['password123', 'password124'],
        ['StrongPass1', 'StrongPass2'],
        ['password', ''],
        ['', 'password'],
        ['Complex@Pass123', 'complex@pass123'] // Case sensitive
      ];

      testCases.forEach(([pass1, pass2]) => {
        expect(ValidationService.validatePasswordMatch(pass1, pass2)).toBe(false);
      });
    });
  });

  describe('Name Validation', () => {
    it('should validate correct names', () => {
      const validNames = [
        'John',
        'Mary-Jane',
        'O\'Connor',
        'José',
        'A', // Single character
        'VeryLongNameThatIsExactlyFiftyCharactersLongTest' // Exactly 50 chars
      ];

      validNames.forEach(name => {
        expect(ValidationService.validateName(name)).toBe(true);
      });
    });

    it('should reject invalid names', () => {
      const invalidNames = [
        '', // Empty
        'A'.repeat(51), // Too long (51 characters)
        'VeryLongNameThatIsMoreThanFiftyCharactersLongAndShouldFail' // > 50 chars
      ];

      invalidNames.forEach(name => {
        expect(ValidationService.validateName(name)).toBe(false);
      });
    });
  });

  describe('Input Sanitization', () => {
    it('should trim whitespace from input', () => {
      const testCases = [
        ['  hello  ', 'hello'],
        ['\ttest\t', 'test'],
        ['\n\nvalue\n\n', 'value'],
        ['  mixed  whitespace  ', 'mixed  whitespace'],
        ['', ''],
        ['   ', '']
      ];

      testCases.forEach(([input, expected]) => {
        expect(ValidationService.sanitizeInput(input)).toBe(expected);
      });
    });

    it('should handle special characters and unicode', () => {
      const testCases = [
        ['  José  ', 'José'],
        ['  email@domain.com  ', 'email@domain.com'],
        ['  user+tag@example.org  ', 'user+tag@example.org'],
        ['  Hello, World!  ', 'Hello, World!']
      ];

      testCases.forEach(([input, expected]) => {
        expect(ValidationService.sanitizeInput(input)).toBe(expected);
      });
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete validation workflow', () => {
      // Simulate a registration form validation
      const formData = {
        email: '  test@example.com  ',
        password: 'StrongPass123',
        confirmPassword: 'StrongPass123',
        firstName: '  John  ',
        lastName: '  Doe  '
      };

      // Sanitize inputs
      const cleanEmail = ValidationService.sanitizeInput(formData.email);
      const cleanFirstName = ValidationService.sanitizeInput(formData.firstName);
      const cleanLastName = ValidationService.sanitizeInput(formData.lastName);

      // Validate sanitized inputs
      expect(ValidationService.validateEmail(cleanEmail)).toBe(true);
      expect(ValidationService.validatePassword(formData.password).valid).toBe(true);
      expect(ValidationService.validatePasswordMatch(formData.password, formData.confirmPassword)).toBe(true);
      expect(ValidationService.validateName(cleanFirstName)).toBe(true);
      expect(ValidationService.validateName(cleanLastName)).toBe(true);

      // Check sanitized values
      expect(cleanEmail).toBe('test@example.com');
      expect(cleanFirstName).toBe('John');
      expect(cleanLastName).toBe('Doe');
    });

    it('should catch validation errors in workflow', () => {
      const invalidFormData = {
        email: 'invalid-email',
        password: 'weak',
        confirmPassword: 'different',
        firstName: '',
        lastName: 'A'.repeat(51)
      };

      expect(ValidationService.validateEmail(invalidFormData.email)).toBe(false);
      expect(ValidationService.validatePassword(invalidFormData.password).valid).toBe(false);
      expect(ValidationService.validatePasswordMatch(invalidFormData.password, invalidFormData.confirmPassword)).toBe(false);
      expect(ValidationService.validateName(invalidFormData.firstName)).toBe(false);
      expect(ValidationService.validateName(invalidFormData.lastName)).toBe(false);
    });
  });
}); 