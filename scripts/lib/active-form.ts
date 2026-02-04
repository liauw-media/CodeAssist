/**
 * Converts imperative task titles ("Fix login bug") to present-continuous
 * active form ("Fixing login bug") for progress spinners and status lines.
 */

// Irregular verb lookup: imperative → "-ing" form
const VERB_LOOKUP: Record<string, string> = {
  // Common development verbs
  add: "Adding",
  apply: "Applying",
  audit: "Auditing",
  benchmark: "Benchmarking",
  build: "Building",
  bump: "Bumping",
  check: "Checking",
  clean: "Cleaning",
  clear: "Clearing",
  clone: "Cloning",
  close: "Closing",
  commit: "Committing",
  configure: "Configuring",
  connect: "Connecting",
  convert: "Converting",
  copy: "Copying",
  create: "Creating",
  debug: "Debugging",
  delete: "Deleting",
  deploy: "Deploying",
  detect: "Detecting",
  disable: "Disabling",
  drop: "Dropping",
  enable: "Enabling",
  enforce: "Enforcing",
  ensure: "Ensuring",
  execute: "Executing",
  export: "Exporting",
  extend: "Extending",
  extract: "Extracting",
  fetch: "Fetching",
  filter: "Filtering",
  find: "Finding",
  fix: "Fixing",
  format: "Formatting",
  generate: "Generating",
  get: "Getting",
  handle: "Handling",
  implement: "Implementing",
  import: "Importing",
  improve: "Improving",
  index: "Indexing",
  initialize: "Initializing",
  inject: "Injecting",
  install: "Installing",
  integrate: "Integrating",
  introduce: "Introducing",
  investigate: "Investigating",
  launch: "Launching",
  lint: "Linting",
  list: "Listing",
  load: "Loading",
  log: "Logging",
  make: "Making",
  manage: "Managing",
  merge: "Merging",
  migrate: "Migrating",
  minimize: "Minimizing",
  mock: "Mocking",
  modify: "Modifying",
  monitor: "Monitoring",
  move: "Moving",
  normalize: "Normalizing",
  open: "Opening",
  optimize: "Optimizing",
  orchestrate: "Orchestrating",
  override: "Overriding",
  parse: "Parsing",
  patch: "Patching",
  plan: "Planning",
  poll: "Polling",
  prevent: "Preventing",
  process: "Processing",
  profile: "Profiling",
  provision: "Provisioning",
  publish: "Publishing",
  pull: "Pulling",
  push: "Pushing",
  read: "Reading",
  rebuild: "Rebuilding",
  reduce: "Reducing",
  refactor: "Refactoring",
  refresh: "Refreshing",
  register: "Registering",
  release: "Releasing",
  reload: "Reloading",
  remove: "Removing",
  rename: "Renaming",
  render: "Rendering",
  replace: "Replacing",
  report: "Reporting",
  request: "Requesting",
  require: "Requiring",
  reset: "Resetting",
  resolve: "Resolving",
  restart: "Restarting",
  restore: "Restoring",
  restructure: "Restructuring",
  retry: "Retrying",
  return: "Returning",
  revert: "Reverting",
  review: "Reviewing",
  revoke: "Revoking",
  rewrite: "Rewriting",
  run: "Running",
  save: "Saving",
  scaffold: "Scaffolding",
  scan: "Scanning",
  schedule: "Scheduling",
  search: "Searching",
  secure: "Securing",
  seed: "Seeding",
  send: "Sending",
  serve: "Serving",
  set: "Setting",
  setup: "Setting up",
  ship: "Shipping",
  show: "Showing",
  simplify: "Simplifying",
  skip: "Skipping",
  sort: "Sorting",
  split: "Splitting",
  start: "Starting",
  stop: "Stopping",
  store: "Storing",
  stream: "Streaming",
  strip: "Stripping",
  stub: "Stubbing",
  submit: "Submitting",
  support: "Supporting",
  suppress: "Suppressing",
  swap: "Swapping",
  sync: "Syncing",
  tag: "Tagging",
  test: "Testing",
  throttle: "Throttling",
  toggle: "Toggling",
  trace: "Tracing",
  track: "Tracking",
  transform: "Transforming",
  trigger: "Triggering",
  trim: "Trimming",
  truncate: "Truncating",
  type: "Typing",
  unblock: "Unblocking",
  undo: "Undoing",
  uninstall: "Uninstalling",
  unlink: "Unlinking",
  unlock: "Unlocking",
  unwrap: "Unwrapping",
  update: "Updating",
  upgrade: "Upgrading",
  upload: "Uploading",
  validate: "Validating",
  verify: "Verifying",
  version: "Versioning",
  watch: "Watching",
  wire: "Wiring",
  wrap: "Wrapping",
  write: "Writing",
};

// Prefixes that indicate the first word is NOT a verb
// (e.g. "Core feature" should not become "Coring feature")
const NON_VERB_PREFIXES = new Set([
  "api", "app", "auth", "aws", "base", "ci", "cli", "config", "core",
  "css", "data", "db", "dev", "dns", "docker", "dom", "env", "error",
  "file", "git", "gql", "graphql", "html", "http", "i18n", "json",
  "jwt", "k8s", "key", "log", "mcp", "model", "node", "npm", "oauth",
  "orm", "package", "page", "php", "pr", "queue", "react", "redis",
  "rest", "route", "rpc", "schema", "sdk", "server", "service", "sql",
  "ssh", "ssl", "state", "style", "tcp", "tls", "token", "ts", "ui",
  "url", "user", "vue", "webpack", "xml", "yaml",
]);

/**
 * Apply "-ing" suffix using English grammar rules.
 * Handles: silent-e drop, CVC doubling, ie→ying, ee/ye/oe preservation.
 */
function applyIngSuffix(verb: string): string {
  const lower = verb.toLowerCase();

  // ie → ying (die → dying, lie → lying)
  if (lower.endsWith("ie")) {
    return verb.slice(0, -2) + "ying";
  }

  // ee, ye, oe → keep e + ing (see → seeing, dye → dyeing)
  if (lower.endsWith("ee") || lower.endsWith("ye") || lower.endsWith("oe")) {
    return verb + "ing";
  }

  // Silent-e drop (make → making, configure → configuring)
  if (lower.endsWith("e") && lower.length > 2) {
    return verb.slice(0, -1) + "ing";
  }

  // CVC doubling: single vowel + single consonant at end (run → running, stop → stopping)
  // Only for short words (1 syllable heuristic: ≤5 chars)
  if (lower.length <= 5) {
    const vowels = "aeiou";
    const lastChar = lower[lower.length - 1];
    const secondLast = lower[lower.length - 2];
    // Don't double w, x, y
    if (
      lastChar && secondLast &&
      !vowels.includes(lastChar) &&
      !"wxy".includes(lastChar) &&
      vowels.includes(secondLast)
    ) {
      return verb + lastChar + "ing";
    }
  }

  return verb + "ing";
}

/**
 * Convert an imperative title to present-continuous "active form".
 *
 * Examples:
 *   "Fix login bug"       → "Fixing login bug"
 *   "Add user auth"       → "Adding user auth"
 *   "Core refactor"       → "Core refactor"  (non-verb prefix, unchanged)
 *   "configure logging"   → "Configuring logging"
 */
export function toActiveForm(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return trimmed;

  const words = trimmed.split(/\s+/);
  const firstWord = words[0];
  const firstLower = firstWord.toLowerCase();

  // Check if first word is a known non-verb prefix
  if (NON_VERB_PREFIXES.has(firstLower)) {
    return trimmed;
  }

  // Check lookup table first (handles irregulars and common verbs)
  const looked = VERB_LOOKUP[firstLower];
  if (looked) {
    // Preserve the rest of the title
    const rest = words.slice(1).join(" ");
    return rest ? `${looked} ${rest}` : looked;
  }

  // Already ends in "-ing"? Return as-is
  if (firstLower.endsWith("ing") && firstLower.length > 4) {
    return trimmed;
  }

  // Apply grammar rules as fallback
  const ingForm = applyIngSuffix(firstWord);
  // Capitalize first letter
  const capitalized = ingForm.charAt(0).toUpperCase() + ingForm.slice(1);
  const rest = words.slice(1).join(" ");
  return rest ? `${capitalized} ${rest}` : capitalized;
}
