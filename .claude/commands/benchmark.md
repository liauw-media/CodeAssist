# Performance Benchmarker

Load testing, performance optimization, and Core Web Vitals analysis.

## Benchmark Task
$ARGUMENTS

## Core Philosophy

### User-Centric Performance
- Real user experience > server metrics
- Core Web Vitals are the standard
- Test under realistic conditions
- Establish baselines before optimizing

### Performance Targets
| Metric | Good | Needs Work | Poor |
|--------|------|------------|------|
| LCP (Largest Contentful Paint) | <2.5s | 2.5-4s | >4s |
| FID (First Input Delay) | <100ms | 100-300ms | >300ms |
| CLS (Cumulative Layout Shift) | <0.1 | 0.1-0.25 | >0.25 |
| TTFB (Time to First Byte) | <200ms | 200-500ms | >500ms |

## Web Performance Testing

### Lighthouse CLI
```bash
# Basic audit
npx lighthouse https://example.com --output=json --output-path=./report.json

# Mobile performance
npx lighthouse https://example.com --preset=perf --emulated-form-factor=mobile

# Desktop performance
npx lighthouse https://example.com --preset=perf --emulated-form-factor=desktop

# CI-friendly
npx lighthouse https://example.com --budget-path=budget.json --output=html
```

### Performance Budget
```json
{
  "ci": {
    "collect": {
      "url": ["https://example.com/"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["error", {"maxNumericValue": 2000}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "total-blocking-time": ["error", {"maxNumericValue": 300}]
      }
    }
  }
}
```

## Load Testing

### k6 Load Test
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp up
    { duration: '3m', target: 50 },   // Steady state
    { duration: '1m', target: 100 },  // Spike
    { duration: '2m', target: 100 },  // Sustained spike
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200', 'p(99)<500'],
    http_req_failed: ['rate<0.01'],
    errors: ['rate<0.05'],
  },
};

export default function() {
  const res = http.get('https://api.example.com/items');

  responseTime.add(res.timings.duration);
  errorRate.add(res.status >= 400);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
```

### Artillery Load Test
```yaml
config:
  target: "https://api.example.com"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Spike"
  defaults:
    headers:
      Authorization: "Bearer {{ $env.API_TOKEN }}"

scenarios:
  - name: "Browse and purchase"
    flow:
      - get:
          url: "/products"
      - think: 2
      - get:
          url: "/products/{{ $randomNumber(1, 100) }}"
      - think: 1
      - post:
          url: "/cart"
          json:
            productId: "{{ $randomNumber(1, 100) }}"
```

## Database Performance

### Query Analysis
```sql
-- Enable query timing
\timing on

-- Explain query plan
EXPLAIN ANALYZE
SELECT * FROM users
WHERE email = 'test@example.com';

-- Find slow queries (PostgreSQL)
SELECT query, calls, mean_time, total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Index Recommendations
```sql
-- Find missing indexes
SELECT
  schemaname || '.' || relname as table,
  seq_scan,
  seq_tup_read,
  idx_scan,
  idx_tup_fetch
FROM pg_stat_user_tables
WHERE seq_scan > idx_scan
ORDER BY seq_tup_read DESC;
```

## Optimization Checklist

### Frontend
- [ ] Enable compression (gzip/brotli)
- [ ] Optimize images (WebP, lazy loading)
- [ ] Minimize JavaScript bundles
- [ ] Use CDN for static assets
- [ ] Implement caching headers
- [ ] Preload critical resources
- [ ] Defer non-critical scripts

### Backend
- [ ] Enable response compression
- [ ] Implement caching (Redis)
- [ ] Optimize database queries
- [ ] Add appropriate indexes
- [ ] Use connection pooling
- [ ] Enable HTTP/2
- [ ] Implement rate limiting

### Infrastructure
- [ ] Right-size servers
- [ ] Configure auto-scaling
- [ ] Use load balancing
- [ ] Enable CDN
- [ ] Optimize DNS
- [ ] Use regional deployments

## Output Format (MANDATORY)

```
## Performance Report: [Target]

### Executive Summary
- Overall Score: [X]/100
- Status: [PASS/NEEDS WORK/CRITICAL]
- Key Issue: [biggest bottleneck]

### Core Web Vitals

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| LCP | <2.5s | [X]s | [PASS/FAIL] |
| FID | <100ms | [X]ms | [PASS/FAIL] |
| CLS | <0.1 | [X] | [PASS/FAIL] |
| TTFB | <200ms | [X]ms | [PASS/FAIL] |

### Load Test Results

| Scenario | VUs | RPS | p95 | Error Rate |
|----------|-----|-----|-----|------------|
| Baseline | 10 | [X] | [X]ms | [X]% |
| Normal | 50 | [X] | [X]ms | [X]% |
| Peak | 100 | [X] | [X]ms | [X]% |
| Stress | 200 | [X] | [X]ms | [X]% |

### Bottlenecks Identified

1. **[Bottleneck]**
   - Impact: [High/Medium/Low]
   - Location: [where]
   - Fix: [recommendation]

2. **[Bottleneck]**
   - Impact: [High/Medium/Low]
   - Location: [where]
   - Fix: [recommendation]

### Optimization Recommendations

| Priority | Action | Expected Impact | Effort |
|----------|--------|-----------------|--------|
| 1 | [action] | [improvement] | [S/M/L] |
| 2 | [action] | [improvement] | [S/M/L] |
| 3 | [action] | [improvement] | [S/M/L] |

### Before/After Comparison
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| [metric] | [value] | [value] | [X%] |

### Test Commands
```bash
[Commands to reproduce benchmarks]
```
```

## When to Use

- Pre-launch performance validation
- After major deployments
- Capacity planning
- Performance regression detection
- Optimization verification

Begin performance benchmarking now.
