#!/usr/bin/env npx ts-node
/**
 * Ralph Wiggum - Autonomous Development Runner
 * Powered by Claude Agent SDK
 *
 * Usage:
 *   npx ts-node ralph-runner.ts --issue=123
 *   npx ts-node ralph-runner.ts --epic=200
 *   npx ts-node ralph-runner.ts --issue=123 --preset=production
 *   npx ts-node ralph-runner.ts --issue=123 --supervised
 *   npx ts-node ralph-runner.ts --issue=123 --dry-run
 */

import {
  query,
  ClaudeAgentOptions,
  AgentDefinition,
  HookCallback,
} from "@anthropic-ai/claude-agent-sdk";
import { appendFileSync, readFileSync, existsSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import * as yaml from "yaml";

// ============================================
// CONSTANTS
// ============================================
const CONFIG_PATH = join(process.cwd(), ".claude", "autonomous.yml");
const AUDIT_LOG = join(process.cwd(), "autonomous-audit.log");
const METRICS_FILE = join(process.cwd(), "autonomous-metrics.json");
const STATE_FILE = join(process.cwd(), ".ralph-state.json");

// Scoring thresholds
const GATE_PASS_THRESHOLD = 0.8;
const PR_FALLBACK_SCORE = 85;
const BLOCKER_ITERATION_THRESHOLD = 5;
const SUPERVISED_PAUSE_MS = 30000;
const MAX_ISSUES_PER_GATE = 3;
const MAX_SCORE = 100;
const MAX_AUDIT_LOG_SIZE = 10 * 1024 * 1024; // 10MB

// Valid presets
const VALID_PRESETS = ["default", "production", "prototype", "frontend"] as const;

// ============================================
// TYPES
// ============================================
interface GateConfig {
  weight: number;
  required: boolean;
  auto_fix: boolean;
  command?: string;
  description?: string;
  thresholds?: Record<string, number>;
  parallel_group?: number;
}

interface AutonomousConfig {
  target_score: number;
  max_iterations: number;
  iteration_delay: number;
  gates: Record<string, GateConfig>;
  presets?: Record<string, Partial<AutonomousConfig>>;
  safety: {
    max_api_calls_per_hour: number;
    max_issues_created_per_run: number;
    forbidden: string[];
  };
  git_rules: {
    protected_branches: string[];
    commit_rules: {
      forbidden_patterns: string[];
      auto_strip: boolean;
    };
  };
}

interface GateResult {
  gate: string;
  score: number;
  maxScore: number;
  passed: boolean;
  issues: GateIssue[];
  duration: number;
  autoFixed: number;
}

interface GateIssue {
  severity: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  file?: string;
  line?: number;
  description: string;
  recommendation?: string;
  autoFixable: boolean;
}

interface IterationResult {
  iteration: number;
  totalScore: number;
  targetScore: number;
  gates: GateResult[];
  passed: boolean;
  duration: number;
  apiCalls: number;
}

interface RunState {
  runId: string;
  issueId: string;
  sessionId?: string;
  iteration: number;
  lastScore: number;
  createdIssues: string[];
  startTime: string;
  lastCheckpoint: string;
}

interface CircuitBreakerState {
  failures: number;
  lastFailure: number;
  isOpen: boolean;
}

// ============================================
// RUN CONTEXT (Eliminates Global State)
// ============================================
class RunContext {
  public readonly runId: string;
  public readonly config: AutonomousConfig;
  public readonly issueId: string;
  public readonly options: RunOptions;

  public sessionId?: string;
  public apiCallCount: number = 0;
  public iteration: number = 0;
  public issuesCreated: string[] = [];
  public filesModified: Set<string> = new Set();
  public autoFixesApplied: number = 0;
  public startTime: Date = new Date();

  private circuitBreaker: CircuitBreakerState = {
    failures: 0,
    lastFailure: 0,
    isOpen: false,
  };

  constructor(issueId: string, config: AutonomousConfig, options: RunOptions) {
    this.runId = `ralph-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    this.issueId = issueId;
    this.config = config;
    this.options = options;
  }

  // Rate limiting
  public checkRateLimit(): boolean {
    if (this.apiCallCount >= this.config.safety.max_api_calls_per_hour) {
      return false;
    }
    this.apiCallCount++;
    return true;
  }

  // Circuit breaker
  public recordFailure(): void {
    this.circuitBreaker.failures++;
    this.circuitBreaker.lastFailure = Date.now();
    if (this.circuitBreaker.failures >= 5) {
      this.circuitBreaker.isOpen = true;
      this.log("warn", "Circuit breaker OPEN - too many failures");
    }
  }

  public recordSuccess(): void {
    this.circuitBreaker.failures = 0;
    if (this.circuitBreaker.isOpen) {
      this.circuitBreaker.isOpen = false;
      this.log("info", "Circuit breaker CLOSED - recovered");
    }
  }

  public isCircuitOpen(): boolean {
    if (!this.circuitBreaker.isOpen) return false;

    // Check if cooldown period passed (5 minutes)
    const cooldownMs = 5 * 60 * 1000;
    if (Date.now() - this.circuitBreaker.lastFailure > cooldownMs) {
      this.circuitBreaker.isOpen = false;
      this.circuitBreaker.failures = 0;
      return false;
    }
    return true;
  }

  // Issue creation limit
  public canCreateIssue(): boolean {
    return this.issuesCreated.length < this.config.safety.max_issues_created_per_run;
  }

  // Structured logging
  public log(level: "info" | "warn" | "error" | "debug", message: string, data?: object): void {
    const entry = {
      timestamp: new Date().toISOString(),
      runId: this.runId,
      level,
      message,
      ...data,
    };

    if (level === "error") {
      console.error(JSON.stringify(entry));
    } else if (level === "warn") {
      console.warn(`   [WARN] ${message}`);
    } else if (level === "debug" && process.env.DEBUG) {
      console.log(`   [DEBUG] ${message}`);
    } else if (level === "info") {
      console.log(`   ${message}`);
    }
  }

  // State persistence for crash recovery
  public saveCheckpoint(): void {
    const state: RunState = {
      runId: this.runId,
      issueId: this.issueId,
      sessionId: this.sessionId,
      iteration: this.iteration,
      lastScore: 0,
      createdIssues: this.issuesCreated,
      startTime: this.startTime.toISOString(),
      lastCheckpoint: new Date().toISOString(),
    };
    writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  }

  public static loadCheckpoint(): RunState | null {
    if (!existsSync(STATE_FILE)) return null;
    try {
      return JSON.parse(readFileSync(STATE_FILE, "utf-8"));
    } catch {
      return null;
    }
  }

  // Metrics
  public getMetrics(): object {
    return {
      runId: this.runId,
      issueId: this.issueId,
      startTime: this.startTime.toISOString(),
      duration: Date.now() - this.startTime.getTime(),
      iterations: this.iteration,
      apiCalls: this.apiCallCount,
      issuesCreated: this.issuesCreated.length,
      autoFixesApplied: this.autoFixesApplied,
      filesModified: Array.from(this.filesModified),
    };
  }
}

interface RunOptions {
  preset?: string;
  supervised: boolean;
  dryRun: boolean;
}

// ============================================
// INPUT VALIDATION & SANITIZATION
// ============================================
function validateIssueId(input: string): string {
  // Must be numeric only (no shell metacharacters)
  if (!/^\d+$/.test(input)) {
    throw new Error(`Invalid issue ID: "${input}". Must be numeric.`);
  }
  return input;
}

function validatePreset(input: string | undefined): string | undefined {
  if (!input) return undefined;
  if (!VALID_PRESETS.includes(input as any)) {
    throw new Error(`Invalid preset: "${input}". Valid: ${VALID_PRESETS.join(", ")}`);
  }
  return input;
}

function sanitizeForShell(input: string): string {
  // Remove shell metacharacters
  return input.replace(/[;&|`$(){}[\]<>\\'"!#*?~\n\r]/g, "");
}

function sanitizeFilePath(input: string, projectRoot: string): string | null {
  const resolved = resolve(projectRoot, input);
  if (!resolved.startsWith(projectRoot)) {
    return null; // Path traversal attempt
  }
  return resolved;
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ============================================
// ENVIRONMENT VALIDATION
// ============================================
function validateEnvironment(): void {
  const required = ["ANTHROPIC_API_KEY"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("\n[ERROR] Missing required environment variables:");
    missing.forEach((key) => console.error(`  - ${key}`));
    console.error("\nSet them in your environment or .env file:");
    console.error("  export ANTHROPIC_API_KEY=your-api-key\n");
    process.exit(1);
  }

  // Warn about optional
  if (!process.env.GITHUB_TOKEN) {
    console.warn("[WARN] GITHUB_TOKEN not set - using gh CLI authentication");
  }
}

// ============================================
// CONFIGURATION
// ============================================
function loadConfig(preset?: string): AutonomousConfig {
  const defaultConfig: AutonomousConfig = {
    target_score: 95,
    max_iterations: 15,
    iteration_delay: 5,
    gates: {
      test: { weight: 25, required: true, auto_fix: true, parallel_group: 1 },
      security: { weight: 25, required: true, auto_fix: true, parallel_group: 1 },
      build: { weight: 15, required: true, auto_fix: true, parallel_group: 1 },
      review: { weight: 20, required: false, auto_fix: true, parallel_group: 2 },
      mentor: { weight: 10, required: false, auto_fix: false, parallel_group: 2 },
      ux: { weight: 5, required: false, auto_fix: false, parallel_group: 2 },
      architect: { weight: 0, required: false, auto_fix: false, parallel_group: 3 },
      devops: { weight: 0, required: false, auto_fix: false, parallel_group: 3 },
    },
    safety: {
      max_api_calls_per_hour: 100,
      max_issues_created_per_run: 10,
      forbidden: ["force_push", "push_to_main", "auto_merge"],
    },
    git_rules: {
      protected_branches: ["main", "master", "staging"],
      commit_rules: {
        forbidden_patterns: [
          "Co-Authored-By: Claude",
          "Co-Authored-By:.*anthropic",
          "Generated by Claude",
          "AI-generated",
        ],
        auto_strip: true,
      },
    },
  };

  if (existsSync(CONFIG_PATH)) {
    try {
      const fileContent = readFileSync(CONFIG_PATH, "utf-8");
      const fileConfig = yaml.parse(fileContent, { strict: true });

      // Validate config structure
      if (typeof fileConfig !== "object" || fileConfig === null) {
        throw new Error("Invalid config: must be an object");
      }

      // Deep merge with validation
      if (fileConfig.target_score !== undefined) {
        if (typeof fileConfig.target_score !== "number" || fileConfig.target_score < 0 || fileConfig.target_score > 100) {
          throw new Error("Invalid target_score: must be 0-100");
        }
        defaultConfig.target_score = fileConfig.target_score;
      }

      if (fileConfig.max_iterations !== undefined) {
        if (typeof fileConfig.max_iterations !== "number" || fileConfig.max_iterations < 1) {
          throw new Error("Invalid max_iterations: must be >= 1");
        }
        defaultConfig.max_iterations = fileConfig.max_iterations;
      }

      if (fileConfig.gates) {
        Object.assign(defaultConfig.gates, fileConfig.gates);
      }

      if (fileConfig.presets) {
        defaultConfig.presets = fileConfig.presets;
      }

    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      console.warn(`[WARN] Config error: ${message}. Using defaults.`);
    }
  }

  // Apply validated preset
  const validatedPreset = validatePreset(preset);
  if (validatedPreset && defaultConfig.presets?.[validatedPreset]) {
    Object.assign(defaultConfig, defaultConfig.presets[validatedPreset]);
  }

  return defaultConfig;
}

// ============================================
// QUALITY GATE SUBAGENTS
// ============================================
const qualityGateAgents: Record<string, AgentDefinition> = {
  "test-runner": {
    description: "Run tests and report coverage",
    prompt: `You are a test execution specialist. Run the project's test suite.

STEPS:
1. Detect test framework (jest, pytest, phpunit, cargo test, go test)
2. Run tests with coverage
3. Parse results

OUTPUT JSON ONLY:
{
  "passed": boolean,
  "total": number,
  "failed": number,
  "skipped": number,
  "coverage": number,
  "failures": [{ "test": string, "error": string, "file": string }],
  "score": number
}

SCORING:
- All tests pass: +20 points
- Coverage >= 80%: +5 points
- Coverage >= 90%: +2 bonus
- Each failure: -5 points (min 0)`,
    tools: ["Bash", "Read", "Glob"],
  },

  "security-auditor": {
    description: "Security vulnerability scanner",
    prompt: `You are a security auditor. Scan for vulnerabilities.

CHECK FOR:
1. Hardcoded secrets (API keys, passwords, tokens)
2. SQL injection risks (string concatenation in queries)
3. XSS vulnerabilities (unescaped output)
4. Command injection (user input in shell commands)
5. Insecure dependencies (npm audit, composer audit)
6. Weak cryptography (MD5, SHA1 for passwords)

OUTPUT JSON ONLY:
{
  "critical": number,
  "high": number,
  "medium": number,
  "low": number,
  "issues": [{
    "severity": "critical|high|medium|low",
    "title": string,
    "file": string,
    "line": number,
    "description": string,
    "recommendation": string,
    "autoFixable": boolean
  }],
  "score": number
}

SCORING: Base 25, Critical=-25, High=-10, Medium=-1 each`,
    tools: ["Read", "Grep", "Glob", "Bash"],
  },

  "build-fixer": {
    description: "Build and fix compilation errors",
    prompt: `You are a build specialist. Build the project and fix errors.

STEPS:
1. Detect build system (npm, composer, cargo, go, make)
2. Run build command
3. If fails, analyze errors and fix
4. Retry up to 5 times

OUTPUT JSON ONLY:
{
  "success": boolean,
  "errors": [{ "message": string, "file": string, "line": number }],
  "fixed": [{ "error": string, "fix": string }],
  "attempts": number,
  "score": number
}

SCORING: Build succeeds = 15, fails = 0`,
    tools: ["Bash", "Read", "Edit", "Glob"],
  },

  "code-reviewer": {
    description: "Code quality and style review",
    prompt: `You are a code review specialist. Review for quality issues.

CHECK FOR:
1. Code smells (long functions, deep nesting, magic numbers)
2. Duplication (copy-paste code)
3. Complexity (cyclomatic complexity > 10)
4. Naming (unclear variable/function names)
5. Dead code (unused variables, unreachable code)

OUTPUT JSON ONLY:
{
  "smells": number,
  "duplication_percent": number,
  "complexity_issues": [{ "function": string, "file": string, "complexity": number }],
  "fixable": [{ "issue": string, "file": string, "fix": string }],
  "unfixable": [{ "issue": string, "file": string, "recommendation": string }],
  "fixed_count": number,
  "score": number
}

SCORING: Base 20, -2 per smell, -5 if duplication > 5%`,
    tools: ["Read", "Edit", "Glob", "Grep", "Bash"],
  },

  "mentor-advisor": {
    description: "Architecture and design review",
    prompt: `You are a senior architect mentor. Review architecture decisions.

EVALUATE:
1. SOLID principles adherence
2. Design patterns usage
3. Separation of concerns
4. Scalability considerations
5. Technical debt

DO NOT auto-fix. Only advise.

OUTPUT JSON ONLY:
{
  "concerns": [{
    "category": "architecture|patterns|scalability|performance|debt",
    "severity": "high|medium|low",
    "title": string,
    "description": string,
    "recommendation": string,
    "effort": "low|medium|high"
  }],
  "strengths": [string],
  "recommendations": [string],
  "score": number
}

SCORING: Base 10, High concern=-3, Medium=-1`,
    tools: ["Read", "Glob", "Grep"],
  },

  "ux-reviewer": {
    description: "UX and accessibility review",
    prompt: `You are a UX specialist. Review accessibility and UX.

CHECK FOR:
1. Accessibility (WCAG 2.1 AA - alt text, ARIA, keyboard nav)
2. Responsive design
3. Loading states
4. Error messages
5. Form validation UX

APPLIES TO: tsx, jsx, vue, html, css files

OUTPUT JSON ONLY:
{
  "a11y_issues": [{ "rule": string, "element": string, "file": string, "fix": string }],
  "ux_issues": [{ "type": string, "description": string, "file": string }],
  "responsive_ok": boolean,
  "score": number
}

SCORING: Base 5, -1 per a11y violation, -1 per major UX issue`,
    tools: ["Read", "Glob", "Grep"],
  },

  "architect-advisor": {
    description: "System architecture and security hardening advisor",
    prompt: `You are a system architect specializing in security and performance.

ANALYZE:
1. Authentication/authorization design
2. API security (rate limiting, input validation)
3. Data flow and privacy
4. Infrastructure security posture
5. Caching strategy
6. Database query optimization

OUTPUT JSON ONLY:
{
  "security_posture": "strong|adequate|weak",
  "performance_rating": "optimized|acceptable|needs_work",
  "findings": [{
    "category": "security|performance|scalability|reliability",
    "severity": "critical|high|medium|low",
    "title": string,
    "current_state": string,
    "recommendation": string,
    "implementation_effort": "hours|days|weeks"
  }],
  "quick_wins": [string],
  "roadmap": [{ "phase": string, "items": [string] }]
}`,
    tools: ["Read", "Glob", "Grep"],
  },

  "devops-advisor": {
    description: "CI/CD and infrastructure review",
    prompt: `You are a DevOps engineer. Review deployment and infrastructure.

ANALYZE:
1. CI/CD pipeline configuration
2. Docker/container setup
3. Environment configuration
4. Secrets management
5. Monitoring and logging

CHECK FILES: .github/workflows/, Dockerfile, docker-compose.yml, terraform/, k8s/

OUTPUT JSON ONLY:
{
  "ci_cd_health": "healthy|needs_attention|broken",
  "container_health": "optimized|acceptable|needs_work|missing",
  "findings": [{
    "category": "ci_cd|containers|secrets|monitoring|deployment",
    "severity": "critical|high|medium|low",
    "title": string,
    "description": string,
    "recommendation": string
  }],
  "missing_essentials": [string],
  "recommendations": [string]
}`,
    tools: ["Read", "Glob", "Grep"],
  },
};

// ============================================
// HOOKS (Using Context, Not Globals)
// ============================================
function createAuditHook(ctx: RunContext): HookCallback {
  return async (input) => {
    const toolInput = (input as any).tool_input || {};
    const filePath = toolInput.file_path || toolInput.path;

    // Validate file path if present
    if (filePath) {
      const sanitized = sanitizeFilePath(filePath, process.cwd());
      if (!sanitized) {
        ctx.log("warn", `Blocked path traversal attempt: ${filePath}`);
        return { decision: "block", message: "Path traversal blocked" };
      }
      ctx.filesModified.add(sanitized);
    }

    // Rotate audit log if too large
    if (existsSync(AUDIT_LOG)) {
      const stats = require("fs").statSync(AUDIT_LOG);
      if (stats.size > MAX_AUDIT_LOG_SIZE) {
        const rotatedPath = `${AUDIT_LOG}.${Date.now()}`;
        require("fs").renameSync(AUDIT_LOG, rotatedPath);
      }
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      runId: ctx.runId,
      tool: (input as any).tool,
      file: filePath,
      command: toolInput.command?.substring(0, 100),
    };

    appendFileSync(AUDIT_LOG, JSON.stringify(logEntry) + "\n");
    return {};
  };
}

function createGitBlockHook(ctx: RunContext): HookCallback {
  return async (input) => {
    const command = ((input as any).tool_input?.command || "").toLowerCase();

    // Block direct push to protected branches (case-insensitive)
    for (const branch of ctx.config.git_rules.protected_branches) {
      const pattern = new RegExp(`git\\s+push.*${escapeRegex(branch)}`, "i");
      if (pattern.test(command)) {
        ctx.log("warn", `Blocked push to ${branch}`);
        return {
          decision: "block",
          message: `[BLOCKED] Direct push to ${branch}. Use PR workflow.`,
        };
      }
    }

    // Block force push
    if (/git\s+push.*--force/i.test(command)) {
      return { decision: "block", message: "[BLOCKED] Force push is forbidden." };
    }

    // Block hard reset
    if (/git\s+reset\s+--hard/i.test(command)) {
      return { decision: "block", message: "[BLOCKED] Hard reset requires manual confirmation." };
    }

    return {};
  };
}

function createAttributionStripHook(ctx: RunContext): HookCallback {
  return async (input) => {
    const command = (input as any).tool_input?.command || "";

    if (!command.toLowerCase().includes("git commit")) {
      return {};
    }

    let sanitizedCommand = command;
    for (const pattern of ctx.config.git_rules.commit_rules.forbidden_patterns) {
      sanitizedCommand = sanitizedCommand.replace(new RegExp(pattern, "gi"), "");
    }

    if (sanitizedCommand !== command) {
      ctx.log("info", "Stripped AI attribution from commit");
      return {
        decision: "modify",
        tool_input: { command: sanitizedCommand },
      };
    }

    return {};
  };
}

function createRateLimitHook(ctx: RunContext): HookCallback {
  return async () => {
    if (!ctx.checkRateLimit()) {
      return {
        decision: "block",
        message: "[RATE LIMIT] API call limit exceeded. Pausing for cooldown.",
      };
    }

    if (ctx.isCircuitOpen()) {
      return {
        decision: "block",
        message: "[CIRCUIT OPEN] Too many failures. Waiting for cooldown.",
      };
    }

    return {};
  };
}

// ============================================
// GATE EXECUTION
// ============================================
async function runGatesInParallel(
  gates: string[],
  ctx: RunContext
): Promise<GateResult[]> {
  const results: GateResult[] = [];

  // Group gates by parallel_group
  const groups = new Map<number, string[]>();
  for (const gate of gates) {
    const group = ctx.config.gates[gate]?.parallel_group || 0;
    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group)!.push(gate);
  }

  const sortedGroups = Array.from(groups.keys()).sort();

  for (const groupNum of sortedGroups) {
    const groupGates = groups.get(groupNum)!;
    ctx.log("info", `[Group ${groupNum}] Running: ${groupGates.join(", ")}`);

    const groupPromises = groupGates.map((gate) => runSingleGate(gate, ctx));
    const groupResults = await Promise.all(groupPromises);
    results.push(...groupResults);

    // Check for blockers before next group
    const blockers = groupResults.filter(
      (r) => ctx.config.gates[r.gate]?.required && !r.passed
    );

    if (blockers.length > 0) {
      ctx.log("warn", `Required gate(s) failed: ${blockers.map((b) => b.gate).join(", ")}`);
      ctx.recordFailure();
      break;
    } else {
      ctx.recordSuccess();
    }
  }

  return results;
}

async function runSingleGate(gateName: string, ctx: RunContext): Promise<GateResult> {
  const startTime = Date.now();
  const gateConfig = ctx.config.gates[gateName];

  const result: GateResult = {
    gate: gateName,
    score: 0,
    maxScore: gateConfig.weight,
    passed: false,
    issues: [],
    duration: 0,
    autoFixed: 0,
  };

  const agentName = getAgentNameForGate(gateName);

  try {
    for await (const message of query({
      prompt: `Use the ${agentName} agent to evaluate this codebase. Return only valid JSON.`,
      options: {
        resume: ctx.sessionId,
        allowedTools: ["Task", "Read", "Glob", "Grep", "Bash", "Edit"],
        agents: qualityGateAgents,
        permissionMode: gateConfig.auto_fix ? "acceptEdits" : "bypassPermissions",
      },
    })) {
      if ("result" in message) {
        try {
          const parsed = JSON.parse(extractJson(message.result));
          result.score = Math.min(parsed.score || 0, gateConfig.weight);
          result.passed = gateConfig.required
            ? result.score >= gateConfig.weight * GATE_PASS_THRESHOLD
            : true;
          result.issues = (parsed.issues || parsed.findings || []).slice(0, 50); // Limit
          result.autoFixed = parsed.fixed_count || parsed.fixed?.length || 0;
          ctx.autoFixesApplied += result.autoFixed;
        } catch (e) {
          ctx.log("error", `Failed to parse ${gateName} result`, { error: String(e) });
        }
      }
    }
  } catch (e) {
    ctx.log("error", `Gate ${gateName} execution failed`, { error: String(e) });
    ctx.recordFailure();
  }

  result.duration = Date.now() - startTime;
  return result;
}

function getAgentNameForGate(gate: string): string {
  const mapping: Record<string, string> = {
    test: "test-runner",
    security: "security-auditor",
    build: "build-fixer",
    review: "code-reviewer",
    mentor: "mentor-advisor",
    ux: "ux-reviewer",
    architect: "architect-advisor",
    devops: "devops-advisor",
  };
  return mapping[gate] || `${gate}-runner`;
}

function extractJson(text: string): string {
  const jsonMatch = text.match(/```json?\s*([\s\S]*?)```/);
  if (jsonMatch) return jsonMatch[1].trim();

  const braceMatch = text.match(/\{[\s\S]*\}/);
  if (braceMatch) return braceMatch[0];

  return text;
}

// ============================================
// ISSUE INTEGRATION (Sanitized)
// ============================================
async function createSubIssue(
  parentIssue: string,
  gateIssue: GateIssue,
  gateName: string,
  ctx: RunContext
): Promise<string | null> {
  if (!ctx.canCreateIssue()) {
    ctx.log("warn", "Issue creation limit reached");
    return null;
  }

  // Sanitize all user-controllable content
  const title = sanitizeForShell(`[${gateName.toUpperCase()}] ${gateIssue.title}`).slice(0, 100);
  const labels = ["auto-generated", gateName, gateIssue.severity].join(",");

  const body = `## ${gateIssue.severity.toUpperCase()}: ${sanitizeForShell(gateIssue.title)}

**Found by:** \`/${gateName}\` gate
**File:** ${sanitizeForShell(gateIssue.file || "N/A")}
**Auto-fixable:** ${gateIssue.autoFixable ? "Yes" : "No"}

### Description
${sanitizeForShell(gateIssue.description).slice(0, 500)}

### Recommendation
${sanitizeForShell(gateIssue.recommendation || "Review and address manually.").slice(0, 500)}

---
*Auto-generated by CodeAssist Ralph runner*
*Parent issue: #${parentIssue}*`;

  try {
    for await (const message of query({
      prompt: `Create a GitHub issue. Title: "${title}". Labels: "${labels}". Use gh issue create command with proper escaping.`,
      options: {
        resume: ctx.sessionId,
        allowedTools: ["Bash"],
      },
    })) {
      if ("result" in message) {
        const issueMatch = message.result.match(/#(\d+)/);
        if (issueMatch) {
          ctx.issuesCreated.push(issueMatch[1]);
          return issueMatch[1];
        }
      }
    }
  } catch (e) {
    ctx.log("error", "Failed to create sub-issue", { error: String(e) });
  }

  return null;
}

async function postToIssue(issueId: string, body: string, ctx: RunContext): Promise<void> {
  // Sanitize body for shell safety
  const sanitizedBody = sanitizeForShell(body).slice(0, 5000);

  try {
    for await (const _ of query({
      prompt: `Post a comment to GitHub issue #${issueId}. Use gh issue comment with proper escaping for the body content.`,
      options: {
        resume: ctx.sessionId,
        allowedTools: ["Bash"],
      },
    })) {
      // Comment posted
    }
  } catch (e) {
    ctx.log("error", "Failed to post to issue", { error: String(e) });
  }
}

// ============================================
// PROGRESS REPORTING
// ============================================
function generateProgressReport(result: IterationResult, ctx: RunContext): string {
  const gateRows = result.gates
    .map((g) => {
      const status = g.passed ? "PASS" : g.maxScore === 0 ? "INFO" : "FAIL";
      return `| /${g.gate} | ${g.score}/${g.maxScore} | ${status} | ${g.issues.length} issues |`;
    })
    .join("\n");

  return `## Ralph Run - Iteration ${result.iteration}

**Status:** ${result.passed ? "TARGET REACHED" : "IN PROGRESS"}
**Score:** ${result.totalScore}/${result.targetScore}
**Duration:** ${(result.duration / 1000).toFixed(1)}s

### Quality Gates

| Gate | Score | Status | Issues |
|------|-------|--------|--------|
${gateRows}

### Metrics
- API calls: ${result.apiCalls}
- Auto-fixes: ${ctx.autoFixesApplied}
- Files modified: ${ctx.filesModified.size}

---
*Run ID: ${ctx.runId} | Iteration ${result.iteration}*`;
}

// ============================================
// MAIN AUTONOMOUS LOOP
// ============================================
async function runAutonomousLoop(issueId: string, options: RunOptions): Promise<void> {
  const config = loadConfig(options.preset);
  const ctx = new RunContext(issueId, config, options);

  console.log("\n" + "=".repeat(60));
  console.log("          RALPH WIGGUM - Autonomous Development");
  console.log("=".repeat(60));
  console.log(`  Issue: #${issueId}`);
  console.log(`  Target: ${config.target_score}/100`);
  console.log(`  Max iterations: ${config.max_iterations}`);
  console.log(`  Preset: ${options.preset || "default"}`);
  console.log(`  Run ID: ${ctx.runId}`);
  if (options.dryRun) console.log("  MODE: DRY RUN (no changes will be made)");
  console.log("=".repeat(60) + "\n");

  if (options.dryRun) {
    console.log("[DRY RUN] Configuration validated. Would execute:");
    console.log(`  - Fetch issue #${issueId}`);
    console.log(`  - Create branch: feature/${issueId}-implement`);
    console.log(`  - Run gates: ${Object.keys(config.gates).join(", ")}`);
    console.log(`  - Target score: ${config.target_score}`);
    return;
  }

  // === PHASE 1: Implementation ===
  ctx.log("info", "Phase 1: Fetching issue and implementing...");

  const hooks = {
    PreToolUse: [
      { matcher: "Bash", hooks: [createRateLimitHook(ctx), createGitBlockHook(ctx), createAttributionStripHook(ctx)] },
      { matcher: "Edit|Write", hooks: [createRateLimitHook(ctx)] },
    ],
    PostToolUse: [{ matcher: "Edit|Write|Bash", hooks: [createAuditHook(ctx)] }],
  };

  for await (const message of query({
    prompt: `You are starting an autonomous development session for issue #${issueId}.

STEPS:
1. Fetch issue #${issueId} from GitHub (use: gh issue view ${issueId})
2. Create feature branch: feature/${issueId}-implement
3. Read the issue description and acceptance criteria
4. Implement the feature/fix
5. Commit with format: "feat: description" or "fix: description"

RULES:
- NEVER push directly to main/master/staging
- NEVER include "Co-Authored-By: Claude" in commits
- Keep commits atomic and focused`,
    options: {
      allowedTools: ["Read", "Edit", "Write", "Bash", "Glob", "Grep", "Task"],
      agents: qualityGateAgents,
      permissionMode: "acceptEdits",
      hooks,
    },
  })) {
    if (message.type === "system" && message.subtype === "init") {
      ctx.sessionId = message.session_id;
      ctx.log("info", `Session initialized: ${ctx.sessionId}`);
    }
    if ("result" in message) {
      ctx.log("info", "Implementation phase complete");
    }
  }

  if (!ctx.sessionId) {
    ctx.log("error", "Failed to initialize session");
    return;
  }

  ctx.saveCheckpoint();

  // === PHASE 2: Quality Gate Loop ===
  ctx.log("info", "\nPhase 2: Running quality gates...");

  const enabledGates = Object.keys(config.gates);
  let currentScore = 0;
  let lastGateResults: GateResult[] = [];

  while (ctx.iteration < config.max_iterations && currentScore < config.target_score) {
    ctx.iteration++;
    const iterationStart = Date.now();
    const iterationApiStart = ctx.apiCallCount;

    console.log(`\n${"─".repeat(60)}`);
    console.log(`Iteration ${ctx.iteration}/${config.max_iterations}`);
    console.log(`${"─".repeat(60)}`);

    // Run gates
    const gateResults = await runGatesInParallel(enabledGates, ctx);
    lastGateResults = gateResults;

    // Calculate score
    currentScore = gateResults
      .filter((g) => ctx.config.gates[g.gate].weight > 0)
      .reduce((sum, g) => sum + g.score, 0);

    // Bonus points
    const testGate = gateResults.find((g) => g.gate === "test");
    if (testGate && testGate.score >= 25) {
      currentScore += 2;
      ctx.log("info", "[BONUS] +2 for excellent test coverage");
    }

    const reviewGate = gateResults.find((g) => g.gate === "review");
    if (reviewGate && reviewGate.issues.length === 0) {
      currentScore += 2;
      ctx.log("info", "[BONUS] +2 for zero code smells");
    }

    currentScore = Math.min(currentScore, MAX_SCORE);
    console.log(`\n   Score: ${currentScore}/${config.target_score}`);

    const iterationResult: IterationResult = {
      iteration: ctx.iteration,
      totalScore: currentScore,
      targetScore: config.target_score,
      gates: gateResults,
      passed: currentScore >= config.target_score,
      duration: Date.now() - iterationStart,
      apiCalls: ctx.apiCallCount - iterationApiStart,
    };

    // Post progress
    await postToIssue(issueId, generateProgressReport(iterationResult, ctx), ctx);

    // Create issues for advisory gate findings
    for (const gate of gateResults) {
      if (["architect", "devops", "mentor"].includes(gate.gate)) {
        for (const issue of gate.issues.slice(0, MAX_ISSUES_PER_GATE)) {
          if (issue.severity === "critical" || issue.severity === "high") {
            const newId = await createSubIssue(issueId, issue, gate.gate, ctx);
            if (newId) ctx.log("info", `Created issue #${newId} for ${gate.gate} finding`);
          }
        }
      }
    }

    ctx.saveCheckpoint();

    // Check completion
    if (currentScore >= config.target_score) {
      ctx.log("info", "\nTarget score reached!");
      break;
    }

    // Check blockers
    const requiredFailed = gateResults.filter(
      (g) => ctx.config.gates[g.gate]?.required && !g.passed
    );

    if (requiredFailed.length > 0 && ctx.iteration >= BLOCKER_ITERATION_THRESHOLD) {
      ctx.log("warn", `BLOCKED: Required gates failed after ${ctx.iteration} iterations`);
      await postToIssue(
        issueId,
        `## BLOCKED\n\nRequired gates failed: ${requiredFailed.map((g) => `/${g.gate}`).join(", ")}\n\nComment \`@resume\` to retry.`,
        ctx
      );
      break;
    }

    // Supervised pause
    if (options.supervised) {
      ctx.log("info", "[SUPERVISED] Pausing for review (30s)...");
      await new Promise((r) => setTimeout(r, SUPERVISED_PAUSE_MS));
    } else {
      await new Promise((r) => setTimeout(r, config.iteration_delay * 1000));
    }
  }

  // === PHASE 3: Create PR ===
  if (currentScore >= config.target_score || (currentScore >= PR_FALLBACK_SCORE && ctx.iteration >= config.max_iterations)) {
    ctx.log("info", "\nPhase 3: Creating pull request...");

    for await (const message of query({
      prompt: `Create a pull request from the current branch to staging.
Title: "feat: implement #${issueId}"
Include quality gate scores in the body.
Use: gh pr create --fill --base staging`,
      options: {
        resume: ctx.sessionId,
        allowedTools: ["Bash", "Read"],
      },
    })) {
      if ("result" in message) {
        ctx.log("info", "PR created successfully");
      }
    }
  }

  // Save final metrics
  writeFileSync(METRICS_FILE, JSON.stringify(ctx.getMetrics(), null, 2));

  console.log("\n" + "=".repeat(60));
  console.log("                    RUN COMPLETE");
  console.log("=".repeat(60));
  console.log(`  Final Score: ${currentScore}/${config.target_score}`);
  console.log(`  Iterations: ${ctx.iteration}`);
  console.log(`  Duration: ${((Date.now() - ctx.startTime.getTime()) / 1000 / 60).toFixed(1)} minutes`);
  console.log(`  Issues Created: ${ctx.issuesCreated.length}`);
  console.log("=".repeat(60) + "\n");
}

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
let shutdownRequested = false;

process.on("SIGINT", () => {
  if (shutdownRequested) {
    console.log("\nForce exit.");
    process.exit(1);
  }
  shutdownRequested = true;
  console.log("\nShutdown requested. Saving state...");
  // State is saved via checkpoints
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\nSIGTERM received. Saving state...");
  process.exit(0);
});

// ============================================
// CLI
// ============================================
function parseArgs(): { issueId?: string; epicId?: string; preset?: string; supervised: boolean; dryRun: boolean } {
  const args = process.argv.slice(2);
  return {
    issueId: args.find((a) => a.startsWith("--issue="))?.split("=")[1],
    epicId: args.find((a) => a.startsWith("--epic="))?.split("=")[1],
    preset: args.find((a) => a.startsWith("--preset="))?.split("=")[1],
    supervised: args.includes("--supervised"),
    dryRun: args.includes("--dry-run"),
  };
}

function printUsage(): void {
  console.log(`
RALPH WIGGUM - Autonomous Development Runner

USAGE:
  npx ts-node ralph-runner.ts --issue=123
  npx ts-node ralph-runner.ts --issue=123 --preset=production
  npx ts-node ralph-runner.ts --issue=123 --supervised
  npx ts-node ralph-runner.ts --issue=123 --dry-run

OPTIONS:
  --issue=ID      Run on a single issue (required)
  --epic=ID       Run on all issues in epic (not yet implemented)
  --preset=NAME   Use config preset (default, production, prototype, frontend)
  --supervised    Pause after each iteration for review
  --dry-run       Validate config without executing

ENVIRONMENT:
  ANTHROPIC_API_KEY  Required: Your Anthropic API key
  GITHUB_TOKEN       Optional: GitHub token (falls back to gh CLI)
  DEBUG              Optional: Enable debug logging

QUALITY GATES:
  /test       25pts  Tests + coverage
  /security   25pts  Vulnerability scan
  /build      15pts  Compilation check
  /review     20pts  Code quality
  /mentor     10pts  Architecture advice
  /ux          5pts  Accessibility
  /architect   0pts  System security (creates issues)
  /devops      0pts  CI/CD review (creates issues)

CONFIG: .claude/autonomous.yml
`);
}

// Main
const { issueId, epicId, preset, supervised, dryRun } = parseArgs();

if (issueId) {
  validateEnvironment();
  try {
    const validatedIssueId = validateIssueId(issueId);
    runAutonomousLoop(validatedIssueId, { preset, supervised, dryRun }).catch((e) => {
      console.error("[FATAL]", e.message);
      process.exit(1);
    });
  } catch (e) {
    console.error("[ERROR]", (e as Error).message);
    process.exit(1);
  }
} else if (epicId) {
  console.log("Epic mode not yet implemented. Use --issue for now.");
  process.exit(1);
} else {
  printUsage();
}
