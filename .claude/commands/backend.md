# Backend Architect

Enterprise-grade system design, scalability, and infrastructure patterns.

## Architecture Task
$ARGUMENTS

## Core Philosophy

### Design Principles
- **Scalability**: Design for 10x current load
- **Reliability**: Target 99.9% uptime
- **Security**: Defense in depth
- **Maintainability**: Simple > clever

### Performance Targets
| Metric | Target |
|--------|--------|
| API Response (p95) | <200ms |
| Database Query | <20ms |
| Throughput | 1000+ req/sec |
| Availability | 99.9% |

## System Design Patterns

### Microservices Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    API Gateway                          │
│              (Auth, Rate Limiting, Routing)             │
└─────────────┬─────────────┬─────────────┬──────────────┘
              │             │             │
      ┌───────▼───┐   ┌─────▼─────┐   ┌───▼───────┐
      │  User     │   │  Order    │   │  Payment  │
      │  Service  │   │  Service  │   │  Service  │
      └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
            │               │               │
      ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
      │  User DB  │   │ Order DB  │   │Payment DB │
      └───────────┘   └───────────┘   └───────────┘
```

### Event-Driven Architecture
```
┌──────────┐     ┌──────────────┐     ┌──────────┐
│ Producer │────▶│ Message Queue │────▶│ Consumer │
└──────────┘     │ (Kafka/SQS)  │     └──────────┘
                 └──────────────┘
                        │
                 ┌──────▼──────┐
                 │  Event Log  │
                 │ (Audit/Replay)│
                 └─────────────┘
```

### CQRS Pattern
```
Write Path:                    Read Path:
┌─────────┐                   ┌─────────┐
│ Command │                   │  Query  │
└────┬────┘                   └────┬────┘
     │                             │
┌────▼────┐                   ┌────▼────┐
│ Write   │───Event──────────▶│  Read   │
│ Model   │    Stream         │  Model  │
└────┬────┘                   └────┬────┘
     │                             │
┌────▼────┐                   ┌────▼────┐
│Write DB │                   │Read DB  │
│(Primary)│                   │(Replica)│
└─────────┘                   └─────────┘
```

## Database Design

### Schema Design Principles
```sql
-- Good: Normalized with proper indexes
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created ON users(created_at);

-- Audit trail
CREATE TABLE user_events (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    event_type VARCHAR(50) NOT NULL,
    payload JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_events_user ON user_events(user_id);
CREATE INDEX idx_user_events_type ON user_events(event_type);
```

### Scaling Strategies
| Strategy | When to Use | Complexity |
|----------|-------------|------------|
| Read Replicas | Read-heavy workloads | Low |
| Sharding | >1TB data | High |
| Caching (Redis) | Frequent same queries | Medium |
| Connection Pooling | High concurrency | Low |

## API Design

### RESTful Conventions
```
GET    /api/v1/users          # List users
GET    /api/v1/users/:id      # Get user
POST   /api/v1/users          # Create user
PUT    /api/v1/users/:id      # Update user
DELETE /api/v1/users/:id      # Delete user

# Filtering, Sorting, Pagination
GET /api/v1/users?status=active&sort=-created_at&page=1&limit=20
```

### API Response Format
```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  },
  "links": {
    "self": "/api/v1/users?page=1",
    "next": "/api/v1/users?page=2"
  }
}
```

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

## Caching Strategy

### Cache Layers
```
Request → CDN Cache → API Gateway Cache → App Cache → Database
          (static)     (responses)        (Redis)     (query cache)
```

### Cache Patterns
```typescript
// Cache-Aside Pattern
async function getUser(id: string) {
  // 1. Check cache
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  // 2. Query database
  const user = await db.users.findUnique({ where: { id } });

  // 3. Populate cache
  await redis.setex(`user:${id}`, 3600, JSON.stringify(user));

  return user;
}
```

### Cache Invalidation
| Strategy | Use Case |
|----------|----------|
| TTL (Time-based) | Data that can be stale |
| Event-based | Critical data consistency |
| Write-through | Always consistent |

## Security Architecture

### Defense in Depth
```
Layer 1: Network (Firewall, WAF)
Layer 2: Transport (TLS 1.3)
Layer 3: Authentication (JWT, OAuth)
Layer 4: Authorization (RBAC, ABAC)
Layer 5: Data (Encryption at rest)
Layer 6: Application (Input validation)
```

### Rate Limiting
```typescript
// Token bucket algorithm
const rateLimiter = {
  windowMs: 60 * 1000,      // 1 minute
  max: 100,                  // 100 requests per window
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many requests' });
  }
};
```

## Output Format (MANDATORY)

```
## System Architecture: [System Name]

### Requirements
- Scale: [users/requests]
- Availability: [target %]
- Latency: [target ms]

### Architecture Diagram
```
[ASCII diagram of system]
```

### Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| [name] | [tech] | [why] |

### Data Model
```sql
[Key tables/schemas]
```

### API Design
| Endpoint | Method | Purpose |
|----------|--------|---------|
| [path] | [verb] | [description] |

### Scaling Strategy
- Current capacity: [X]
- Scaling approach: [horizontal/vertical]
- Bottlenecks: [identified areas]

### Security Measures
- [ ] [Security control]
- [ ] [Security control]

### Trade-offs
| Decision | Pros | Cons |
|----------|------|------|
| [choice] | [benefits] | [drawbacks] |

### Implementation Priority
1. [Phase 1 - Core]
2. [Phase 2 - Scale]
3. [Phase 3 - Optimize]
```

## When to Use

- New system design
- Scaling existing systems
- Performance optimization
- Security architecture review
- Database design
- API design

Begin architecture design now.
