# Apps/AI - Odyssey Creator Platform (MVP - Iteration 1)

> **Simple AI Chat Service** - MVP implementation with basic Gemini integration

## Architecture Overview

The AI app provides basic chat functionality using Google's Gemini API. This is **Iteration 1 (MVP)** focused on core chat features only.

## Complete AI Message Flow

```typescript
📱 Frontend (apps/web)
    ↓ POST /api/chat/send-message { message, userId }
🔧 API (apps/api) 
    ↓ Saves user message to DB
    ↓ HTTP POST to odyssey-ai-lmcreans-projects.vercel.app/api/chat/send-message
🤖 AI Service (apps/ai)
    ↓ Processes with Gemini API
    ↑ Returns AI response { content, metadata }
🔧 API (apps/api)
    ↑ Saves AI message to DB  
    ↑ Returns complete conversation to Frontend
📱 Frontend receives: { userMessage, aiMessage, conversationId }
```

## Deployment Structure

```typescript
// Separate Vercel deployment
apps/ai/ → odyssey-ai-lmcreans-projects.vercel.app

// Service communication
apps/web/ → apps/api/ → apps/ai/
              ↓         ↑
         Database   AI Processing
         (Stores)   (Stateless)
```

## MVP Directory Structure

```typescript
apps/ai/
├── src/
│   ├── apps/
│   │   └── chat/                    # Core conversational AI functionality
│   │       ├── routes/
│   │       │   ├── send-initial-message/    # New conversation starter
│   │       │   │   ├── Controller.ts        # Context-aware initial responses
│   │       │   │   └── Route.ts
│   │       │   ├── send-follow-up-message/  # Ongoing conversation
│   │       │   │   ├── Controller.ts        # Context-aware follow-ups
│   │       │   │   └── Route.ts
│   │       │   ├── get-conversation-context/ # Context retrieval for API
│   │       │   │   ├── Controller.ts
│   │       │   │   └── Route.ts
│   │       │   └── validate-conversation/    # Conversation state validation
│   │       │       ├── Controller.ts
│   │       │       └── Route.ts
│   │       ├── services/
│   │       │   ├── GeminiService.ts          # Core Gemini API integration
│   │       │   ├── ConversationProcessor.ts  # Conversation state management
│   │       │   ├── PromptBuilder.ts          # Dynamic prompt generation
│   │       │   ├── ResponseProcessor.ts      # AI response processing
│   │       │   ├── ContextManager.ts         # Conversation context handling
│   │       │   ├── AssessmentHandler.ts      # Assessment integration logic
│   │       │   └── FallbackManager.ts        # Mock/fallback responses
│   │       ├── middleware/
│   │       │   ├── ConversationValidator.ts  # Validate conversation state
│   │       │   ├── ContextInjector.ts        # Inject conversation context
│   │       │   └── ResponseFormatter.ts      # Standardize response format
│   │       └── types/
│   │           ├── conversation.ts           # Conversation state types
│   │           ├── context.ts               # Context management types
│   │           ├── assessment.ts            # Assessment integration types
│   │           ├── prompts.ts               # Prompt building types
│   │           ├── gemini.ts                # Gemini-specific types
│   │           └── responses.ts             # Response format types
│   │
│   ├── shared/
│   │   ├── config/
│   │   │   ├── gemini.config.ts             # Gemini configuration
│   │   │   ├── prompts.config.ts            # System prompts
│   │   │   └── safety.config.ts             # Safety settings
│   │   ├── middleware/
│   │   │   ├── auth.ts                      # Internal API token validation
│   │   │   ├── rateLimit.ts                 # Basic rate limiting
│   │   │   └── errorHandler.ts              # Centralized error handling
│   │   ├── utilities/
│   │   │   ├── messageUtils.ts              # Message formatting utilities
│   │   │   ├── contextUtils.ts              # Context manipulation utilities
│   │   │   └── validationUtils.ts           # Input validation utilities
│   │   └── types/
│   │       ├── api.ts                       # API request/response types
│   │       ├── internal.ts                  # Internal service types
│   │       └── common.ts                    # Shared common types
│   │
│   └── server.ts
├── vercel.json
├── package.json
└── tsconfig.json
```

## Migration from Archive (TypeScript Conversion)

```typescript
// Current location → New location (JS → TS conversion required)
.archive/backend-js-reference/routes/chat/ → apps/ai/src/apps/chat/routes/

// Files to migrate and convert to TypeScript:
- send-initial-message/controller.js → apps/ai/src/apps/chat/routes/send-message/Controller.ts
- send-follow-up-message/controller.js → apps/ai/src/apps/chat/services/MessageProcessor.ts
- [gemini integration] → apps/ai/src/apps/chat/services/GeminiService.ts

// Archive has working Gemini integration - convert to TypeScript:
- GoogleGenerativeAI setup ✅
- System prompts ✅  
- Conversation history handling ✅
- Error handling with fallbacks ✅
```

## Database Strategy (Important Clarification)

```typescript
// DATABASE OWNERSHIP: API app stores everything, AI app is stateless

📦 apps/api (Database Owner)
├── Stores user messages
├── Stores AI responses  
├── Manages conversation history
└── Handles user authentication

🤖 apps/ai (Stateless Processor)
├── Receives: { userId, message, conversationHistory }
├── Processes with Gemini
├── Returns: { content, metadata }
└── NO database operations
```

## API Integration Pattern

```typescript
// apps/api/src/apps/chat/services/AIService.ts

export class AIService {
  private aiBaseUrl = 'https://odyssey-ai-lmcreans-projects.vercel.app';
  
  async processMessage(userId: string, message: string, conversationHistory: Message[]) {
    const response = await fetch(`${this.aiBaseUrl}/api/chat/send-message`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.INTERNAL_AI_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        userId, 
        message,
        conversationHistory: conversationHistory.slice(-10) // Last 10 messages for context
      })
    });
    
    if (!response.ok) {
      throw new Error(`AI Service error: ${response.status}`);
    }
    
    return response.json() as Promise<{
      content: string;
      metadata: {
        model: string;
        tokens: number;
        responseTime: number;
      }
    }>;
  }
}

// Usage in apps/api chat controller:
export class ChatController {
  async sendMessage(req: Request, res: Response) {
    const { message } = req.body;
    const userId = req.user.id;
    
    try {
      // 1. Save user message to database
      const userMessage = await saveUserMessage(userId, message);
      
      // 2. Get conversation history
      const history = await getConversationHistory(userMessage.conversationId);
      
      // 3. Get AI response
      const aiResponse = await this.aiService.processMessage(userId, message, history);
      
      // 4. Save AI message to database
      const aiMessage = await saveAIMessage(userMessage.conversationId, aiResponse.content);
      
      // 5. Return complete conversation update
      res.json({
        success: true,
        userMessage,
        aiMessage,
        conversationId: userMessage.conversationId
      });
      
    } catch (error) {
      // Fallback handling
      res.status(500).json({ error: 'AI service unavailable' });
    }
  }
}
```

## AI Service Response Format

```typescript
// apps/ai/src/apps/chat/types/chat.ts

export interface AIProcessRequest {
  userId: string;
  message: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
  }>;
}

export interface AIProcessResponse {
  success: boolean;
  content: string;
  metadata: {
    model: 'gemini-2.0-flash' | 'gemini-pro';
    tokens: number;
    responseTime: number;
    conversationLength: number;
    contextUsed: boolean;
  };
  error?: string;
}
```

## Environment Variables

```bash
# AI App (.env) - MVP
GEMINI_API_KEY=...              # Primary AI provider
INTERNAL_AI_TOKEN=...           # Secure API↔AI communication (NO DATABASE ACCESS NEEDED)
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
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Iteration 1 (MVP) Features

### ✅ Included in MVP
- Basic Gemini chat integration (convert from existing JS archive)
- Process message with conversation context
- Return AI responses with metadata
- Internal service authentication
- Basic error handling with fallbacks
- TypeScript implementation

### 🔄 MVP but Minimal Implementation
- Conversation context (last 10 messages only)
- Basic rate limiting per request

### ❌ Not Included in MVP
- Advanced memory system
- AI personality evolution
- AI content generation for creators
- Multiple AI providers (OpenAI, Claude)
- AI agents and automation
- Multimodal AI (video, voice, images)
- Cost optimization and monitoring
- Advanced caching strategies
- Persistent conversation storage (handled by API app)
- Usage analytics

## Testing Strategy

```typescript
// MVP testing focus
npm run test "apps/ai"           # All AI tests
npm run test "GeminiService"     # AI provider integration
npm run test "MessageProcessor"  # Message processing logic

// Integration testing with API app
npm run test:integration         # Test API ↔ AI communication
npm run test:prod                # Production environment testing
```

## Implementation Timeline

### **Week 1: Setup & Migration**
- ✅ Set up apps/ai structure
- ✅ Convert archive JS files to TypeScript
- ✅ Implement GeminiService (from archive)
- ✅ Create send-message endpoint

### **Week 2: Integration & Testing**
- ✅ Integrate with apps/api via HTTP
- ✅ Test internal authentication
- ✅ Unit tests for core functionality
- ✅ Deploy to Vercel

### **Week 3: Production Testing**
- ✅ Integration tests with main API
- ✅ Production environment testing
- ✅ Performance optimization

## Security & Privacy (MVP)

### **Basic Security**
- Bearer token authentication between API↔AI
- Input validation and sanitization
- No direct database access from AI service
- Internal service communication only

### **Data Protection**
- No persistent storage in AI service
- Conversation data handled by API app only
- Basic privacy controls
- User data anonymization in logs

## Benefits of This Architecture

### 🚀 **Service Separation**
- AI service is stateless and scalable
- Database operations centralized in API
- Clear responsibility boundaries
- Easy to maintain and debug

### 💰 **Cost Effective**
- Simple Gemini integration (existing archive code)
- No complex infrastructure
- Minimal third-party services
- Predictable costs

### 🔧 **Easy Integration**
- HTTP-based communication
- Standard REST API patterns
- Existing Gemini code can be reused
- TypeScript for better maintainability

### 📈 **Foundation for Growth**
- Clean architecture ready for enhancements
- Service can be scaled independently
- API structure extensible
- Easy to add more AI providers later

## Key Implementation Notes

1. **Database Strategy**: Only apps/api touches the database - apps/ai is purely for processing
2. **Archive Migration**: Convert existing working JS Gemini code to TypeScript
3. **Error Handling**: AI service failures should not break the chat experience
4. **Authentication**: Internal token between services, no user auth in AI service
5. **Context**: Pass conversation history to AI service for better responses

## Next Steps to Iteration 2

After MVP validation, expand to include:
1. Advanced memory system
2. AI content generation features
3. Multiple AI provider support
4. Cost optimization
5. Enhanced user experience 

## What the Archive Code Reveals We Need

### **1. Conversation Type Handling**
```typescript
// The archive has separate logic for:
- Initial messages (with assessment context)
- Follow-up messages (with conversation history)
- Different system prompts per conversation type
- Assessment integration logic
```

### **2. Complex Prompt Management**
```typescript
// Multiple prompt types needed:
- SYSTEM_PROMPT for base personality
- Assessment-aware prompts
- Context-enhanced prompts for follow-ups
- Safety and content filtering
```

### **3. Conversation Context Processing**
```typescript
// Archive shows complex context handling:
- Converting conversation history to Gemini format
- Managing conversation state
- Assessment data integration
- History length management (performance)
```

### **4. Sophisticated Response Processing**
```typescript
// Response handling includes:
- Mock response generation (for development)
- Fallback responses (when API fails)
- Response formatting and metadata
- Error recovery strategies
```

### **5. State Management**
```typescript
// Conversation state complexity:
- Assessment linking
- Conversation history tracking
- User context preservation
- Performance optimization
```

## API Endpoints & Conversation Flow

### **Required Endpoints (Based on Archive Analysis)**

```typescript
// 1. Initial Message Processing
POST /api/chat/send-initial-message
{
  userId: string;
  message: string;
  conversationId: string;
  assessmentId?: string;        # Links to user assessment
  assessmentData?: object;      # Assessment context
}

// 2. Follow-up Message Processing  
POST /api/chat/send-follow-up-message
{
  userId: string;
  message: string;
  conversationId: string;
  conversationHistory: Message[];  # Last 10-20 messages for context
}

// 3. Conversation Context Retrieval
GET /api/chat/conversation-context/:conversationId
# Returns: conversation state, assessment links, context summary

// 4. Health/Status Check
GET /api/chat/health
# Returns: service status, Gemini API availability
```

### **Complex Conversation Processing**

```typescript
// apps/ai/src/apps/chat/services/ConversationProcessor.ts

export class ConversationProcessor {
  
  // Handle initial message with assessment context
  async processInitialMessage(request: InitialMessageRequest): Promise<AIResponse> {
    // 1. Assessment context integration
    const assessmentContext = await this.assessmentHandler.getContext(request.assessmentId);
    
    // 2. Build enhanced prompt with assessment data
    const systemPrompt = this.promptBuilder.buildInitialPrompt(assessmentContext);
    
    // 3. Process with Gemini
    const geminiResponse = await this.geminiService.sendInitialMessage(
      systemPrompt,
      request.message,
      assessmentContext
    );
    
    // 4. Process and format response
    return this.responseProcessor.formatInitialResponse(geminiResponse, assessmentContext);
  }
  
  // Handle follow-up with conversation history
  async processFollowUpMessage(request: FollowUpMessageRequest): Promise<AIResponse> {
    // 1. Process conversation history
    const contextSummary = this.contextManager.buildContextSummary(request.conversationHistory);
    
    // 2. Convert to Gemini format
    const geminiHistory = this.contextManager.formatForGemini(request.conversationHistory);
    
    // 3. Build context-aware prompt
    const enhancedPrompt = this.promptBuilder.buildFollowUpPrompt(contextSummary);
    
    // 4. Process with conversation context
    const geminiResponse = await this.geminiService.sendFollowUpMessage(
      geminiHistory,
      request.message,
      enhancedPrompt
    );
    
    // 5. Process and format response
    return this.responseProcessor.formatFollowUpResponse(geminiResponse, contextSummary);
  }
}
```

### **Assessment Integration Complexity**

```typescript
// apps/ai/src/apps/chat/services/AssessmentHandler.ts

export class AssessmentHandler {
  
  // Extract assessment context for AI
  async getAssessmentContext(assessmentId: string): Promise<AssessmentContext> {
    // Complex logic from archive:
    // - Assessment pattern recognition
    // - Symptom context extraction  
    // - Personalization data
    // - Medical context awareness
    
    return {
      pattern: 'irregular_periods',
      symptoms: ['heavy_flow', 'pain'],
      personalizedGuidance: true,
      medicalDisclaimerRequired: true
    };
  }
  
  // Build assessment-aware prompts
  buildAssessmentPrompt(assessmentData: AssessmentContext): string {
    // From archive: complex prompt building with:
    // - User's specific assessment results
    // - Personalized system prompts
    // - Medical disclaimer integration
    // - Context-specific guidance
    
    return `You are Dottie, responding to a user with ${assessmentData.pattern}...`;
  }
}
```

### **Fallback & Error Management**

```typescript
// apps/ai/src/apps/chat/services/FallbackManager.ts

export class FallbackManager {
  
  // Generate contextual mock responses (from archive)
  generateInitialFallback(message: string, assessmentId?: string): string {
    // Complex fallback logic based on:
    // - Message content analysis
    // - Assessment context
    // - Conversation type
    
    if (message.includes('irregular')) {
      return "Irregular periods can have many causes...";
    }
    // ... more complex logic
  }
  
  // Generate follow-up fallbacks
  generateFollowUpFallback(message: string, conversationHistory: Message[]): string {
    // Context-aware fallbacks based on:
    // - Previous conversation
    // - Current message intent
    // - Conversation flow
  }
}
``` 