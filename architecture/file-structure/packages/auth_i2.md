# Authentication Package Architecture - Iteration 2 (Complete Auth System)

## Overview
This document describes the `packages/auth/` structure for Iteration 2, implementing a comprehensive authentication system for the Odyssey B2B competitive intelligence platform. This package follows the established observability package pattern with mixed C#/TypeScript architecture, providing both backend and frontend authentication capabilities.

## Package Purpose
The auth package serves as the central authentication system across the Odyssey platform, providing:
- **JWT-Based Authentication**: Secure token-based authentication with refresh token rotation
- **B2B User Management**: Company-based user isolation and role-based access control
- **Frontend Components**: Angular authentication components using @odyssey/ui
- **Backend Services**: C# services for authentication, authorization, and user management
- **Database Integration**: Entity Framework models and migrations for auth tables

## Project Structure

```
packages/auth/
├── package.json                    # NPM package configuration
├── CompetitorAnalysis.Auth.csproj  # NuGet package configuration
├── README.md                       # Package documentation
├── tsconfig.json                   # TypeScript configuration
├── entities/
│   ├── User.cs                     # C# entity model
│   ├── user.types.ts               # TypeScript types for User
│   ├── Company.cs                  # C# entity model
│   ├── company.types.ts            # TypeScript types for Company
│   ├── RefreshToken.cs             # C# entity model
│   └── refresh-token.types.ts      # TypeScript types for RefreshToken
├── services/
│   ├── IJwtTokenService.cs         # C# JWT service interface
│   ├── JwtTokenService.cs          # C# JWT service implementation
│   ├── IPasswordService.cs         # C# password service interface
│   ├── PasswordService.cs          # C# password service implementation
│   ├── auth.service.ts             # TypeScript auth service
│   ├── auth.service.spec.ts        # TypeScript auth service tests
│   └── user.service.ts             # TypeScript user service
├── data/
│   ├── AuthDbContext.cs            # Entity Framework context
│   ├── Configurations/
│   │   ├── UserConfiguration.cs    # EF User entity configuration
│   │   ├── CompanyConfiguration.cs # EF Company entity configuration
│   │   └── RefreshTokenConfiguration.cs # EF RefreshToken configuration
│   ├── Migrations/                 # EF generated migrations
│   └── auth-requests.types.ts      # TypeScript request/response types
├── middleware/
│   ├── JwtAuthMiddleware.cs        # C# JWT authentication middleware
│   └── auth.interceptor.ts         # TypeScript HTTP interceptor
├── guards/
│   ├── AuthorizeAttributes.cs      # C# authorization attributes
│   ├── auth.guard.ts               # TypeScript route guard
│   ├── auth.guard.spec.ts          # TypeScript guard tests
│   └── role.guard.ts               # TypeScript role-based guard
├── components/                     # Angular standalone components (using @odyssey/ui)
│   ├── login/
│   │   ├── login.component.ts     # Imports Button, FormField from @odyssey/ui
│   │   ├── login.component.html   # Uses Tailwind classes
│   │   └── login.component.spec.ts
│   ├── register/
│   │   ├── register.component.ts  # Imports Card, Button, FormField from @odyssey/ui
│   │   ├── register.component.html # Uses Tailwind classes
│   │   └── register.component.spec.ts
│   ├── profile/
│   │   ├── profile.component.ts   # Imports Card, Button, Modal from @odyssey/ui
│   │   ├── profile.component.html # Uses Tailwind classes
│   │   └── profile.component.spec.ts
│   └── forgot-password/
│       ├── forgot-password.component.ts  # Imports Card, Button, FormField
│       ├── forgot-password.component.html # Uses Tailwind classes
│       └── forgot-password.component.spec.ts
├── Extensions/
│   └── AuthServiceExtensions.cs    # C# DI configuration extensions
├── src/                            # TypeScript package entry point
│   └── index.ts                    # Exports all TypeScript modules
├── dist/                           # Built TypeScript output
├── bin/                            # Built C# output
├── obj/                            # C# build artifacts
├── .npmignore                      # NPM package ignore rules
├── .gitignore                      # Git ignore for build artifacts
└── scripts/
    ├── build.sh                    # Build both C# and TypeScript
    └── test.sh                     # Run both C# and TypeScript tests
```

## Database Entities

### User Entity (C#)
```csharp
// entities/User.cs
public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public Guid? CompanyId { get; set; }
    public bool EmailVerified { get; set; } = false;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation properties
    public Company? Company { get; set; }
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}

public enum UserRole
{
    Expert,
    User,
    Both
}
```

### User Types (TypeScript)
```typescript
// entities/user.types.ts
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  companyId?: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  company?: Company;
}

export enum UserRole {
  Expert = 'Expert',
  User = 'User',
  Both = 'Both'
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName: string;
  companySize: string;
  primaryUseCase: string;
  acceptTerms: boolean;
  sendUpdates: boolean;
}
```

## Core Services

### JWT Token Service (C#)
```csharp
// services/JwtTokenService.cs
public interface IJwtTokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    Task<bool> ValidateRefreshTokenAsync(string token, Guid userId);
    Task RevokeRefreshTokenAsync(string token);
}

public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _configuration;
    private readonly AuthDbContext _context;

    public string GenerateAccessToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["JwtSettings:Secret"]);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim("CompanyId", user.CompanyId?.ToString() ?? "")
            }),
            Expires = DateTime.UtcNow.AddMinutes(15), // Short-lived access token
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature),
            Issuer = _configuration["JwtSettings:Issuer"],
            Audience = _configuration["JwtSettings:Audience"]
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
```

### Auth Service (TypeScript)
```typescript
// services/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  // Angular 18 signals for reactive state
  private _currentUser = signal<User | null>(null);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Computed signals
  currentUser = computed(() => this._currentUser());
  isAuthenticated = computed(() => !!this._currentUser());
  isLoading = computed(() => this._isLoading());
  error = computed(() => this._error());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  async login(email: string, password: string, rememberMe: boolean): Promise<void> {
    this._isLoading.set(true);
    this._error.set(null);

    try {
      const response = await this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, {
        email,
        password,
        rememberMe
      }).toPromise();

      if (response) {
        this.setAuthData(response);
        await this.router.navigate(['/dashboard']);
      }
    } catch (error) {
      this._error.set(this.getErrorMessage(error));
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  async register(registerData: RegisterRequest): Promise<void> {
    this._isLoading.set(true);
    this._error.set(null);

    try {
      const response = await this.http.post<LoginResponse>(`${this.apiUrl}/auth/register`, registerData).toPromise();

      if (response) {
        this.setAuthData(response);
        await this.router.navigate(['/onboarding']);
      }
    } catch (error) {
      this._error.set(this.getErrorMessage(error));
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  private setAuthData(response: LoginResponse): void {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    this._currentUser.set(response.user);
  }
}
```

## Authentication Components

### Login Component Integration
```typescript
// components/login/login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Import from UI package
import { 
  ButtonComponent, 
  FormFieldComponent, 
  CardComponent,
  SpinnerComponent 
} from '@odyssey/ui';

// Import from auth package services
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'auth-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    FormFieldComponent,
    CardComponent,
    SpinnerComponent
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <od-card class="w-full max-w-md">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">Welcome to Odyssey</h2>
          <p class="mt-2 text-sm text-gray-600">Competitive Intelligence Platform</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <od-form-field 
            label="Work Email" 
            [error]="emailError"
            [required]="true">
            <input 
              type="email" 
              formControlName="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user@company.com">
          </od-form-field>
          
          <od-form-field 
            label="Password" 
            [error]="passwordError"
            [required]="true">
            <input 
              type="password" 
              formControlName="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          </od-form-field>
          
          <od-button 
            type="submit" 
            variant="primary"
            [loading]="authService.isLoading()"
            [disabled]="loginForm.invalid || authService.isLoading()"
            class="w-full">
            Sign In to Dashboard
          </od-button>
        </form>
      </od-card>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  protected authService = inject(AuthService);
  private router = inject(Router);
  
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false]
  });
  
  async onSubmit() {
    if (this.loginForm.invalid) return;
    
    await this.authService.login(
      this.loginForm.value.email!,
      this.loginForm.value.password!,
      this.loginForm.value.rememberMe!
    );
  }

  get emailError(): string | null {
    const email = this.loginForm.get('email');
    if (email?.touched && email?.errors) {
      if (email.errors['required']) return 'Email is required';
      if (email.errors['email']) return 'Please enter a valid email';
    }
    return null;
  }

  get passwordError(): string | null {
    const password = this.loginForm.get('password');
    if (password?.touched && password?.errors) {
      if (password.errors['required']) return 'Password is required';
      if (password.errors['minlength']) return 'Password must be at least 8 characters';
    }
    return null;
  }
}
```

## Security Features

### JWT Authentication Middleware
```csharp
// middleware/JwtAuthMiddleware.cs
public class JwtAuthMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;

    public async Task InvokeAsync(HttpContext context, IJwtTokenService tokenService)
    {
        var token = ExtractTokenFromRequest(context.Request);
        
        if (!string.IsNullOrEmpty(token))
        {
            try
            {
                var principal = tokenService.GetPrincipalFromExpiredToken(token);
                if (principal != null)
                {
                    context.User = principal;
                }
            }
            catch (SecurityTokenException)
            {
                // Token validation failed
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Invalid token");
                return;
            }
        }

        await _next(context);
    }

    private string? ExtractTokenFromRequest(HttpRequest request)
    {
        var authorization = request.Headers["Authorization"].FirstOrDefault();
        if (authorization?.StartsWith("Bearer ") == true)
        {
            return authorization.Substring("Bearer ".Length).Trim();
        }
        return null;
    }
}
```

### Route Guards (TypeScript)
```typescript
// guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const roleGuard = (requiredRole: UserRole) => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.currentUser();
    if (user && (user.role === requiredRole || user.role === UserRole.Both)) {
      return true;
    }

    router.navigate(['/unauthorized']);
    return false;
  };
};
```

## Package Configuration

### NPM Package (TypeScript)
```json
{
  "name": "@odyssey/auth",
  "version": "1.0.0",
  "description": "Authentication package for Odyssey platform",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "peerDependencies": {
    "@angular/core": "^18.0.0",
    "@angular/common": "^18.0.0",
    "@angular/router": "^18.0.0",
    "@odyssey/ui": "^1.0.0"
  }
}
```

### C# Project Configuration
```xml
<!-- CompetitorAnalysis.Auth.csproj -->
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net9.0</TargetFramework>
    <PackageId>CompetitorAnalysis.Auth</PackageId>
    <Version>1.0.0</Version>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="9.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore" Version="9.0.0" />
    <PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
    <PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="7.1.2" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="../observability/csharp/CompetitorAnalysis.Observability.csproj" />
  </ItemGroup>
</Project>
```

## Integration with Applications

### API Integration
```csharp
// apps/api/Program.cs
using CompetitorAnalysis.Auth.Extensions;

builder.Services.AddAuthenticationServices(builder.Configuration);
builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

app.UseAuthentication();
app.UseAuthorization();
```

### Web Application Integration
```typescript
// apps/web/src/app/app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@odyssey/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    // Other providers
  ]
};
```

## Testing Strategy

### Backend Testing (C#)
- Unit tests for JWT token service
- Integration tests for auth controllers
- Database migration tests
- Security middleware tests

### Frontend Testing (TypeScript)
- Component testing with Angular Testing Library
- Service testing with mocked HTTP clients
- Guard testing for route protection
- E2E authentication flow tests

## Security Considerations

### Token Management
- Short-lived access tokens (15 minutes)
- Refresh token rotation on each use
- Secure token storage (httpOnly cookies)
- Token revocation on logout

### Password Security
- Bcrypt hashing with work factor 10
- Password strength requirements
- Account lockout after failed attempts
- Password reset with secure tokens

### API Security
- Rate limiting on auth endpoints
- CSRF protection for state-changing operations
- Input validation and sanitization
- SQL injection prevention

## Deployment Integration

### Database Migrations
- Automatic migration on deployment
- Rollback strategy for failed deployments
- Data seeding for initial admin users
- Environment-specific configurations

### Environment Configuration
```json
// appsettings.json
{
  "JwtSettings": {
    "Secret": "[Generated secure key]",
    "Issuer": "OdysseyIntelligence",
    "Audience": "OdysseyUsers",
    "AccessTokenExpiration": 15,
    "RefreshTokenExpiration": 10080
  },
  "AuthSettings": {
    "PasswordRequirements": {
      "RequiredLength": 8,
      "RequireDigit": true,
      "RequireLowercase": true,
      "RequireUppercase": true,
      "RequireNonAlphanumeric": true
    },
    "RateLimiting": {
      "LoginAttempts": 5,
      "LockoutDuration": 900
    }
  }
}
```

## Future Enhancements

### SSO Integration
- Google Workspace integration
- Microsoft Azure AD integration
- SAML 2.0 support
- OpenID Connect support

### Advanced Security
- Multi-factor authentication (2FA)
- Biometric authentication (WebAuthn)
- Device fingerprinting
- Anomaly detection

### B2B Features
- Company-level settings
- Bulk user management
- API key management
- Usage analytics and reporting