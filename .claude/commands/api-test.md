# API Tester

Comprehensive API testing for functionality, security, and performance.

## API Test Task
$ARGUMENTS

## Core Philosophy

### Security-First Testing
- Every endpoint is a potential attack surface
- Test authentication before functionality
- Assume malicious input
- Verify error handling doesn't leak info

### Coverage Targets
| Area | Target |
|------|--------|
| Endpoint coverage | 95%+ |
| Response time (p95) | <200ms |
| Error rate | <0.1% |
| Security compliance | OWASP Top 10 |

## Testing Protocol

### 1. Authentication Testing
```bash
# Test without auth (should fail)
curl -X GET https://api.example.com/users
# Expected: 401 Unauthorized

# Test with invalid token
curl -X GET https://api.example.com/users \
  -H "Authorization: Bearer invalid_token"
# Expected: 401 Unauthorized

# Test with expired token
curl -X GET https://api.example.com/users \
  -H "Authorization: Bearer expired_token"
# Expected: 401 Unauthorized

# Test with valid token
curl -X GET https://api.example.com/users \
  -H "Authorization: Bearer valid_token"
# Expected: 200 OK
```

### 2. Authorization Testing
```bash
# Test accessing other user's data
curl -X GET https://api.example.com/users/other_user_id \
  -H "Authorization: Bearer user_token"
# Expected: 403 Forbidden

# Test admin-only endpoints with regular user
curl -X DELETE https://api.example.com/users/123 \
  -H "Authorization: Bearer regular_user_token"
# Expected: 403 Forbidden
```

### 3. Input Validation Testing
```bash
# SQL Injection
curl -X POST https://api.example.com/users \
  -d '{"email": "test@test.com; DROP TABLE users;--"}'
# Expected: 400 Bad Request (sanitized)

# XSS
curl -X POST https://api.example.com/comments \
  -d '{"content": "<script>alert(1)</script>"}'
# Expected: 400 Bad Request or sanitized output

# Oversized payload
curl -X POST https://api.example.com/upload \
  -d "$(head -c 10M /dev/urandom | base64)"
# Expected: 413 Payload Too Large

# Invalid types
curl -X POST https://api.example.com/users \
  -d '{"age": "not_a_number"}'
# Expected: 400 Bad Request with clear error
```

### 4. Functional Testing
```bash
# CRUD Operations
# Create
curl -X POST https://api.example.com/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Item"}'
# Verify: 201 Created, returns ID

# Read
curl -X GET https://api.example.com/items/{id}
# Verify: 200 OK, correct data

# Update
curl -X PUT https://api.example.com/items/{id} \
  -d '{"name": "Updated Item"}'
# Verify: 200 OK, data updated

# Delete
curl -X DELETE https://api.example.com/items/{id}
# Verify: 204 No Content or 200 OK
```

### 5. Performance Testing
```bash
# Using k6 for load testing
k6 run - <<EOF
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function() {
  const res = http.get('https://api.example.com/items');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  sleep(1);
}
EOF
```

## Test Categories

### Security Tests
| Test | Check | Expected |
|------|-------|----------|
| No auth | Missing token | 401 |
| Bad auth | Invalid token | 401 |
| Authz bypass | Access other's data | 403 |
| SQL injection | Malicious SQL | 400/sanitized |
| XSS | Script injection | 400/escaped |
| Rate limit | Excessive requests | 429 |

### Functional Tests
| Test | Method | Expected |
|------|--------|----------|
| List items | GET /items | 200 + array |
| Get item | GET /items/:id | 200 + object |
| Create item | POST /items | 201 + id |
| Update item | PUT /items/:id | 200 |
| Delete item | DELETE /items/:id | 204 |
| Not found | GET /items/invalid | 404 |

### Edge Cases
| Test | Input | Expected |
|------|-------|----------|
| Empty body | {} | 400 with errors |
| Missing required | {partial} | 400 with field errors |
| Duplicate | Same unique value | 409 Conflict |
| Pagination | ?page=999 | 200 empty array |
| Max length | Very long string | 400 or truncated |

## Automated Test Suite

### Jest/Supertest Example
```typescript
import request from 'supertest';
import app from '../src/app';

describe('Users API', () => {
  describe('GET /users', () => {
    it('returns 401 without auth', async () => {
      const res = await request(app).get('/users');
      expect(res.status).toBe(401);
    });

    it('returns users with valid auth', async () => {
      const res = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${validToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /users', () => {
    it('validates required fields', async () => {
      const res = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.error.details).toContainEqual(
        expect.objectContaining({ field: 'email' })
      );
    });
  });
});
```

## Output Format (MANDATORY)

```
## API Test Report: [API Name]

### Test Summary
| Category | Passed | Failed | Coverage |
|----------|--------|--------|----------|
| Security | [X] | [X] | [X]% |
| Functional | [X] | [X] | [X]% |
| Performance | [X] | [X] | [X]% |
| **Total** | **[X]** | **[X]** | **[X]%** |

### Security Test Results

| Test | Endpoint | Result | Notes |
|------|----------|--------|-------|
| Auth required | GET /users | PASS | Returns 401 |
| SQL injection | POST /users | PASS | Input sanitized |
| Rate limiting | ALL | FAIL | Not implemented |

### Performance Metrics
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| p95 latency | <200ms | [X]ms | PASS/FAIL |
| Error rate | <0.1% | [X]% | PASS/FAIL |
| Throughput | >100 rps | [X] rps | PASS/FAIL |

### Issues Found

**Critical:**
- [Issue]: [Description]
  - Endpoint: [path]
  - Risk: [impact]
  - Fix: [recommendation]

**Major:**
- [Issue]: [Description]

**Minor:**
- [Issue]: [Description]

### Recommendations
1. [Priority fix]
2. [Security improvement]
3. [Performance optimization]

### Test Commands
```bash
[Commands to reproduce tests]
```
```

## When to Use

- Before API releases
- After API changes
- Security audits
- Performance validation
- CI/CD quality gates

Begin API testing now.
