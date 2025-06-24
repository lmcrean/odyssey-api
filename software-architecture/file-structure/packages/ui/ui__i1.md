# Packages/UI - Odyssey Creator Platform (MVP - Iteration 1)

> **Essential UI Components** - Basic form inputs, buttons, and layout components only

## Architecture Overview

Minimal UI component library providing **only essential** React components needed for MVP launch. All advanced components moved to iteration 2.

## Directory Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── forms/
│   │   │   ├── Input.tsx            # ✅ Basic text input
│   │   │   ├── Button.tsx           # ✅ Basic button
│   │   │   ├── TextArea.tsx         # ✅ Basic textarea
│   │   │   └── index.ts
│   │   ├── layout/
│   │   │   ├── Container.tsx        # ✅ Basic container
│   │   │   ├── Header.tsx           # ✅ Basic header
│   │   │   ├── Footer.tsx           # ✅ Basic footer  
│   │   │   └── index.ts
│   │   ├── feedback/
│   │   │   ├── LoadingSpinner.tsx   # ✅ Basic spinner
│   │   │   ├── ErrorMessage.tsx     # ✅ Basic error display
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── styles/
│   │   ├── globals.css              # ✅ Basic styles
│   │   └── variables.css            # ✅ CSS variables
│   └── index.ts
├── package.json
└── tsconfig.json
```

## Essential Components

### **Form Components**
```typescript
// components/forms/Input.tsx
interface InputProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

// components/forms/Button.tsx  
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}

// components/forms/TextArea.tsx
interface TextAreaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}
```

### **Layout Components**
```typescript
// components/layout/Container.tsx
interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: boolean;
}

// components/layout/Header.tsx
interface HeaderProps {
  title: string;
  user?: {
    username: string;
    profilePicture?: string;
  };
  onLogout?: () => void;
}
```

### **Feedback Components**  
```typescript
// components/feedback/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

// components/feedback/ErrorMessage.tsx
interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}
```

## Basic Styling (CSS)

```css
/* styles/variables.css */
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  --color-error: #ef4444;
  --color-success: #10b981;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
}

/* styles/globals.css */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: var(--font-size-base);
  line-height: 1.5;
  color: #374151;
}

.button {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: 0.375rem;
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: background-color 0.2s;
}

.button-primary {
  background-color: var(--color-primary);
  color: white;
}

.button-primary:hover {
  background-color: #2563eb;
}

.input {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: var(--font-size-base);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

## Dependencies

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

## MVP Features ✅

- ✅ Basic form inputs (text, email, password)
- ✅ Simple buttons with loading states
- ✅ Basic textarea component
- ✅ Essential layout components
- ✅ Loading spinner
- ✅ Error message display
- ✅ Minimal CSS styling system

## Excluded from MVP (Moved to Iteration 2) ❌

- ❌ Advanced form components (date picker, select, file upload)
- ❌ Data visualization (charts, graphs)
- ❌ Complex modals and overlays
- ❌ Navigation components (tabs, breadcrumbs)
- ❌ Advanced layout (grid systems, responsive utilities)
- ❌ Animation and transitions
- ❌ Rich text editors
- ❌ Image/video players
- ❌ Advanced styling (themes, design tokens)
- ❌ Accessibility features (beyond basic)
- ❌ Mobile-specific components
- ❌ Advanced feedback (notifications, toasts)

## Usage Examples

```typescript
// In apps/web
import { Input, Button, Container, LoadingSpinner } from '@odyssey/ui';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <Container maxWidth="sm">
      <Input
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        required
      />
      <Button
        type="submit"
        variant="primary"
        loading={loading}
      >
        {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
      </Button>
    </Container>
  );
}
```

This package provides **only the absolute minimum** UI components needed for a functional MVP, focusing on essential user interactions and basic layout. 