# E2E Testing

Create or run end-to-end tests with Playwright/Cypress.

## Task
$ARGUMENTS

## Agent Protocol

Deploy the **e2e-runner** agent.

### Pre-Flight

1. **Read the agent**: `agents/e2e-runner.md`
2. **Check framework**: Playwright, Cypress, or other
3. **Identify flows**: What user journeys to test

### Execute

1. **Analyze** - Understand the user flow
2. **Design** - Plan test cases (happy path, errors, edge cases)
3. **Implement** - Write robust, maintainable tests
4. **Run** - Execute and report results

### Best Practices

- Use `data-testid` selectors for stability
- Avoid `sleep()` - use proper waits
- Make tests independent (no order dependency)
- Clean up test data after runs

### Output Format

```
## E2E Test: [Flow Name]

### Test Cases
1. [Happy path test]
2. [Error case test]
3. [Edge case test]

### Results
| Test | Status |
|------|--------|
| [name] | PASS/FAIL |

### Next Steps
[Additional coverage needed]
```

Execute the e2e-runner agent now.
