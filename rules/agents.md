# Agent Delegation Rules

**These rules guide when and how to delegate to specialized agents.**

## When to Delegate

| Task Type | Agent | When |
|-----------|-------|------|
| Planning features | `planner` | Before implementing anything non-trivial |
| System design | `architect` | Infrastructure, scaling, design decisions |
| Code review | `code-reviewer` | Before merging any PR |
| Security audit | `security-reviewer` | Auth changes, API endpoints, data handling |
| Build errors | `build-error-resolver` | Compilation/runtime errors |
| E2E testing | `e2e-runner` | UI flows, integration tests |
| Dead code cleanup | `refactor-cleaner` | After features, before release |

## Delegation Decision Framework

```
Is the task complex enough to benefit from specialized focus?
├── YES → Delegate to appropriate agent
└── NO → Handle directly

Does the task require deep domain expertise?
├── YES → Delegate (security, architecture, testing)
└── NO → Handle directly

Would delegation improve quality or catch issues?
├── YES → Delegate (code review, security review)
└── NO → Handle directly
```

## Agent Communication Protocol

1. **Clear handoff**: Specify exactly what the agent should do
2. **Provide context**: Include relevant files, requirements, constraints
3. **Define done**: What does success look like?
4. **Review output**: Verify agent's work before accepting

## NEVER Delegate

- Simple fixes (typos, small bugs)
- Tasks requiring conversation context
- Tasks the user explicitly wants YOU to do
- Trivial operations (file reads, simple edits)

## ALWAYS Delegate

- Security reviews for auth/payment code
- Architecture decisions for new systems
- Code reviews before PR creation
- E2E test creation for critical flows

## Agent Output Verification

After receiving agent output:

```
✓ Output addresses the original task
✓ Recommendations are actionable
✓ No hallucinated files or functions
✓ Code changes are syntactically valid
✓ Security recommendations are followed
```
