# Web Structure - Iteration 1: Angular Hello World

## Angular Frontend Setup

### Project Structure
```
apps/web/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── hello-world/
│   │   │       ├── hello-world.component.ts
│   │   │       ├── hello-world.component.html
│   │   │       └── hello-world.component.scss
│   │   ├── services/
│   │   │   └── api.service.ts           # HTTP client for API calls
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.routes.ts                # Routing configuration
│   │   └── app.config.ts                # App configuration
│   ├── environments/
│   │   ├── environment.ts               # Dev environment
│   │   └── environment.prod.ts          # Prod environment
│   ├── index.html
│   └── main.ts
├── angular.json
├── package.json
├── tsconfig.json
└── firebase.json                        # Firebase hosting config
```

### Key Files for Iteration 1

#### src/app/app.component.ts
- Root component
- Basic layout structure
- Bootstrap hello-world component

#### src/app/components/hello-world/hello-world.component.ts
- Simple component consuming API
- HTTP call to C# API /health endpoint
- Display API response
- Error handling

#### src/app/services/api.service.ts
- HTTP client service
- Base URL configuration from environment
- GET request to hello world endpoint
- Response typing with TypeScript interfaces

#### src/environments/environment.ts
- API base URL: http://localhost:5000 (dev)
- Firebase config placeholder

#### src/environments/environment.prod.ts
- Production API URL (Google Cloud Run)
- Firebase hosting configuration

### Dependencies (package.json)
- @angular/core, @angular/common, @angular/platform-browser
- @angular/common/http for API calls
- @angular/router for future routing
- Bootstrap or Angular Material for basic styling

### Testing Setup (Vitest)
- Vitest configuration
- Integration tests for API service
- Component testing for hello-world
- Mock API responses

### Firebase Hosting Setup
- Firebase project configuration
- Build output directory: dist/web
- Routing configuration for SPA
- Environment-specific deployments

### Build Configuration
- Angular build for production
- Environment variable replacement
- Output optimization for Firebase
- Source maps for debugging