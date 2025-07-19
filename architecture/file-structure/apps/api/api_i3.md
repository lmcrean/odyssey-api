# API Structure - Iteration 3: B2B Competitor Analysis Dashboard

## Enhanced API with Competitor Analysis Features

### Updated Project Structure
```
apps/api/
├── Controllers/
│   ├── HealthController.cs              # Health endpoints
│   ├── AuthController.cs                # Authentication
│   ├── UserController.cs                # User management
│   ├── CompetitorController.cs          # Competitor management
│   ├── NewsController.cs                # News aggregation
│   ├── AnalyticsController.cs           # Analytics and reporting
│   └── DashboardController.cs           # Dashboard data
├── Services/
│   ├── ICompetitorService.cs            # Competitor interface
│   ├── CompetitorService.cs             # Competitor logic
│   ├── INewsAggregationService.cs       # News interface
│   ├── NewsAggregationService.cs        # News aggregation
│   ├── IAnalyticsService.cs             # Analytics interface
│   ├── AnalyticsService.cs              # Analytics processing
│   └── ExternalApiServices/
│       ├── NewsApiService.cs            # NewsAPI integration
│       ├── RedditApiService.cs          # Reddit API integration
│       └── GoogleNewsService.cs         # Google News RSS
├── Models/
│   ├── Domain/
│   │   ├── Competitor.cs                # Competitor entity
│   │   ├── NewsArticle.cs               # News article entity
│   │   ├── CompanyMention.cs            # Company mention tracking
│   │   └── AnalyticsReport.cs           # Analytics report
│   ├── DTOs/
│   │   ├── CompetitorDto.cs             # Competitor data transfer
│   │   ├── NewsArticleDto.cs            # News article DTO
│   │   ├── DashboardDto.cs              # Dashboard data
│   │   └── AnalyticsDto.cs              # Analytics data
│   └── External/
│       ├── NewsApiResponse.cs           # NewsAPI response models
│       └── RedditApiResponse.cs         # Reddit API response models
├── Data/
│   ├── ApplicationDbContext.cs          # Enhanced EF context
│   ├── Repositories/
│   │   ├── ICompetitorRepository.cs     # Competitor repository
│   │   ├── CompetitorRepository.cs      # Implementation
│   │   ├── INewsRepository.cs           # News repository
│   │   └── NewsRepository.cs            # Implementation
│   └── Migrations/                      # Database migrations
├── BackgroundServices/
│   ├── NewsAggregationService.cs        # Background news collection
│   ├── CompetitorMonitoringService.cs   # Competitor monitoring
│   └── AnalyticsProcessingService.cs    # Analytics processing
└── Configuration/
    ├── ExternalApiSettings.cs           # API configuration
    └── AnalyticsSettings.cs             # Analytics configuration
```

### Key Features Implementation

#### Controllers/CompetitorController.cs
- GET /api/competitors - List user's competitors
- POST /api/competitors - Add new competitor
- PUT /api/competitors/{id} - Update competitor
- DELETE /api/competitors/{id} - Remove competitor
- GET /api/competitors/{id}/news - Get competitor news

#### Controllers/NewsController.cs
- GET /api/news/recent - Recent news across all competitors
- GET /api/news/search - Search news by keywords
- GET /api/news/{id} - Get specific news article
- POST /api/news/analyze - Analyze news sentiment

#### Controllers/AnalyticsController.cs
- GET /api/analytics/summary - Dashboard summary
- GET /api/analytics/trends - Competitor trends
- GET /api/analytics/reports - Generate reports
- POST /api/analytics/export - Export data

#### Services/NewsAggregationService.cs
- Integration with NewsAPI
- Reddit API for social mentions
- Google News RSS parsing
- Duplicate detection and filtering
- Sentiment analysis integration

#### Services/CompetitorService.cs
- Competitor CRUD operations
- Company-based isolation (B2B)
- Competitor validation
- Logo and metadata management

#### Background Services
- Scheduled news collection every 15 minutes
- Competitor monitoring for new mentions
- Analytics data processing
- Email notifications for important news

### Free APIs Integration

#### NewsAPI Service
- Headlines endpoint for competitor news
- Search functionality
- Category filtering
- Rate limiting handling

#### Reddit API Service
- Subreddit monitoring
- Keyword-based searches
- Comment sentiment analysis
- Rate limiting compliance

#### Google News RSS
- RSS feed parsing
- Company-specific news
- Real-time updates
- Duplicate prevention

### Database Schema Extensions
```sql
-- Competitors table
CREATE TABLE Competitors (
    Id INT PRIMARY KEY IDENTITY,
    CompanyId INT FOREIGN KEY,
    Name NVARCHAR(255),
    Website NVARCHAR(255),
    Industry NVARCHAR(255),
    LogoUrl NVARCHAR(255),
    CreatedAt DATETIME2,
    UpdatedAt DATETIME2
);

-- News Articles table
CREATE TABLE NewsArticles (
    Id INT PRIMARY KEY IDENTITY,
    CompetitorId INT FOREIGN KEY,
    Title NVARCHAR(500),
    Content NTEXT,
    Url NVARCHAR(1000),
    Source NVARCHAR(255),
    PublishedAt DATETIME2,
    SentimentScore FLOAT,
    CreatedAt DATETIME2
);

-- Company Mentions table
CREATE TABLE CompanyMentions (
    Id INT PRIMARY KEY IDENTITY,
    CompetitorId INT FOREIGN KEY,
    Platform NVARCHAR(100),
    Content NTEXT,
    Url NVARCHAR(1000),
    MentionDate DATETIME2,
    SentimentScore FLOAT,
    CreatedAt DATETIME2
);
```

### Configuration Settings
- API keys for external services
- Rate limiting configurations
- Analytics processing schedules
- Email notification settings
- Export format options

### Security and Rate Limiting
- API key management
- Rate limiting per external service
- Request throttling
- Error handling for API failures
- Fallback mechanisms