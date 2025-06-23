# packages/ui - Design System & Components

> **Reusable UI components** with consistent styling and accessibility

## Overview
Comprehensive design system providing reusable UI components, consistent styling, theming, and accessibility features for all frontend applications. Built with modern React patterns, Tailwind CSS, and full TypeScript support.

## Tech Stack
- **React** for component library
- **Tailwind CSS** for styling system
- **Headless UI** for accessible primitives  
- **Storybook** for component documentation
- **Framer Motion** for animations
- **TypeScript** for type safety

## File Structure
```typescript
ui/
├── package.json       // Dependencies: react, tailwind, headless-ui, framer-motion
├── tailwind.config.js // Tailwind configuration
├── src/
│   ├── components/   // UI components
│   │   ├── forms/
│   │   │   ├── Input.tsx            // Text input with variants
│   │   │   ├── TextArea.tsx         // Multi-line text input
│   │   │   ├── Select.tsx           // Dropdown select component
│   │   │   ├── Checkbox.tsx         // Checkbox input
│   │   │   ├── RadioGroup.tsx       // Radio button group
│   │   │   ├── Switch.tsx           // Toggle switch
│   │   │   ├── FileUpload.tsx       // File upload with drag & drop
│   │   │   ├── ImageUpload.tsx      // Image upload with preview
│   │   │   ├── SearchInput.tsx      // Search input with suggestions
│   │   │   ├── PasswordInput.tsx    // Password input with toggle
│   │   │   ├── PriceInput.tsx       // Currency input for payments
│   │   │   ├── GDPRConsent.tsx     // GDPR consent checkbox
│   │   │   └── __tests__/
│   │   ├── layout/
│   │   │   ├── Container.tsx        // Responsive page container
│   │   │   ├── Grid.tsx            // CSS Grid wrapper component
│   │   │   ├── Stack.tsx           // Vertical/horizontal stack
│   │   │   ├── Flex.tsx            // Flexbox utility component
│   │   │   ├── Sidebar.tsx         // Navigation sidebar
│   │   │   ├── Header.tsx          // Page header component
│   │   │   ├── Footer.tsx          // Page footer component
│   │   │   ├── Section.tsx         // Content section wrapper
│   │   │   ├── Card.tsx            // Content card component
│   │   │   ├── Panel.tsx           // Information panel
│   │   │   └── __tests__/
│   │   ├── feedback/
│   │   │   ├── Alert.tsx           // Alert message component
│   │   │   ├── Toast.tsx           // Toast notification
│   │   │   ├── Loading.tsx         // Loading spinner states
│   │   │   ├── Skeleton.tsx        // Content loading placeholders
│   │   │   ├── ProgressBar.tsx     // Progress indicator
│   │   │   ├── ProgressCircle.tsx  // Circular progress indicator
│   │   │   ├── EmptyState.tsx      // Empty state illustration
│   │   │   ├── ErrorBoundary.tsx   // Error boundary component
│   │   │   └── __tests__/
│   │   ├── content/
│   │   │   ├── Avatar.tsx          // User avatar component
│   │   │   ├── AvatarGroup.tsx     // Multiple avatar display
│   │   │   ├── Badge.tsx           // Status badge component
│   │   │   ├── Tag.tsx             // Content tag component
│   │   │   ├── MediaPlayer.tsx     // Video/audio player
│   │   │   ├── ImageGallery.tsx    // Image carousel/gallery
│   │   │   ├── ContentCard.tsx     // Creator content display
│   │   │   ├── UserCard.tsx        // User profile card
│   │   │   ├── CreatorCard.tsx     // Creator profile card
│   │   │   ├── StatCard.tsx        // Analytics stat display
│   │   │   ├── PricingCard.tsx     // Subscription pricing card
│   │   │   └── __tests__/
│   │   ├── navigation/
│   │   │   ├── Button.tsx          // Primary button component
│   │   │   ├── IconButton.tsx      // Icon-only button
│   │   │   ├── ButtonGroup.tsx     // Button group component
│   │   │   ├── Link.tsx            // Styled link component
│   │   │   ├── NavLink.tsx         // Navigation link
│   │   │   ├── Breadcrumb.tsx      // Navigation breadcrumbs
│   │   │   ├── Tabs.tsx            // Tab navigation
│   │   │   ├── Pagination.tsx      // Pagination controls
│   │   │   ├── Menu.tsx            // Navigation menu
│   │   │   ├── MobileMenu.tsx      // Mobile navigation menu
│   │   │   └── __tests__/
│   │   ├── overlay/
│   │   │   ├── Modal.tsx           // Modal dialog component
│   │   │   ├── Drawer.tsx          // Slide-out drawer
│   │   │   ├── Dropdown.tsx        // Dropdown menu
│   │   │   ├── Popover.tsx         // Popover component
│   │   │   ├── Tooltip.tsx         // Hover tooltip
│   │   │   ├── ContextMenu.tsx     // Right-click context menu
│   │   │   ├── Backdrop.tsx        // Modal backdrop
│   │   │   └── __tests__/
│   │   ├── creator/
│   │   │   ├── ContentUploader.tsx // Content upload interface
│   │   │   ├── EarningsDisplay.tsx // Revenue/earnings display
│   │   │   ├── AnalyticsChart.tsx  // Analytics visualization
│   │   │   ├── SubscriberList.tsx  // Subscriber management
│   │   │   ├── LiveStreamPlayer.tsx // Live streaming interface
│   │   │   ├── ChatInterface.tsx   // Live chat component
│   │   │   ├── TipJar.tsx          // Tip/donation component
│   │   │   └── __tests__/
│   │   └── social/
│   │       ├── LikeButton.tsx      // Like/heart button
│   │       ├── ShareButton.tsx     // Content sharing
│   │       ├── CommentBox.tsx      // Comment input/display
│   │       ├── FollowButton.tsx    // Follow/unfollow button
│   │       ├── NotificationBell.tsx // Notification indicator
│   │       ├── MessageThread.tsx   // Message conversation
│   │       └── __tests__/
│   ├── hooks/        // UI hooks
│   │   ├── useDisclosure.ts        // Modal/dropdown state management
│   │   ├── useToast.ts            // Toast notification hook
│   │   ├── useMedia.ts            // Media query hook
│   │   ├── useKeyboard.ts         // Keyboard shortcut handling
│   │   ├── useClipboard.ts        // Clipboard operations
│   │   ├── useLocalStorage.ts     // Local storage hook
│   │   ├── useDebounce.ts         // Debounced value hook
│   │   ├── useIntersection.ts     // Intersection observer
│   │   └── __tests__/
│   ├── styles/       // Styling utilities
│   │   ├── globals.css            // Global CSS styles
│   │   ├── components.css         // Component-specific styles
│   │   ├── variables.css          // CSS custom properties
│   │   ├── animations.css         // Animation keyframes
│   │   ├── utilities.css          // Utility classes
│   │   └── responsive.css         // Responsive utilities
│   ├── icons/        // Icon components
│   │   ├── social/
│   │   │   ├── Heart.tsx          // Like/favorite icon
│   │   │   ├── HeartFilled.tsx    // Filled like icon
│   │   │   ├── Share.tsx          // Share icon
│   │   │   ├── Comment.tsx        // Comment icon
│   │   │   ├── Follow.tsx         // Follow icon
│   │   │   ├── Message.tsx        // Message icon
│   │   │   └── Notification.tsx   // Bell notification icon
│   │   ├── actions/
│   │   │   ├── Upload.tsx         // Upload icon
│   │   │   ├── Download.tsx       // Download icon
│   │   │   ├── Edit.tsx           // Edit/pencil icon
│   │   │   ├── Delete.tsx         // Delete/trash icon
│   │   │   ├── Copy.tsx           // Copy icon
│   │   │   ├── Search.tsx         // Search icon
│   │   │   └── Filter.tsx         // Filter icon
│   │   ├── navigation/
│   │   │   ├── Menu.tsx           // Hamburger menu
│   │   │   ├── Close.tsx          // Close/X icon
│   │   │   ├── ChevronDown.tsx    // Dropdown arrow
│   │   │   ├── ChevronUp.tsx      // Up arrow
│   │   │   ├── ChevronLeft.tsx    // Left arrow
│   │   │   ├── ChevronRight.tsx   // Right arrow
│   │   │   ├── ArrowBack.tsx      // Back arrow
│   │   │   └── Home.tsx           // Home icon
│   │   ├── media/
│   │   │   ├── Play.tsx           // Play button
│   │   │   ├── Pause.tsx          // Pause button
│   │   │   ├── Stop.tsx           // Stop button
│   │   │   ├── Volume.tsx         // Volume icon
│   │   │   ├── VolumeOff.tsx      // Muted volume
│   │   │   ├── Fullscreen.tsx     // Fullscreen icon
│   │   │   └── Camera.tsx         // Camera icon
│   │   └── __tests__/
│   ├── themes/       // Theme definitions
│   │   ├── light.ts              // Light theme configuration
│   │   ├── dark.ts               // Dark theme configuration
│   │   ├── creator.ts            // Creator-focused theme
│   │   ├── fan.ts                // Fan-focused theme
│   │   ├── admin.ts              // Admin interface theme
│   │   └── index.ts              // Theme system exports
│   ├── tokens/       // Design tokens
│   │   ├── colors.ts             // Color palette
│   │   ├── typography.ts         // Font definitions
│   │   ├── spacing.ts            // Spacing scale
│   │   ├── shadows.ts            // Shadow definitions
│   │   ├── borders.ts            // Border styles
│   │   ├── animations.ts         // Animation timings
│   │   └── index.ts
│   ├── providers/    // Context providers
│   │   ├── ThemeProvider.tsx     // Theme context provider
│   │   ├── ToastProvider.tsx     // Toast notification provider
│   │   ├── ModalProvider.tsx     // Modal context provider
│   │   └── __tests__/
│   └── utils/        // UI utilities
│       ├── classNames.ts         // CSS class utilities (clsx)
│       ├── responsive.ts         // Responsive helpers
│       ├── accessibility.ts      // A11y utilities
│       ├── animations.ts         // Animation utilities
│       ├── colors.ts             // Color manipulation
│       ├── focus.ts              // Focus management
│       └── __tests__/
├── storybook/        // Component documentation
│   ├── .storybook/
│   │   ├── main.ts               // Storybook configuration
│   │   ├── preview.ts            // Global story settings
│   │   └── theme.ts              // Storybook theme
│   └── stories/
│       ├── components/           // Component stories
│       ├── pages/                // Page-level stories
│       ├── patterns/             // Design pattern stories
│       └── tokens/               // Design token stories
└── docs/
    ├── README.md                 // Package overview
    ├── design-system.md          // Design system guide
    ├── component-api.md          // Component API reference
    ├── theming.md               // Theming guide
    ├── accessibility.md         // Accessibility guidelines
    └── examples/
        ├── basic-usage.tsx      // Basic component usage
        ├── theming-examples.tsx  // Theme customization
        └── advanced-patterns.tsx // Advanced usage patterns
```

## Key Features

### Design System
- **Consistent Design Language**: Unified visual language across all components
- **Design Tokens**: Centralized design decisions (colors, typography, spacing)
- **Component Variants**: Multiple styles and sizes for each component
- **Responsive Design**: Mobile-first responsive components
- **Dark/Light Mode**: Complete theme system with mode switching

### Accessibility
- **WCAG 2.1 Compliant**: Meets accessibility standards
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: Meets contrast requirements for all text

### Developer Experience
- **TypeScript First**: Complete type definitions for all components
- **Storybook Documentation**: Interactive component documentation
- **Tree Shakeable**: Import only what you need
- **Customizable**: Easy to extend and customize components
- **Testing Ready**: Built-in test utilities and examples

### Creator Platform Specific
- **Creator Components**: Specialized components for creator workflows
- **Content Display**: Optimized media and content presentation
- **Monetization UI**: Payment and subscription interface components
- **Analytics Visualization**: Chart and metrics display components
- **Live Streaming**: Real-time interaction components

## Usage Examples

### Basic Components
```typescript
import { Button, Input, Card } from '@packages/ui/components';

function LoginForm() {
  return (
    <Card className="max-w-md mx-auto">
      <form className="space-y-4">
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
        <Button type="submit" variant="primary" fullWidth>
          Sign In
        </Button>
      </form>
    </Card>
  );
}
```

### Creator-Specific Components
```typescript
import { 
  ContentUploader, 
  EarningsDisplay, 
  AnalyticsChart 
} from '@packages/ui/components/creator';

function CreatorDashboard() {
  return (
    <div className="space-y-6">
      <EarningsDisplay 
        totalEarnings={2543.67}
        monthlyEarnings={487.23}
        currency="USD"
      />
      
      <ContentUploader
        acceptedTypes={['image', 'video']}
        maxSize="100MB"
        onUpload={handleUpload}
      />
      
      <AnalyticsChart
        data={analyticsData}
        type="line"
        title="Views Over Time"
      />
    </div>
  );
}
```

### Theme System
```typescript
import { ThemeProvider, useTheme } from '@packages/ui/providers';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <MainContent />
    </ThemeProvider>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  );
}
```

### Form Components
```typescript
import { 
  Input, 
  Select, 
  Checkbox, 
  FileUpload,
  Button 
} from '@packages/ui/components';

function ProfileForm() {
  return (
    <form className="space-y-4">
      <Input
        label="Display Name"
        placeholder="Your creator name"
        maxLength={50}
      />
      
      <Select
        label="Content Category"
        options={[
          { value: 'art', label: 'Art & Design' },
          { value: 'music', label: 'Music' },
          { value: 'fitness', label: 'Fitness' }
        ]}
      />
      
      <FileUpload
        label="Profile Picture" 
        accept="image/*"
        maxSize="5MB"
        preview
      />
      
      <Checkbox
        label="I agree to the Terms of Service"
        required
      />
      
      <Button type="submit" variant="primary">
        Save Profile
      </Button>
    </form>
  );
}
```

## Theme Configuration

### Custom Theme
```typescript
import { createTheme } from '@packages/ui/themes';

const customTheme = createTheme({
  colors: {
    primary: {
      50: '#f0f9ff',
      500: '#3b82f6',
      900: '#1e3a8a'
    },
    creator: {
      50: '#fdf4ff',
      500: '#d946ef',
      900: '#581c87'
    }
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Poppins', 'Inter', 'sans-serif']
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  }
});
```

### Responsive Breakpoints
```typescript
const breakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Usage in components
<Stack 
  direction={{ base: 'column', md: 'row' }}
  spacing={{ base: 'sm', md: 'md' }}
>
  <ContentCard />
  <ContentCard />
</Stack>
```

## Animation System
```typescript
import { motion } from 'framer-motion';
import { fadeIn, slideUp } from '@packages/ui/utils/animations';

function AnimatedCard() {
  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <Card>Content here</Card>
    </motion.div>
  );
}
```

## Accessibility Features
- **Keyboard Navigation**: Tab order, arrow keys, escape handling
- **Screen Reader Support**: ARIA labels, roles, and descriptions
- **Focus Management**: Visible focus rings, focus trapping in modals
- **Color Blind Support**: Sufficient contrast ratios, non-color-only indicators
- **Reduced Motion**: Respects user's motion preferences

## Testing Strategy
- **Unit Tests**: Component behavior and props testing
- **Visual Tests**: Storybook visual regression testing
- **Accessibility Tests**: Automated a11y testing with jest-axe
- **Integration Tests**: Component interaction testing

## Dependencies
- **React**: ^18.0.0 - Component library foundation
- **Tailwind CSS**: ^3.0.0 - Utility-first CSS framework
- **Headless UI**: ^1.7.0 - Accessible component primitives
- **Framer Motion**: ^10.0.0 - Animation library
- **clsx**: ^1.2.0 - Conditional className utility
- **@radix-ui/react-***: Various accessible primitives 