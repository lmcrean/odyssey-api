# UI Package Architecture - Iteration 2 (Design System & Component Library)

## Overview
This document describes the `packages/ui/` structure for Iteration 2, implementing a comprehensive design system and shared UI component library for the Odyssey B2B competitive intelligence platform. This package provides reusable Angular components built with Tailwind CSS to ensure design consistency across all applications and features.

## Package Purpose
The UI package serves as the foundation for all user interface components across the Odyssey platform, providing:
- **Design System**: Consistent visual language with Tailwind CSS design tokens
- **Reusable Components**: Battle-tested Angular components for common UI patterns
- **Developer Experience**: Streamlined development with pre-built, accessible components
- **Scalability**: Multi-application ready for web, admin, mobile, and desktop apps

## Project Structure

```
packages/ui/
├── package.json                    # NPM package configuration
├── README.md                       # UI component documentation
├── tailwind.config.js             # Tailwind configuration with design tokens
├── tsconfig.json                   # TypeScript configuration
├── angular.json                    # Angular library configuration
├── components/
│   ├── button/
│   │   ├── button.component.ts    # Reusable button with variants (primary, secondary, outline, ghost)
│   │   ├── button.component.html  # Template with Tailwind classes
│   │   ├── button.component.scss  # Component-specific styles
│   │   └── button.component.spec.ts # Unit tests
│   ├── form/
│   │   ├── form-field.component.ts     # Form field wrapper with validation display
│   │   ├── form-field.component.html   # Template with label, input slot, error display
│   │   ├── form-field.component.scss   # Form field styling
│   │   ├── form-field.component.spec.ts # Unit tests
│   │   ├── form-validators.ts          # Common validators (email, password strength, etc.)
│   │   ├── input.component.ts          # Base input component
│   │   ├── textarea.component.ts       # Textarea component
│   │   ├── select.component.ts         # Select dropdown component
│   │   └── checkbox.component.ts       # Checkbox component
│   ├── card/
│   │   ├── card.component.ts      # Card container component with variants
│   │   ├── card.component.html    # Card structure with header, body, footer slots
│   │   ├── card.component.scss    # Card styling with elevation levels
│   │   └── card.component.spec.ts # Unit tests
│   ├── modal/
│   │   ├── modal.component.ts     # Modal dialog component
│   │   ├── modal.component.html   # Modal structure with backdrop and content
│   │   ├── modal.component.scss   # Modal animations and styling
│   │   ├── modal.component.spec.ts # Unit tests
│   │   ├── modal.service.ts       # Modal service for programmatic management
│   │   └── modal-ref.ts           # Modal reference class
│   ├── loading/
│   │   ├── spinner.component.ts   # Loading spinner with size variants
│   │   ├── spinner.component.html # Spinner template
│   │   ├── spinner.component.scss # Spinner animations
│   │   ├── skeleton.component.ts  # Skeleton loader component
│   │   ├── skeleton.component.html # Skeleton template
│   │   └── skeleton.component.spec.ts # Unit tests
│   ├── navigation/
│   │   ├── navbar.component.ts    # Top navigation bar component
│   │   ├── sidebar.component.ts   # Sidebar navigation component
│   │   ├── breadcrumb.component.ts # Breadcrumb navigation
│   │   └── tabs.component.ts      # Tab navigation component
│   ├── feedback/
│   │   ├── alert.component.ts     # Alert/notification component
│   │   ├── toast.component.ts     # Toast notification component
│   │   ├── toast.service.ts       # Toast service for programmatic use
│   │   └── tooltip.component.ts   # Tooltip component
│   └── layout/
│       ├── container.component.ts # Layout container with responsive breakpoints
│       ├── grid.component.ts      # CSS Grid wrapper component
│       ├── flex.component.ts      # Flexbox wrapper component
│       └── spacer.component.ts    # Spacing utility component
├── directives/
│   ├── tooltip.directive.ts       # Tooltip directive for hover/focus behavior
│   ├── click-outside.directive.ts # Click outside detection directive
│   ├── auto-focus.directive.ts    # Auto-focus directive for forms
│   └── ripple.directive.ts        # Material-style ripple effect
├── pipes/
│   ├── truncate.pipe.ts          # Text truncation pipe
│   ├── currency.pipe.ts          # Custom currency formatting
│   └── relative-time.pipe.ts     # Relative time display (e.g., "2 hours ago")
├── services/
│   ├── theme.service.ts          # Theme management service
│   ├── viewport.service.ts       # Viewport/breakpoint detection service
│   └── accessibility.service.ts  # Accessibility utilities
├── styles/
│   ├── utilities.css             # Tailwind utility extensions
│   ├── components.css            # Base component styles
│   ├── tokens.css               # Design tokens as CSS variables
│   └── animations.css           # Custom animations and transitions
├── tokens/
│   ├── colors.ts                # Color palette definitions
│   ├── typography.ts            # Typography scale and fonts
│   ├── spacing.ts               # Spacing scale
│   ├── shadows.ts               # Box shadow definitions
│   └── breakpoints.ts           # Responsive breakpoint definitions
├── src/
│   └── index.ts                 # Package exports (public API)
├── dist/                        # Built output
├── node_modules/                # Dependencies
└── .storybook/                  # Storybook configuration (optional)
    ├── main.ts                  # Storybook main configuration
    ├── preview.ts              # Global decorators and parameters
    └── stories/                # Component stories
```

## Design System Tokens

### Color Palette
```typescript
// tokens/colors.ts
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',  // Main brand color
    600: '#2563eb',
    900: '#1e3a8a'
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    500: '#64748b',
    600: '#475569',
    900: '#0f172a'
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  // B2B specific colors
  competitive: '#8b5cf6',  // For competitive intelligence features
  insights: '#06b6d4',     // For data insights
  analysis: '#ec4899'      // For analysis tools
};
```

### Typography Scale
```typescript
// tokens/typography.ts
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace']
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }]
  }
};
```

## Core Component Examples

### Button Component
```typescript
// components/button/button.component.ts
@Component({
  selector: 'od-button',
  standalone: true,
  template: `
    <button
      [class]="buttonClasses"
      [disabled]="disabled || loading"
      [type]="type"
      (click)="onClick($event)">
      
      <od-spinner *ngIf="loading" size="sm" class="mr-2"></od-spinner>
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() loading = false;
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Output() click = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    return [
      'inline-flex items-center justify-center font-medium rounded-md transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      this.sizeClasses,
      this.variantClasses,
      this.disabled || this.loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    ].join(' ');
  }

  private get sizeClasses(): string {
    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };
    return sizes[this.size];
  }

  private get variantClasses(): string {
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
      ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500'
    };
    return variants[this.variant];
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.click.emit(event);
    }
  }
}
```

### Form Field Component
```typescript
// components/form/form-field.component.ts
@Component({
  selector: 'od-form-field',
  standalone: true,
  template: `
    <div class="space-y-1">
      <label 
        *ngIf="label"
        [for]="fieldId"
        [class]="labelClasses">
        {{ label }}
        <span *ngIf="required" class="text-red-500 ml-1">*</span>
      </label>
      
      <div class="relative">
        <ng-content></ng-content>
      </div>
      
      <div *ngIf="error || hint" class="min-h-[1.25rem]">
        <p *ngIf="error" class="text-sm text-red-600">{{ error }}</p>
        <p *ngIf="!error && hint" class="text-sm text-gray-500">{{ hint }}</p>
      </div>
    </div>
  `
})
export class FormFieldComponent {
  @Input() label?: string;
  @Input() error?: string;
  @Input() hint?: string;
  @Input() required = false;
  @Input() fieldId = `field-${Math.random().toString(36).substring(2, 9)}`;

  get labelClasses(): string {
    return [
      'block text-sm font-medium',
      this.error ? 'text-red-700' : 'text-gray-700'
    ].join(' ');
  }
}
```

## Integration with Applications

### Tailwind Configuration Extension
```javascript
// apps/web/tailwind.config.js
module.exports = {
  presets: [require('@odyssey/ui/tailwind.config')],
  content: [
    './src/**/*.{html,ts}',
    './node_modules/@odyssey/ui/**/*.{js,ts}'
  ],
  theme: {
    extend: {
      // App-specific extensions
    }
  }
};
```

### Component Usage in Auth Package
```typescript
// packages/auth/components/login/login.component.ts
import { ButtonComponent, FormFieldComponent, CardComponent } from '@odyssey/ui';

@Component({
  imports: [ButtonComponent, FormFieldComponent, CardComponent],
  template: `
    <od-card class="max-w-md mx-auto">
      <od-form-field label="Email" [error]="emailError" [required]="true">
        <input 
          type="email" 
          class="w-full px-3 py-2 border border-gray-300 rounded-md">
      </od-form-field>
      
      <od-button variant="primary" [loading]="isLoading" class="w-full">
        Sign In to Dashboard
      </od-button>
    </od-card>
  `
})
export class LoginComponent { }
```

## Package Configuration

### NPM Package Setup
```json
{
  "name": "@odyssey/ui",
  "version": "1.0.0",
  "description": "Shared UI component library for Odyssey platform",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./tailwind.config": "./tailwind.config.js"
  },
  "peerDependencies": {
    "@angular/core": "^18.0.0",
    "@angular/common": "^18.0.0",
    "tailwindcss": "^3.4.0"
  },
  "dependencies": {
    "@angular/cdk": "^18.0.0"
  }
}
```

### Build Configuration
```json
// angular.json
{
  "projects": {
    "ui": {
      "root": "packages/ui",
      "sourceRoot": "packages/ui/src",
      "projectType": "library",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:ng-packagr",
          "options": {
            "project": "packages/ui/ng-package.json"
          }
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "tsConfig": "packages/ui/tsconfig.spec.json",
            "karmaConfig": "packages/ui/karma.conf.js"
          }
        }
      }
    }
  }
}
```

## Testing Strategy

### Unit Testing
- Component behavior testing with Angular Testing Library
- Accessibility testing with @angular/cdk/a11y
- Visual regression testing (optional with Chromatic)
- Props validation and edge cases

### Integration Testing
- Component interaction testing
- Form validation flows
- Theme switching functionality
- Responsive behavior testing

### Documentation Testing
- Storybook stories for all components
- Interactive component playground
- Usage examples and best practices
- Design token documentation

## Accessibility Features

### Built-in A11y Support
- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management and trapping
- Screen reader compatibility
- Color contrast compliance (WCAG 2.1 AA)

### Focus Management
```typescript
// directives/auto-focus.directive.ts
@Directive({
  selector: '[odAutoFocus]'
})
export class AutoFocusDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    // Focus element after view initialization
    this.elementRef.nativeElement.focus();
  }
}
```

## Performance Considerations

### Tree Shaking
- Modular component architecture
- Separate entry points for each component
- Minimal bundle impact with lazy loading

### Bundle Optimization
- CSS purging in production builds
- Component lazy loading
- Shared dependency optimization

## Development Workflow

### Component Development
1. Create component with tests
2. Add Storybook story
3. Update public API exports
4. Document usage examples
5. Test accessibility compliance

### Release Process
1. Version bump following SemVer
2. Build and test all components
3. Publish to npm registry
4. Update consuming applications
5. Document breaking changes

## Future Enhancements

### Advanced Components
- Data table with sorting/filtering
- Rich text editor integration
- Chart components for analytics
- Advanced form builders

### Design System Evolution
- Dark mode support
- Brand customization
- Animation library expansion
- Mobile-specific optimizations

## Integration Points

### With Authentication Package
- Login/register form components
- User profile management UI
- Session management interface
- Password strength indicators

### With Observability Package
- Error boundary components
- Performance monitoring UI
- Debug information display
- Health status indicators

### Multi-Application Usage
- Web application (Angular)
- Admin dashboard (future)
- Mobile app wrapper (future)
- Desktop app integration (future)