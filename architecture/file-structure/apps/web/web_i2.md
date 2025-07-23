# Web Architecture - Iteration 2 (Authentication Integration)

## Overview
This document describes the Angular 18 frontend structure for Iteration 2, implementing a complete authentication system for the B2B competitive intelligence platform. This builds upon the i1 foundation (basic Angular app with API communication) to add user authentication flows, protected routes, and integration with the new shared UI component library.

## Enhanced Project Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── hello-world/           # i1 - Basic component
│   │   │   └── navigation/            # Updated with auth state
│   │   │       ├── navigation.component.ts    # Uses @odyssey/ui components
│   │   │       ├── navigation.component.html  # Tailwind classes only
│   │   │       └── navigation.component.spec.ts
│   │   ├── services/
│   │   │   ├── api.service.ts         # i1 - HTTP service (updated)
│   │   │   └── [Auth services from packages/auth/services/]
│   │   ├── guards/                    # NEW - From packages/auth/guards/
│   │   │   ├── auth.guard.ts          # Route protection
│   │   │   └── role.guard.ts          # Role-based access
│   │   ├── interceptors/              # NEW - From packages/auth/middleware/
│   │   │   └── auth.interceptor.ts    # Token attachment
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.config.ts              # Updated with auth providers
│   │   └── app.routes.ts              # Updated with auth routes
│   ├── styles.css                     # Import Tailwind and @odyssey/ui
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html
│   └── main.ts
├── tailwind.config.js                 # Extends @odyssey/ui config
├── angular.json
├── package.json                       # Updated dependencies
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── firebase.json                      # i1 - Hosting config
└── .firebaserc                        # i1 - Project config
```

## Authentication Components (from packages/auth)

### Login Component
- Path: `/login`
- Features:
  - Email/password authentication
  - "Remember me" functionality
  - Google SSO integration
  - Microsoft SSO integration
  - Responsive design with Tailwind
  - Uses @odyssey/ui Button, FormField, Card components

### Register Component
- Path: `/register`
- Features:
  - B2B onboarding flow
  - Company information collection
  - Password strength indicator
  - Terms of service acceptance
  - Free trial activation
  - Uses @odyssey/ui form components

### Profile Component
- Path: `/profile`
- Features:
  - User information management
  - Company details display
  - Session management
  - Password change functionality
  - Account deletion
  - Uses @odyssey/ui Card, Button, Modal components

### Password Reset Components
- Paths: `/forgot-password`, `/reset-password`
- Features:
  - Email-based password reset
  - Secure token validation
  - Password requirements display

## Navigation Integration

### Updated Navigation Component
```typescript
// Uses signals for reactive auth state
export class NavigationComponent {
  authService = inject(AuthService);
  
  user = computed(() => this.authService.currentUser());
  isAuthenticated = computed(() => !!this.user());
  
  menuItems = computed(() => {
    if (this.isAuthenticated()) {
      return [
        { label: 'Dashboard', route: '/dashboard' },
        { label: 'Analytics', route: '/analytics' },
        { label: 'Reports', route: '/reports' },
        { label: 'Teams', route: '/teams' },
        { label: 'API', route: '/api' }
      ];
    }
    return [];
  });
}
```

### User Menu Dropdown
- Account Settings
- Company Management
- Team Members
- Usage & Billing
- API Keys
- Activity Log
- Help & Support
- Sign Out

## Service Architecture

### Auth Service (from packages/auth)
- Angular 18 signals for state management
- JWT token management
- Automatic token refresh
- Session persistence
- Logout across all tabs

### Token Service
- Secure token storage (httpOnly cookies)
- Token expiration tracking
- Refresh token rotation
- CSRF protection

### API Service Updates
- Integration with auth interceptor
- Error handling for 401/403 responses
- Automatic retry with token refresh

## Route Configuration

### Public Routes
```typescript
export const routes: Routes = [
  { path: 'login', loadComponent: () => import('@odyssey/auth').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('@odyssey/auth').then(m => m.RegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('@odyssey/auth').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('@odyssey/auth').then(m => m.ResetPasswordComponent) }
];
```

### Protected Routes
```typescript
export const protectedRoutes: Routes = [
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('@odyssey/auth').then(m => m.ProfileComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('Admin')],
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
  }
];
```

## UI Component Library Integration

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  presets: [require('@odyssey/ui/tailwind.config')],
  content: [
    './src/**/*.{html,ts}',
    './node_modules/@odyssey/ui/**/*.{js,ts}'
  ]
};
```

### Using UI Components
```typescript
import { ButtonComponent, FormFieldComponent, CardComponent } from '@odyssey/ui';

@Component({
  imports: [ButtonComponent, FormFieldComponent, CardComponent],
  template: `
    <od-card class="max-w-md mx-auto">
      <od-form-field label="Email" [error]="emailError">
        <input type="email" class="w-full px-3 py-2 border rounded-md">
      </od-form-field>
      <od-button variant="primary" [loading]="isLoading">
        Submit
      </od-button>
    </od-card>
  `
})
```

## State Management

### Authentication State
- Centralized in AuthService using signals
- Persisted across browser sessions
- Synchronized across tabs
- Reactive updates throughout app

### User Preferences
- Theme selection (future)
- Language preference (future)
- Dashboard customization (future)

## Security Implementation

### Client-Side Security
- XSS protection with Angular sanitization
- CSRF tokens for state-changing operations
- Secure cookie settings for tokens
- Input validation on all forms

### HTTP Security
- Auth interceptor adds Bearer tokens
- Automatic 401 handling with token refresh
- Request retry logic
- Secure error handling

## Performance Optimizations

### Lazy Loading
- Auth components loaded on demand
- Route-based code splitting
- Shared UI components bundled separately

### Caching Strategy
- User profile cached with signals
- API responses cached appropriately
- Token refresh optimization

## Testing Approach

### Unit Tests
- Component behavior with auth states
- Service method validation
- Guard logic verification
- Interceptor token handling

### Integration Tests
- Complete auth flows
- Route navigation with guards
- API communication with auth
- Error scenarios

### E2E Tests
- User registration journey
- Login and navigation
- Profile management
- Password reset flow

## Deployment Updates

### Environment Configuration
```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.odyssey-intelligence.com',
  authConfig: {
    tokenRefreshBuffer: 300, // 5 minutes
    sessionTimeout: 1800     // 30 minutes
  }
};
```

### Build Configuration
- Tailwind CSS purging for production
- Tree shaking for unused UI components
- Auth package optimization

## Mobile Responsiveness

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Responsive Features
- Collapsible navigation menu
- Touch-friendly form inputs
- Optimized modal dialogs
- Adaptive layouts

## Accessibility

### WCAG 2.1 Compliance
- Proper ARIA labels on auth forms
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

### Focus Management
- Logical tab order
- Focus trapping in modals
- Clear focus indicators

## Next Steps (Post-i2)

### Immediate Enhancements
- Biometric authentication (WebAuthn)
- Social login providers expansion
- Advanced session management UI
- Security dashboard for users

### Long-term Features
- Multi-factor authentication (MFA)
- Enterprise SSO (SAML, OIDC)
- Passwordless authentication
- Compliance reporting (SOC2, GDPR)