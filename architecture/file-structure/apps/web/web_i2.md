# Web Structure - Iteration 2: Authentication Integration

## Angular Frontend with Authentication

### Updated Project Structure
```
apps/web/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── hello-world/             # Existing component
│   │   │   ├── login/
│   │   │   │   ├── login.component.ts
│   │   │   │   ├── login.component.html
│   │   │   │   └── login.component.scss
│   │   │   ├── register/
│   │   │   │   ├── register.component.ts
│   │   │   │   ├── register.component.html
│   │   │   │   └── register.component.scss
│   │   │   └── dashboard/
│   │   │       ├── dashboard.component.ts
│   │   │       ├── dashboard.component.html
│   │   │       └── dashboard.component.scss
│   │   ├── services/
│   │   │   ├── api.service.ts           # Enhanced HTTP service
│   │   │   ├── auth.service.ts          # Authentication service
│   │   │   └── token.service.ts         # JWT token management
│   │   ├── guards/
│   │   │   ├── auth.guard.ts            # Route protection
│   │   │   └── role.guard.ts            # Role-based access
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts      # JWT token injection
│   │   │   └── error.interceptor.ts     # Error handling
│   │   ├── models/
│   │   │   ├── user.model.ts            # User interface
│   │   │   ├── auth.model.ts            # Auth DTOs
│   │   │   └── api-response.model.ts    # API response typing
│   │   ├── app.component.ts
│   │   ├── app.routes.ts                # Updated routing
│   │   └── app.config.ts                # Auth providers
│   ├── environments/
│   │   ├── environment.ts               # Dev with auth config
│   │   └── environment.prod.ts          # Prod with auth config
│   └── index.html
├── angular.json
├── package.json                         # Updated dependencies
└── vitest.config.ts                     # Enhanced test config
```

### Key Authentication Components

#### services/auth.service.ts
- Login/logout functionality
- Token storage and retrieval
- User session management
- Registration flow
- Password reset
- Auto-logout on token expiry

#### services/token.service.ts
- JWT token storage (localStorage/sessionStorage)
- Token validation and parsing
- Refresh token management
- Token expiry handling
- Secure token operations

#### guards/auth.guard.ts
- Route protection for authenticated users
- Redirect to login if not authenticated
- Token validation before route access
- Role-based route protection

#### interceptors/auth.interceptor.ts
- Automatic JWT token injection
- Authorization header management
- Token refresh on 401 responses
- Request/response logging

#### components/login/login.component.ts
- Login form with validation
- Error handling and display
- Remember me functionality
- Redirect after successful login
- Integration with auth service

#### components/register/register.component.ts
- Registration form with validation
- Company association for B2B
- Password strength validation
- Terms and conditions acceptance
- Email verification flow

### Routing Updates

#### app.routes.ts
```typescript
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '/login' }
];
```

### Enhanced Dependencies
- @angular/forms for reactive forms
- @angular/common/http for HTTP client
- Angular Material or Bootstrap for UI
- Angular JWT library for token handling
- Form validation libraries
- Toast/notification service

### Testing Enhancements
- Auth service unit tests
- Component integration tests
- Guard and interceptor tests
- Mock authentication flows
- E2E authentication tests

### Security Features
- Secure token storage
- XSS protection
- CSRF prevention
- Input sanitization
- Route protection
- Auto-logout functionality