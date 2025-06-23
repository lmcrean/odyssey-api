Key Testing Strategy
Unit Testing - __tests__/ folders

Jest Configuration: Each package has its own jest.config.js for isolated testing
Co-location: Tests live alongside source files in __tests__/ directories
Coverage: Comprehensive unit tests for all services, hooks, components, and utilities
Mocking: Mock external dependencies (Stripe, database, APIs) for fast, reliable tests

E2E Testing - e2e/runners/ folders

Playwright: Both app-specific and global E2E tests using Playwright
App-Level E2E: Tests specific to web app user flows in apps/web/e2e/runners/
Global E2E: Cross-app integration tests in root e2e/runners/ for complete user journeys
Test Data: Fixtures and page objects for maintainable test suites
CI/CD Integration: Automated E2E tests on pull requests and deployments

Testing Architecture Benefits

Isolation: Unit tests run fast and independently
Integration: E2E tests ensure features work end-to-end
Maintainability: Co-located tests make refactoring safer
CI/CD Ready: Separate test configs allow parallel test execution
Creator Focus: Payment flows, sponsorship journeys, and monetization features fully tested