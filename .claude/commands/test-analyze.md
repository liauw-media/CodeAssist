# Test Results Analyzer

Comprehensive test failure analysis, pattern detection, and actionable fix recommendations.

## Analysis Task
$ARGUMENTS

## Core Philosophy

### Evidence-Based Analysis
- Stack traces tell the story
- Patterns reveal root causes
- History predicts recurrence
- Metrics guide prioritization

### Analysis Targets
| Metric | Target |
|--------|--------|
| Root cause accuracy | >90% |
| Fix success rate | >85% |
| Analysis time | <5 min |
| Pattern detection | All recurring failures |

## Test Failure Categories

### 1. Environment Failures
```
Symptoms:
- Tests pass locally, fail in CI
- Intermittent failures
- Timeout errors
- Connection refused

Common Causes:
- Missing environment variables
- Database not ready
- Service dependencies unavailable
- Resource constraints (memory/CPU)

Investigation:
1. Check CI environment variables
2. Verify service health checks
3. Review resource usage metrics
4. Compare local vs CI configuration
```

### 2. Assertion Failures
```
Symptoms:
- Expected vs actual mismatch
- Consistent failures
- Specific test cases

Common Causes:
- Code changes broke expectations
- Test data changed
- Business logic updated
- Timing/race conditions

Investigation:
1. Review recent code changes
2. Check test data fixtures
3. Verify business requirements
4. Add debugging output
```

### 3. Flaky Tests
```
Symptoms:
- Random pass/fail
- Timing-dependent
- Order-dependent
- Works in isolation

Common Causes:
- Race conditions
- Shared state between tests
- Network timeouts
- Date/time dependencies

Investigation:
1. Run test in isolation
2. Run test suite multiple times
3. Check for shared state
4. Review async operations
```

### 4. Performance Failures
```
Symptoms:
- Timeout errors
- Slow test execution
- Memory errors

Common Causes:
- N+1 queries
- Missing indexes
- Large test data
- Inefficient algorithms

Investigation:
1. Profile test execution
2. Check database queries
3. Review memory usage
4. Optimize test data
```

## Analysis Framework

### Step 1: Categorize Failures
```bash
# Group by error type
grep -h "FAIL\|ERROR" test-results.log | sort | uniq -c | sort -rn

# Find most common stack traces
grep -A 10 "Error:" test-results.log | sort | uniq -c | sort -rn | head -20
```

### Step 2: Pattern Detection
```
Look for:
- Same file failing multiple tests
- Same assertion type across tests
- Time-based patterns (only fails at midnight)
- Environment-based patterns (only fails in CI)
```

### Step 3: Root Cause Analysis
```
5 Whys Technique:
1. Why did the test fail? → Assertion mismatch
2. Why was there a mismatch? → Return value changed
3. Why did the return value change? → New validation added
4. Why wasn't test updated? → No test coverage for new code
5. Why no coverage? → Feature developed without TDD
```

### Step 4: Fix Prioritization
| Priority | Criteria |
|----------|----------|
| Critical | Blocks deployment, affects many tests |
| High | Core functionality, frequent occurrence |
| Medium | Feature-specific, workaround exists |
| Low | Edge case, rarely triggered |

## Common Fix Patterns

### Database Issues
```typescript
// Problem: Tests polluting each other
// Fix: Use transactions with rollback
beforeEach(async () => {
  await db.beginTransaction();
});

afterEach(async () => {
  await db.rollback();
});
```

### Async Issues
```typescript
// Problem: Test completes before async operation
// Fix: Proper async/await handling
it('should save user', async () => {
  await user.save();  // Don't forget await!
  const found = await User.find(user.id);
  expect(found).toBeDefined();
});
```

### Timing Issues
```typescript
// Problem: Time-dependent tests
// Fix: Mock the clock
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2024-01-15'));
});

afterEach(() => {
  jest.useRealTimers();
});
```

### Flaky Network Tests
```typescript
// Problem: External service calls
// Fix: Mock external dependencies
jest.mock('./api-client', () => ({
  fetchData: jest.fn().mockResolvedValue({ data: 'mocked' })
}));
```

## CI/CD Integration

### Test Retry Strategy
```yaml
# GitHub Actions
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
    steps:
      - uses: nick-fields/retry@v2
        with:
          timeout_minutes: 10
          max_attempts: 3
          command: npm test
```

### Failure Reporting
```bash
# Generate JUnit report for CI
npm test -- --reporter=junit --output=test-results.xml

# Upload artifacts
- uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: test-results
    path: test-results.xml
```

## Output Format (MANDATORY)

```
## Test Analysis Report

### Summary
| Metric | Value |
|--------|-------|
| Total Tests | [X] |
| Passed | [X] |
| Failed | [X] |
| Skipped | [X] |
| Flaky | [X] |

### Failure Breakdown

| Category | Count | % of Failures |
|----------|-------|---------------|
| Environment | [X] | [X]% |
| Assertion | [X] | [X]% |
| Flaky | [X] | [X]% |
| Performance | [X] | [X]% |

### Critical Failures

**1. [Test Name]**
- File: `[path/to/test.spec.ts]`
- Error: `[error message]`
- Root Cause: [analysis]
- Fix: [recommendation]
- Priority: [Critical/High/Medium/Low]

**2. [Test Name]**
...

### Pattern Analysis

| Pattern | Affected Tests | Root Cause |
|---------|---------------|------------|
| [pattern] | [count] | [cause] |

### Recommendations

| Priority | Action | Impact |
|----------|--------|--------|
| 1 | [fix] | Fixes [X] tests |
| 2 | [fix] | Fixes [X] tests |
| 3 | [fix] | Fixes [X] tests |

### Quick Fixes
```bash
[Commands to fix common issues]
```

### Prevention
- [ ] [Measure to prevent recurrence]
- [ ] [Measure to prevent recurrence]
```

## When to Use

- After test suite failures
- Investigating flaky tests
- CI/CD debugging
- Test suite maintenance
- Code review of test changes

Begin test analysis now.
