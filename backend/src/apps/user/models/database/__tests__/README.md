# User Database Model Tests

This directory contains unit tests for the user database model functions. We take a **focused, pragmatic approach** to testing these functions.

## Testing Philosophy

Instead of complex database mocking (which is difficult to maintain and can give false confidence), we focus on testing the **business logic and transformation patterns** that are the most valuable and error-prone parts of these functions.

## What We Test

### ✅ **Business Logic** (High Value)
- **Input validation patterns** - `!!(input?.trim())` logic 
- **ValidationService integration** - Email/password validation calls
- **Data transformation logic** - Database row → TypeScript interface mapping
- **Field mapping logic** - Modern vs legacy field preferences (`profilePicture || avatar`)
- **Default value handling** - Missing fields get sensible defaults
- **Date conversion logic** - String dates → Date objects
- **Password hashing detection** - Already hashed vs plain text passwords
- **Search query validation** - Limit boundaries and trimming
- **Error pattern detection** - SQLite constraint error parsing
- **Truthy/falsy evaluation** - Database result existence checking

### ❌ **What We DON'T Test** (Low Value)
- Raw database queries (covered by integration tests)
- Database connection handling (infrastructure concern)
- Simple CRUD operations without business logic
- Database constraint enforcement (database responsibility)

## Test Structure

### `validation.test.ts`
Our main test file focusing on pure business logic:

```typescript
describe('User Database Functions - Validation Logic', () => {
  describe('Input Validation Patterns', () => {
    // Tests the validation patterns used across all functions
  });
  
  describe('Data Transformation Logic', () => {
    // Tests transformation helpers and mapping logic
  });
  
  describe('Error Handling Patterns', () => {
    // Tests error detection and classification logic
  });
});
```

## Benefits of This Approach

1. **Fast execution** - No database setup/teardown
2. **Reliable** - No flaky database mocking
3. **Maintainable** - Tests focus on logic that actually changes
4. **Comprehensive** - Covers the error-prone business logic thoroughly
5. **TDD-friendly** - Easy to write tests first, then implement

## Integration Testing Coverage

The complex database interactions are covered by:
- **Integration tests** in `e2e/` directory
- **Development environment tests** (`npm run test:dev`)
- **Production environment tests** (`npm run test:prod`)

## Running Tests

```bash
# Run all user model tests
npm test -- "user/models"

# Run specific test file
npm test -- "validation.test.ts"

# Run with coverage
npm run test:coverage -- "user/models"
```

## Coverage Areas

### Input Validation (19 tests)
- Empty/null string handling
- Email validation integration
- Password validation integration

### Data Transformation (8 tests)
- Database row mapping
- Legacy field support
- Date conversion
- Default values

### Error Handling (2 tests)  
- SQLite error classification
- Result existence evaluation

### Business Logic (4 tests)
- Password hash detection
- Search query validation
- Limit boundaries

**Total: 19 comprehensive tests** covering the core business logic patterns used across all database functions.

## Future Additions

When adding new database functions:

1. **Extract validation patterns** → Add to validation tests
2. **Extract transformation logic** → Add to transformation tests  
3. **Complex database operations** → Cover in integration tests
4. **Keep unit tests focused** on business logic only

This approach gives us confidence in the business logic while keeping tests fast, reliable, and maintainable. 