#!/usr/bin/env npx tsx
/**
 * Ralph Wiggum - Autonomous Development Runner
 * Powered by Claude Agent SDK
 *
 * Usage:
 *   npx tsx ralph-runner.ts --issue=123
 *   npx tsx ralph-runner.ts --issue=123 --preset=production
 *   npx tsx ralph-runner.ts --issue=123 --supervised
 *   npx tsx ralph-runner.ts --issue=123 --dry-run
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
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import * as yaml from "yaml";
import { z } from "zod";

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================
// CONSTANTS
// ============================================
const CONFIG_PATH = join(process.cwd(), ".claude", "autonomous.yml");
const AUDIT_LOG = join(process.cwd(), "autonomous-audit.log");
const METRICS_FILE = join(process.cwd(), "autonomous-metrics.json");
const STATE_FILE = join(process.cwd(), ".ralph-state.json");
const GATES_DIR = join(__dirname, "gates");

// Platform detection patterns
const GITLAB_REMOTE_PATTERNS = [
  /gitlab\.com/i,
  /gitlab\./i,
  /@gitlab/i,
];
const GITHUB_REMOTE_PATTERNS = [
  /github\.com/i,
  /github\./i,
  /@github/i,
];

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
const VALID_PRESETS = ["default", "production", "prototype", "frontend"] as const;
type Preset = (typeof VALID_PRESETS)[number];

// Provider presets (handled separately from general presets)
const VALID_PROVIDER_PRESETS = ["ollama_hybrid", "ollama_only"] as const;

// ============================================
// ZOD SCHEMAS (Config Validation)
// Note: zod v4 - .strict() is default, use z.record(keySchema, valueSchema)
// ============================================
const GateConfigSchema = z.object({
  weight: z.number()
    .min(0, "Gate weight must be >= 0")
    .max(100, "Gate weight must be <= 100"),
  required: z.boolean(),
  auto_fix: z.boolean(),
  command: z.string().optional(),
  description: z.string().optional(),
  thresholds: z.record(z.string(), z.number()).optional(),
  parallel_group: z.number().int().min(0).optional(),
  timeout_ms: z.number().int().positive().optional(),
});

const SafetyConfigSchema = z.object({
  max_api_calls_per_hour: z.number()
    .int()
    .min(1, "Must allow at least 1 API call per hour")
    .max(1000, "API call limit too high (max 1000)"),
  max_issues_created_per_run: z.number()
    .int()
    .min(0, "Cannot create negative issues")
    .max(50, "Issue creation limit too high (max 50)"),
  forbidden: z.array(z.string()),
});

const GitCommitRulesSchema = z.object({
  forbidden_patterns: z.array(z.string()),
  auto_strip: z.boolean(),
});

const GitRulesConfigSchema = z.object({
  protected_branches: z.array(z.string()),
  commit_rules: GitCommitRulesSchema,
});

const AutonomousConfigSchema = z.object({
  target_score: z.number()
    .min(0, "Target score must be >= 0")
    .max(100, "Target score must be <= 100"),
  max_iterations: z.number()
    .int()
    .min(1, "Must allow at least 1 iteration")
    .max(100, "Too many iterations (max 100)"),
  iteration_delay: z.number()
    .min(0, "Delay cannot be negative")
    .max(300, "Delay too long (max 300 seconds)"),
  gates: z.record(z.string(), GateConfigSchema),
  presets: z.record(z.string(), z.any()).optional(),
  safety: SafetyConfigSchema,
  git_rules: GitRulesConfigSchema,
  providers: z.any().optional(), // Validated separately in loadConfig
});

// Partial schema for user config files (all fields optional)
// Note: zod v4 doesn't have deepPartial, define nested partials explicitly
const PartialGitCommitRulesSchema = z.object({
  forbidden_patterns: z.array(z.string()).optional(),
  auto_strip: z.boolean().optional(),
}).optional();

const PartialGitRulesConfigSchema = z.object({
  protected_branches: z.array(z.string()).optional(),
  commit_rules: PartialGitCommitRulesSchema,
}).optional();

const PartialAutonomousConfigSchema = z.object({
  target_score: z.number().min(0).max(100).optional(),
  max_iterations: z.number().int().min(1).max(100).optional(),
  iteration_delay: z.number().min(0).max(300).optional(),
  gates: z.record(z.string(), GateConfigSchema.partial()).optional(),
  presets: z.record(z.string(), z.any()).optional(),
  safety: SafetyConfigSchema.partial().optional(),
  git_rules: PartialGitRulesConfigSchema,
  providers: z.any().optional(), // Validated separately
}).passthrough();

// ============================================
// PROVIDER SCHEMAS
// ============================================
const ProviderNameSchema = z.enum(["claude", "ollama"]);
type ProviderName = z.infer<typeof ProviderNameSchema>;

const OllamaConfigSchema = z.object({
  enabled: z.boolean(),
  base_url: z.string().url("Invalid Ollama URL - must be a valid URL like http://localhost:11434"),
  model: z.string().optional(),
  api_key: z.string().optional(),
});

// Gate provider can be a simple string or an object with provider + model
const GateProviderConfigSchema = z.object({
  provider: ProviderNameSchema,
  model: z.string().optional(),
});

// Support both formats: "ollama" or { provider: "ollama", model: "qwen3-coder" }
const GateProviderSchema = z.union([
  ProviderNameSchema,
  GateProviderConfigSchema,
]);

const ProvidersConfigSchema = z.object({
  default: ProviderNameSchema,
  ollama: OllamaConfigSchema.optional(),
  gate_providers: z.record(z.string(), GateProviderSchema).optional(),
});

type ProvidersConfig = z.infer<typeof ProvidersConfigSchema>;

// Provider presets for CLI
const PROVIDER_PRESETS: Record<string, ProvidersConfig> = {
  // Default: Claude only
  default: {
    default: "claude",
  },

  // Hybrid: Claude for critical gates, Ollama for others
  ollama_hybrid: {
    default: "claude",
    ollama: {
      enabled: true,
      base_url: "http://localhost:11434",
    },
    gate_providers: {
      test: "claude",
      security: "claude",
      build: "ollama",
      review: "ollama",
      mentor: "claude",
      ux: "ollama",
      architect: "ollama",
      devops: "ollama",
    },
  },

  // Fully local: Ollama only
  ollama_only: {
    default: "ollama",
    ollama: {
      enabled: true,
      base_url: "http://localhost:11434",
    },
  },
};

// ============================================
// TYPE DEFINITIONS
// ============================================
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
  providers?: ProvidersConfig;
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
  provider: string;  // Provider name (e.g., "Claude", "Ollama/qwen3-coder")
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
}

interface GateDefinition {
  name: string;
  description: string;
  tools: string[];
  prompt: string;
}

// ============================================
// PLATFORM TYPES (GitHub/GitLab abstraction)
// ============================================
type PlatformName = "github" | "gitlab";

interface CreateIssueParams {
  title: string;
  body: string;
  labels?: string[];
  parentIssue?: string;
}

interface CreatePRParams {
  title: string;
  body: string;
  sourceBranch: string;
  targetBranch: string;
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
// PROVIDER CLIENT (Single Responsibility)
// ============================================

// Ollama model info from /api/tags
interface OllamaModelInfo {
  name: string;
  size: number;
  details: {
    family: string;
    families?: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

// Model classification for task routing
type ModelCapability = "coding" | "reasoning" | "general" | "fast";

const MODEL_FAMILY_CAPABILITIES: Record<string, ModelCapability> = {
  // Coding-focused models
  qwen: "coding",
  qwen2: "coding",
  qwen3: "coding",
  qwen3moe: "coding",
  "qwen3-coder": "coding",
  "qwen2.5-coder": "coding",
  codellama: "coding",
  "deepseek-coder": "coding",
  deepseek2: "coding",
  starcoder: "coding",
  codestral: "coding",
  // Reasoning models
  llama: "reasoning",
  mistral: "reasoning",
  minimaxm2: "reasoning",
  // Fast/lightweight models
  phi: "fast",
  phi3: "fast",
  gemma: "fast",
  gemma3: "fast",
  tinyllama: "fast",
};

// Model name patterns for classification (checked first, overrides family)
const MODEL_NAME_PATTERNS: Array<{ pattern: RegExp; capability: ModelCapability }> = [
  // Reasoning models (check first - some use coding model architectures)
  { pattern: /deepseek-r1/i, capability: "reasoning" },
  { pattern: /qwq/i, capability: "reasoning" },
  // Coding models
  { pattern: /codestral/i, capability: "coding" },
  { pattern: /deepseek-coder/i, capability: "coding" },
  { pattern: /qwen.*coder/i, capability: "coding" },
  { pattern: /codellama/i, capability: "coding" },
  { pattern: /starcoder/i, capability: "coding" },
];

function classifyModel(family: string, parameterSize: string, modelName?: string): { capability: ModelCapability; tier: "small" | "medium" | "large" } {
  let capability: ModelCapability | undefined;

  // First try model name patterns (most accurate for known models)
  if (modelName) {
    for (const { pattern, capability: cap } of MODEL_NAME_PATTERNS) {
      if (pattern.test(modelName)) {
        capability = cap;
        break;
      }
    }
  }

  // Fall back to family-based classification
  if (!capability) {
    capability = MODEL_FAMILY_CAPABILITIES[family.toLowerCase()];
  }

  // Default to general if still not found
  capability = capability || "general";

  // Parse parameter size (e.g., "7B", "32B", "3.2B")
  const sizeMatch = parameterSize.match(/(\d+\.?\d*)/);
  const sizeNum = sizeMatch ? parseFloat(sizeMatch[1]) : 7;

  let tier: "small" | "medium" | "large";
  if (sizeNum < 7) {
    tier = "small";
  } else if (sizeNum < 20) {
    tier = "medium";
  } else {
    tier = "large";
  }

  return { capability, tier };
}

interface ProviderClientConfig {
  name: ProviderName;
  baseUrl?: string;
  apiKey?: string;
  model?: string;
}

interface HealthCheckResult {
  ok: boolean;
  error?: string;
  latencyMs?: number;
  models?: OllamaModelInfo[];
  configuredModelValid?: boolean;
  configuredModelInfo?: OllamaModelInfo;
}

class ProviderClient {
  private readonly config: ProviderClientConfig;

  constructor(config: ProviderClientConfig) {
    this.config = config;
  }

  /**
   * Get isolated environment variables for this provider.
   * Used with query({ options: { env: client.getEnv() }})
   * This is the KEY to avoiding race conditions - each query gets its own env.
   */
  public getEnv(): Record<string, string | undefined> {
    const env = { ...process.env };

    if (this.config.name === "ollama") {
      env.ANTHROPIC_BASE_URL = this.config.baseUrl;
      env.ANTHROPIC_API_KEY = this.config.apiKey || "ollama";
      env.ANTHROPIC_AUTH_TOKEN = this.config.apiKey || "ollama";
    }
    // For claude, we just use existing env vars (no override needed)

    return env;
  }

  /**
   * Fetch available models from Ollama server
   */
  public async listModels(): Promise<OllamaModelInfo[]> {
    if (this.config.name !== "ollama") {
      return [];
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.config.baseUrl}/api/tags`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        return [];
      }

      const data = await response.json() as { models: OllamaModelInfo[] };
      return data.models || [];
    } catch {
      return [];
    }
  }

  /**
   * Check if the provider is reachable and configured model is valid
   */
  public async healthCheck(): Promise<HealthCheckResult> {
    if (this.config.name === "claude") {
      // Claude is always "healthy" if API key exists
      const hasKey = !!process.env.ANTHROPIC_API_KEY;
      return {
        ok: hasKey,
        error: hasKey ? undefined : "ANTHROPIC_API_KEY not set",
      };
    }

    if (this.config.name === "ollama") {
      const start = Date.now();
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${this.config.baseUrl}/api/tags`, {
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) {
          return { ok: false, error: `HTTP ${response.status}` };
        }

        const data = await response.json() as { models: OllamaModelInfo[] };
        const models = data.models || [];
        const latencyMs = Date.now() - start;

        // Validate configured model if specified
        let configuredModelValid = true;
        let configuredModelInfo: OllamaModelInfo | undefined;

        if (this.config.model) {
          // Match model name (with or without tag)
          const configuredName = this.config.model.toLowerCase();
          configuredModelInfo = models.find((m) => {
            const modelName = m.name.toLowerCase();
            // Exact match or prefix match (e.g., "llama3.2" matches "llama3.2:3b")
            return modelName === configuredName || modelName.startsWith(configuredName + ":");
          });
          configuredModelValid = !!configuredModelInfo;
        }

        return {
          ok: configuredModelValid,
          error: configuredModelValid ? undefined : `Model "${this.config.model}" not found on server`,
          latencyMs,
          models,
          configuredModelValid,
          configuredModelInfo,
        };
      } catch (e) {
        const error = e as Error;
        if (error.name === "AbortError") {
          return { ok: false, error: "Connection timeout (5s)" };
        }
        return { ok: false, error: error.message };
      }
    }

    return { ok: false, error: "Unknown provider" };
  }

  public getName(): ProviderName {
    return this.config.name;
  }

  public getDisplayName(): string {
    if (this.config.name === "ollama") {
      return `Ollama (${this.config.baseUrl})`;
    }
    return "Claude";
  }

  public getModel(): string | undefined {
    return this.config.model;
  }
}

// ============================================
// PROVIDER REGISTRY (Single Responsibility)
// ============================================

// Resolved gate config (normalized from string or object)
interface ResolvedGateProvider {
  provider: ProviderName;
  model?: string;
}

class ProviderRegistry {
  private readonly claudeClient: ProviderClient;
  private readonly defaultOllamaClient?: ProviderClient;
  private readonly ollamaBaseUrl?: string;
  private readonly ollamaApiKey?: string;
  private readonly defaultProvider: ProviderName;
  private readonly defaultOllamaModel?: string;
  private readonly gateProviders: Record<string, ResolvedGateProvider>;
  private readonly gateClientCache: Map<string, ProviderClient> = new Map();

  constructor(config?: ProvidersConfig) {
    // Default to Claude-only if no config provided
    const effectiveConfig = config || { default: "claude" as const };

    this.defaultProvider = effectiveConfig.default;

    // Store Ollama config for creating per-gate clients
    if (effectiveConfig.ollama?.enabled) {
      this.ollamaBaseUrl = effectiveConfig.ollama.base_url;
      this.ollamaApiKey = effectiveConfig.ollama.api_key;
      this.defaultOllamaModel = effectiveConfig.ollama.model;
    }

    // Always create Claude client
    this.claudeClient = new ProviderClient({ name: "claude" });

    // Create default Ollama client if enabled
    if (effectiveConfig.ollama?.enabled) {
      this.defaultOllamaClient = new ProviderClient({
        name: "ollama",
        baseUrl: effectiveConfig.ollama.base_url,
        apiKey: effectiveConfig.ollama.api_key,
        model: effectiveConfig.ollama.model,
      });
    }

    // Normalize gate_providers to ResolvedGateProvider format
    this.gateProviders = {};
    if (effectiveConfig.gate_providers) {
      for (const [gate, config] of Object.entries(effectiveConfig.gate_providers)) {
        if (typeof config === "string") {
          // Simple format: "ollama"
          this.gateProviders[gate] = { provider: config };
        } else {
          // Object format: { provider: "ollama", model: "qwen3-coder" }
          this.gateProviders[gate] = {
            provider: config.provider,
            model: config.model,
          };
        }
      }
    }
  }

  /**
   * Get the provider client for a specific gate (with per-gate model support)
   */
  public getClientForGate(gateName: string): ProviderClient {
    const gateConfig = this.gateProviders[gateName];
    const providerName = gateConfig?.provider || this.defaultProvider;
    const gateModel = gateConfig?.model;

    // Claude doesn't support model override
    if (providerName === "claude") {
      return this.claudeClient;
    }

    // Ollama with per-gate model
    if (providerName === "ollama") {
      if (!this.ollamaBaseUrl) {
        console.warn(`[WARN] Ollama requested for gate "${gateName}" but not configured. Using Claude.`);
        return this.claudeClient;
      }

      // If no custom model, use default Ollama client
      if (!gateModel) {
        return this.defaultOllamaClient!;
      }

      // Create or retrieve cached client for this gate's model
      const cacheKey = `ollama:${gateModel}`;
      if (!this.gateClientCache.has(cacheKey)) {
        this.gateClientCache.set(cacheKey, new ProviderClient({
          name: "ollama",
          baseUrl: this.ollamaBaseUrl,
          apiKey: this.ollamaApiKey,
          model: gateModel,
        }));
      }
      return this.gateClientCache.get(cacheKey)!;
    }

    return this.claudeClient;
  }

  /**
   * Get the model name for a specific gate (for display)
   */
  public getModelForGate(gateName: string): string | undefined {
    const gateConfig = this.gateProviders[gateName];
    return gateConfig?.model || this.defaultOllamaModel;
  }

  /**
   * Get the default provider client (for implementation phase)
   */
  public getDefaultClient(): ProviderClient {
    if (this.defaultProvider === "ollama" && this.defaultOllamaClient) {
      return this.defaultOllamaClient;
    }
    return this.claudeClient;
  }

  /**
   * Run health checks on all configured providers
   */
  public async healthCheckAll(): Promise<Record<string, HealthCheckResult>> {
    const results: Record<string, HealthCheckResult> = {};

    results.claude = await this.claudeClient.healthCheck();

    if (this.defaultOllamaClient) {
      results.ollama = await this.defaultOllamaClient.healthCheck();
    }

    return results;
  }

  /**
   * Check if Ollama is configured
   */
  public hasOllama(): boolean {
    return !!this.defaultOllamaClient;
  }

  /**
   * Get summary of provider configuration
   */
  public getSummary(): string {
    const parts = [`Default: ${this.defaultProvider}`];

    if (this.defaultOllamaClient) {
      parts.push(`Ollama: ${this.defaultOllamaClient.getDisplayName()}`);
      if (this.defaultOllamaModel) {
        parts.push(`Model: ${this.defaultOllamaModel}`);
      }
    }

    const overrides = Object.entries(this.gateProviders);
    if (overrides.length > 0) {
      const claudeGates = overrides.filter(([, cfg]) => cfg.provider === "claude").map(([g]) => g);
      const ollamaGates = overrides.filter(([, cfg]) => cfg.provider === "ollama").map(([g]) => g);
      const customModelGates = overrides.filter(([, cfg]) => cfg.model).map(([g, cfg]) => `${g}:${cfg.model}`);

      if (claudeGates.length > 0) {
        parts.push(`Claude gates: ${claudeGates.join(", ")}`);
      }
      if (ollamaGates.length > 0) {
        parts.push(`Ollama gates: ${ollamaGates.join(", ")}`);
      }
      if (customModelGates.length > 0) {
        parts.push(`Custom models: ${customModelGates.join(", ")}`);
      }
    }

    return parts.join(" | ");
  }
}

// ============================================
// PLATFORM CLIENT (GitHub/GitLab abstraction)
// ============================================

/**
 * Safe command execution helper (no shell, no injection risk)
 */
async function execCommand(command: string, args: string[]): Promise<{ stdout: string; ok: boolean }> {
  const { execFile } = require("child_process");
  return new Promise((resolve) => {
    execFile(command, args, { encoding: "utf-8", timeout: 5000 }, (error: Error | null, stdout: string) => {
      resolve({ stdout: stdout?.trim() || "", ok: !error });
    });
  });
}

/**
 * Detect platform from git remote URL or config files
 */
async function detectPlatform(): Promise<PlatformName> {
  // Check for GitLab CI file first (most reliable indicator)
  if (existsSync(join(process.cwd(), ".gitlab-ci.yml"))) {
    return "gitlab";
  }

  // Check for GitHub workflows directory
  if (existsSync(join(process.cwd(), ".github", "workflows"))) {
    return "github";
  }

  // Try to detect from git remote
  const { stdout, ok } = await execCommand("git", ["remote", "get-url", "origin"]);
  if (ok && stdout) {
    for (const pattern of GITLAB_REMOTE_PATTERNS) {
      if (pattern.test(stdout)) {
        return "gitlab";
      }
    }

    for (const pattern of GITHUB_REMOTE_PATTERNS) {
      if (pattern.test(stdout)) {
        return "github";
      }
    }
  }

  // Default to GitHub
  return "github";
}

/**
 * Abstract interface for platform operations (GitHub/GitLab)
 */
interface IPlatformClient {
  getName(): PlatformName;
  getDisplayName(): string;
  getIssueViewCommand(issueId: string): string;
  getIssueCreateCommand(params: CreateIssueParams): string;
  getIssueCommentCommand(issueId: string, body: string): string;
  getPRCreateCommand(params: CreatePRParams): string;
  getTokenEnvVar(): string;
  validateCLI(): Promise<boolean>;
}

/**
 * GitHub CLI implementation
 */
class GitHubClient implements IPlatformClient {
  getName(): PlatformName {
    return "github";
  }

  getDisplayName(): string {
    return "GitHub (gh)";
  }

  getIssueViewCommand(issueId: string): string {
    return `gh issue view ${issueId}`;
  }

  getIssueCreateCommand(params: CreateIssueParams): string {
    const labelArg = params.labels?.length ? ` --label "${params.labels.join(",")}"` : "";
    // Use heredoc for body to handle multi-line content
    return `gh issue create --title "${sanitizeForShell(params.title)}"${labelArg} --body "$(cat <<'RALPH_EOF'\n${params.body}\nRALPH_EOF\n)"`;
  }

  getIssueCommentCommand(issueId: string, body: string): string {
    // Use heredoc for body to handle multi-line content
    return `gh issue comment ${issueId} --body "$(cat <<'RALPH_EOF'\n${body}\nRALPH_EOF\n)"`;
  }

  getPRCreateCommand(params: CreatePRParams): string {
    return `gh pr create --title "${sanitizeForShell(params.title)}" --body "$(cat <<'RALPH_EOF'\n${params.body}\nRALPH_EOF\n)" --base ${params.targetBranch}`;
  }

  getTokenEnvVar(): string {
    return "GITHUB_TOKEN";
  }

  async validateCLI(): Promise<boolean> {
    const { ok } = await execCommand("gh", ["--version"]);
    return ok;
  }
}

/**
 * GitLab CLI implementation (glab)
 */
class GitLabClient implements IPlatformClient {
  getName(): PlatformName {
    return "gitlab";
  }

  getDisplayName(): string {
    return "GitLab (glab)";
  }

  getIssueViewCommand(issueId: string): string {
    return `glab issue view ${issueId}`;
  }

  getIssueCreateCommand(params: CreateIssueParams): string {
    const labelArg = params.labels?.length ? ` --label "${params.labels.join(",")}"` : "";
    // Use heredoc for description to handle multi-line content
    return `glab issue create --title "${sanitizeForShell(params.title)}"${labelArg} --description "$(cat <<'RALPH_EOF'\n${params.body}\nRALPH_EOF\n)"`;
  }

  getIssueCommentCommand(issueId: string, body: string): string {
    // GitLab uses 'note' for comments
    return `glab issue note ${issueId} --message "$(cat <<'RALPH_EOF'\n${body}\nRALPH_EOF\n)"`;
  }

  getPRCreateCommand(params: CreatePRParams): string {
    // GitLab uses 'mr' (merge request) instead of 'pr'
    return `glab mr create --title "${sanitizeForShell(params.title)}" --description "$(cat <<'RALPH_EOF'\n${params.body}\nRALPH_EOF\n)" --target-branch ${params.targetBranch} --source-branch ${params.sourceBranch}`;
  }

  getTokenEnvVar(): string {
    return "GITLAB_TOKEN";
  }

  async validateCLI(): Promise<boolean> {
    const { ok } = await execCommand("glab", ["--version"]);
    return ok;
  }
}

/**
 * Factory for creating platform clients
 */
class PlatformRegistry {
  private client: IPlatformClient;
  private detectedPlatform: PlatformName;
  private initialized: boolean = false;

  constructor() {
    // Default to GitHub, will be updated in init()
    this.detectedPlatform = "github";
    this.client = new GitHubClient();
  }

  public async init(forcePlatform?: PlatformName): Promise<void> {
    if (this.initialized && !forcePlatform) return;

    this.detectedPlatform = forcePlatform || await detectPlatform();

    if (this.detectedPlatform === "gitlab") {
      this.client = new GitLabClient();
    } else {
      this.client = new GitHubClient();
    }

    this.initialized = true;
  }

  public getClient(): IPlatformClient {
    return this.client;
  }

  public getPlatform(): PlatformName {
    return this.detectedPlatform;
  }

  public async validateSetup(): Promise<{ ok: boolean; error?: string }> {
    const cliValid = await this.client.validateCLI();
    if (!cliValid) {
      const cli = this.detectedPlatform === "gitlab" ? "glab" : "gh";
      return {
        ok: false,
        error: `${cli} CLI not found. Install it from: ${
          this.detectedPlatform === "gitlab"
            ? "https://gitlab.com/gitlab-org/cli"
            : "https://cli.github.com"
        }`,
      };
    }

    const tokenVar = this.client.getTokenEnvVar();
    if (!process.env[tokenVar]) {
      return {
        ok: true, // CLI auth may work without explicit token
        error: `${tokenVar} not set - using CLI authentication`,
      };
    }

    return { ok: true };
  }

  public getSummary(): string {
    return `Platform: ${this.client.getDisplayName()}`;
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
  public readonly providerRegistry: ProviderRegistry;
  public readonly platformRegistry: PlatformRegistry;

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
      providerRegistry?: ProviderRegistry;
      platformRegistry?: PlatformRegistry;
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
    this.providerRegistry = dependencies?.providerRegistry ?? new ProviderRegistry(config.providers);
    this.platformRegistry = dependencies?.platformRegistry ?? new PlatformRegistry();
  }

  public async initPlatform(): Promise<void> {
    await this.platformRegistry.init();
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
  // Allow provider presets (they're handled separately in loadConfig)
  if (VALID_PROVIDER_PRESETS.includes(input as typeof VALID_PROVIDER_PRESETS[number])) {
    return undefined; // Not a general preset, but valid
  }
  if (!VALID_PRESETS.includes(input as Preset)) {
    const allValid = [...VALID_PRESETS, ...VALID_PROVIDER_PRESETS].join(", ");
    throw new Error(`Invalid preset: "${input}". Valid: ${allValid}`);
  }
  return input as Preset;
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
function validateEnvironment(platform?: PlatformName): void {
  const required = ["ANTHROPIC_API_KEY"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("\n[ERROR] Missing required environment variables:");
    missing.forEach((key) => console.error(`  - ${key}`));
    console.error("\nSet them in your environment or .env file:");
    console.error("  export ANTHROPIC_API_KEY=your-api-key\n");
    process.exit(1);
  }

  // Check platform-specific token
  const tokenVar = platform === "gitlab" ? "GITLAB_TOKEN" : "GITHUB_TOKEN";
  if (!process.env[tokenVar]) {
    const cli = platform === "gitlab" ? "glab" : "gh";
    console.warn(`[WARN] ${tokenVar} not set - using ${cli} CLI authentication`);
  }
}

// ============================================
// CONFIGURATION
// ============================================
function formatZodError(error: z.ZodError): string {
  // zod v4 uses .issues instead of .errors
  return error.issues.map((issue) => {
    const path = issue.path.join(".");
    return `  - ${path ? `${path}: ` : ""}${issue.message}`;
  }).join("\n");
}

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

      // Validate with Zod (partial schema allows missing fields)
      const parseResult = PartialAutonomousConfigSchema.safeParse(fileConfig);
      if (!parseResult.success) {
        console.error("[ERROR] Configuration validation failed:");
        console.error(formatZodError(parseResult.error));
        console.error("\nUsing defaults. Fix the issues above in .claude/autonomous.yml");
      } else {
        const validConfig = parseResult.data;

        // Merge validated config with defaults
        if (validConfig.target_score !== undefined) {
          defaultConfig.target_score = validConfig.target_score;
        }
        if (validConfig.max_iterations !== undefined) {
          defaultConfig.max_iterations = validConfig.max_iterations;
        }
        if (validConfig.iteration_delay !== undefined) {
          defaultConfig.iteration_delay = validConfig.iteration_delay;
        }
        if (validConfig.gates) {
          for (const [gateName, gateConfig] of Object.entries(validConfig.gates)) {
            if (defaultConfig.gates[gateName]) {
              Object.assign(defaultConfig.gates[gateName], gateConfig);
            } else {
              // New gate - ensure required fields have defaults
              defaultConfig.gates[gateName] = {
                weight: gateConfig.weight ?? 0,
                required: gateConfig.required ?? false,
                auto_fix: gateConfig.auto_fix ?? false,
                ...gateConfig,
              };
            }
          }
        }
        if (validConfig.safety) {
          Object.assign(defaultConfig.safety, validConfig.safety);
        }
        if (validConfig.git_rules) {
          if (validConfig.git_rules.protected_branches) {
            defaultConfig.git_rules.protected_branches = validConfig.git_rules.protected_branches;
          }
          if (validConfig.git_rules.commit_rules) {
            Object.assign(defaultConfig.git_rules.commit_rules, validConfig.git_rules.commit_rules);
          }
        }
        if (validConfig.presets) {
          defaultConfig.presets = validConfig.presets;
        }

        // Handle providers config
        if (validConfig.providers) {
          const providersResult = ProvidersConfigSchema.safeParse(validConfig.providers);
          if (!providersResult.success) {
            console.error("[ERROR] Provider configuration validation failed:");
            console.error(formatZodError(providersResult.error));
            console.error("\nProviders config ignored. Using Claude only.");
          } else {
            defaultConfig.providers = providersResult.data;
          }
        }
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      console.warn(`[WARN] Config parse error: ${message}. Using defaults.`);
    }
  }

  // Apply general preset (default, production, prototype, frontend)
  const validatedPreset = validatePreset(preset);
  if (validatedPreset && defaultConfig.presets?.[validatedPreset]) {
    Object.assign(defaultConfig, defaultConfig.presets[validatedPreset]);
  }

  // Apply provider preset if specified (ollama_hybrid, ollama_only)
  // Merge with existing providers config to preserve user's base_url, model, etc.
  if (preset && PROVIDER_PRESETS[preset]) {
    const presetProviders = PROVIDER_PRESETS[preset];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingProviders = (defaultConfig.providers || {}) as any;
    const existingOllama = existingProviders.ollama || {};
    const existingGateProviders = existingProviders.gate_providers || {};

    defaultConfig.providers = {
      ...presetProviders,
      // Preserve user's ollama config (base_url, model) if they specified one
      ollama: {
        ...presetProviders.ollama,
        // User's config takes precedence
        ...(existingOllama.base_url && { base_url: existingOllama.base_url }),
        ...(existingOllama.model && { model: existingOllama.model }),
        ...(existingOllama.api_key && { api_key: existingOllama.api_key }),
      },
      // Merge gate_providers: user's config takes precedence
      gate_providers: {
        ...presetProviders.gate_providers,
        ...existingGateProviders,
      },
    };
  }

  // Final validation of merged config
  const finalResult = AutonomousConfigSchema.safeParse(defaultConfig);
  if (!finalResult.success) {
    console.error("[ERROR] Final config validation failed:");
    console.error(formatZodError(finalResult.error));
    throw new Error("Configuration validation failed");
  }

  return finalResult.data;
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

  // Get the provider for this gate (may be different from default in hybrid mode)
  const providerClient = ctx.providerRegistry.getClientForGate(gateName);
  const modelName = providerClient.getModel();
  const providerDisplay = modelName
    ? `${providerClient.getDisplayName()}/${modelName}`
    : providerClient.getDisplayName();

  const result: GateResult = {
    gate: gateName,
    score: 0,
    maxScore: gateConfig.weight,
    passed: false,
    issues: [],
    duration: 0,
    autoFixed: 0,
    timedOut: false,
    provider: providerDisplay,
  };

  const agentName = getAgentNameForGate(gateName);
  ctx.logger.info(`[${gateName}] Provider: ${providerDisplay}`);

  const executeGate = async (): Promise<void> => {
    for await (const message of query({
      prompt: `Use the ${agentName} agent to evaluate this codebase. Return only valid JSON.`,
      options: {
        resume: ctx.sessionId,
        allowedTools: ["Task", "Read", "Glob", "Grep", "Bash", "Edit"],
        agents: gateAgents,
        permissionMode: gateConfig.auto_fix ? "acceptEdits" : "bypassPermissions",
        env: providerClient.getEnv(),  // Isolated env for this provider
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
  const labels = ["auto-generated", gateName, gateIssue.severity];

  const description = sanitizeForShell(gateIssue.description).slice(0, 500);
  const recommendation = sanitizeForShell(gateIssue.recommendation || "Review and address manually.").slice(0, 500);

  const body = `## Severity: ${gateIssue.severity.toUpperCase()}

**Found by:** /${gateName} gate
**File:** ${sanitizeForShell(gateIssue.file || "N/A")}
**Auto-fixable:** ${gateIssue.autoFixable ? "Yes" : "No"}

### Description
${description}

### Recommendation
${recommendation}

---
Parent issue: #${parentIssue}`;

  const platformClient = ctx.platformRegistry.getClient();
  const platformName = ctx.platformRegistry.getPlatform();

  try {
    for await (const message of query({
      prompt: `Create an issue on ${platformName === "gitlab" ? "GitLab" : "GitHub"} with:
- Title: "${title}"
- Labels: "${labels.join(",")}"
- Body/Description (use heredoc for proper formatting):
${body}

Use this command (platform: ${platformClient.getDisplayName()}):
${platformClient.getIssueCreateCommand({ title, body, labels })}`,
      options: {
        resume: ctx.sessionId,
        allowedTools: ["Bash"],
      },
    })) {
      if (isResultMessage(message)) {
        // Match issue number from both GitHub (#123) and GitLab (!123 or #123) output
        const issueMatch = message.result.match(/[#!](\d+)/);
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
  const platformClient = ctx.platformRegistry.getClient();
  const platformName = ctx.platformRegistry.getPlatform();

  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for await (const _message of query({
      prompt: `Post a comment to ${platformName === "gitlab" ? "GitLab" : "GitHub"} issue #${issueId}.
Content (first 1000 chars): ${commentBody.slice(0, 1000)}...

Use this command (platform: ${platformClient.getDisplayName()}):
${platformClient.getIssueCommentCommand(issueId, commentBody)}`,
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
      return `| /${g.gate} | ${g.score}/${g.maxScore} | ${status} | ${g.provider} | ${g.issues.length} issues |`;
    })
    .join("\n");

  return `## Ralph Run - Iteration ${result.iteration}

**Status:** ${result.passed ? "TARGET REACHED" : "IN PROGRESS"}
**Score:** ${result.totalScore}/${result.targetScore}
**Duration:** ${(result.duration / 1000).toFixed(1)}s

### Quality Gates

| Gate | Score | Status | Provider | Issues |
|------|-------|--------|----------|--------|
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
  const config = loadConfig(options.preset);
  const ctx = new RunContext(issueId, config, options);
  const gateAgents = loadGateDefinitions();

  // Initialize platform detection
  await ctx.initPlatform();
  const platformClient = ctx.platformRegistry.getClient();
  const platformName = ctx.platformRegistry.getPlatform();

  // Validate environment with platform-specific checks
  validateEnvironment(platformName);

  // Validate platform CLI is available
  const platformSetup = await ctx.platformRegistry.validateSetup();
  if (!platformSetup.ok) {
    console.error(`\n[ERROR] ${platformSetup.error}`);
    process.exit(1);
  }

  console.log("\n" + "=".repeat(60));
  console.log("          RALPH WIGGUM - Autonomous Development");
  console.log("=".repeat(60));
  console.log(`  Issue: #${issueId}`);
  console.log(`  Target: ${config.target_score}/100`);
  console.log(`  Max iterations: ${config.max_iterations}`);
  console.log(`  Preset: ${options.preset || "default"}`);
  console.log(`  Run ID: ${ctx.runId}`);
  console.log(`  Platform: ${ctx.platformRegistry.getSummary()}`);
  console.log(`  Providers: ${ctx.providerRegistry.getSummary()}`);
  if (options.dryRun) console.log("  MODE: DRY RUN (no changes will be made)");
  console.log("=".repeat(60) + "\n");

  // Health check providers if Ollama is configured
  if (ctx.providerRegistry.hasOllama()) {
    ctx.logger.info("Checking provider health...");
    const health = await ctx.providerRegistry.healthCheckAll();
    for (const [name, result] of Object.entries(health)) {
      if (result.ok) {
        ctx.logger.info(`  ${name}: OK${result.latencyMs ? ` (${result.latencyMs}ms)` : ""}`);
      } else {
        ctx.logger.warn(`  ${name}: FAILED - ${result.error}`);
      }
    }
    console.log();
  }

  if (options.dryRun) {
    console.log("[DRY RUN] Configuration validated. Would execute:");
    console.log(`  - Fetch issue #${issueId} (using ${platformClient.getDisplayName()})`);
    console.log(`  - Create branch: feature/${issueId}-implement`);
    console.log(`  - Run gates: ${Object.keys(config.gates).join(", ")}`);
    console.log(`  - Target score: ${config.target_score}`);
    console.log(`  - Gate timeout: ${DEFAULT_GATE_TIMEOUT_MS / 1000}s`);
    console.log(`  - Platform: ${ctx.platformRegistry.getSummary()}`);
    console.log(`  - Providers: ${ctx.providerRegistry.getSummary()}`);
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

  // Use default provider for implementation phase
  const implementationProvider = ctx.providerRegistry.getDefaultClient();
  ctx.logger.info(`Implementation provider: ${implementationProvider.getDisplayName()}`);

  const platformDisplayName = platformName === "gitlab" ? "GitLab" : "GitHub";
  const issueViewCommand = platformClient.getIssueViewCommand(issueId);

  for await (const message of query({
    prompt: `You are starting an autonomous development session for issue #${issueId}.

PLATFORM: ${platformDisplayName} (using ${platformClient.getDisplayName()})

STEPS:
1. Fetch issue #${issueId} from ${platformDisplayName} (use: ${issueViewCommand})
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
      env: implementationProvider.getEnv(),  // Isolated env for provider
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

    // Display gate results summary with provider info
    console.log("\n   Gate Results:");
    for (const g of gateResults) {
      const status = g.timedOut ? "TIMEOUT" : g.passed ? "PASS" : "FAIL";
      const statusIcon = g.timedOut ? "⏱️" : g.passed ? "✅" : "❌";
      console.log(`   ${statusIcon} /${g.gate}: ${g.score}/${g.maxScore} (${g.provider}) [${status}]`);
    }

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

  // === PHASE 3: Create PR/MR ===
  if (currentScore >= config.target_score || (currentScore >= PR_FALLBACK_SCORE && ctx.iteration >= config.max_iterations)) {
    const prType = platformName === "gitlab" ? "merge request" : "pull request";
    ctx.logger.info(`\nPhase 3: Creating ${prType}...`);

    const prTitle = `feat: implement #${issueId}`;
    const prBody = `Implements #${issueId}\n\nQuality gate scores: ${currentScore}/${config.target_score}`;
    const sourceBranch = `feature/${issueId}-implement`;
    const targetBranch = "staging";

    const prCommand = platformClient.getPRCreateCommand({
      title: prTitle,
      body: prBody,
      sourceBranch,
      targetBranch,
    });

    for await (const message of query({
      prompt: `Create a ${prType} from the current branch to staging.
Title: "${prTitle}"
Include quality gate scores in the body.

PLATFORM: ${platformDisplayName}
Use this command:
${prCommand}`,
      options: {
        resume: ctx.sessionId,
        allowedTools: ["Bash", "Read"],
        env: implementationProvider.getEnv(),
      },
    })) {
      if (isResultMessage(message)) {
        ctx.logger.info(`${prType} created successfully`);
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
function parseArgs(): { issueId?: string; preset?: string; supervised: boolean; dryRun: boolean; testProvider: boolean } {
  const args = process.argv.slice(2);
  return {
    issueId: args.find((a) => a.startsWith("--issue="))?.split("=")[1],
    preset: args.find((a) => a.startsWith("--preset="))?.split("=")[1],
    supervised: args.includes("--supervised"),
    dryRun: args.includes("--dry-run"),
    testProvider: args.includes("--test-provider"),
  };
}

async function testProviders(preset?: string): Promise<void> {
  console.log("\n" + "=".repeat(50));
  console.log("           PROVIDER HEALTH CHECK");
  console.log("=".repeat(50) + "\n");

  const config = loadConfig(preset);
  const registry = new ProviderRegistry(config.providers);

  console.log("Testing providers...\n");

  const results = await registry.healthCheckAll();
  let allHealthy = true;

  // Display Claude results
  if (results.claude) {
    console.log("  Claude API:");
    if (results.claude.ok) {
      console.log("    \u2713 ANTHROPIC_API_KEY is set");
      console.log("    \u2713 Provider configured");
    } else {
      console.log("    \u2717 " + (results.claude.error || "Not configured"));
      allHealthy = false;
    }
    console.log();
  }

  // Display Ollama results
  if (results.ollama) {
    const ollamaConfig = config.providers?.ollama;
    const url = ollamaConfig?.base_url || "http://localhost:11434";
    console.log(`  Ollama (${url}):`);

    // Check if server is reachable (latencyMs indicates successful connection)
    const serverReachable = results.ollama.latencyMs !== undefined;

    if (serverReachable) {
      console.log("    \u2713 Server reachable");
      console.log(`    \u2713 Response time: ${results.ollama.latencyMs}ms`);

      // Show available models
      if (results.ollama.models && results.ollama.models.length > 0) {
        console.log(`    \u2713 Available models: ${results.ollama.models.length}`);
        console.log();
        console.log("    Available Models:");
        for (const model of results.ollama.models) {
          const { capability, tier } = classifyModel(
            model.details.family,
            model.details.parameter_size,
            model.name
          );
          const sizeGB = (model.size / 1024 / 1024 / 1024).toFixed(1);
          console.log(
            `      - ${model.name} (${model.details.parameter_size}, ${sizeGB}GB)`
          );
          console.log(
            `        Family: ${model.details.family} | Capability: ${capability} | Tier: ${tier}`
          );
        }
        console.log();
      } else {
        console.log("    \u26a0 No models found. Pull one with: ollama pull <model>");
        allHealthy = false;
      }

      // Validate configured model
      if (ollamaConfig?.model) {
        if (results.ollama.configuredModelValid && results.ollama.configuredModelInfo) {
          const info = results.ollama.configuredModelInfo;
          const { capability, tier } = classifyModel(
            info.details.family,
            info.details.parameter_size,
            info.name
          );
          console.log(`    \u2713 Configured model: ${ollamaConfig.model}`);
          console.log(`      Matched: ${info.name} (${info.details.parameter_size})`);
          console.log(`      Capability: ${capability} | Tier: ${tier}`);
        } else {
          console.log(`    \u2717 Configured model "${ollamaConfig.model}" NOT FOUND`);
          console.log("      Available models:");
          for (const model of results.ollama.models || []) {
            console.log(`        - ${model.name}`);
          }
          allHealthy = false;
        }
      } else {
        console.log("    \u26a0 No model configured. Add 'model: <name>' to config.");
      }
    } else {
      console.log("    \u2717 " + (results.ollama.error || "Connection failed"));
      allHealthy = false;
    }
    console.log();
  }

  // Summary
  console.log("=".repeat(50));
  if (allHealthy) {
    console.log("\u2713 All providers healthy.");
    console.log("=".repeat(50) + "\n");
    process.exit(0);
  } else {
    console.log("\u2717 Some providers are unhealthy.");
    console.log("=".repeat(50));
    console.log("\nTroubleshooting:");
    if (results.ollama && !results.ollama.ok) {
      console.log("  - Start Ollama: ollama serve");
      console.log("  - Check URL in config: .claude/autonomous.yml");
    }
    if (results.claude && !results.claude.ok) {
      console.log("  - Set ANTHROPIC_API_KEY environment variable");
    }
    console.log();
    process.exit(1);
  }
}

function printUsage(): void {
  console.log(`
RALPH WIGGUM - Autonomous Development Runner

USAGE:
  npx tsx ralph-runner.ts --issue=123
  npx tsx ralph-runner.ts --issue=123 --preset=production
  npx tsx ralph-runner.ts --issue=123 --supervised
  npx tsx ralph-runner.ts --issue=123 --dry-run
  npx tsx ralph-runner.ts --test-provider
  npx tsx ralph-runner.ts --test-provider --preset=ollama_hybrid

OPTIONS:
  --issue=ID       Run on a single issue (required for runs)
  --preset=NAME    Use config preset (default, production, ollama_hybrid, ollama_only)
  --supervised     Pause after each iteration for review
  --dry-run        Validate config without executing
  --test-provider  Test provider connectivity and exit

PLATFORM SUPPORT:
  GitHub           Auto-detected from .github/ or git remote (uses gh CLI)
  GitLab           Auto-detected from .gitlab-ci.yml or git remote (uses glab CLI)

  Platform is detected automatically. Ensure the appropriate CLI is installed:
    GitHub: https://cli.github.com
    GitLab: https://gitlab.com/gitlab-org/cli

ENVIRONMENT:
  ANTHROPIC_API_KEY  Required: Your Anthropic API key
  GITHUB_TOKEN       Optional: GitHub token (falls back to gh CLI auth)
  GITLAB_TOKEN       Optional: GitLab token (falls back to glab CLI auth)
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

GATE DEFINITIONS:
  External YAML files in: scripts/gates/
  Override or add gates by creating *.yml files

TIMEOUTS:
  Default gate timeout: ${DEFAULT_GATE_TIMEOUT_MS / 1000 / 60} minutes
  Configure per-gate: timeout_ms in autonomous.yml

CONFIG: .claude/autonomous.yml
`);
}

// Main
const { issueId, preset, supervised, dryRun, testProvider } = parseArgs();

if (testProvider) {
  // Health check mode - test providers and exit
  testProviders(preset).catch((e) => {
    console.error("[FATAL]", e.message);
    process.exit(1);
  });
} else if (issueId) {
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
} else {
  printUsage();
}
