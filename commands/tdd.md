# Test-Driven Development

Execute TDD workflow: Red-Green-Refactor cycle.

## Task
$ARGUMENTS

## TDD Protocol

You are now operating in **strict TDD mode**. Follow the Red-Green-Refactor cycle.

### Phase 1: RED (Write Failing Test)

```
╔═══════════════════════════════════════════════════════════╗
║  STEP 1: Write a test that FAILS                          ║
║  - Test describes the desired behavior                    ║
║  - Test is specific and focused                           ║
║  - Run test to confirm it FAILS (not errors, FAILS)       ║
╚═══════════════════════════════════════════════════════════╝
```

1. **Understand the requirement** - What should the code do?
2. **Write the test first** - Before any implementation
3. **Run the test** - Confirm it fails for the right reason
4. **Commit** - `test: add failing test for [feature]`

### Phase 2: GREEN (Make It Pass)

```
╔═══════════════════════════════════════════════════════════╗
║  STEP 2: Write MINIMAL code to pass                       ║
║  - Only enough code to make the test pass                 ║
║  - No extra features, no "while I'm here" changes         ║
║  - Ugly code is OK at this stage                          ║
╚═══════════════════════════════════════════════════════════╝
```

1. **Write minimal implementation** - Just enough to pass
2. **Run the test** - Confirm it passes
3. **Run all tests** - Ensure no regressions
4. **Commit** - `feat: implement [feature]`

### Phase 3: REFACTOR (Improve)

```
╔═══════════════════════════════════════════════════════════╗
║  STEP 3: Clean up while tests stay GREEN                  ║
║  - Remove duplication                                     ║
║  - Improve naming                                         ║
║  - Simplify logic                                         ║
║  - Tests must pass after EVERY change                     ║
╚═══════════════════════════════════════════════════════════╝
```

1. **Identify improvements** - Code smells, duplication
2. **Make ONE change** - Small, atomic refactoring
3. **Run tests** - Must still pass
4. **Repeat** - Until code is clean
5. **Commit** - `refactor: clean up [feature]`

## Coverage Requirement

**Minimum 80% coverage** for new code.

```bash
# Check coverage
npm test -- --coverage
pytest --cov=.
vendor/bin/pest --coverage
```

## TDD Checklist

Before each cycle:
- [ ] Test describes behavior, not implementation
- [ ] Test name is descriptive: `test_user_can_login_with_valid_credentials`
- [ ] Test follows Arrange-Act-Assert pattern

During GREEN phase:
- [ ] Implementation is minimal
- [ ] No premature optimization
- [ ] No "extra" features added

During REFACTOR phase:
- [ ] Tests pass after EVERY change
- [ ] Changes are atomic
- [ ] No behavior changes

## Output Format

```
## TDD Session: [Task]

### Cycle 1: [Feature/Behavior]

#### RED Phase
**Test:** `test_[description]`
**Location:** [file:line]
**Status:** FAILING ❌
**Failure reason:** [expected vs actual]

#### GREEN Phase
**Implementation:** [brief description]
**Location:** [file:line]
**Status:** PASSING ✅

#### REFACTOR Phase
**Changes:**
- [refactoring 1]
- [refactoring 2]
**Status:** PASSING ✅

### Cycle 2: [Next Feature]
...

### Summary
| Metric | Value |
|--------|-------|
| Tests written | X |
| Tests passing | X |
| Coverage | X% |
| Cycles completed | X |

### Next Steps
[Continue with next behavior or "TDD session complete"]
```

## Execute TDD Now

Begin the Red-Green-Refactor cycle for the specified task.
