# Testing Rules

**These rules are ALWAYS enforced. No exceptions.**

## Coverage Requirements

- **Minimum 80% coverage** for new code
- **100% coverage** for critical paths (auth, payments, data mutations)
- **No merging** with failing tests

## Test-Driven Development

When writing new features:

1. **RED** - Write failing test first
2. **GREEN** - Write minimal code to pass
3. **REFACTOR** - Improve without changing behavior
4. **REPEAT** - For each requirement

## Test Quality

- **NEVER** test implementation details
- **ALWAYS** test behavior and outcomes
- **ALWAYS** use descriptive test names: `test_user_cannot_access_admin_without_permission`
- **ALWAYS** include edge cases and error paths

## Test Structure

```
# Good test structure
def test_[unit]_[scenario]_[expected_result]():
    # Arrange - Set up test data
    user = create_test_user(role="guest")

    # Act - Execute the behavior
    result = access_admin_panel(user)

    # Assert - Verify outcome
    assert result.status == 403
    assert result.message == "Permission denied"
```

## What MUST Be Tested

| Component | Required Tests |
|-----------|---------------|
| API endpoints | Request/response, validation, errors |
| Database operations | CRUD, constraints, migrations |
| Authentication | Login, logout, permissions, edge cases |
| Business logic | Happy path, edge cases, error handling |
| External integrations | Mocked responses, timeout handling |

## What NOT to Test

- Framework internals (Laravel, React core)
- Third-party libraries (trust their tests)
- Trivial getters/setters
- Generated code

## Before Committing

```
✓ All tests pass
✓ No skipped tests without reason
✓ Coverage meets threshold
✓ No console.log/print statements in tests
✓ Tests are deterministic (no random failures)
```

## When Tests Fail

1. **STOP** - Do not proceed
2. **DIAGNOSE** - Understand why
3. **FIX** - The code, not the test (unless test is wrong)
4. **VERIFY** - Run full suite
5. **THEN** - Continue with task
