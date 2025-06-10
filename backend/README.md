# Odyssey Backend

A TypeScript Express backend built with Vite, Vitest, Playwright, SQLite, and Vercel.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Development

```bash
# Start development server
npm run dev

# Start development server for E2E testing
npm run dev:e2e
```

The server will start on `http://localhost:5000` (or `5001` on macOS).

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run unit tests with Vitest
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run test coverage
npm run test:coverage

# Run Playwright E2E tests (development)
npm run test:dev

# Run Playwright E2E tests (production)
npm run test:prod
```

### Database

```bash
# Initialize SQLite database
npm run db:init:sqlite

# Reset database
npm run db:reset

# Run migrations
npm run db:migrate
```

### Deployment

```bash
# Deploy to Vercel
npm run deploy:vercel
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── db/              # Database configuration and initialization
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models (to be added)
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── test-utilities/  # Testing utilities
│   ├── types/           # TypeScript type definitions
│   └── server.ts        # Main server file
├── e2e/                 # Playwright E2E tests
├── dist/                # Built files
└── dev.sqlite3          # SQLite database file
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Build Tool**: Vite
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Knex.js
- **Deployment**: Vercel

## 📝 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Test Endpoints
- `GET /api/hello` - Basic hello message

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=./dev.sqlite3
JWT_SECRET=your-super-secret-jwt-key-here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### TypeScript Configuration

The project uses modern TypeScript with ES modules. Key configurations:
- Target: ES2022
- Module: ESNext
- Strict mode enabled
- Path aliases configured for clean imports

### Vite Configuration

Vite is configured for:
- TypeScript compilation
- Path aliases
- Node.js target
- Development server on port 5000

## 🧪 Testing Strategy

### Unit Tests (Vitest)
- Located in `src/**/__tests__/`
- Test individual functions and modules
- Fast execution with hot reload

### E2E Tests (Playwright)
- Located in `e2e/`
- Test complete API workflows
- Separate configs for dev/prod environments
- Only uses Safari browser as per project requirements

## 🚀 Deployment

The backend is configured for Vercel deployment using the builds configuration:

1. Build the project: `npm run build`
2. Deploy: `npm run deploy:vercel`

The `vercel.json` configuration handles routing and CORS headers.

## 📚 Development Guidelines

- Keep files under 100 lines when possible
- Use singular functions for database operations
- Follow TypeScript strict mode
- Write tests for all new features
- Use path aliases for clean imports

## 🔄 Next Steps

This is the base setup. You can now add:
- Authentication routes and middleware
- User management
- Message handling
- Database models
- Additional API endpoints
- More comprehensive testing 