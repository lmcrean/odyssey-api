# B2B Competitor Analysis Dashboard Architecture

## Project Overview
A competitive intelligence platform for B2B companies to track competitor news, updates, and market movements through live APIs and real-time data analysis.

## Technology Stack
- **Backend**: C# ASP.NET Core (apps/api)
- **Frontend**: TypeScript/Angular (apps/web) 
- **Testing**: 
  - C# for backend integration testing
  - Vitest for Angular integration testing
- **Deployment**: Google Cloud Platform
  - ASP.NET Core on Cloud Run
  - Angular on Firebase Hosting
- **Authentication**: Custom packages/auth system

## Key Features
- Live competitor news tracking via free APIs
- Real-time dashboard with analytics
- Secure B2B authentication system
- Automated competitor data aggregation
- Export capabilities for reports

## Development Iterations

### Iteration 1: Foundation (_i1.md files)
- Hello World API (C# ASP.NET) to Angular frontend
- Basic project structure and deployment pipeline
- Initial Google Cloud setup

### Iteration 2: Authentication (_i2.md files)
- Secure authentication system in packages/auth
- JWT token management
- Role-based access control for B2B users

### Iteration 3: Core Dashboard (_i3.md files)
- Competitor analysis dashboard
- News API integrations
- Data visualization and reporting

## Free APIs for Competitor Analysis
- NewsAPI for general news
- Reddit API for social mentions
- Google News RSS feeds
- Company press release feeds
- Social media APIs (Twitter, LinkedIn public data)

## Deployment Strategy
- Branch previews for contributors
- Automatic main branch deployment
- Google Cloud Run for ASP.NET API
- Firebase Hosting for Angular frontend
- Free tier optimization