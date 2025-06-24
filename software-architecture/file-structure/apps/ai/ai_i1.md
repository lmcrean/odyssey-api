# Apps/AI - Odyssey Creator Platform (MVP - Iteration 1)

> **Basic AI Chat** - Minimal viable AI integration with simple Gemini API calls

## Architecture Overview

The AI app provides **basic chat functionality** using Google's Gemini API. This is **true MVP** - user sends message, AI responds. No complex context, state management, or assessments.

## Simple Message Flow

```typescript
📱 Frontend (apps/web)
    ↓ POST /api/chat/send-message { message, userId }
🔧 API (apps/api) 
    ↓ Saves user message to DB
    ↓ HTTP POST to odyssey-ai-lmcreans-projects.vercel.app/api/chat/send-message
🤖 AI Service (apps/ai)
    ↓ Simple Gemini API call
    ↑ Returns AI response { content }
🔧 API (apps/api)
    ↑ Saves AI message to DB  
    ↑ Returns to Frontend
📱 Frontend receives: { userMessage, aiMessage }
```

## MVP Directory Structure

```typescript
apps/ai/
├── src/
│   ├── routes/
│   │   └── send-message/
│   │       ├── Controller.ts        # Simple message handling
│   │       └── Route.ts             # Basic POST route
│   ├── services/
│   │   └── GeminiService.ts         # Direct Gemini API integration
│   ├── types/
│   │   └── chat.ts                  # Basic message types
│   ├── middleware/
│   │   └── auth.ts                  # Basic auth validation
│   └── server.ts                    # Express server
├── vercel.json
├── package.json
└── tsconfig.json
```

## Migration from Archive

```typescript
// Use existing working code from archive
.archive/backend-js-reference/routes/chat/chat.js → apps/ai/src/services/GeminiService.ts

// Convert to TypeScript:
- Basic GoogleGenerativeAI setup 
- Simple system prompt   
- Basic error handling 
- No conversation history (MVP limitation)
```

## Simple API Integration

```typescript
// apps/api/src/services/AIService.ts

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
    
    if (!response.ok) {
      return { content: "Sorry, I'm having trouble right now. Please try again later." };
    }
    
    return response.json();
  }
}
```

## Basic Controller Implementation

```typescript
// apps/ai/src/routes/send-message/Controller.ts

export class SendMessageController {
  constructor(private geminiService: GeminiService) {}
  
  async handle(req: Request, res: Response) {
    try {
      const { message, userId } = req.body;
      
      // Simple validation
      if (!message || !userId) {
        return res.status(400).json({ error: 'Message and userId required' });
      }
      
      // Direct Gemini call - no context, no history
      const aiResponse = await this.geminiService.generateResponse(message);
      
      res.json({
        success: true,
        content: aiResponse
      });
      
    } catch (error) {
      res.json({
        success: true,
        content: "I'm here to help! Could you rephrase your question?"
      });
    }
  }
}
```

## Basic Gemini Service

```typescript
// apps/ai/src/services/GeminiService.ts

import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }
  
  async generateResponse(message: string): Promise<string> {
    const prompt = `You are a helpful AI assistant. Keep responses brief and friendly.

User message: ${message}`;
    
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
}
```

## Environment Variables (MVP Only)

```bash
# AI App (.env) - Minimal MVP
GEMINI_API_KEY=...              # Only AI provider needed
INTERNAL_AI_TOKEN=...           # Basic API security
NODE_ENV=...                    # Environment
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
  ]
}
```

## MVP Features

###  Included in MVP
- Basic Gemini API integration (convert from archive)
- Simple message/response handling
- Basic error handling with fallback responses
- Internal service authentication
- TypeScript implementation

### ❌ NOT in MVP (Moved to Iteration 2)
- Conversation context or history
- Assessment integration
- Dynamic prompt building
- Complex response processing
- Conversation state management
- Memory systems
- Multiple AI providers
- Advanced error recovery
- Cost optimization
- Usage analytics
- Rate limiting (basic auth only)

## Testing Strategy

```typescript
// MVP testing focus - keep it simple
npm run test "GeminiService"     # Test basic AI integration
npm run test "send-message"      # Test message endpoint
npm run test:integration         # Test API ↔ AI communication
```

## Implementation Timeline

### **Week 1: Basic Setup**
-  Convert archive JS Gemini code to TypeScript
-  Create simple send-message endpoint
-  Basic error handling

### **Week 2: Integration**
-  Integrate with apps/api via HTTP
-  Test internal authentication
-  Deploy to Vercel

## Key Simplifications from Archive

### **Remove Complex Features**
- No conversation history tracking
- No assessment integration logic
- No context-aware responses
- No dynamic prompt generation
- No conversation state validation

### **Keep Simple Features**
- Basic Gemini API integration
- Simple system prompt
- Error handling with fallbacks
- Basic request/response format

## Migration to Iteration 2

After MVP validation with real users:
1. Add conversation history (stored in API app)
2. Add context-aware responses
3. Add assessment integration
4. Add advanced prompt management
5. Add memory systems
6. Add multiple AI providers

## Benefits of This Simple Approach

### 🚀 **Fast Implementation**
- Reuse existing working archive code
- Minimal new development required
- Quick deployment and testing

### 💰 **Cost Effective**
- Simple Gemini integration only
- No complex infrastructure
- Predictable costs

### 🔧 **Easy Debugging**
- Single API call per message
- Simple error paths
- Clear failure modes

### 📈 **Foundation for Growth**
- Clean architecture ready for iteration 2 enhancements
- Service can be enhanced incrementally
- API structure ready for complex features

## What This Actually Tests

**MVP validates:**
- Do users want to chat with AI?
- Is the basic response quality acceptable?
- Does the service architecture work?
- Can we handle the basic load?

**Iteration 2 will add:**
- Context-aware conversations
- Personalized responses
- Assessment integration
- Advanced AI features 