# TriLLM Architecture 🏗️

## System Overview

TriLLM is a meta-AI service that aggregates responses from multiple Large Language Models (ChatGPT, Gemini, Claude) and presents the best answer to users.

---

## Architecture Evolution

### Stage 1: Monolithic MVP
```
┌─────────────┐          ┌─────────────────┐
│   Browser   │ ────────▶│  Static Frontend│
│             │          │   (Vercel)      │
└─────────────┘          └─────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   API Server    │
                         │  (Railway)      │
                         └─────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
              ┌─────────┐   ┌─────────┐   ┌─────────┐
              │ OpenAI  │   │Anthropic│   │ (Later) │
              │   API   │   │   API   │   │         │
              └─────────┘   └─────────┘   └─────────┘
```

### Stage 2: Enhanced with Caching & Database
```
┌─────────────┐          ┌─────────────────┐
│   Browser   │ ────────▶│     Frontend    │
│             │          │   (Next.js)     │
└─────────────┘          └─────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   API Server    │
                         │  + Queue System │
                         └─────────────────┘
                          │      │         │
                          │      │         └──────▶ ┌──────────┐
                          │      │                  │  Redis   │
                          │      │                  │  Cache   │
                          │      │                  └──────────┘
                          │      │
                          │      └─────────────────▶ ┌──────────┐
                          │                          │PostgreSQL│
                          │                          │ Database │
                          │                          └──────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
    ┌─────────┐      ┌─────────┐    ┌─────────┐
    │ OpenAI  │      │  Google │    │Anthropic│
    │   API   │      │   API   │    │   API   │
    └─────────┘      └─────────┘    └─────────┘
```

### Stage 3: Microservices Production Architecture
```
                          ┌─────────────────┐
                          │   CloudFlare    │
                          │      CDN        │
                          └────────┬────────┘
                                   │
┌─────────────┐                   │
│   Browser   │                   ▼
│   Extension │          ┌─────────────────┐
│   Mobile    │ ────────▶│  API Gateway    │
└─────────────┘          │   (Kong/NGINX)  │
                         └────────┬────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 ▼                ▼                ▼
        ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
        │    User     │  │     LLM     │  │   Ranking   │
        │   Service   │  │   Service   │  │   Service   │
        └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
               │                │                 │
               ▼                ▼                 ▼
        ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
        │  Analytics  │  │   Payment   │  │    Queue    │
        │   Service   │  │   Service   │  │   (BullMQ)  │
        └─────────────┘  └─────────────┘  └─────────────┘
                                                  │
        ┌────────────────────────────────────────┤
        │                 │                      │
        ▼                 ▼                      ▼
  ┌──────────┐      ┌──────────┐         ┌──────────┐
  │PostgreSQL│      │  Redis   │         │  S3/GCS  │
  │ Primary  │      │  Cache   │         │  Storage │
  └──────────┘      └──────────┘         └──────────┘
        │
        ▼
  ┌──────────┐      ┌──────────┐         ┌──────────┐
  │PostgreSQL│      │ MongoDB  │         │Elastic-  │
  │ Replica  │      │Analytics │         │ search   │
  └──────────┘      └──────────┘         └──────────┘
```

---

## Component Details

### Frontend (React/Next.js)

**Responsibilities:**
- User interface and interaction
- Question input and submission
- Display LLM responses
- Handle authentication (Stage 3)
- Client-side caching

**Key Pages:**
- `/` - Landing page with search
- `/results/:queryId` - Results page with all LLM responses
- `/history` - Query history (Stage 2+)
- `/dashboard` - User dashboard (Stage 3)
- `/pricing` - Subscription plans (Stage 3)

**State Management:**
- Zustand for global state
- React Query for server state
- Context for theme/settings

### Backend API Server

**Responsibilities:**
- Request validation
- Rate limiting
- Authentication/Authorization
- Query orchestration
- Response aggregation
- Caching logic

**Key Endpoints:**

**Stage 1:**
```
POST   /api/query                 # Submit question
GET    /api/health                # Health check
```

**Stage 2:**
```
POST   /api/query                 # Submit question
GET    /api/query/:id             # Get specific query result
GET    /api/history               # Get query history
POST   /api/feedback              # Submit feedback
GET    /api/health                # Health check
GET    /api/stats                 # Basic statistics
```

**Stage 3:**
```
POST   /api/v1/auth/register      # User registration
POST   /api/v1/auth/login         # User login
POST   /api/v1/auth/logout        # User logout
GET    /api/v1/user/profile       # Get user profile
GET    /api/v1/user/usage         # Get usage stats

POST   /api/v1/query              # Submit question
GET    /api/v1/query/:id          # Get query result
GET    /api/v1/queries            # List user queries
DELETE /api/v1/query/:id          # Delete query

POST   /api/v1/feedback           # Submit feedback
GET    /api/v1/favorites          # Get favorite responses

POST   /api/v1/subscription       # Manage subscription
GET    /api/v1/billing            # Get billing info

# Public API (authenticated with API key)
POST   /api/v1/public/query       # API endpoint for developers
GET    /api/v1/public/status      # API status
```

### LLM Integration Layer

**Responsibilities:**
- Manage connections to OpenAI, Google, Anthropic
- Handle API authentication
- Format requests/responses
- Implement retry logic
- Track API usage and costs

**LLM Adapters (Interface Pattern):**
```typescript
interface LLMAdapter {
  name: string;
  query(prompt: string, options?: QueryOptions): Promise<LLMResponse>;
  isAvailable(): boolean;
  estimateCost(tokens: number): number;
}

class OpenAIAdapter implements LLMAdapter { }
class GeminiAdapter implements LLMAdapter { }
class ClaudeAdapter implements LLMAdapter { }
```

**Query Flow:**
1. Receive user question
2. Check cache (Stage 2+)
3. Distribute to all LLMs (parallel)
4. Collect responses with timeout
5. Rank responses
6. Store in database
7. Return to user

### Ranking System

**Stage 1: Simple Heuristic**
- Response length
- Presence of code blocks
- Structured formatting
- Response time

**Stage 2: Multi-Criteria Scoring**
```typescript
interface ScoringCriteria {
  relevance: number;      // 0-100
  completeness: number;   // 0-100
  clarity: number;        // 0-100
  accuracy: number;       // 0-100
}

function calculateScore(response: LLMResponse): number {
  const weights = {
    relevance: 0.4,
    completeness: 0.3,
    clarity: 0.2,
    accuracy: 0.1
  };

  return Object.entries(weights).reduce((total, [key, weight]) => {
    return total + (response.scores[key] * weight);
  }, 0);
}
```

**Stage 3: AI-Powered Evaluation**
- Use a 4th LLM call to judge responses
- Compare against ground truth (if available)
- Learn from user feedback
- ML model for preference prediction

### Database Schema

**Stage 2 Schema (PostgreSQL):**

```sql
-- Users table (Stage 3)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  subscription_tier VARCHAR(50) DEFAULT 'free',
  api_key VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Queries table
CREATE TABLE queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  question TEXT NOT NULL,
  category VARCHAR(100),
  session_id VARCHAR(255),
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

-- LLM Responses table
CREATE TABLE llm_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES queries(id) ON DELETE CASCADE,
  llm_provider VARCHAR(50) NOT NULL, -- 'openai', 'gemini', 'anthropic'
  response_text TEXT NOT NULL,
  tokens_used INTEGER,
  response_time_ms INTEGER,
  cost_usd DECIMAL(10, 6),
  scores JSONB, -- {relevance: 85, completeness: 90, ...}
  is_best BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES queries(id) ON DELETE CASCADE,
  response_id UUID REFERENCES llm_responses(id),
  rating INTEGER CHECK (rating IN (-1, 1)), -- thumbs up/down
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usage tracking (for rate limiting and billing)
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(50), -- 'query', 'api_call'
  timestamp TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

-- Indexes
CREATE INDEX idx_queries_user_id ON queries(user_id);
CREATE INDEX idx_queries_created_at ON queries(created_at);
CREATE INDEX idx_llm_responses_query_id ON llm_responses(query_id);
CREATE INDEX idx_llm_responses_is_best ON llm_responses(is_best);
CREATE INDEX idx_usage_logs_user_id_timestamp ON usage_logs(user_id, timestamp);
```

### Caching Strategy (Redis)

**Cache Keys:**
```
query:{hash}                 # Cached query results (TTL: 1 hour)
rate_limit:{ip}:{minute}     # Rate limiting counter (TTL: 1 minute)
rate_limit:{user_id}:{day}   # Daily quota (TTL: 24 hours)
session:{session_id}         # Session data (TTL: 1 day)
```

**Cache Invalidation:**
- Time-based (TTL)
- Manual invalidation for updated answers
- LRU eviction policy

### Queue System (BullMQ - Stage 3)

**Job Types:**
1. **Query Jobs**: Process LLM queries asynchronously
2. **Ranking Jobs**: Calculate rankings in background
3. **Analytics Jobs**: Aggregate statistics
4. **Cleanup Jobs**: Delete old data

**Queue Configuration:**
- Priority queue (premium users get priority)
- Retry mechanism (3 attempts with exponential backoff)
- Dead letter queue for failed jobs

---

## Data Flow

### Query Processing Flow

```
User submits question
         │
         ▼
 ┌───────────────┐
 │ API Endpoint  │
 └───────┬───────┘
         │
         ▼
 ┌───────────────┐
 │ Validate Input│  ← Check rate limits
 └───────┬───────┘  ← Check authentication
         │
         ▼
 ┌───────────────┐
 │  Check Cache  │
 └───────┬───────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
 Cache      Cache
  Hit       Miss
    │         │
    │         ▼
    │   ┌─────────────┐
    │   │ Create Job  │
    │   │  (if async) │
    │   └──────┬──────┘
    │          │
    │          ▼
    │   ┌─────────────┐
    │   │Query 3 LLMs │ (Parallel)
    │   │             │
    │   └──────┬──────┘
    │          │
    │          ▼
    │   ┌─────────────┐
    │   │Collect      │
    │   │Responses    │
    │   └──────┬──────┘
    │          │
    │          ▼
    │   ┌─────────────┐
    │   │Rank & Score │
    │   └──────┬──────┘
    │          │
    │          ▼
    │   ┌─────────────┐
    │   │ Save to DB  │
    │   └──────┬──────┘
    │          │
    │          ▼
    │   ┌─────────────┐
    │   │ Cache Result│
    │   └──────┬──────┘
    │          │
    └────┬─────┘
         │
         ▼
 ┌───────────────┐
 │Return to User │
 └───────────────┘
```

---

## Security Considerations

### API Key Management
- Store in environment variables
- Rotate regularly
- Use separate keys for dev/staging/prod
- Monitor usage and costs

### User Security
- Hash passwords with bcrypt (Stage 3)
- JWT tokens with short expiration
- HTTPS only
- CSRF protection
- SQL injection prevention (parameterized queries)

### Rate Limiting
**Stage 1:**
- 10 requests per minute per IP

**Stage 2:**
- Free tier: 10 queries/day
- Authenticated: 100 queries/day

**Stage 3:**
- Free: 10/day
- Pro: 1000/day
- Enterprise: Unlimited

### Input Validation
- Max question length: 1000 characters
- Sanitize input (prevent prompt injection)
- Content moderation (flag inappropriate content)

### API Security
- API key authentication for public API
- Rate limiting per API key
- Request signing (optional, enterprise)

---

## Monitoring & Observability

### Metrics to Track
- Request count (total, per LLM)
- Response times (p50, p95, p99)
- Error rates
- Cache hit ratio
- API costs per LLM
- User retention
- Conversion rate (free → paid)

### Logging
- Structured logging (JSON format)
- Log levels: ERROR, WARN, INFO, DEBUG
- Log query IDs for traceability
- Centralized logging (ELK Stack or Datadog)

### Alerts
- High error rate (> 5%)
- Slow responses (> 10s)
- API failures
- High costs
- System downtime

---

## Scalability Strategy

### Horizontal Scaling
- Stateless API servers (easy to replicate)
- Load balancer (Nginx, ALB)
- Database read replicas
- Redis cluster for distributed caching

### Performance Optimizations
- Connection pooling (database, Redis)
- HTTP/2 for API calls
- Gzip compression
- CDN for static assets
- Lazy loading (frontend)
- Pagination for large results

### Cost Optimization
- Cache aggressively
- Smart model routing (use cheaper models when appropriate)
- Batch similar queries
- Negotiate volume discounts with LLM providers
- Monitor and optimize token usage

---

## Deployment Strategy

### Stage 1
- Frontend: Vercel (automatic deployments)
- Backend: Railway (easy setup, env vars)
- DNS: Cloudflare
- SSL: Automatic (Vercel, Railway)

### Stage 2
- Frontend: Vercel
- Backend: Railway or Fly.io
- Database: Supabase (managed PostgreSQL)
- Cache: Upstash (managed Redis)

### Stage 3
- Frontend: Vercel or self-hosted
- Backend: Kubernetes (AWS EKS, GCP GKE)
- Database: AWS RDS or GCP Cloud SQL
- Cache: AWS ElastiCache or GCP Memorystore
- Object Storage: AWS S3 or GCP Cloud Storage
- CI/CD: GitHub Actions
- Infrastructure as Code: Terraform

### Deployment Pipeline
```
git push to main
      │
      ▼
┌────────────┐
│  GitHub    │
│  Actions   │
└─────┬──────┘
      │
      ├─────▶ Run Tests
      │
      ├─────▶ Build Frontend
      │
      ├─────▶ Build Backend (Docker)
      │
      └─────▶ Deploy
              │
              ├─────▶ Deploy Frontend (Vercel)
              │
              └─────▶ Deploy Backend (K8s/Railway)
```

---

## Technology Stack Summary

| Component | Stage 1 | Stage 2 | Stage 3 |
|-----------|---------|---------|---------|
| **Frontend** | React + Vite | Next.js 14 | Next.js 14 + PWA |
| **Styling** | Tailwind CSS | Tailwind CSS | Tailwind CSS |
| **State** | React Context | Zustand | Zustand + React Query |
| **Backend** | Node + Express | Node + Express + TS | NestJS or Microservices |
| **Database** | - | PostgreSQL | PostgreSQL + MongoDB |
| **Cache** | - | Redis | Redis Cluster |
| **Queue** | - | - | BullMQ |
| **Auth** | - | JWT | Auth0/Clerk |
| **Payment** | - | - | Stripe |
| **Hosting** | Vercel + Railway | Vercel + Railway | AWS/GCP + K8s |
| **Monitoring** | Basic logs | Sentry | Grafana + Prometheus |

---

## Risk Mitigation

### Technical Risks
1. **LLM API Downtime**:
   - Implement graceful degradation
   - Cache previous responses
   - Show partial results

2. **High Costs**:
   - Set budget alerts
   - Implement aggressive caching
   - Use rate limiting

3. **Slow Response Times**:
   - Set timeouts
   - Stream responses
   - Use faster models when possible

### Business Risks
1. **Low User Adoption**:
   - Focus on unique value prop
   - Get early user feedback
   - Iterate quickly

2. **Competition**:
   - Differentiate with better UX
   - Add unique features (synthesis, learning)
   - Build community

---

## Future Enhancements

- Multi-language support
- Voice input/output
- Image generation comparison
- Fine-tuned models for specific domains
- Collaborative features (team workspaces)
- Plugin system for custom LLMs
- On-premise deployment option (Enterprise)

---

**Ready to build this architecture? Let's start with Stage 1! 🚀**
