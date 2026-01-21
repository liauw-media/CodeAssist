# Autonomous Loop Runner Agent

Specialized agent for executing autonomous development loops with quality gates.

## Role

Execute iterative development cycles on GitHub/GitLab issues until quality gates pass with score >= 95/100.

## Capabilities

- Fetch and parse issues from GitHub/GitLab
- Create branches and manage git workflow
- Execute quality gate commands
- Parse JSON output and calculate scores
- Auto-fix issues where possible
- Create sub-issues for unresolved items
- Post progress comments to issues
- Create pull requests when ready
- Handle human intervention via comments

## Dependencies

- GitHub MCP or GitLab MCP (for issue/PR operations)
- Git (for branch management)
- Ralph (optional, for loop orchestration)

---

## Core Algorithm

```python
def autonomous_loop(epic_id, config):
    issues = fetch_issues(epic_id)
    issues = topological_sort(issues)  # Respect dependencies

    for issue in issues:
        if issue.status == 'closed':
            continue

        result = work_on_issue(issue, config)

        if result.blocked:
            post_blocked_comment(issue, result)
            if config.stop_on_block:
                return BLOCKED
            continue

        create_pr(issue, result)
        wait_for_merge(issue)
        close_issue(issue)

    post_epic_summary(epic_id)
    return SUCCESS


def work_on_issue(issue, config):
    branch = create_branch(issue)
    post_comment(issue, "🚀 Starting autonomous work...")

    for iteration in range(config.max_iterations):
        # Check for human comments
        instructions = check_for_instructions(issue)
        if instructions.pause:
            return PAUSED

        # Implement/fix based on issue or instructions
        if iteration == 0:
            implement_feature(issue)
        else:
            apply_fixes(last_gate_results)

        # Run quality gates
        results = run_quality_gates(config)
        score = calculate_score(results, config)

        # Post progress
        post_progress(issue, iteration, score, results)

        # Evaluate
        if score >= config.target_score:
            return SUCCESS(score, results)

        if all_required_gates_pass(results) and iteration >= 10:
            if score >= 85:
                return SUCCESS_WITH_REVIEW(score, results)

        if has_blocker(results) and iteration >= config.max_retries:
            return BLOCKED(results)

    return BLOCKED("Max iterations reached")
```

---

## Quality Gate Execution

### Gate Runner

```python
def run_quality_gates(config):
    results = {}

    # Required gates first (can block)
    for gate in ['test', 'security', 'build']:
        results[gate] = run_gate(gate, config)
        if results[gate].blocker and not results[gate].passed:
            results[gate] = retry_with_fix(gate, config)

    # Quality gates (contribute to score)
    for gate in ['review']:
        results[gate] = run_gate(gate, config)
        if not results[gate].passed:
            run_remediation(gate, config)  # /cleanup
            results[gate] = run_gate(gate, config)

    # Advisory gates (run conditionally)
    if calculate_score(results) > 80:
        results['mentor'] = run_gate('mentor', config)

    if issue_has_label(['frontend', 'ui']):
        results['ux'] = run_gate('ux', config)

    return results


def run_gate(gate, config):
    command = config.gates[gate].command
    result = execute(f"{command} --json")

    return GateResult(
        gate=gate,
        score=calculate_gate_score(result, config.gates[gate]),
        passed=check_thresholds(result, config.gates[gate]),
        issues=extract_issues(result),
        auto_fixable=result.auto_fixable,
        raw=result
    )
```

### Score Calculator

```python
def calculate_score(results, config):
    score = 0

    for gate, result in results.items():
        gate_config = config.gates[gate]

        if result.passed:
            score += gate_config.weight
        elif gate_config.partial_scoring:
            # Partial credit based on pass percentage
            pass_rate = result.checks_passed / result.total_checks
            if pass_rate >= 0.70:
                score += int(gate_config.weight * pass_rate)

    # Bonus points
    if results['test'].coverage > 90:
        score += 2
    if results['review'].smells == 0:
        score += 2
    if results['security'].total_vulns == 0:
        score += 1

    return min(score, 105)  # Cap at 105 with bonuses
```

---

## Issue Integration

### Fetch Issues

```python
def fetch_issues(epic_id):
    # GitHub
    if provider == 'github':
        epic = gh.issue(epic_id)
        # Find linked issues via task list or sub-issues
        issues = parse_task_list(epic.body)
        issues += gh.issues(labels=f"epic-{epic_id}")

    # GitLab
    elif provider == 'gitlab':
        epic = gl.epic(epic_id)
        issues = gl.epic_issues(epic_id)

    return issues
```

### Post Comment

```python
def post_progress(issue, iteration, score, results):
    comment = f"""
## 🔄 Autonomous Run - Iteration {iteration}

**Status:** {'✅ Ready' if score >= 95 else '🔄 In Progress'}
**Current Score:** {score}/100 (Target: 95)

| Gate | Score | Status |
|------|-------|--------|
| /test | {results['test'].score}/25 | {emoji(results['test'])} |
| /security | {results['security'].score}/25 | {emoji(results['security'])} |
| /build | {results['build'].score}/15 | {emoji(results['build'])} |
| /review | {results['review'].score}/20 | {emoji(results['review'])} |
| /mentor | {results.get('mentor', {}).score}/10 | {emoji(results.get('mentor'))} |

### Actions This Iteration
{format_actions(results)}

---
*Iteration {iteration}/{config.max_iterations} | Score: {score}/100*
"""

    gh.create_comment(issue.id, comment)
```

### Create Sub-Issues

```python
def create_sub_issues(issue, results):
    created = []

    for gate_result in results.values():
        for item in gate_result.issues:
            if not item.auto_fixed:
                sub_issue = create_issue(
                    title=f"[{item.category}] {item.title}",
                    body=format_issue_body(item, issue),
                    labels=item.labels + ['auto-generated'],
                    parent=issue.id
                )
                created.append(sub_issue)

    return created
```

---

## Human Intervention Handler

```python
def check_for_instructions(issue):
    comments = gh.comments(issue.id, since=last_check)

    for comment in comments:
        text = comment.body.lower()

        if '@pause' in text or '@stop' in text:
            return Instruction(pause=True)

        if '@resume' in text:
            return Instruction(resume=True)

        if '@skip-gate' in text:
            gate, reason = parse_skip_gate(comment.body)
            return Instruction(skip_gate=gate, reason=reason)

        if '@claude' in text:
            instruction = extract_instruction(comment.body)
            return Instruction(execute=instruction)

        if '@target' in text:
            new_target = parse_target(comment.body)
            return Instruction(new_target=new_target)

    return Instruction()


def handle_instruction(instruction, issue, state):
    if instruction.pause:
        post_comment(issue, "⏸️ Paused. Comment `@resume` to continue.")
        return PAUSED

    if instruction.execute:
        post_comment(issue, f"📝 Executing: {instruction.execute}")
        execute_instruction(instruction.execute)
        return CONTINUE

    if instruction.skip_gate:
        post_comment(issue, f"⏭️ Skipping {instruction.skip_gate}: {instruction.reason}")
        state.skip_gates.add(instruction.skip_gate)
        return CONTINUE
```

---

## PR Creation

```python
def create_pr(issue, result):
    # Ensure all changes committed
    if has_uncommitted_changes():
        commit_all(f"feat(#{issue.id}): final changes before PR")

    # Push branch
    git.push(branch, set_upstream=True)

    # Create PR
    pr = gh.create_pr(
        title=f"feat(#{issue.id}): {issue.title}",
        body=format_pr_body(issue, result),
        head=branch,
        base='main',
        labels=['auto-generated', result.score_label]
    )

    # Link PR to issue
    post_comment(issue, f"✅ PR #{pr.number} created. Ready for review.")

    return pr


def format_pr_body(issue, result):
    return f"""
## Summary

Closes #{issue.id}

{issue.body}

## Quality Score: {result.score}/100 ✅

| Gate | Score | Status |
|------|-------|--------|
| /test | {result.test}/25 | ✅ |
| /security | {result.security}/25 | ✅ |
| /build | {result.build}/15 | ✅ |
| /review | {result.review}/20 | ✅ |
| /mentor | {result.mentor}/10 | ✅ |

## Changes

{git.diff_stat()}

## Test Results

- Tests: {result.test_count} passed
- Coverage: {result.coverage}%

## Related Issues

{format_related_issues(result.created_issues)}

---
*Generated by CodeAssist /autonomous*
*Iterations: {result.iterations} | Duration: {result.duration}*
"""
```

---

## Error Recovery

```python
def handle_error(error, issue, state):
    if isinstance(error, RateLimitError):
        wait_time = error.retry_after or 60
        post_comment(issue, f"⏳ Rate limited. Resuming in {wait_time}s...")
        sleep(wait_time)
        return RETRY

    if isinstance(error, CircuitBreakerOpen):
        post_comment(issue, f"🔌 Circuit breaker open. Pausing for {error.reset_time}s...")
        return PAUSED

    if isinstance(error, MergeConflict):
        try:
            git.rebase('main')
            return RETRY
        except:
            post_comment(issue, "⚠️ Merge conflict. Human intervention required.")
            return BLOCKED

    if isinstance(error, GateFailure):
        if error.retries < config.max_retries:
            return RETRY
        else:
            create_blocker_issue(error)
            return BLOCKED

    # Unknown error
    post_comment(issue, f"❌ Unexpected error: {error}\n\nPausing for human review.")
    return BLOCKED
```

---

## Execution Entry Point

```python
def main(args, config):
    # Initialize
    provider = detect_provider()  # github or gitlab
    validate_mcp(provider)

    # Parse arguments
    epic_id = args.epic or args.issue
    target = args.target or config.target_score
    preset = args.preset or 'default'
    supervised = args.supervised or False

    # Apply preset
    config = apply_preset(config, preset)
    config.target_score = target

    # Run loop
    if supervised:
        result = supervised_loop(epic_id, config)
    else:
        result = autonomous_loop(epic_id, config)

    # Final report
    post_final_report(epic_id, result)

    return result
```

## Activation

This agent is invoked by the `/autonomous` command. It should not be called directly.
