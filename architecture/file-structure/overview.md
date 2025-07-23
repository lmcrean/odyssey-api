# Architecture Overview - B2B Competitor Analysis Dashboard

## Project Structure

```
/architecture/
├── overview.md                          # This file
├── file-structure/
│   ├── apps/
│   │   ├── api/
│   │   │   ├── api_i1.md               # Hello World C# ASP.NET API
│   │   │   ├── api_i2.md               # Authentication integration
│   │   │   └── api_i3.md               # Full competitor analysis features
│   │   └── web/
│   │       ├── web_i1.md               # Hello World Angular frontend
│   │       ├── web_i2.md               # Authentication integration
│   │       └── web_i3.md               # Full dashboard features
│   ├── packages/
│   │   ├── shared_i2.md                # Shared types and constants package
│   │   └── auth_i2.md                  # Authentication package
│   ├── workflows/
│   │   ├── deploy-api-main-csharp.yml  # C# API deployment to Google Cloud
│   │   ├── deploy-web-main-firebase.yml # Angular deployment to Firebase
│   │   ├── deploy-branch-preview-csharp.yml # Branch preview deployment
│   │   └── integration-test-csharp.yml # Integration testing workflow
│   └── ux-design/
│       └── dashboard-wireframes.md     # UX wireframes for dashboard
└── overview.md                         # Main architecture overview
```

## Technology Stack

### Backend (C# ASP.NET Core)
- **Framework**: ASP.NET Core 9.0
- **Database**: PostgreSQL on Google Cloud SQL
- **Authentication**: JWT with refresh tokens
- **Deployment**: Google Cloud Run (serverless)
- **Testing**: xUnit for integration tests
- **External APIs**: NewsAPI, Reddit API, Google News RSS

### Frontend (Angular)
- **Framework**: Angular 18+ with TypeScript
- **State Management**: Services with RxJS
- **UI Components**: Angular Material or Bootstrap
- **Testing**: Vitest for integration tests
- **Deployment**: Firebase Hosting
- **Charts**: Chart.js for data visualization

### Infrastructure
- **Cloud Provider**: Google Cloud Platform (Free Tier)
- **API Hosting**: Cloud Run (pay-per-use)
- **Web Hosting**: Firebase Hosting (free tier)
- **Database**: Cloud SQL PostgreSQL (free tier)
- **Secrets**: Google Secret Manager
- **CI/CD**: GitHub Actions

## Development Phases

### Phase 1: Foundation (Iteration 1)
- **Goal**: Hello World connection between C# API and Angular frontend
- **Duration**: 1-2 weeks
- **Deliverables**:
  - Basic C# ASP.NET API with health endpoint
  - Angular app consuming the API
  - Docker containerization
  - Basic Google Cloud deployment
  - GitHub Actions workflow

### Phase 2: Authentication (Iteration 2)
- **Goal**: Secure B2B authentication system
- **Duration**: 2-3 weeks
- **Deliverables**:
  - Enhanced packages/shared with authentication types
  - JWT authentication in packages/auth
  - User registration and login
  - Role-based access control
  - Company-based user isolation
  - Protected API endpoints
  - Authentication UI components

### Phase 3: Core Features (Iteration 3)
- **Goal**: Full competitor analysis dashboard
- **Duration**: 3-4 weeks
- **Deliverables**:
  - Competitor management system
  - News aggregation from multiple APIs
  - Real-time dashboard with analytics
  - Data visualization and charts
  - Export functionality
  - Background services for monitoring

## API Integration Strategy

### Free APIs for Competitor Analysis
1. **NewsAPI** (newsapi.org)
   - 1,000 requests/day free tier
   - Real-time news headlines
   - Search by company name/keywords

2. **Reddit API** (reddit.com/dev/api)
   - Free with OAuth
   - Social media mentions
   - Subreddit monitoring

3. **Google News RSS**
   - Free RSS feeds
   - Company-specific news
   - No API key required

### Rate Limiting Strategy
- Implement request queuing
- Cache responses for 15 minutes
- Graceful degradation on API limits
- Background processing for non-critical updates

## Security Considerations

### API Security
- JWT tokens with short expiration
- Refresh token rotation
- Input validation and sanitization
- SQL injection prevention
- Rate limiting on authentication endpoints

### Web Security
- HTTPS enforcement
- XSS protection
- CSRF prevention
- Content Security Policy headers
- Secure token storage

### Infrastructure Security
- Service account with minimal permissions
- Environment variable secrets
- Database connection encryption
- Cloud Run security headers

## Testing Strategy

### Integration Testing Overlap
- **C# Integration Tests**: Test API endpoints, database operations, external API integrations
- **Angular Integration Tests**: Test services, components, API communication using Vitest
- **Cross-Platform E2E Tests**: Test complete user workflows using Playwright

### Testing Pyramid
1. Unit tests for individual components
2. Integration tests for service interactions
3. E2E tests for complete user journeys
4. Performance tests for load handling
5. Security tests for vulnerability scanning

## Deployment Strategy

### Branch Workflow
- **Main Branch**: Auto-deploy to production
- **Feature Branches**: Deploy to preview environments
- **Pull Request**: Run full test suite
- **Merge**: Automatic deployment with rollback capability

### Environment Management
- **Development**: Local development with Docker
- **Staging**: Branch preview deployments
- **Production**: Main branch deployment
- **Testing**: Isolated test environments

## Cost Optimization

### Google Cloud Free Tier Usage
- **Cloud Run**: 2 million requests/month free
- **Cloud SQL**: 1 shared-core, 614 MB RAM free
- **Firebase Hosting**: 10 GB storage, 10 GB transfer free
- **Secret Manager**: 6 active secret versions free

### Performance Optimization
- Container image optimization
- Database connection pooling
- Response caching
- CDN for static assets
- Lazy loading for large datasets

## Monitoring and Maintenance

### Health Checks
- API health endpoints
- Database connectivity checks
- External API status monitoring
- Frontend application health

### Logging and Metrics
- Structured logging with Google Cloud Logging
- Performance metrics collection
- Error tracking and alerting
- Usage analytics

This architecture provides a solid foundation for a B2B competitor analysis dashboard with modern technologies, secure authentication, and cost-effective deployment on Google Cloud Platform.