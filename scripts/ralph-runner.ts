#!/usr/bin/env npx ts-node
/**
 * Ralph Wiggum - Autonomous Development Runner
 * Powered by Claude Agent SDK
 *
 * Usage:
 *   npx ts-node ralph-runner.ts --issue=123
 *   npx ts-node ralph-runner.ts --issue=123 --preset=production
 *   npx ts-node ralph-runner.ts --issue=123 --supervised
 *   npx ts-node ralph-runner.ts --issue=123 --dry-run
 */

import {
  query,
  AgentDefinition,
  HookCallback,
} from "@anthropic-ai/claude-agent-sdk";
import {
  appendFileSync,
  readFileSync,
  existsSync,
  writeFileSync,
  readdirSync,
  statSync,
  renameSync,
  unlinkSync,
} from "fs";
import { join, resolve } from "path";
import { homedir } from "os";
import * as yaml from "yaml";

// ============================================
// CONSTANTS
// ============================================
const PROJECT_CONFIG_PATH = join(process.cwd(), ".claude", "autonomous.yml");
const USER_CONFIG_PATH = join(homedir(), ".claude", "codeassist.yml");
const AUDIT_LOG = join(process.cwd(), "autonomous-audit.log");
const METRICS_FILE = join(process.cwd(), "autonomous-metrics.json");
const STATE_FILE = join(process.cwd(), ".ralph-state.json");
const GATES_DIR = join(__dirname, "gates");

// Provider defaults
const DEFAULT_CLAUDE_MODEL = "claude-sonnet-4-20250514";
const DEFAULT_OLLAMA_BASE_URL = "http://localhost:11434";
const DEFAULT_OLLAMA_MODEL = "qwen3-coder";

// Scoring thresholds
const GATE_PASS_THRESHOLD = 0.8;
const PR_FALLBACK_SCORE = 85;
const BLOCKER_ITERATION_THRESHOLD = 5;
const SUPERVISED_PAUSE_MS = 30000;
const MAX_ISSUES_PER_GATE = 3;
const MAX_SCORE = 100;
const MAX_AUDIT_LOG_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_GATE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

// Circuit breaker settings
const CIRCUIT_BREAKER_THRESHOLD = 5;
const CIRCUIT_BREAKER_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

// Valid presets
const VALID_PRESETS = ["default", "production", "prototype", "frontend", "ollama_hybrid", "ollama_only"] as const;
type Preset = (typeof VALID_PRESETS)[number];

// Valid providers
const VALID_PROVIDERS = ["claude", "ollama"] as const;
type Provider = (typeof VALID_PROVIDERS)[number];

// ============================================
// TYPE DEFINITIONS
// ============================================

// Provider configuration types
interface ProviderConfig {
  default: Provider;
  claude?: {
    model?: string;
    api_key?: string;
  };
  ollama?: {
    enabled?: boolean;
    base_url?: string;
    model?: string;
  };
  gate_providers?: Record<string, Provider>;
  fallback?: Provider;
  fallback_on?: string[];
}

interface UserConfig {
  providers?: ProviderConfig;
  defaults?: {
    target_score?: number;
    preset?: Preset;
    max_iterations?: number;
    iteration_delay?: number;
  };
  safety?: Partial<SafetyConfig>;
  logging?: {
    level?: string;
    directory?: string;
  };
}

interface GateConfig {
  weight: number;
  required: boolean;
  auto_fix: boolean;
  command?: string;
  description?: string;
  thresholds?: Record<string, number>;
  parallel_group?: number;
  timeout_ms?: number;
}

interface AutonomousConfig {
  target_score: number;
  max_iterations: number;
  iteration_delay: number;
  gates: Record<string, GateConfig>;
  presets?: Record<string, Partial<AutonomousConfig>>;
  safety: SafetyConfig;
  git_rules: GitRulesConfig;
  providers: ProviderConfig;
}

interface SafetyConfig {
  max_api_calls_per_hour: number;
  max_issues_created_per_run: number;
  forbidden: string[];
}

interface GitRulesConfig {
  protected_branches: string[];
  commit_rules: {
    forbidden_patterns: string[];
    auto_strip: boolean;
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
  timedOut: boolean;
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

interface RunOptions {
  preset?: string;
  supervised: boolean;
  dryRun: boolean;
  provider?: Provider;
  model?: string;
}

interface GateDefinition {
  name: string;
  description: string;
  tools: string[];
  prompt: string;
}

// SDK Type Guards
interface ToolUseInput {
  tool: string;
  tool_input: {
    command?: string;
    file_path?: string;
    path?: string;
    content?: string;
  };
}

interface SystemMessage {
  type: "system";
  subtype: string;
  session_id?: string;
}

interface ResultMessage {
  result: string;
}

function isToolUseInput(input: unknown): input is ToolUseInput {
  if (typeof input !== "object" || input === null) return false;
  const obj = input as Record<string, unknown>;
  return typeof obj.tool === "string" && typeof obj.tool_input === "object";
}

function isSystemMessage(message: unknown): message is SystemMessage {
  if (typeof message !== "object" || message === null) return false;
  const obj = message as Record<string, unknown>;
  return obj.type === "system" && typeof obj.subtype === "string";
}

function isResultMessage(message: unknown): message is ResultMessage {
  if (typeof message !== "object" || message === null) return false;
  return "result" in message && typeof (message as ResultMessage).result === "string";
}

// ============================================
// RATE LIMITER (Single Responsibility)
// ============================================
class RateLimiter {
  private callCount: number = 0;
  private readonly maxCalls: number;
  private resetTime: number;

  constructor(maxCallsPerHour: number) {
    this.maxCalls = maxCallsPerHour;
    this.resetTime = Date.now() + 60 * 60 * 1000;
  }

  public canProceed(): boolean {
    this.checkReset();
    return this.callCount < this.maxCalls;
  }

  public recordCall(): void {
    this.checkReset();
    this.callCount++;
  }

  public getRemaining(): number {
    this.checkReset();
    return this.maxCalls - this.callCount;
  }

  private checkReset(): void {
    if (Date.now() > this.resetTime) {
      this.callCount = 0;
      this.resetTime = Date.now() + 60 * 60 * 1000;
    }
  }
}

// ============================================
// CIRCUIT BREAKER (Single Responsibility)
// ============================================
class CircuitBreaker {
  private failures: number = 0;
  private lastFailure: number = 0;
  private isOpen: boolean = false;
  private readonly threshold: number;
  private readonly cooldownMs: number;

  constructor(
    threshold: number = CIRCUIT_BREAKER_THRESHOLD,
    cooldownMs: number = CIRCUIT_BREAKER_COOLDOWN_MS
  ) {
    this.threshold = threshold;
    this.cooldownMs = cooldownMs;
  }

  public recordFailure(): void {
    this.failures++;
    this.lastFailure = Date.now();
    if (this.failures >= this.threshold) {
      this.isOpen = true;
    }
  }

  public recordSuccess(): void {
    this.failures = 0;
    this.isOpen = false;
  }

  public canProceed(): boolean {
    if (!this.isOpen) return true;

    // Check cooldown
    if (Date.now() - this.lastFailure > this.cooldownMs) {
      this.isOpen = false;
      this.failures = 0;
      return true;
    }
    return false;
  }

  public getState(): { isOpen: boolean; failures: number } {
    return { isOpen: this.isOpen, failures: this.failures };
  }
}

// ============================================
// CHECKPOINT MANAGER (Single Responsibility)
// ============================================
class CheckpointManager {
  private readonly stateFile: string;

  constructor(stateFile: string = STATE_FILE) {
    this.stateFile = stateFile;
  }

  public save(state: RunState): void {
    try {
      writeFileSync(this.stateFile, JSON.stringify(state, null, 2));
    } catch (error) {
      console.error("[WARN] Failed to save checkpoint:", error);
    }
  }

  public load(): RunState | null {
    if (!existsSync(this.stateFile)) return null;
    try {
      return JSON.parse(readFileSync(this.stateFile, "utf-8"));
    } catch {
      return null;
    }
  }

  public clear(): void {
    if (existsSync(this.stateFile)) {
      try {
        unlinkSync(this.stateFile);
      } catch {
        // Ignore
      }
    }
  }
}

// ============================================
// AUDIT LOGGER (Single Responsibility)
// ============================================
class AuditLogger {
  private readonly logFile: string;
  private readonly maxSize: number;

  constructor(logFile: string = AUDIT_LOG, maxSize: number = MAX_AUDIT_LOG_SIZE) {
    this.logFile = logFile;
    this.maxSize = maxSize;
  }

  public log(entry: Record<string, unknown>): void {
    this.rotateIfNeeded();
    try {
      appendFileSync(this.logFile, JSON.stringify(entry) + "\n");
    } catch (error) {
      console.error("[WARN] Failed to write audit log:", error);
    }
  }

  private rotateIfNeeded(): void {
    if (!existsSync(this.logFile)) return;
    try {
      const stats = statSync(this.logFile);
      if (stats.size > this.maxSize) {
        const rotatedPath = `${this.logFile}.${Date.now()}`;
        renameSync(this.logFile, rotatedPath);
      }
    } catch {
      // Ignore rotation errors
    }
  }
}

// ============================================
// METRICS COLLECTOR (Single Responsibility)
// ============================================
class MetricsCollector {
  private readonly metricsFile: string;
  public apiCallCount: number = 0;
  public autoFixesApplied: number = 0;
  public filesModified: Set<string> = new Set();
  public issuesCreated: string[] = [];

  constructor(metricsFile: string = METRICS_FILE) {
    this.metricsFile = metricsFile;
  }

  public recordApiCall(): void {
    this.apiCallCount++;
  }

  public recordAutoFix(count: number): void {
    this.autoFixesApplied += count;
  }

  public recordFileModified(file: string): void {
    this.filesModified.add(file);
  }

  public recordIssueCreated(issueId: string): void {
    this.issuesCreated.push(issueId);
  }

  public canCreateIssue(maxIssues: number): boolean {
    return this.issuesCreated.length < maxIssues;
  }

  public save(runId: string, issueId: string, startTime: Date, iteration: number): void {
    const metrics = {
      runId,
      issueId,
      startTime: startTime.toISOString(),
      duration: Date.now() - startTime.getTime(),
      iterations: iteration,
      apiCalls: this.apiCallCount,
      issuesCreated: this.issuesCreated.length,
      autoFixesApplied: this.autoFixesApplied,
      filesModified: Array.from(this.filesModified),
    };
    try {
      writeFileSync(this.metricsFile, JSON.stringify(metrics, null, 2));
    } catch (error) {
      console.error("[WARN] Failed to save metrics:", error);
    }
  }
}

// ============================================
// STRUCTURED LOGGER (Single Responsibility)
// ============================================
class StructuredLogger {
  private readonly runId: string;

  constructor(runId: string) {
    this.runId = runId;
  }

  public info(message: string, data?: Record<string, unknown>): void {
    console.log(`   ${message}`);
    if (process.env.DEBUG && data) {
      console.log(`   [DEBUG] ${JSON.stringify(data)}`);
    }
  }

  public warn(message: string, data?: Record<string, unknown>): void {
    console.warn(`   [WARN] ${message}`);
    if (data) {
      console.warn(`   ${JSON.stringify(data)}`);
    }
  }

  public error(message: string, data?: Record<string, unknown>): void {
    const entry = {
      timestamp: new Date().toISOString(),
      runId: this.runId,
      level: "error",
      message,
      ...data,
    };
    console.error(JSON.stringify(entry));
  }

  public debug(message: string): void {
    if (process.env.DEBUG) {
      console.log(`   [DEBUG] ${message}`);
    }
  }
}

// ============================================
// RUN CONTEXT (Coordinates Dependencies)
// ============================================
class RunContext {
  public readonly runId: string;
  public readonly config: AutonomousConfig;
  public readonly issueId: string;
  public readonly options: RunOptions;

  public sessionId?: string;
  public iteration: number = 0;
  public readonly startTime: Date = new Date();

  // Injected dependencies
  public readonly rateLimiter: RateLimiter;
  public readonly circuitBreaker: CircuitBreaker;
  public readonly checkpointManager: CheckpointManager;
  public readonly auditLogger: AuditLogger;
  public readonly metrics: MetricsCollector;
  public readonly logger: StructuredLogger;

  constructor(
    issueId: string,
    config: AutonomousConfig,
    options: RunOptions,
    dependencies?: {
      rateLimiter?: RateLimiter;
      circuitBreaker?: CircuitBreaker;
      checkpointManager?: CheckpointManager;
      auditLogger?: AuditLogger;
      metrics?: MetricsCollector;
    }
  ) {
    this.runId = `ralph-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    this.issueId = issueId;
    this.config = config;
    this.options = options;

    // Dependency injection with defaults
    this.rateLimiter = dependencies?.rateLimiter ?? new RateLimiter(config.safety.max_api_calls_per_hour);
    this.circuitBreaker = dependencies?.circuitBreaker ?? new CircuitBreaker();
    this.checkpointManager = dependencies?.checkpointManager ?? new CheckpointManager();
    this.auditLogger = dependencies?.auditLogger ?? new AuditLogger();
    this.metrics = dependencies?.metrics ?? new MetricsCollector();
    this.logger = new StructuredLogger(this.runId);
  }

  public saveCheckpoint(): void {
    const state: RunState = {
      runId: this.runId,
      issueId: this.issueId,
      sessionId: this.sessionId,
      iteration: this.iteration,
      lastScore: 0,
      createdIssues: this.metrics.issuesCreated,
      startTime: this.startTime.toISOString(),
      lastCheckpoint: new Date().toISOString(),
    };
    this.checkpointManager.save(state);
  }

  public saveMetrics(): void {
    this.metrics.save(this.runId, this.issueId, this.startTime, this.iteration);
  }
}

// ============================================
// INPUT VALIDATION & SANITIZATION
// ============================================
function validateIssueId(input: string): string {
  if (!/^\d+$/.test(input)) {
    throw new Error(`Invalid issue ID: "${input}". Must be numeric.`);
  }
  return input;
}

function validatePreset(input: string | undefined): Preset | undefined {
  if (!input) return undefined;
  if (!VALID_PRESETS.includes(input as Preset)) {
    throw new Error(`Invalid preset: "${input}". Valid: ${VALID_PRESETS.join(", ")}`);
  }
  return input as Preset;
}

function validateProvider(input: string | undefined): Provider | undefined {
  if (!input) return undefined;
  if (!VALID_PROVIDERS.includes(input as Provider)) {
    throw new Error(`Invalid provider: "${input}". Valid: ${VALID_PROVIDERS.join(", ")}`);
  }
  return input as Provider;
}

function sanitizeForShell(input: string): string {
  return input.replace(/[;&|`$(){}[\]<>\\'"!#*?~\n\r]/g, "");
}

function sanitizeFilePath(input: string, projectRoot: string): string | null {
  const resolved = resolve(projectRoot, input);
  if (!resolved.startsWith(projectRoot)) {
    return null;
  }
  return resolved;
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ============================================
// ENVIRONMENT VALIDATION
// ============================================
function validateEnvironment(provider: Provider = "claude"): void {
  // For Ollama-only mode, ANTHROPIC_API_KEY is not required
  if (provider === "ollama") {
    // Ollama mode - check if base URL is accessible
    const baseUrl = process.env.OLLAMA_BASE_URL || DEFAULT_OLLAMA_BASE_URL;
    console.log(`[INFO] Using Ollama provider at ${baseUrl}`);
    return;
  }

  // For Claude or hybrid mode, require API key
  const required = ["ANTHROPIC_API_KEY"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("\n[ERROR] Missing required environment variables:");
    missing.forEach((key) => console.error(`  - ${key}`));
    console.error("\nSet them in your environment or .env file:");
    console.error("  export ANTHROPIC_API_KEY=your-api-key\n");
    console.error("Or use Ollama mode: --provider=ollama");
    process.exit(1);
  }

  if (!process.env.GITHUB_TOKEN) {
    console.warn("[WARN] GITHUB_TOKEN not set - using gh CLI authentication");
  }
}

// ============================================
// CONFIGURATION
// ============================================

/**
 * Configuration Hierarchy (highest to lowest priority):
 * 1. CLI flags (--provider=ollama, --model=qwen3-coder)
 * 2. Environment variables (CODEASSIST_PROVIDER, OLLAMA_BASE_URL)
 * 3. Project config (.claude/autonomous.yml)
 * 4. User config (~/.claude/codeassist.yml)
 * 5. Built-in defaults
 */

function loadUserConfig(): UserConfig | null {
  if (!existsSync(USER_CONFIG_PATH)) {
    return null;
  }

  try {
    const content = readFileSync(USER_CONFIG_PATH, "utf-8");
    const config = yaml.parse(content, { strict: true });
    if (typeof config !== "object" || config === null) {
      throw new Error("Invalid user config: must be an object");
    }
    return config as UserConfig;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.warn(`[WARN] User config error (${USER_CONFIG_PATH}): ${message}`);
    return null;
  }
}

function loadProjectConfig(): Partial<AutonomousConfig> | null {
  if (!existsSync(PROJECT_CONFIG_PATH)) {
    return null;
  }

  try {
    const content = readFileSync(PROJECT_CONFIG_PATH, "utf-8");
    const config = yaml.parse(content, { strict: true });
    if (typeof config !== "object" || config === null) {
      throw new Error("Invalid project config: must be an object");
    }
    return config as Partial<AutonomousConfig>;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.warn(`[WARN] Project config error (${PROJECT_CONFIG_PATH}): ${message}`);
    return null;
  }
}

function getDefaultProviderConfig(): ProviderConfig {
  return {
    default: "claude",
    claude: {
      model: DEFAULT_CLAUDE_MODEL,
    },
    ollama: {
      enabled: false,
      base_url: DEFAULT_OLLAMA_BASE_URL,
      model: DEFAULT_OLLAMA_MODEL,
    },
    gate_providers: {
      // Default: all gates use default provider
    },
  };
}

function mergeProviderConfigs(
  base: ProviderConfig,
  override: Partial<ProviderConfig> | undefined
): ProviderConfig {
  if (!override) return base;

  return {
    default: override.default || base.default,
    claude: { ...base.claude, ...override.claude },
    ollama: { ...base.ollama, ...override.ollama },
    gate_providers: { ...base.gate_providers, ...override.gate_providers },
    fallback: override.fallback || base.fallback,
    fallback_on: override.fallback_on || base.fallback_on,
  };
}

function applyPresetProviders(preset: string, providers: ProviderConfig): ProviderConfig {
  switch (preset) {
    case "ollama_hybrid":
      // Claude for critical gates, Ollama for others (~60% cost savings)
      return {
        ...providers,
        default: "ollama",
        ollama: { ...providers.ollama, enabled: true },
        gate_providers: {
          test: "claude",
          security: "claude",
          build: "claude",
          review: "ollama",
          mentor: "claude",
          ux: "ollama",
          architect: "ollama",
          devops: "ollama",
        },
      };
    case "ollama_only":
      // Fully local, no API costs
      return {
        ...providers,
        default: "ollama",
        ollama: { ...providers.ollama, enabled: true },
        gate_providers: {
          test: "ollama",
          security: "ollama",
          build: "ollama",
          review: "ollama",
          mentor: "ollama",
          ux: "ollama",
          architect: "ollama",
          devops: "ollama",
        },
      };
    default:
      return providers;
  }
}

function loadConfig(options: { preset?: string; provider?: Provider; model?: string }): AutonomousConfig {
  // Step 1: Built-in defaults
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
    providers: getDefaultProviderConfig(),
  };

  // Step 2: Apply user config (~/.claude/codeassist.yml)
  const userConfig = loadUserConfig();
  if (userConfig) {
    if (userConfig.defaults?.target_score !== undefined) {
      defaultConfig.target_score = userConfig.defaults.target_score;
    }
    if (userConfig.defaults?.max_iterations !== undefined) {
      defaultConfig.max_iterations = userConfig.defaults.max_iterations;
    }
    if (userConfig.defaults?.iteration_delay !== undefined) {
      defaultConfig.iteration_delay = userConfig.defaults.iteration_delay;
    }
    if (userConfig.safety) {
      Object.assign(defaultConfig.safety, userConfig.safety);
    }
    if (userConfig.providers) {
      defaultConfig.providers = mergeProviderConfigs(defaultConfig.providers, userConfig.providers);
    }
    console.log(`[INFO] Loaded user config from ${USER_CONFIG_PATH}`);
  }

  // Step 3: Apply project config (.claude/autonomous.yml)
  const projectConfig = loadProjectConfig();
  if (projectConfig) {
    if (projectConfig.target_score !== undefined) {
      if (typeof projectConfig.target_score !== "number" || projectConfig.target_score < 0 || projectConfig.target_score > 100) {
        throw new Error("Invalid target_score: must be 0-100");
      }
      defaultConfig.target_score = projectConfig.target_score;
    }

    if (projectConfig.max_iterations !== undefined) {
      if (typeof projectConfig.max_iterations !== "number" || projectConfig.max_iterations < 1) {
        throw new Error("Invalid max_iterations: must be >= 1");
      }
      defaultConfig.max_iterations = projectConfig.max_iterations;
    }

    if (projectConfig.gates) {
      Object.assign(defaultConfig.gates, projectConfig.gates);
    }

    if (projectConfig.presets) {
      defaultConfig.presets = projectConfig.presets;
    }

    if (projectConfig.providers) {
      defaultConfig.providers = mergeProviderConfigs(defaultConfig.providers, projectConfig.providers);
    }

    console.log(`[INFO] Loaded project config from ${PROJECT_CONFIG_PATH}`);
  }

  // Step 4: Apply preset
  const validatedPreset = validatePreset(options.preset);
  if (validatedPreset) {
    // Apply preset-specific general settings
    if (defaultConfig.presets?.[validatedPreset]) {
      const presetConfig = defaultConfig.presets[validatedPreset];
      Object.assign(defaultConfig, presetConfig);
    }
    // Apply preset-specific provider settings
    defaultConfig.providers = applyPresetProviders(validatedPreset, defaultConfig.providers);
  }

  // Step 5: Apply environment variables
  const envProvider = process.env.CODEASSIST_PROVIDER;
  if (envProvider) {
    const validated = validateProvider(envProvider);
    if (validated) {
      defaultConfig.providers.default = validated;
      console.log(`[INFO] Provider from env: ${validated}`);
    }
  }

  const envOllamaUrl = process.env.OLLAMA_BASE_URL;
  if (envOllamaUrl && defaultConfig.providers.ollama) {
    defaultConfig.providers.ollama.base_url = envOllamaUrl;
  }

  // Step 6: Apply CLI flags (highest priority)
  if (options.provider) {
    defaultConfig.providers.default = options.provider;
    console.log(`[INFO] Provider from CLI: ${options.provider}`);
  }

  if (options.model) {
    const provider = defaultConfig.providers.default;
    if (provider === "ollama" && defaultConfig.providers.ollama) {
      defaultConfig.providers.ollama.model = options.model;
    } else if (provider === "claude" && defaultConfig.providers.claude) {
      defaultConfig.providers.claude.model = options.model;
    }
    console.log(`[INFO] Model from CLI: ${options.model}`);
  }

  return defaultConfig;
}

/**
 * Get the provider to use for a specific gate
 */
function getProviderForGate(gateName: string, config: AutonomousConfig): {
  provider: Provider;
  baseUrl?: string;
  model?: string;
} {
  const providers = config.providers;
  const gateProvider = providers.gate_providers?.[gateName] || providers.default;

  if (gateProvider === "ollama") {
    return {
      provider: "ollama",
      baseUrl: providers.ollama?.base_url || DEFAULT_OLLAMA_BASE_URL,
      model: providers.ollama?.model || DEFAULT_OLLAMA_MODEL,
    };
  }

  return {
    provider: "claude",
    model: providers.claude?.model || DEFAULT_CLAUDE_MODEL,
  };
}

// ============================================
// GATE DEFINITIONS LOADER
// ============================================
function loadGateDefinitions(): Record<string, AgentDefinition> {
  const agents: Record<string, AgentDefinition> = {};

  if (!existsSync(GATES_DIR)) {
    console.warn(`[WARN] Gates directory not found: ${GATES_DIR}. Using embedded definitions.`);
    return getEmbeddedGateDefinitions();
  }

  const files = readdirSync(GATES_DIR).filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"));

  if (files.length === 0) {
    console.warn("[WARN] No gate definition files found. Using embedded definitions.");
    return getEmbeddedGateDefinitions();
  }

  for (const file of files) {
    try {
      const content = readFileSync(join(GATES_DIR, file), "utf-8");
      const def: GateDefinition = yaml.parse(content);

      if (!def.name || !def.prompt) {
        console.warn(`[WARN] Invalid gate definition in ${file}: missing name or prompt`);
        continue;
      }

      agents[def.name] = {
        description: def.description || def.name,
        prompt: def.prompt,
        tools: def.tools || ["Read", "Glob", "Grep"],
      };
    } catch (e) {
      console.warn(`[WARN] Failed to load gate ${file}:`, e);
    }
  }

  return agents;
}

function getEmbeddedGateDefinitions(): Record<string, AgentDefinition> {
  // Fallback embedded definitions (minimal)
  return {
    "test-runner": {
      description: "Run tests and report coverage",
      prompt: "Run the project's test suite. Output JSON with passed, total, failed, coverage, score.",
      tools: ["Bash", "Read", "Glob"],
    },
    "security-auditor": {
      description: "Security vulnerability scanner",
      prompt: "Scan for security vulnerabilities. Output JSON with critical, high, medium, low counts and issues array.",
      tools: ["Read", "Grep", "Glob", "Bash"],
    },
    "build-fixer": {
      description: "Build and fix compilation errors",
      prompt: "Build the project. Output JSON with success, errors, fixed, attempts, score.",
      tools: ["Bash", "Read", "Edit", "Glob"],
    },
    "code-reviewer": {
      description: "Code quality review",
      prompt: "Review code quality. Output JSON with smells, duplication_percent, fixed_count, score.",
      tools: ["Read", "Edit", "Glob", "Grep", "Bash"],
    },
    "mentor-advisor": {
      description: "Architecture review",
      prompt: "Review architecture. Output JSON with concerns, strengths, recommendations, score.",
      tools: ["Read", "Glob", "Grep"],
    },
    "ux-reviewer": {
      description: "UX and accessibility review",
      prompt: "Review UX and accessibility. Output JSON with a11y_issues, ux_issues, score.",
      tools: ["Read", "Glob", "Grep"],
    },
    "architect-advisor": {
      description: "System architecture advisor",
      prompt: "Review system architecture. Output JSON with security_posture, performance_rating, findings.",
      tools: ["Read", "Glob", "Grep"],
    },
    "devops-advisor": {
      description: "CI/CD review",
      prompt: "Review CI/CD setup. Output JSON with ci_cd_health, container_health, findings.",
      tools: ["Read", "Glob", "Grep"],
    },
  };
}

// ============================================
// HOOKS FACTORY
// ============================================
function createAuditHook(ctx: RunContext): HookCallback {
  return async (input: unknown) => {
    if (!isToolUseInput(input)) return {};

    const filePath = input.tool_input.file_path || input.tool_input.path;

    if (filePath) {
      const sanitized = sanitizeFilePath(filePath, process.cwd());
      if (!sanitized) {
        ctx.logger.warn(`Blocked path traversal attempt: ${filePath}`);
        return { decision: "block", message: "Path traversal blocked" };
      }
      ctx.metrics.recordFileModified(sanitized);
    }

    ctx.auditLogger.log({
      timestamp: new Date().toISOString(),
      runId: ctx.runId,
      tool: input.tool,
      file: filePath,
      command: input.tool_input.command?.substring(0, 100),
    });

    return {};
  };
}

function createGitBlockHook(ctx: RunContext): HookCallback {
  return async (input: unknown) => {
    if (!isToolUseInput(input)) return {};

    const command = (input.tool_input.command || "").toLowerCase();

    for (const branch of ctx.config.git_rules.protected_branches) {
      const pattern = new RegExp(`git\\s+push.*${escapeRegex(branch)}`, "i");
      if (pattern.test(command)) {
        ctx.logger.warn(`Blocked push to ${branch}`);
        return {
          decision: "block",
          message: `[BLOCKED] Direct push to ${branch}. Use PR workflow.`,
        };
      }
    }

    if (/git\s+push.*--force/i.test(command)) {
      return { decision: "block", message: "[BLOCKED] Force push is forbidden." };
    }

    if (/git\s+reset\s+--hard/i.test(command)) {
      return { decision: "block", message: "[BLOCKED] Hard reset requires manual confirmation." };
    }

    return {};
  };
}

function createAttributionStripHook(ctx: RunContext): HookCallback {
  return async (input: unknown) => {
    if (!isToolUseInput(input)) return {};

    const command = input.tool_input.command || "";

    if (!command.toLowerCase().includes("git commit")) {
      return {};
    }

    // Check for forbidden patterns
    for (const pattern of ctx.config.git_rules.commit_rules.forbidden_patterns) {
      if (new RegExp(pattern, "gi").test(command)) {
        ctx.logger.warn(`Blocked commit with AI attribution pattern: ${pattern}`);
        return {
          decision: "block",
          message: `[BLOCKED] Commit contains forbidden pattern: ${pattern}. Remove AI attribution before committing.`,
        };
      }
    }

    return {};
  };
}

function createRateLimitHook(ctx: RunContext): HookCallback {
  return async () => {
    if (!ctx.rateLimiter.canProceed()) {
      return {
        decision: "block",
        message: "[RATE LIMIT] API call limit exceeded. Pausing for cooldown.",
      };
    }

    if (!ctx.circuitBreaker.canProceed()) {
      return {
        decision: "block",
        message: "[CIRCUIT OPEN] Too many failures. Waiting for cooldown.",
      };
    }

    ctx.rateLimiter.recordCall();
    ctx.metrics.recordApiCall();
    return {};
  };
}

// ============================================
// GATE EXECUTION WITH TIMEOUT
// ============================================
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<{ result: T; timedOut: false } | { result: null; timedOut: true }> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<{ result: null; timedOut: true }>((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ result: null, timedOut: true });
    }, timeoutMs);
  });

  const resultPromise = promise.then((result) => {
    clearTimeout(timeoutId);
    return { result, timedOut: false as const };
  });

  return Promise.race([resultPromise, timeoutPromise]);
}

async function runGatesInParallel(
  gates: string[],
  ctx: RunContext,
  gateAgents: Record<string, AgentDefinition>
): Promise<GateResult[]> {
  const results: GateResult[] = [];

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
    ctx.logger.info(`[Group ${groupNum}] Running: ${groupGates.join(", ")}`);

    const groupPromises = groupGates.map((gate) => runSingleGate(gate, ctx, gateAgents));
    const groupResults = await Promise.all(groupPromises);
    results.push(...groupResults);

    const blockers = groupResults.filter(
      (r) => ctx.config.gates[r.gate]?.required && !r.passed
    );

    if (blockers.length > 0) {
      ctx.logger.warn(`Required gate(s) failed: ${blockers.map((b) => b.gate).join(", ")}`);
      ctx.circuitBreaker.recordFailure();
      break;
    } else {
      ctx.circuitBreaker.recordSuccess();
    }
  }

  return results;
}

async function runSingleGate(
  gateName: string,
  ctx: RunContext,
  gateAgents: Record<string, AgentDefinition>
): Promise<GateResult> {
  const startTime = Date.now();
  const gateConfig = ctx.config.gates[gateName];
  const timeoutMs = gateConfig.timeout_ms || DEFAULT_GATE_TIMEOUT_MS;

  // Get provider for this gate
  const providerInfo = getProviderForGate(gateName, ctx.config);
  ctx.logger.debug(`Gate ${gateName} using provider: ${providerInfo.provider} (model: ${providerInfo.model})`);

  const result: GateResult = {
    gate: gateName,
    score: 0,
    maxScore: gateConfig.weight,
    passed: false,
    issues: [],
    duration: 0,
    autoFixed: 0,
    timedOut: false,
  };

  const agentName = getAgentNameForGate(gateName);

  // Set environment for Ollama if needed
  const originalBaseUrl = process.env.ANTHROPIC_BASE_URL;
  const originalApiKey = process.env.ANTHROPIC_API_KEY;

  if (providerInfo.provider === "ollama" && providerInfo.baseUrl) {
    process.env.ANTHROPIC_BASE_URL = providerInfo.baseUrl;
    // Ollama requires a dummy API key
    if (!process.env.ANTHROPIC_API_KEY) {
      process.env.ANTHROPIC_API_KEY = "ollama";
    }
    ctx.logger.info(`  [${gateName}] Using Ollama at ${providerInfo.baseUrl}`);
  }

  const executeGate = async (): Promise<void> => {
    for await (const message of query({
      prompt: `Use the ${agentName} agent to evaluate this codebase. Return only valid JSON.`,
      options: {
        resume: ctx.sessionId,
        allowedTools: ["Task", "Read", "Glob", "Grep", "Bash", "Edit"],
        agents: gateAgents,
        permissionMode: gateConfig.auto_fix ? "acceptEdits" : "bypassPermissions",
      },
    })) {
      if (isResultMessage(message)) {
        try {
          const parsed = JSON.parse(extractJson(message.result));
          result.score = Math.min(parsed.score || 0, gateConfig.weight);
          result.passed = gateConfig.required
            ? result.score >= gateConfig.weight * GATE_PASS_THRESHOLD
            : true;
          result.issues = (parsed.issues || parsed.findings || []).slice(0, 50);
          result.autoFixed = parsed.fixed_count || parsed.fixed?.length || 0;
          ctx.metrics.recordAutoFix(result.autoFixed);
        } catch (e) {
          ctx.logger.error(`Failed to parse ${gateName} result`, { error: String(e) });
        }
      }
    }
  };

  try {
    const { timedOut } = await withTimeout(executeGate(), timeoutMs);
    if (timedOut) {
      result.timedOut = true;
      result.passed = false;
      ctx.logger.warn(`Gate ${gateName} timed out after ${timeoutMs}ms`);
      ctx.circuitBreaker.recordFailure();
    }
  } catch (e) {
    ctx.logger.error(`Gate ${gateName} execution failed`, { error: String(e) });
    ctx.circuitBreaker.recordFailure();
  } finally {
    // Restore original environment
    if (providerInfo.provider === "ollama") {
      if (originalBaseUrl !== undefined) {
        process.env.ANTHROPIC_BASE_URL = originalBaseUrl;
      } else {
        delete process.env.ANTHROPIC_BASE_URL;
      }
      if (originalApiKey !== undefined) {
        process.env.ANTHROPIC_API_KEY = originalApiKey;
      }
    }
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
// ISSUE INTEGRATION
// ============================================
async function createSubIssue(
  parentIssue: string,
  gateIssue: GateIssue,
  gateName: string,
  ctx: RunContext
): Promise<string | null> {
  if (!ctx.metrics.canCreateIssue(ctx.config.safety.max_issues_created_per_run)) {
    ctx.logger.warn("Issue creation limit reached");
    return null;
  }

  const title = sanitizeForShell(`[${gateName.toUpperCase()}] ${gateIssue.title}`).slice(0, 100);
  const labels = ["auto-generated", gateName, gateIssue.severity].join(",");

  const description = sanitizeForShell(gateIssue.description).slice(0, 500);
  const recommendation = sanitizeForShell(gateIssue.recommendation || "Review and address manually.").slice(0, 500);

  try {
    for await (const message of query({
      prompt: `Create a GitHub issue with:
- Title: "${title}"
- Labels: "${labels}"
- Body should include:
  - Severity: ${gateIssue.severity.toUpperCase()}
  - Found by: /${gateName} gate
  - File: ${sanitizeForShell(gateIssue.file || "N/A")}
  - Auto-fixable: ${gateIssue.autoFixable ? "Yes" : "No"}
  - Description: ${description}
  - Recommendation: ${recommendation}
  - Parent issue: #${parentIssue}
Use gh issue create command with proper escaping.`,
      options: {
        resume: ctx.sessionId,
        allowedTools: ["Bash"],
      },
    })) {
      if (isResultMessage(message)) {
        const issueMatch = message.result.match(/#(\d+)/);
        if (issueMatch) {
          ctx.metrics.recordIssueCreated(issueMatch[1]);
          return issueMatch[1];
        }
      }
    }
  } catch (e) {
    ctx.logger.error("Failed to create sub-issue", { error: String(e) });
  }

  return null;
}

async function postToIssue(issueId: string, body: string, ctx: RunContext): Promise<void> {
  const commentBody = sanitizeForShell(body).slice(0, 5000);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for await (const _message of query({
      prompt: `Post a comment to GitHub issue #${issueId}. Content: ${commentBody.slice(0, 1000)}... Use gh issue comment with proper escaping.`,
      options: {
        resume: ctx.sessionId,
        allowedTools: ["Bash"],
      },
    })) {
      // Comment posted - consume the async iterator
    }
  } catch (e) {
    ctx.logger.error("Failed to post to issue", { error: String(e) });
  }
}

// ============================================
// PROGRESS REPORTING
// ============================================
function generateProgressReport(result: IterationResult, ctx: RunContext): string {
  const gateRows = result.gates
    .map((g) => {
      let status = g.passed ? "PASS" : "FAIL";
      if (g.timedOut) status = "TIMEOUT";
      if (g.maxScore === 0) status = "INFO";
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
- Auto-fixes: ${ctx.metrics.autoFixesApplied}
- Files modified: ${ctx.metrics.filesModified.size}

---
*Run ID: ${ctx.runId} | Iteration ${result.iteration}*`;
}

// ============================================
// MAIN AUTONOMOUS LOOP
// ============================================
async function runAutonomousLoop(issueId: string, options: RunOptions): Promise<void> {
  const config = loadConfig({
    preset: options.preset,
    provider: options.provider,
    model: options.model,
  });
  const ctx = new RunContext(issueId, config, options);
  const gateAgents = loadGateDefinitions();

  // Calculate provider distribution
  const providerStats = { claude: 0, ollama: 0 };
  for (const gate of Object.keys(config.gates)) {
    const prov = config.providers.gate_providers?.[gate] || config.providers.default;
    providerStats[prov]++;
  }

  console.log("\n" + "=".repeat(60));
  console.log("          RALPH WIGGUM - Autonomous Development");
  console.log("=".repeat(60));
  console.log(`  Issue: #${issueId}`);
  console.log(`  Target: ${config.target_score}/100`);
  console.log(`  Max iterations: ${config.max_iterations}`);
  console.log(`  Preset: ${options.preset || "default"}`);
  console.log(`  Provider: ${config.providers.default}`);
  if (config.providers.default === "ollama" || providerStats.ollama > 0) {
    console.log(`  Ollama URL: ${config.providers.ollama?.base_url || DEFAULT_OLLAMA_BASE_URL}`);
    console.log(`  Ollama Model: ${config.providers.ollama?.model || DEFAULT_OLLAMA_MODEL}`);
  }
  if (providerStats.claude > 0 && providerStats.ollama > 0) {
    console.log(`  Gate Distribution: Claude=${providerStats.claude}, Ollama=${providerStats.ollama}`);
  }
  console.log(`  Run ID: ${ctx.runId}`);
  if (options.dryRun) console.log("  MODE: DRY RUN (no changes will be made)");
  console.log("=".repeat(60) + "\n");

  if (options.dryRun) {
    console.log("[DRY RUN] Configuration validated. Would execute:");
    console.log(`  - Fetch issue #${issueId}`);
    console.log(`  - Create branch: feature/${issueId}-implement`);
    console.log(`  - Run gates: ${Object.keys(config.gates).join(", ")}`);
    console.log(`  - Target score: ${config.target_score}`);
    console.log(`  - Gate timeout: ${DEFAULT_GATE_TIMEOUT_MS / 1000}s`);
    return;
  }

  // === PHASE 1: Implementation ===
  ctx.logger.info("Phase 1: Fetching issue and implementing...");

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
      agents: gateAgents,
      permissionMode: "acceptEdits",
      hooks,
    },
  })) {
    if (isSystemMessage(message) && message.subtype === "init") {
      ctx.sessionId = message.session_id;
      ctx.logger.info(`Session initialized: ${ctx.sessionId}`);
    }
    if (isResultMessage(message)) {
      ctx.logger.info("Implementation phase complete");
    }
  }

  if (!ctx.sessionId) {
    ctx.logger.error("Failed to initialize session");
    return;
  }

  ctx.saveCheckpoint();

  // === PHASE 2: Quality Gate Loop ===
  ctx.logger.info("\nPhase 2: Running quality gates...");

  const enabledGates = Object.keys(config.gates);
  let currentScore = 0;

  while (ctx.iteration < config.max_iterations && currentScore < config.target_score) {
    ctx.iteration++;
    const iterationStart = Date.now();
    const iterationApiStart = ctx.metrics.apiCallCount;

    console.log(`\n${"─".repeat(60)}`);
    console.log(`Iteration ${ctx.iteration}/${config.max_iterations}`);
    console.log(`${"─".repeat(60)}`);

    const gateResults = await runGatesInParallel(enabledGates, ctx, gateAgents);

    currentScore = gateResults
      .filter((g) => ctx.config.gates[g.gate].weight > 0)
      .reduce((sum, g) => sum + g.score, 0);

    // Bonus points
    const testGate = gateResults.find((g) => g.gate === "test");
    if (testGate && testGate.score >= 25) {
      currentScore += 2;
      ctx.logger.info("[BONUS] +2 for excellent test coverage");
    }

    const reviewGate = gateResults.find((g) => g.gate === "review");
    if (reviewGate && reviewGate.issues.length === 0) {
      currentScore += 2;
      ctx.logger.info("[BONUS] +2 for zero code smells");
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
      apiCalls: ctx.metrics.apiCallCount - iterationApiStart,
    };

    await postToIssue(issueId, generateProgressReport(iterationResult, ctx), ctx);

    // Create issues for advisory gate findings
    for (const gate of gateResults) {
      if (["architect", "devops", "mentor"].includes(gate.gate)) {
        for (const issue of gate.issues.slice(0, MAX_ISSUES_PER_GATE)) {
          if (issue.severity === "critical" || issue.severity === "high") {
            const newId = await createSubIssue(issueId, issue, gate.gate, ctx);
            if (newId) ctx.logger.info(`Created issue #${newId} for ${gate.gate} finding`);
          }
        }
      }
    }

    ctx.saveCheckpoint();

    if (currentScore >= config.target_score) {
      ctx.logger.info("\nTarget score reached!");
      break;
    }

    const requiredFailed = gateResults.filter(
      (g) => ctx.config.gates[g.gate]?.required && !g.passed
    );

    if (requiredFailed.length > 0 && ctx.iteration >= BLOCKER_ITERATION_THRESHOLD) {
      ctx.logger.warn(`BLOCKED: Required gates failed after ${ctx.iteration} iterations`);
      await postToIssue(
        issueId,
        `## BLOCKED\n\nRequired gates failed: ${requiredFailed.map((g) => `/${g.gate}`).join(", ")}\n\nComment \`@resume\` to retry.`,
        ctx
      );
      break;
    }

    if (options.supervised) {
      ctx.logger.info("[SUPERVISED] Pausing for review (30s)...");
      await new Promise((r) => setTimeout(r, SUPERVISED_PAUSE_MS));
    } else {
      await new Promise((r) => setTimeout(r, config.iteration_delay * 1000));
    }
  }

  // === PHASE 3: Create PR ===
  if (currentScore >= config.target_score || (currentScore >= PR_FALLBACK_SCORE && ctx.iteration >= config.max_iterations)) {
    ctx.logger.info("\nPhase 3: Creating pull request...");

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
      if (isResultMessage(message)) {
        ctx.logger.info("PR created successfully");
      }
    }
  }

  ctx.saveMetrics();

  console.log("\n" + "=".repeat(60));
  console.log("                    RUN COMPLETE");
  console.log("=".repeat(60));
  console.log(`  Final Score: ${currentScore}/${config.target_score}`);
  console.log(`  Iterations: ${ctx.iteration}`);
  console.log(`  Duration: ${((Date.now() - ctx.startTime.getTime()) / 1000 / 60).toFixed(1)} minutes`);
  console.log(`  Issues Created: ${ctx.metrics.issuesCreated.length}`);
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
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\nSIGTERM received. Saving state...");
  process.exit(0);
});

// ============================================
// CLI
// ============================================
function parseArgs(): {
  issueId?: string;
  preset?: string;
  supervised: boolean;
  dryRun: boolean;
  provider?: Provider;
  model?: string;
} {
  const args = process.argv.slice(2);
  const providerArg = args.find((a) => a.startsWith("--provider="))?.split("=")[1];

  return {
    issueId: args.find((a) => a.startsWith("--issue="))?.split("=")[1],
    preset: args.find((a) => a.startsWith("--preset="))?.split("=")[1],
    supervised: args.includes("--supervised"),
    dryRun: args.includes("--dry-run"),
    provider: validateProvider(providerArg),
    model: args.find((a) => a.startsWith("--model="))?.split("=")[1],
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
  npx ts-node ralph-runner.ts --issue=123 --preset=ollama_hybrid
  npx ts-node ralph-runner.ts --issue=123 --provider=ollama --model=qwen3-coder

OPTIONS:
  --issue=ID       Run on a single issue (required)
  --preset=NAME    Use config preset:
                   - default, production, prototype, frontend
                   - ollama_hybrid (Claude for critical, Ollama for others)
                   - ollama_only (fully local, no API costs)
  --provider=NAME  Override provider (claude, ollama)
  --model=NAME     Override model (e.g., qwen3-coder, codellama:34b)
  --supervised     Pause after each iteration for review
  --dry-run        Validate config without executing

ENVIRONMENT:
  ANTHROPIC_API_KEY    Required for Claude (not needed for ollama_only)
  GITHUB_TOKEN         Optional: GitHub token (falls back to gh CLI)
  CODEASSIST_PROVIDER  Override default provider (claude, ollama)
  OLLAMA_BASE_URL      Ollama server URL (default: ${DEFAULT_OLLAMA_BASE_URL})
  DEBUG                Enable debug logging

CONFIGURATION HIERARCHY (highest to lowest priority):
  1. CLI flags         --provider=ollama --model=qwen3-coder
  2. Environment       CODEASSIST_PROVIDER=ollama
  3. Project config    .claude/autonomous.yml
  4. User config       ~/.claude/codeassist.yml
  5. Built-in defaults

QUALITY GATES:
  /test       25pts  Tests + coverage
  /security   25pts  Vulnerability scan
  /build      15pts  Compilation check
  /review     20pts  Code quality
  /mentor     10pts  Architecture advice
  /ux          5pts  Accessibility
  /architect   0pts  System security (creates issues)
  /devops      0pts  CI/CD review (creates issues)

OLLAMA PRESETS:
  ollama_hybrid   Claude: test, security, build, mentor
                  Ollama: review, ux, architect, devops
                  (~60% API cost savings)

  ollama_only     All gates use Ollama
                  (100% local, no API costs)

GATE DEFINITIONS:
  External YAML files in: scripts/gates/
  Override or add gates by creating *.yml files

TIMEOUTS:
  Default gate timeout: ${DEFAULT_GATE_TIMEOUT_MS / 1000 / 60} minutes
  Configure per-gate: timeout_ms in autonomous.yml

CONFIG FILES:
  User config:    ~/.claude/codeassist.yml
  Project config: .claude/autonomous.yml
`);
}

// Main
const { issueId, preset, supervised, dryRun, provider, model } = parseArgs();

if (issueId) {
  // Determine effective provider for environment validation
  // If preset is ollama_only, treat as ollama provider
  const effectiveProvider = provider || (preset === "ollama_only" ? "ollama" : "claude");
  validateEnvironment(effectiveProvider);

  try {
    const validatedIssueId = validateIssueId(issueId);
    runAutonomousLoop(validatedIssueId, { preset, supervised, dryRun, provider, model }).catch((e) => {
      console.error("[FATAL]", e.message);
      process.exit(1);
    });
  } catch (e) {
    console.error("[ERROR]", (e as Error).message);
    process.exit(1);
  }
} else {
  printUsage();
}
