# Apps/AI - Odyssey Creator Platform (MVP - Iteration 1)

> **Simple AI Chat Service** - MVP implementation with basic Gemini integration

## Architecture Overview

The AI app provides basic chat functionality using Google's Gemini API. This is **Iteration 1 (MVP)** focused on core chat features only.

## Deployment Structure

```typescript
// Separate Vercel deployment
apps/ai/ → odyssey-ai-lmcreans-projects.vercel.app

// Service communication
apps/web/ → apps/api/ → apps/ai/
              ↓         ↑
         Database   AI Chat
```

## MVP Directory Structure

```typescript
apps/ai/
├── src/
│   ├── apps/
│   │   └── chat/                    # Core chat functionality
│   │       ├── routes/
│   │       │   ├── send-message/
│   │       │   │   ├── Controller.ts
│   │       │   │   └── Route.ts
│   │       │   └── get-history/
│   │       │       ├── Controller.ts
│   │       │       └── Route.ts
│   │       ├── services/
│   │       │   ├── GeminiService.ts
│   │       │   └── ConversationManager.ts
│   │       └── types/
│   │           ├── chat.ts
│   │           └── gemini.ts
│   │
│   ├── shared/
│   │   ├── config/
│   │   │   └── gemini.config.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   └── types/
│   │       └── ai-provider.ts
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

// Files to migrate (MVP only):
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
  
  async getChatHistory(userId: string) {
    const response = await fetch(`${this.aiBaseUrl}/api/chat/get-history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.INTERNAL_AI_TOKEN}`,
        'X-User-ID': userId
      }
    });
    
    return response.json();
  }
}
```

## Environment Variables

```bash
# AI App (.env) - MVP
GEMINI_API_KEY=...              # Primary AI provider
DATABASE_URL=...                # Shared Neon PostgreSQL
INTERNAL_AI_TOKEN=...           # Secure API↔AI communication
JWT_SECRET=...                  # Shared auth validation
```

## Vercel Configuration

```json
// apps/ai/vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
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
  }
}
```

## Iteration 1 (MVP) Features

### ✅ Included in MVP
- Basic Gemini chat integration
- Send message to AI
- Receive AI responses
- Simple conversation history storage
- User authentication validation
- Basic error handling

### ❌ Not Included in MVP
- Advanced memory system
- AI personality evolution
- AI content generation for creators
- Multiple AI providers (OpenAI, Claude)
- AI agents and automation
- Multimodal AI (video, voice, images)
- Cost optimization and monitoring
- Advanced caching strategies
- Rate limiting
- Usage analytics

## Testing Strategy

```typescript
// MVP testing focus
npm run test "apps/ai"           # All AI tests
npm run test "chat"              # Chat functionality only
npm run test "GeminiService"     # AI provider integration

// Integration testing
npm run test:dev                 # Local SQLite testing
npm run test:prod                # Production Neon testing
```

## Implementation Timeline

### **Week 1-2: MVP Implementation**
- ✅ Set up basic apps/ai structure
- ✅ Implement GeminiService
- ✅ Create send-message endpoint
- ✅ Create get-history endpoint
- ✅ Basic conversation storage

### **Week 3: Testing & Deployment**
- ✅ Unit tests for core functionality
- ✅ Integration tests with main API
- ✅ Deploy to Vercel
- ✅ Production testing

## Security & Privacy (MVP)

### **Basic Security**
- Bearer token authentication between API↔AI
- Input validation and sanitization
- Basic rate limiting per user

### **Data Protection**
- Conversations stored in shared database
- Basic privacy controls
- User data anonymization in logs

## Benefits of MVP Approach

### 🚀 **Quick Implementation**
- Focus on core functionality first
- Faster time to market
- Early user feedback
- Proof of concept validation

### 💰 **Cost Effective**
- Simple Gemini integration only
- No complex infrastructure
- Minimal third-party services
- Predictable costs

### 🔧 **Easy Maintenance**
- Small, focused codebase
- Clear architecture
- Simple debugging
- Easy to extend later

### 📈 **Foundation for Growth**
- Clean architecture ready for enhancements
- Database schema supports future features
- API structure extensible
- Service separation enables scaling

## Next Steps to Iteration 2

After MVP validation, expand to include:
1. Advanced memory system
2. AI content generation features
3. Multiple AI provider support
4. Cost optimization
5. Enhanced user experience 