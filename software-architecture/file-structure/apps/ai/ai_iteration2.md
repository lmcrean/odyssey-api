# Apps/AI - Odyssey Creator Platform

> **Dedicated AI Service** for chat, memory, and advanced AI features - designed for 10-year AI evolution

## Architecture Overview

The AI app is **intentionally separated** from the main API to support advanced AI features and independent scaling as AI technology evolves rapidly through 2025-2035.

## Deployment Structure

```typescript
// Separate Vercel deployment
apps/ai/ → odyssey-ai-lmcreans-projects.vercel.app

// Service communication
apps/web/ → apps/api/ → apps/ai/
              ↓         ↑
         Database   AI Processing
```

## Directory Structure

```typescript
apps/ai/
├── src/
│   ├── apps/
│   │   ├── chat/                    # Core chat functionality
│   │   │   ├── routes/
│   │   │   │   ├── send-message/
│   │   │   │   │   ├── Controller.ts
│   │   │   │   │   └── Route.ts
│   │   │   │   ├── get-history/
│   │   │   │   │   ├── Controller.ts
│   │   │   │   │   └── Route.ts
│   │   │   │   └── delete-conversation/
│   │   │   │       ├── Controller.ts
│   │   │   │       └── Route.ts
│   │   │   ├── services/
│   │   │   │   ├── GeminiService.ts
│   │   │   │   ├── ChatOrchestrator.ts
│   │   │   │   └── ConversationManager.ts
│   │   │   └── types/
│   │   │       ├── chat.ts
│   │   │       └── gemini.ts
│   │   │
│   │   ├── memory/                  # 🚀 Advanced AI memory system
│   │   │   ├── routes/
│   │   │   │   ├── store-memory/
│   │   │   │   ├── retrieve-context/
│   │   │   │   └── update-personality/
│   │   │   ├── services/
│   │   │   │   ├── MemoryService.ts     # User-specific memory storage
│   │   │   │   ├── ContextService.ts    # Conversation context management
│   │   │   │   └── PersonalityService.ts # AI personality evolution
│   │   │   └── models/
│   │   │       ├── UserMemory.ts
│   │   │       ├── ConversationContext.ts
│   │   │       └── AIPersonality.ts
│   │   │
│   │   ├── content/                 # 🚀 AI content generation
│   │   │   ├── routes/
│   │   │   │   ├── generate-caption/
│   │   │   │   ├── suggest-hashtags/
│   │   │   │   └── analyze-image/
│   │   │   ├── services/
│   │   │   │   ├── ContentGenerator.ts
│   │   │   │   ├── ImageAnalyzer.ts
│   │   │   │   └── TrendAnalyzer.ts
│   │   │   └── types/
│   │   │       └── content-generation.ts
│   │   │
│   │   ├── agents/                  # 🚀 Future: AI agents
│   │   │   ├── routes/
│   │   │   │   ├── schedule-post/
│   │   │   │   ├── auto-respond/
│   │   │   │   └── analyze-engagement/
│   │   │   ├── services/
│   │   │   │   ├── SchedulingAgent.ts
│   │   │   │   ├── EngagementAgent.ts
│   │   │   │   └── ModeratorAgent.ts
│   │   │   └── workflows/
│   │   │       ├── PostingWorkflow.ts
│   │   │       └── ModerationWorkflow.ts
│   │   │
│   │   └── multimodal/              # 🚀 Future: Advanced AI
│   │       ├── routes/
│   │       │   ├── process-video/
│   │       │   ├── generate-voice/
│   │       │   └── create-thumbnail/
│   │       ├── services/
│   │       │   ├── VideoProcessor.ts
│   │       │   ├── VoiceGenerator.ts
│   │       │   └── ImageGenerator.ts
│   │       └── types/
│   │           └── multimodal.ts
│   │
│   ├── shared/
│   │   ├── config/
│   │   │   ├── gemini.config.ts
│   │   │   ├── openai.config.ts      # Future: Multiple AI providers
│   │   │   └── anthropic.config.ts   # Future: Claude integration
│   │   ├── middleware/
│   │   │   ├── auth.ts               # Validate API requests
│   │   │   ├── rate-limit.ts         # AI usage limits
│   │   │   └── cost-tracking.ts      # AI cost monitoring
│   │   ├── services/
│   │   │   ├── AIProviderRouter.ts   # Route to best AI model
│   │   │   ├── CostOptimizer.ts      # Optimize AI costs
│   │   │   └── ResponseCache.ts      # Cache AI responses
│   │   └── types/
│   │       ├── ai-provider.ts
│   │       └── cost-tracking.ts
│   │
│   └── server.ts
├── vercel.json
├── package.json
└── tsconfig.json
```

## Migration from Archive

```typescript
// Current location → New location
.archive/backend-js-reference/routes/chat/ → apps/ai/src/apps/chat/routes/

// Files to migrate:
- chat.js → apps/ai/src/apps/chat/routes/send-message/Controller.ts
- gemini-config.js → apps/ai/src/shared/config/gemini.config.ts
- message-history.js → apps/ai/src/apps/chat/services/ConversationManager.ts
```

## API Integration Pattern

```typescript
// apps/api calls apps/ai via HTTP
// apps/api/src/apps/chat/services/AIService.ts

export class AIService {
  private aiBaseUrl = 'https://odyssey-ai-lmcreans-projects.vercel.app';
  
  async sendMessage(userId: string, message: string) {
    const response = await fetch(`${this.aiBaseUrl}/api/chat/send-message`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.INTERNAL_AI_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, message })
    });
    
    return response.json();
  }
  
  async getMemoryContext(userId: string) {
    // Retrieve user-specific AI memory and context
  }
  
  async generateContent(type: 'caption' | 'hashtags', data: any) {
    // AI content generation for creators
  }
}
```

## Environment Variables

```bash
# AI App (.env)
GEMINI_API_KEY=...              # Primary AI provider
OPENAI_API_KEY=...              # Future: Backup AI provider
ANTHROPIC_API_KEY=...           # Future: Claude integration

# Database
DATABASE_URL=...                # Shared Neon PostgreSQL
REDIS_URL=...                   # AI memory and caching

# Internal Security
INTERNAL_AI_TOKEN=...           # Secure API↔AI communication
JWT_SECRET=...                  # Shared auth validation

# Cost Management
AI_COST_LIMIT_DAILY=100         # Daily spending limit
AI_RATE_LIMIT_USER=50           # Messages per user per hour
```

## Vercel Configuration

```json
// apps/ai/vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/src/server.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "src/server.ts": {
      "maxDuration": 30
    }
  }
}
```

## Future AI Evolution (2025-2027)

### **Phase 1 (MVP 2025)**
- ✅ Basic Gemini chat integration
- ✅ Conversation history
- ✅ Simple memory storage

### **Phase 2 (2025-2026)**
- 🔄 Advanced memory system with personality evolution
- 🔄 AI content generation for creators
- 🔄 Multi-provider AI routing (Gemini + OpenAI + Claude)

### **Phase 3 (2026-2027)**
- 🚀 AI agents for automated posting and engagement
- 🚀 Multimodal AI (video, voice, image generation)
- 🚀 Custom model training on creator content
- 🚀 Real-time AI collaboration tools

### **Phase 4 (2027+)**
- 🚀 AI-powered creator monetization optimization
- 🚀 Predictive content performance analysis
- 🚀 Automated fan engagement and community management
- 🚀 AI-generated NFTs and digital collectibles

## Testing Strategy

```typescript
// AI-specific testing
npm run test "apps/ai"           # All AI tests
npm run test "chat"              # Chat functionality
npm run test "memory"            # Memory system
npm run test "GeminiService"     # AI provider integration

// Integration testing
npm run test:dev                 # Local SQLite testing
npm run test:prod                # Production Neon testing
npm run test:ai-integration      # Cross-app API↔AI testing
```

## Cost Optimization

### **Smart Provider Routing**
```typescript
// Route queries to most cost-effective AI model
- Simple questions → Gemini (cheapest)
- Complex reasoning → GPT-4 (most capable)
- Creative content → Claude (best for writing)
```

### **Caching Strategy**
```typescript
// Cache expensive AI responses
- FAQ responses cached for 7 days
- User personality profiles cached for 24 hours
- Content suggestions cached for 1 hour
```

### **Usage Monitoring**
```typescript
// Track and optimize AI costs
- Per-user usage limits
- Cost alerts and budgeting
- Model performance vs cost analysis
```

## Security & Privacy

### **Data Protection**
- User memory encrypted at rest
- AI conversations logged but anonymized
- GDPR compliance for AI-generated data

### **Internal API Security**
- Bearer token authentication between API↔AI
- Rate limiting per user and endpoint
- Request validation and sanitization

## Benefits of Separate AI App

### **💰 Cost Management**
- Independent scaling based on AI usage
- Dedicated cost monitoring and optimization
- Different compute requirements from main API

### **🚀 Performance**
- AI processing doesn't slow down core API
- Optimized for AI workloads (longer timeouts, more memory)
- Can use specialized AI infrastructure when needed

### **🔮 Future-Proof**
- Easy to integrate new AI providers and models
- Advanced AI features won't complicate main API
- Can evolve AI architecture independently

### **⚡ Development**
- AI team can work independently
- Easier to test and debug AI-specific features
- Clear separation of concerns 