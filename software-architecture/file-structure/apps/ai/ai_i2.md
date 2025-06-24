# Apps/AI - Odyssey Creator Platform (Iteration 2)

> **Advanced AI Service** - Sophisticated chat, memory, content generation, and AI features for scale

## Architecture Overview

The AI app is **intentionally separated** from the main API to support advanced AI features and independent scaling as AI technology evolves rapidly through 2025-2035. This iteration adds all the sophisticated features that were excluded from MVP.

## Advanced Message Flow

```typescript
📱 Frontend (apps/web)
    ↓ POST /api/chat/send-message { message, userId, conversationId?, assessmentId? }
🔧 API (apps/api) 
    ↓ Saves user message to DB
    ↓ Retrieves conversation history & context
    ↓ HTTP POST to odyssey-ai-lmcreans-projects.vercel.app/api/chat/send-message
🤖 AI Service (apps/ai)
    ↓ Assessment context integration
    ↓ Conversation history processing
    ↓ Dynamic prompt building
    ↓ Context-aware Gemini processing
    ↑ Returns AI response { content, metadata, contextUsed }
🔧 API (apps/api)
    ↑ Saves AI message with metadata
    ↑ Updates conversation context
    ↑ Returns complete conversation to Frontend
📱 Frontend receives: { userMessage, aiMessage, conversationId, contextSummary }
```

## Deployment Structure

```typescript
// Separate Vercel deployment with enhanced capabilities
apps/ai/ → odyssey-ai-lmcreans-projects.vercel.app

// Service communication with context awareness
apps/web/ → apps/api/ → apps/ai/
              ↓         ↑
         Database   AI Processing
         (Stores)   (Context-Aware)
```

## Advanced Directory Structure

```typescript
apps/ai/
├── src/
│   ├── apps/
│   │   ├── chat/                    # Core conversational AI functionality
│   │   │   ├── routes/
│   │   │   │   ├── send-initial-message/    # New conversation starter
│   │   │   │   │   ├── Controller.ts        # Context-aware initial responses
│   │   │   │   │   └── Route.ts
│   │   │   │   ├── send-follow-up-message/  # Ongoing conversation
│   │   │   │   │   ├── Controller.ts        # Context-aware follow-ups
│   │   │   │   │   └── Route.ts
│   │   │   │   ├── get-conversation-context/ # Context retrieval for API
│   │   │   │   │   ├── Controller.ts
│   │   │   │   │   └── Route.ts
│   │   │   │   └── validate-conversation/    # Conversation state validation
│   │   │   │       ├── Controller.ts
│   │   │   │       └── Route.ts
│   │   │   ├── services/
│   │   │   │   ├── GeminiService.ts          # Enhanced Gemini API integration
│   │   │   │   ├── ConversationProcessor.ts  # Conversation state management
│   │   │   │   ├── PromptBuilder.ts          # Dynamic prompt generation
│   │   │   │   ├── ResponseProcessor.ts      # AI response processing
│   │   │   │   ├── ContextManager.ts         # Conversation context handling
│   │   │   │   ├── AssessmentHandler.ts      # Assessment integration logic
│   │   │   │   ├── FallbackManager.ts        # Advanced fallback responses
│   │   │   │   ├── ChatOrchestrator.ts       # Orchestrates complex chat flows
│   │   │   │   └── ConversationManager.ts    # Manages conversation lifecycle
│   │   │   ├── middleware/
│   │   │   │   ├── ConversationValidator.ts  # Validate conversation state
│   │   │   │   ├── ContextInjector.ts        # Inject conversation context
│   │   │   │   └── ResponseFormatter.ts      # Standardize response format
│   │   │   └── types/
│   │   │       ├── conversation.ts           # Conversation state types
│   │   │       ├── context.ts               # Context management types
│   │   │       ├── assessment.ts            # Assessment integration types
│   │   │       ├── prompts.ts               # Prompt building types
│   │   │       ├── gemini.ts                # Gemini-specific types
│   │   │       └── responses.ts             # Response format types
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
│   │   │   ├── prompts.config.ts            # Advanced system prompts
│   │   │   ├── safety.config.ts             # Safety settings
│   │   │   ├── openai.config.ts             # Multiple AI providers
│   │   │   └── anthropic.config.ts          # Claude integration
│   │   ├── middleware/
│   │   │   ├── auth.ts                      # Internal API token validation
│   │   │   ├── rateLimit.ts                 # Advanced rate limiting
│   │   │   ├── errorHandler.ts              # Centralized error handling
│   │   │   └── cost-tracking.ts             # AI cost monitoring
│   │   ├── services/
│   │   │   ├── AIProviderRouter.ts          # Route to best AI model
│   │   │   ├── CostOptimizer.ts             # Optimize AI costs
│   │   │   └── ResponseCache.ts             # Cache AI responses
│   │   ├── utilities/
│   │   │   ├── messageUtils.ts              # Message formatting utilities
│   │   │   ├── contextUtils.ts              # Context manipulation utilities
│   │   │   └── validationUtils.ts           # Input validation utilities
│   │   └── types/
│   │       ├── ai-provider.ts
│   │       ├── cost-tracking.ts
│   │       ├── api.ts                       # API request/response types
│   │       ├── internal.ts                  # Internal service types
│   │       └── common.ts                    # Shared common types
│   │
│   └── server.ts
├── vercel.json
├── package.json
└── tsconfig.json
```

## Complex Conversation Processing

### **Advanced Conversation Processor**

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

### **Assessment Integration**

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

### **Advanced Fallback Management**

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

## API Endpoints & Complex Flows

### **Advanced API Endpoints**

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

## Enhanced API Integration Pattern

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
        contextUsed: boolean;
        conversationLength: number;
      }
    }>;
  }
  
  async getMemoryContext(userId: string) {
    // Retrieve user-specific AI memory and context
  }
  
  async generateContent(type: 'caption' | 'hashtags', data: any) {
    // AI content generation for creators
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
      
      // 3. Get AI response with context
      const aiResponse = await this.aiService.processMessage(userId, message, history);
      
      // 4. Save AI message to database with metadata
      const aiMessage = await saveAIMessage(userMessage.conversationId, aiResponse.content, aiResponse.metadata);
      
      // 5. Return complete conversation update
      res.json({
        success: true,
        userMessage,
        aiMessage,
        conversationId: userMessage.conversationId,
        metadata: aiResponse.metadata
      });
      
    } catch (error) {
      // Advanced fallback handling
      const fallback = await this.fallbackManager.generateContextualFallback(message, userId);
      res.json({ success: true, content: fallback });
    }
  }
}
```

## Advanced Response Format

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
  assessmentId?: string;
  assessmentData?: AssessmentContext;
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
    assessmentIntegrated: boolean;
    fallbackUsed: boolean;
  };
  error?: string;
}
```

## Environment Variables

```bash
# AI App (.env) - Advanced Configuration
GEMINI_API_KEY=...              # Primary AI provider
OPENAI_API_KEY=...              # Backup AI provider
ANTHROPIC_API_KEY=...           # Claude integration

# Database & Memory
DATABASE_URL=...                # Shared Neon PostgreSQL
REDIS_URL=...                   # AI memory and caching

# Internal Security
INTERNAL_AI_TOKEN=...           # Secure API↔AI communication
JWT_SECRET=...                  # Shared auth validation

# Cost Management
AI_COST_LIMIT_DAILY=100         # Daily spending limit
AI_RATE_LIMIT_USER=50           # Messages per user per hour

# Assessment Integration
ASSESSMENT_SERVICE_URL=...      # Assessment service endpoint
ASSESSMENT_API_KEY=...          # Assessment service auth
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

### **Phase 1 (Post-MVP 2025)**
- ✅ Advanced conversation context management
- ✅ Assessment integration for personalized responses
- ✅ Dynamic prompt building system
- ✅ Complex fallback and error handling

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
// Advanced AI testing
npm run test "apps/ai"                    # All AI tests
npm run test "chat"                       # Chat functionality
npm run test "memory"                     # Memory system
npm run test "ConversationProcessor"      # Complex conversation logic
npm run test "AssessmentHandler"          # Assessment integration
npm run test "PromptBuilder"              # Dynamic prompt building
npm run test "GeminiService"              # AI provider integration

// Integration testing
npm run test:dev                          # Local SQLite testing
npm run test:prod                         # Production Neon testing
npm run test:ai-integration               # Cross-app API↔AI testing
npm run test:assessment-integration       # Assessment service testing
```

## Cost Optimization

### **Smart Provider Routing**
```typescript
// Route queries to most cost-effective AI model
- Simple questions → Gemini (cheapest)
- Complex reasoning → GPT-4 (most capable)
- Creative content → Claude (best for writing)
- Assessment-related → Specialized prompts
```

### **Advanced Caching Strategy**
```typescript
// Cache expensive AI responses
- FAQ responses cached for 7 days
- User personality profiles cached for 24 hours
- Content suggestions cached for 1 hour
- Assessment-based responses cached per user
```

### **Usage Monitoring**
```typescript
// Track and optimize AI costs
- Per-user usage limits
- Cost alerts and budgeting
- Model performance vs cost analysis
- Assessment integration cost tracking
```

## Security & Privacy

### **Data Protection**
- User memory encrypted at rest
- AI conversations logged but anonymized
- GDPR compliance for AI-generated data
- Assessment data protected and anonymized

### **Internal API Security**
- Bearer token authentication between API↔AI
- Rate limiting per user and endpoint
- Request validation and sanitization
- Assessment service authentication

## Benefits of Advanced AI Architecture

### **💰 Cost Management**
- Independent scaling based on AI usage
- Dedicated cost monitoring and optimization
- Different compute requirements from main API
- Assessment integration cost optimization

### **🚀 Performance**
- AI processing doesn't slow down core API
- Optimized for AI workloads (longer timeouts, more memory)
- Can use specialized AI infrastructure when needed
- Complex conversation processing isolated

### **🔮 Future-Proof**
- Easy to integrate new AI providers and models
- Advanced AI features won't complicate main API
- Can evolve AI architecture independently
- Assessment integration ready for expansion

### **⚡ Development**
- AI team can work independently
- Easier to test and debug AI-specific features
- Clear separation of concerns
- Assessment integration properly isolated 