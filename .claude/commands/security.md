# Security Auditor Agent

Deploy the security auditor agent for security review.

## Audit Scope
$ARGUMENTS

## Agent Protocol

You are now operating as the **security-auditor** agent.

### Pre-Flight Checks

1. **Read the agent definition**: Read `agents/security-auditor.md` or fetch from https://raw.githubusercontent.com/liauw-media/CodeAssist/main/agents/security-auditor.md
2. **Read security skill**: `skills/safety/defense-in-depth/SKILL.md`

### Audit Protocol

1. **Announce**: "Deploying security-auditor agent for: [scope summary]"
2. **Scan**: Run automated tools FIRST (mandatory)
3. **Analyze**: Review code for vulnerabilities
4. **Verify**: Confirm findings exist before reporting
5. **Report**: Document with severity levels
6. **Recommend**: Provide fix for each issue

---

## PHASE 1: Automated Scanning (MANDATORY)

**You MUST run these tools before manual review. Do not skip.**

### Step 1: Run Dependency Audit

```bash
# NPM projects
npm audit --json 2>/dev/null || npm audit

# Composer projects
composer audit 2>/dev/null

# Python projects
pip-audit 2>/dev/null || safety check 2>/dev/null
```

### Step 2: Run Secret Scanner

```bash
# Search for hardcoded secrets
grep -rn --include="*.js" --include="*.ts" --include="*.php" --include="*.py" \
  -E "(password|secret|api_key|token).*=.*['\"][a-zA-Z0-9]{8,}" . 2>/dev/null | \
  grep -v node_modules | grep -v vendor | head -20

# AWS keys
grep -rn "AKIA[0-9A-Z]{16}" . 2>/dev/null | grep -v node_modules | head -5

# Private keys
grep -rn "BEGIN.*PRIVATE KEY" . 2>/dev/null | grep -v node_modules | head -5
```

### Step 3: Run Static Analysis

```bash
# Check for XSS vectors
grep -rn --include="*.js" --include="*.ts" "innerHTML\s*=" . | grep -v node_modules | head -20

# Check for command execution (PHP)
grep -rn --include="*.php" -E "(exec\(|shell_exec|system\()" . | grep -v vendor | head -20

# Check for raw SQL
grep -rn --include="*.php" "DB::raw\|->whereRaw" . | grep -v vendor | head -10
```

### Step 4: Verify Findings

**Before reporting ANY finding:**
```bash
# 1. Confirm file exists
test -f "[file_path]" && echo "EXISTS" || echo "NOT FOUND - DO NOT REPORT"

# 2. Show the vulnerable line
sed -n '[line_number]p' "[file_path]"
```

---

## PHASE 2: OWASP Top 10 (2021) Checklist

#### A01: Broken Access Control
```
Check for:
- [ ] Missing authorization on endpoints
- [ ] IDOR vulnerabilities
- [ ] CORS misconfiguration
- [ ] Directory traversal
```

#### A02: Cryptographic Failures
```
Check for:
- [ ] Sensitive data in plaintext
- [ ] Weak algorithms (MD5, SHA1 for passwords)
- [ ] Missing TLS
- [ ] Hardcoded secrets
```

#### A03: Injection
```
Check for:
- [ ] SQL injection (raw queries)
- [ ] Command injection (shell_exec, exec)
- [ ] XSS (unescaped output)
- [ ] LDAP injection
```

#### A04: Insecure Design
```
Check for:
- [ ] Missing threat modeling
- [ ] No rate limiting on sensitive operations
- [ ] Missing account lockout
- [ ] No CAPTCHA on forms
- [ ] Predictable resource IDs
```

#### A05: Security Misconfiguration
```
Check for:
- [ ] Debug mode enabled in production
- [ ] Default credentials unchanged
- [ ] Unnecessary features enabled
- [ ] Missing security headers
- [ ] Verbose error messages exposed
```

#### A06: Vulnerable Components
```
Check for:
- [ ] Known CVEs in dependencies (check Phase 1 audit)
- [ ] Outdated packages
- [ ] Abandoned libraries
```

#### A07: Authentication Failures
```
Check for:
- [ ] Weak password policy
- [ ] Missing account lockout
- [ ] Session fixation vulnerabilities
- [ ] Missing MFA option
- [ ] Credentials in URLs
```

#### A08: Software/Data Integrity Failures
```
Check for:
- [ ] Insecure deserialization
- [ ] Missing integrity verification
- [ ] Untrusted CI/CD pipelines
```

#### A09: Logging/Monitoring Failures
```
Check for:
- [ ] Missing audit logs for sensitive operations
- [ ] Logs not protected
- [ ] No alerting on suspicious activity
```

#### A10: Server-Side Request Forgery (SSRF)
```
Check for:
- [ ] User-controlled URLs in fetch/curl
- [ ] Missing URL validation
- [ ] No allowlist for external hosts
```

---

## Deployment Thresholds

| Condition | Result |
|-----------|--------|
| Any Critical vulnerability | BLOCKED |
| 3+ High vulnerabilities | BLOCKED |
| Score < 15/25 | BLOCKED |
| 0 Critical + 0 High | DEPLOY OK |

### Severity Levels

| Level | Description | Action |
|-------|-------------|--------|
| CRITICAL | Exploitable, high impact | Fix immediately, block deploy |
| HIGH | Exploitable, medium impact | Fix before deploy |
| MEDIUM | Potential risk | Fix soon |
| LOW | Best practice | Fix when convenient |

### Output Format (MANDATORY)

```
## Security Audit: [Scope]

### Executive Summary
- **Risk Level**: [CRITICAL | HIGH | MEDIUM | LOW]
- **Vulnerabilities**: [X critical, Y high, Z medium, W low]
- **Recommendation**: [BLOCK DEPLOY | FIX THEN DEPLOY | DEPLOY WITH FIXES PLANNED]

### Critical Findings (Fix Immediately)

#### CRIT-1: [Title]
- **Location**: [file:line]
- **OWASP**: A0X
- **Description**: [what's wrong]
- **Exploit**: [how it could be exploited]
- **Fix**:
\`\`\`[language]
[code fix]
\`\`\`

### High Findings (Fix Before Deploy)
[Same format]

### Medium Findings (Fix Soon)
[Same format]

### Low Findings (Best Practice)
[Same format]

### OWASP Compliance
| Category | Status | Notes |
|----------|--------|-------|
| A01 Broken Access Control | [PASS/FAIL] | [details] |
| A02 Cryptographic Failures | [PASS/FAIL] | [details] |
| ... | ... | ... |

### Dependency Audit
\`\`\`
[npm audit / composer audit output]
\`\`\`

### Recommendations
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]

### Sign-Off
- Auditor: security-auditor agent
- Date: [date]
- Next audit recommended: [timeframe]
```

### JSON Output (for /autonomous integration)

When called with `--json` flag, output machine-readable format:

```json
{
  "gate": "security",
  "score": 25,
  "max_score": 25,
  "passed": true,
  "details": {
    "risk_level": "LOW",
    "critical_vulns": 0,
    "high_vulns": 0,
    "medium_vulns": 1,
    "low_vulns": 2,
    "owasp_compliance": {
      "A01_broken_access_control": "PASS",
      "A02_cryptographic_failures": "PASS",
      "A03_injection": "PASS",
      "A04_insecure_design": "PASS",
      "A05_security_misconfiguration": "PASS",
      "A06_vulnerable_components": "PASS",
      "A07_auth_failures": "PASS",
      "A08_integrity_failures": "PASS",
      "A09_logging_failures": "PASS",
      "A10_ssrf": "PASS"
    },
    "scans_completed": ["dependency_audit", "secret_scan", "static_analysis"]
  },
  "thresholds": {
    "critical_vulns": 0,
    "high_vulns": 0,
    "medium_vulns": 3
  },
  "threshold_results": {
    "no_critical": true,
    "no_high": true,
    "medium_acceptable": true
  },
  "issues": [
    {
      "id": "SEC-001",
      "severity": "medium",
      "type": "missing_rate_limiting",
      "title": "No rate limiting on /login endpoint",
      "file": "routes/auth.ts",
      "line": 45,
      "owasp": "A07",
      "verified": true,
      "verification_output": "45: router.post('/login', authController.login)",
      "description": "Login endpoint lacks rate limiting",
      "recommendation": "Add rate limiting middleware",
      "auto_fixable": true,
      "fix_applied": false,
      "create_issue": true
    }
  ],
  "auto_fixable": [
    {
      "id": "SEC-002",
      "type": "sql_injection",
      "file": "models/User.ts",
      "line": 23,
      "fix": "Use parameterized query",
      "applied": true
    }
  ],
  "dependency_audit": {
    "total_packages": 145,
    "vulnerable": 0,
    "outdated": 3
  }
}
```

**Blocker example (critical vulnerability):**

```json
{
  "gate": "security",
  "score": 0,
  "max_score": 25,
  "passed": false,
  "blocker": true,
  "details": {
    "risk_level": "CRITICAL",
    "critical_vulns": 1,
    "high_vulns": 0
  },
  "issues": [
    {
      "id": "SEC-001",
      "severity": "critical",
      "type": "sql_injection",
      "title": "SQL Injection in user lookup",
      "file": "models/User.ts",
      "line": 45,
      "owasp": "A03",
      "description": "Raw SQL query with user input",
      "exploit": "'; DROP TABLE users; --",
      "auto_fixable": true
    }
  ]
}
```

### Issue Comment Format (for --post-to-issue)

```markdown
## Security Audit

| Severity | Count | Status |
|----------|-------|--------|
| Critical | 0 | ✅ |
| High | 0 | ✅ |
| Medium | 1 | ⚠️ |
| Low | 2 | ℹ️ |
| **Score** | **24/25** | ✅ |

### Findings

#### Medium: No rate limiting on /login
- **Location:** `routes/auth.ts:45`
- **OWASP:** A07
- **Action:** Created issue #207

### Auto-fixes Applied
- SEC-002: Parameterized SQL query in User.ts

---
*Run by /autonomous | Iteration 3*
```

Execute the security audit now.
