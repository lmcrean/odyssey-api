# packages/ui - Design System & Components

> **Basic UI components** for web application interface

## Overview
Essential UI components package providing core components, basic styling, and responsive design for web applications. Focused on fundamental interface elements needed for MVP.

## Tech Stack
- **React** for component library
- **Tailwind CSS** for styling system
- **TypeScript** for type safety

## File Structure
```typescript
ui/
├── package.json       // Dependencies: react, tailwind
├── tailwind.config.js // Tailwind configuration
├── src/
│   ├── components/   // UI components
│   │   ├── forms/
│   │   │   ├── Input.tsx            // Text input with variants
│   │   │   ├── TextArea.tsx         // Multi-line text input
│   │   │   ├── Select.tsx           // Dropdown select component
│   │   │   ├── Checkbox.tsx         // Checkbox input
│   │   │   ├── Button.tsx           // Form submit button
│   │   │   ├── FileUpload.tsx       // File upload with drag & drop
│   │   │   ├── PasswordInput.tsx    // Password input with toggle
│   │   │   └── __tests__/
│   │   ├── layout/
│   │   │   ├── Container.tsx        // Responsive page container
│   │   │   ├── Grid.tsx            // CSS Grid wrapper component
│   │   │   ├── Stack.tsx           // Vertical/horizontal stack
│   │   │   ├── Header.tsx          // Page header component
│   │   │   ├── Footer.tsx          // Page footer component
│   │   │   ├── Card.tsx            // Content card component
│   │   │   └── __tests__/
│   │   ├── feedback/
│   │   │   ├── Alert.tsx           // Alert message component
│   │   │   ├── Toast.tsx           // Toast notification
│   │   │   ├── Loading.tsx         // Loading spinner states
│   │   │   ├── Skeleton.tsx        // Content loading placeholders
│   │   │   └── __tests__/
│   │   ├── content/
│   │   │   ├── Avatar.tsx          // User avatar component
│   │   │   ├── Badge.tsx           // Status badge component
│   │   │   ├── MediaPlayer.tsx     // Basic video/audio player
│   │   │   └── __tests__/
│   │   ├── navigation/
│   │   │   ├── Button.tsx          // Primary button component
│   │   │   ├── Link.tsx            // Styled link component
│   │   │   ├── Menu.tsx            // Navigation menu
│   │   │   ├── Tabs.tsx            // Tab navigation
│   │   │   └── __tests__/
│   │   └── overlay/
│   │       ├── Modal.tsx           // Modal dialog component
│   │       ├── Dropdown.tsx        // Dropdown menu
│   │       ├── Tooltip.tsx         // Hover tooltip
│   │       └── __tests__/
│   ├── hooks/        // UI hooks
│   │   ├── useDisclosure.ts        // Modal/dropdown state management
│   │   ├── useToast.ts            // Toast notification hook
│   │   ├── useMedia.ts            // Media query hook
│   │   └── __tests__/
│   ├── styles/       // Styling utilities
│   │   ├── globals.css            // Global CSS styles
│   │   ├── components.css         // Component-specific styles
│   │   └── variables.css          // CSS custom properties
│   ├── icons/        // Icon components
│   │   ├── basic/
│   │   │   ├── Upload.tsx         // Upload icon
│   │   │   ├── Download.tsx       // Download icon
│   │   │   ├── Edit.tsx           // Edit/pencil icon
│   │   │   ├── Delete.tsx         // Delete/trash icon
│   │   │   ├── Search.tsx         // Search icon
│   │   │   └── Close.tsx          // Close/X icon
│   │   └── __tests__/
│   ├── themes/       // Theme definitions
│   │   ├── light.ts              // Light theme configuration
│   │   ├── dark.ts               // Dark theme configuration
│   │   └── index.ts              // Theme system exports
│   ├── tokens/       // Design tokens
│   │   ├── colors.ts             // Color palette
│   │   ├── typography.ts         // Font definitions
│   │   ├── spacing.ts            // Spacing scale
│   │   └── index.ts
│   ├── providers/    // Context providers
│   │   ├── ThemeProvider.tsx     // Theme context provider
│   │   ├── ToastProvider.tsx     // Toast notification provider
│   │   └── __tests__/
│   └── utils/        // UI utilities
│       ├── classNames.ts         // CSS class utilities (clsx)
│       ├── responsive.ts         // Responsive helpers
│       └── __tests__/
└── docs/
    ├── README.md              // Package overview
    └── components.md          // Component documentation
```

## Key Features

### Form Components
- **Input Fields**: Text, textarea, select, checkbox inputs
- **File Upload**: Drag and drop file upload component
- **Validation**: Built-in form validation states
- **Accessibility**: ARIA labels and keyboard navigation

### Layout Components
- **Container**: Responsive page layout container
- **Grid & Stack**: Flexible layout utilities
- **Cards**: Content organization components
- **Header/Footer**: Page structure components

### Feedback Components
- **Alerts**: Success, error, warning messages
- **Toasts**: Non-blocking notifications
- **Loading States**: Spinners and skeleton screens

### Navigation
- **Buttons**: Primary, secondary, link buttons
- **Menus**: Navigation and dropdown menus
- **Tabs**: Tab-based navigation

### Overlay Components
- **Modals**: Dialog and confirmation modals
- **Tooltips**: Contextual help tooltips
- **Dropdowns**: Action and menu dropdowns

## Usage Examples

### Form Components
```typescript
import { Input, Button, Card } from '@packages/ui/components';

function LoginForm() {
  return (
    <Card>
      <form>
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          required
        />
        <Button type="submit" variant="primary">
          Sign In
        </Button>
      </form>
    </Card>
  );
}
```

### Layout Components
```typescript
import { Container, Grid, Stack } from '@packages/ui/components';

function Dashboard() {
  return (
    <Container>
      <Stack spacing="lg">
        <h1>Dashboard</h1>
        <Grid cols={2} gap="md">
          <Card>Content 1</Card>
          <Card>Content 2</Card>
        </Grid>
      </Stack>
    </Container>
  );
}
```

### Feedback Components
```typescript
import { useToast, Alert, Loading } from '@packages/ui/components';

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Operation completed successfully!');
  };

  return (
    <div>
      <Alert variant="success">
        Profile updated successfully
      </Alert>
      <Loading size="lg" />
    </div>
  );
}
```

## Dependencies
- **React**: ^18.0.0 - UI component library
- **Tailwind CSS**: ^3.3.0 - Utility-first CSS framework
- **clsx**: ^2.0.0 - Conditional class name utility 