# packages/shared - Core Utilities

> **Foundation types and utilities** used across all applications

## Overview
The shared package provides core TypeScript types, validation schemas, constants, and utility functions that form the foundation for all other packages and applications.

## Tech Stack
- **Zod** for runtime validation
- **date-fns** for date manipulation
- **lodash** for utility functions
- **TypeScript** for type definitions

## File Structure
```typescript
shared/
├── package.json        // Core dependencies: zod, date-fns, lodash
├── src/
│   ├── types/         // Global TypeScript definitions
│   │   ├── User.ts              // Base user types
│   │   │   ├── BaseUser         // Core user properties
│   │   │   ├── UserProfile      // User profile information
│   │   │   ├── UserPreferences  // User settings & preferences
│   │   │   └── UserRole         // User role definitions
│   │   ├── Creator.ts           // Creator-specific types
│   │   │   ├── CreatorProfile   // Creator profile data
│   │   │   ├── CreatorStats     // Analytics & performance metrics
│   │   │   ├── CreatorSettings  // Creator configuration
│   │   │   └── MonetizationSettings // Revenue settings
│   │   ├── Content.ts           // Content types (photo, video, etc.)
│   │   │   ├── BaseContent      // Core content properties
│   │   │   ├── ImageContent     // Image-specific properties
│   │   │   ├── VideoContent     // Video-specific properties
│   │   │   ├── AudioContent     // Audio-specific properties
│   │   │   ├── LiveStreamContent // Live stream properties
│   │   │   └── ContentMetadata  // Content metadata
│   │   ├── Payment.ts           // Payment & revenue types
│   │   │   ├── PaymentMethod    // Payment method types
│   │   │   ├── Transaction      // Transaction data
│   │   │   ├── Subscription     // Subscription types
│   │   │   ├── Payout          // Creator payout types
│   │   │   └── RevenueShare    // Revenue sharing models
│   │   ├── GDPR.ts             // GDPR compliance types
│   │   │   ├── ConsentRecord    // Consent tracking
│   │   │   ├── DataProcessing   // Processing purposes
│   │   │   ├── DataExport      // Export request types
│   │   │   ├── DataDeletion    // Deletion request types
│   │   │   └── PrivacySettings // Privacy preferences
│   │   ├── API.ts              // API response types
│   │   │   ├── APIResponse      // Standard response format
│   │   │   ├── PaginatedResponse // Paginated data response
│   │   │   ├── ErrorResponse   // Error response format
│   │   │   └── SuccessResponse // Success response format
│   │   ├── Analytics.ts         // Analytics & metrics types
│   │   │   ├── UserAnalytics    // User behavior metrics
│   │   │   ├── ContentAnalytics // Content performance metrics
│   │   │   ├── RevenueAnalytics // Revenue metrics
│   │   │   └── PlatformAnalytics // Platform-wide metrics
│   │   ├── index.ts            // Type exports
│   │   └── __tests__/
│   ├── validation/    // Zod schemas
│   │   ├── userSchemas.ts       // User validation schemas
│   │   │   ├── CreateUserSchema // User creation validation
│   │   │   ├── UpdateUserSchema // User update validation
│   │   │   ├── UserProfileSchema // Profile validation
│   │   │   └── UserPreferencesSchema // Preferences validation
│   │   ├── creatorSchemas.ts    // Creator validation schemas
│   │   │   ├── CreatorProfileSchema // Creator profile validation
│   │   │   ├── CreatorSettingsSchema // Settings validation
│   │   │   └── MonetizationSchema // Monetization validation
│   │   ├── contentSchemas.ts    // Content validation schemas
│   │   │   ├── ContentUploadSchema // Upload validation
│   │   │   ├── ContentUpdateSchema // Update validation
│   │   │   ├── ImageContentSchema // Image validation
│   │   │   ├── VideoContentSchema // Video validation
│   │   │   └── LiveStreamSchema // Live stream validation
│   │   ├── paymentSchemas.ts    // Payment validation schemas
│   │   │   ├── PaymentMethodSchema // Payment method validation
│   │   │   ├── TransactionSchema // Transaction validation
│   │   │   ├── SubscriptionSchema // Subscription validation
│   │   │   └── PayoutSchema // Payout validation
│   │   ├── gdprSchemas.ts       // GDPR validation schemas
│   │   │   ├── ConsentSchema // Consent validation
│   │   │   ├── DataExportSchema // Export request validation
│   │   │   ├── DataDeletionSchema // Deletion request validation
│   │   │   └── PrivacySettingsSchema // Privacy settings validation
│   │   ├── index.ts
│   │   └── __tests__/
│   ├── constants/     // App-wide constants
│   │   ├── errors.ts            // Error messages & codes
│   │   │   ├── AUTH_ERRORS      // Authentication error codes
│   │   │   ├── VALIDATION_ERRORS // Validation error codes
│   │   │   ├── PAYMENT_ERRORS   // Payment error codes
│   │   │   ├── CONTENT_ERRORS   // Content error codes
│   │   │   └── GDPR_ERRORS     // GDPR compliance errors
│   │   ├── limits.ts            // File size, rate limits
│   │   │   ├── FILE_SIZE_LIMITS // Max file sizes by type
│   │   │   ├── RATE_LIMITS     // API rate limits
│   │   │   ├── CONTENT_LIMITS  // Content upload limits
│   │   │   └── USER_LIMITS     // User action limits
│   │   ├── currencies.ts        // Supported currencies
│   │   │   ├── SUPPORTED_CURRENCIES // List of supported currencies
│   │   │   ├── CURRENCY_SYMBOLS // Currency display symbols
│   │   │   ├── DEFAULT_CURRENCY // Platform default currency
│   │   │   └── CURRENCY_CONVERSION // Conversion rate sources
│   │   ├── regions.ts           // GDPR regions & compliance
│   │   │   ├── GDPR_REGIONS    // EU/GDPR applicable regions
│   │   │   ├── DATA_RESIDENCY  // Data residency requirements
│   │   │   ├── PRIVACY_LAWS    // Regional privacy laws
│   │   │   └── COMPLIANCE_LEVELS // Compliance requirement levels
│   │   ├── contentTypes.ts      // Supported media types
│   │   │   ├── IMAGE_FORMATS   // Supported image formats
│   │   │   ├── VIDEO_FORMATS   // Supported video formats
│   │   │   ├── AUDIO_FORMATS   // Supported audio formats
│   │   │   ├── LIVE_STREAM_FORMATS // Live streaming formats
│   │   │   └── FILE_EXTENSIONS // Allowed file extensions
│   │   ├── roles.ts            // User roles & permissions
│   │   │   ├── USER_ROLES      // Available user roles
│   │   │   ├── PERMISSIONS     // Role-based permissions
│   │   │   ├── CREATOR_TIERS   // Creator tier definitions
│   │   │   └── ADMIN_LEVELS    // Admin access levels
│   │   ├── index.ts
│   │   └── __tests__/
│   └── utils/         // Utility functions
│       ├── formatters.ts        // Date, currency formatting
│       │   ├── formatCurrency   // Currency formatting
│       │   ├── formatDate       // Date formatting
│       │   ├── formatFileSize   // File size formatting
│       │   ├── formatDuration   // Duration formatting
│       │   └── formatNumber     // Number formatting
│       ├── validators.ts        // Email, URL validation
│       │   ├── validateEmail    // Email validation
│       │   ├── validateURL      // URL validation
│       │   ├── validateUsername // Username validation
│       │   ├── validatePhoneNumber // Phone validation
│       │   └── validatePassword // Password strength validation
│       ├── sanitizers.ts        // HTML sanitization
│       │   ├── sanitizeHTML     // HTML content sanitization
│       │   ├── sanitizeText     // Text content sanitization
│       │   ├── sanitizeFileName // File name sanitization
│       │   └── sanitizeURL      // URL sanitization
│       ├── crypto.ts           // Hashing, encryption
│       │   ├── hashPassword     // Password hashing
│       │   ├── generateSalt     // Salt generation
│       │   ├── encryptData      // Data encryption
│       │   ├── decryptData      // Data decryption
│       │   └── generateId       // ID generation
│       ├── gdpr.ts             // GDPR utilities
│       │   ├── checkConsent     // Consent verification
│       │   ├── recordProcessing // Processing record creation
│       │   ├── exportUserData   // Data export utilities
│       │   ├── deleteUserData   // Data deletion utilities
│       │   └── anonymizeData    // Data anonymization
│       ├── array.ts            // Array utilities
│       │   ├── chunk            // Array chunking
│       │   ├── paginate         // Pagination utilities
│       │   ├── shuffle          // Array shuffling
│       │   └── unique           // Remove duplicates
│       ├── object.ts           // Object utilities
│       │   ├── deepMerge        // Deep object merging
│       │   ├── pick             // Object property picking
│       │   ├── omit             // Object property omission
│       │   └── flatten          // Object flattening
│       ├── string.ts           // String utilities
│       │   ├── slugify          // String to slug conversion
│       │   ├── truncate         // String truncation
│       │   ├── capitalize       // String capitalization
│       │   └── stripHtml        // HTML tag removal
│       ├── date.ts             // Date utilities
│       │   ├── formatRelative   // Relative date formatting
│       │   ├── addDays          // Date arithmetic
│       │   ├── isWithinRange    // Date range checking
│       │   └── getTimezone      // Timezone utilities
│       ├── index.ts
│       └── __tests__/
└── docs/              // Package documentation
    ├── README.md              // Package overview
    ├── types.md              // Type system documentation
    ├── validation.md         // Validation schema guide
    ├── constants.md          // Constants reference
    ├── utilities.md          // Utility functions guide
    └── examples/
        ├── validation-examples.ts // Validation usage examples
        ├── type-examples.ts      // Type usage examples
        └── utility-examples.ts   // Utility usage examples
```

## Key Features

### Type System
- **Comprehensive Types**: Complete TypeScript definitions for all domain entities
- **Type Safety**: Strict typing across all applications
- **Extensible**: Easy to extend for new features
- **Consistent**: Standardized type patterns
- **Well Documented**: Comprehensive type documentation

### Validation System
- **Zod-based**: Runtime type validation with Zod schemas
- **Reusable**: Shared validation logic across applications
- **Composable**: Build complex validations from simple schemas
- **Error Handling**: Consistent error messages and formatting
- **Type Inference**: Automatic TypeScript type inference from schemas

### Constants & Configuration
- **Centralized**: All platform constants in one place
- **Environment Aware**: Different values for different environments
- **Type Safe**: TypeScript const assertions for type safety
- **Maintainable**: Easy to update and maintain
- **Well Organized**: Logical grouping of related constants

### Utility Functions
- **Pure Functions**: No side effects, easy to test
- **TypeScript First**: Full TypeScript support with proper types
- **Tree Shakeable**: Import only what you need
- **Well Tested**: Comprehensive test coverage
- **Performance Optimized**: Efficient implementations

## Usage Examples

### Types
```typescript
import { User, Creator, Content } from '@packages/shared/types';

const user: User = {
  id: 'user_123',
  email: 'creator@example.com',
  username: 'creator_name',
  profile: {
    displayName: 'Creator Name',
    bio: 'Content creator...',
    avatar: 'https://...'
  }
};
```

### Validation
```typescript
import { CreateUserSchema } from '@packages/shared/validation';

const result = CreateUserSchema.safeParse({
  email: 'user@example.com',
  username: 'username',
  password: 'secure_password'
});

if (result.success) {
  // Valid data
  console.log(result.data);
} else {
  // Validation errors
  console.log(result.error.issues);
}
```

### Constants
```typescript
import { 
  FILE_SIZE_LIMITS, 
  SUPPORTED_CURRENCIES,
  GDPR_REGIONS 
} from '@packages/shared/constants';

// Check file size limit
if (fileSize > FILE_SIZE_LIMITS.IMAGE) {
  throw new Error('File too large');
}

// Check currency support
if (!SUPPORTED_CURRENCIES.includes(currency)) {
  throw new Error('Unsupported currency');
}
```

### Utilities
```typescript
import { 
  formatCurrency, 
  validateEmail, 
  sanitizeHTML,
  hashPassword 
} from '@packages/shared/utils';

// Format currency
const price = formatCurrency(29.99, 'USD'); // "$29.99"

// Validate email
const isValid = validateEmail('user@example.com'); // true

// Sanitize content
const clean = sanitizeHTML('<script>alert("xss")</script>Hello'); // "Hello"

// Hash password
const hash = await hashPassword('password'); // bcrypt hash
```

## Dependencies
- **Zod**: Runtime validation and type inference
- **date-fns**: Date manipulation and formatting
- **lodash**: Utility functions (tree-shakeable imports)
- **bcrypt**: Password hashing
- **uuid**: Unique identifier generation

## Testing
- **Vitest**: Fast unit testing framework
- **100% Coverage**: All utilities and validators tested
- **Type Testing**: TypeScript type correctness tests
- **Property Testing**: Fuzz testing for edge cases 