# Apps/AI - Odyssey Creator Platform (MVP)

> **Simple AI Chat Service** - MVP implementation with basic Gemini integration

## Architecture Overview

The AI app provides basic chat functionality using Google's Gemini API. This is the **MVP implementation** focused on core chat features only.

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
# AI App (.env)
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

## MVP Features

### ✅ Core Chat Functionality
- Send message to Gemini AI
- Receive AI responses
- Basic conversation history storage
- User authentication validation

### ❌ Not Included in MVP
- Advanced memory system
- AI content generation
- Multiple AI providers
- AI agents
- Multimodal AI
- Cost optimization
- Advanced caching

## Testing Strategy

```typescript
// MVP testing focus
npm run test "apps/ai"           # All AI tests
npm run test "chat"              # Chat functionality
npm run test "GeminiService"     # AI provider integration

// Integration testing
npm run test:dev                 # Local SQLite testing
npm run test:prod                # Production Neon testing
```

## Future Iterations

This MVP implementation provides the foundation for future AI enhancements:
- **Iteration 2**: Advanced memory system and content generation
- **Iteration 3**: AI agents and multimodal capabilities
- **Iteration 4**: Custom model training and monetization features

## Benefits of MVP Approach

### 🚀 Quick Implementation
- Focus on core functionality first
- Faster time to market
- Early user feedback

### 💰 Cost Effective
- Simple Gemini integration
- No complex caching or optimization
- Minimal infrastructure requirements

### 🔧 Easy Maintenance
- Small codebase
- Clear architecture
- Simple debugging 