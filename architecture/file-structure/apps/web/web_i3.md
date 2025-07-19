# Web Structure - Iteration 3: B2B Competitor Analysis Dashboard

## Angular Frontend with Full Dashboard Features

### Updated Project Structure
```
apps/web/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── auth/                    # Authentication components
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   ├── dashboard.component.html
│   │   │   │   └── dashboard.component.scss
│   │   │   ├── competitors/
│   │   │   │   ├── competitor-list/
│   │   │   │   │   ├── competitor-list.component.ts
│   │   │   │   │   ├── competitor-list.component.html
│   │   │   │   │   └── competitor-list.component.scss
│   │   │   │   ├── competitor-form/
│   │   │   │   │   ├── competitor-form.component.ts
│   │   │   │   │   ├── competitor-form.component.html
│   │   │   │   │   └── competitor-form.component.scss
│   │   │   │   └── competitor-detail/
│   │   │   │       ├── competitor-detail.component.ts
│   │   │   │       ├── competitor-detail.component.html
│   │   │   │       └── competitor-detail.component.scss
│   │   │   ├── news/
│   │   │   │   ├── news-feed/
│   │   │   │   │   ├── news-feed.component.ts
│   │   │   │   │   ├── news-feed.component.html
│   │   │   │   │   └── news-feed.component.scss
│   │   │   │   ├── news-item/
│   │   │   │   │   ├── news-item.component.ts
│   │   │   │   │   ├── news-item.component.html
│   │   │   │   │   └── news-item.component.scss
│   │   │   │   └── news-search/
│   │   │   │       ├── news-search.component.ts
│   │   │   │       ├── news-search.component.html
│   │   │   │       └── news-search.component.scss
│   │   │   ├── analytics/
│   │   │   │   ├── analytics-dashboard/
│   │   │   │   │   ├── analytics-dashboard.component.ts
│   │   │   │   │   ├── analytics-dashboard.component.html
│   │   │   │   │   └── analytics-dashboard.component.scss
│   │   │   │   ├── charts/
│   │   │   │   │   ├── trend-chart/
│   │   │   │   │   ├── sentiment-chart/
│   │   │   │   │   └── competitor-comparison/
│   │   │   │   └── reports/
│   │   │   │       ├── report-generator/
│   │   │   │       └── report-viewer/
│   │   │   └── shared/
│   │   │       ├── header/
│   │   │       ├── sidebar/
│   │   │       ├── loading/
│   │   │       └── confirmation-dialog/
│   │   ├── services/
│   │   │   ├── api.service.ts           # Base HTTP service
│   │   │   ├── auth.service.ts          # Authentication
│   │   │   ├── competitor.service.ts    # Competitor operations
│   │   │   ├── news.service.ts          # News operations
│   │   │   ├── analytics.service.ts     # Analytics data
│   │   │   ├── export.service.ts        # Data export
│   │   │   └── notification.service.ts  # Toast notifications
│   │   ├── models/
│   │   │   ├── competitor.model.ts      # Competitor interface
│   │   │   ├── news.model.ts            # News article interface
│   │   │   ├── analytics.model.ts       # Analytics data interface
│   │   │   ├── dashboard.model.ts       # Dashboard data interface
│   │   │   └── export.model.ts          # Export options interface
│   │   ├── pipes/
│   │   │   ├── sentiment-color.pipe.ts  # Sentiment color coding
│   │   │   ├── time-ago.pipe.ts         # Time formatting
│   │   │   └── truncate.pipe.ts         # Text truncation
│   │   ├── directives/
│   │   │   ├── lazy-load.directive.ts   # Lazy loading images
│   │   │   └── infinite-scroll.directive.ts # Infinite scroll
│   │   ├── guards/
│   │   │   ├── auth.guard.ts            # Authentication guard
│   │   │   └── role.guard.ts            # Role-based access
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts      # JWT token injection
│   │   │   ├── error.interceptor.ts     # Error handling
│   │   │   └── loading.interceptor.ts   # Loading states
│   │   ├── app.component.ts
│   │   ├── app.routes.ts                # Full routing
│   │   └── app.config.ts                # Complete configuration
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   └── styles.scss                      # Global styles
├── angular.json
├── package.json                         # Chart.js, export libs
└── vitest.config.ts
```

### Key Dashboard Components

#### components/dashboard/dashboard.component.ts
- Overview metrics (total competitors, news articles, alerts)
- Recent news feed
- Trending competitors
- Quick actions (add competitor, generate report)
- Real-time updates with WebSocket/SignalR

#### components/competitors/competitor-list/competitor-list.component.ts
- Data table with competitor information
- Search and filter functionality
- Sorting by various criteria
- Bulk actions (delete, export)
- Pagination for large datasets

#### components/news/news-feed/news-feed.component.ts
- Infinite scroll news feed
- Real-time updates
- Filter by competitor, date, sentiment
- Search functionality
- Article preview with sentiment indicators

#### components/analytics/analytics-dashboard/analytics-dashboard.component.ts
- Interactive charts and graphs
- Competitor comparison views
- Sentiment analysis trends
- Export functionality
- Customizable date ranges

### Data Visualization

#### Chart Components (Chart.js/Angular)
- Trend charts for competitor mentions
- Sentiment analysis over time
- Competitor comparison charts
- News volume analysis
- Interactive tooltips and legends

#### Export Features
- PDF report generation
- Excel/CSV data export
- Chart image export
- Scheduled report delivery
- Custom report templates

### Services Implementation

#### services/competitor.service.ts
- CRUD operations for competitors
- Real-time competitor updates
- Bulk operations
- Validation and error handling

#### services/news.service.ts
- News feed with pagination
- Real-time news updates
- Search and filtering
- Sentiment analysis results
- News article caching

#### services/analytics.service.ts
- Dashboard metrics
- Trend analysis
- Competitor comparisons
- Report generation
- Data aggregation

### Enhanced Dependencies
- Chart.js for data visualization
- Angular Material for UI components
- RxJS for reactive programming
- jsPDF for PDF generation
- xlsx for Excel export
- Socket.io for real-time updates
- Angular CDK for advanced features

### Routing Configuration
```typescript
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'competitors', 
    component: CompetitorListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'news', 
    component: NewsFeedComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'analytics', 
    component: AnalyticsDashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '/dashboard' }
];
```

### Performance Optimizations
- Lazy loading for feature modules
- Virtual scrolling for large lists
- Image lazy loading
- Caching strategies
- Debounced search inputs
- Optimized change detection

### Testing Strategy
- Component unit tests
- Service integration tests
- E2E dashboard workflows
- Chart rendering tests
- Export functionality tests
- Real-time update tests