---
name: playwright-frontend-testing
description: "Use when testing frontend applications. AI-assisted browser testing with Playwright MCP. Fast, deterministic, no vision models needed."
---

# Playwright Frontend Testing

## Core Principle

**Test real browser behavior with AI assistance through Playwright's accessibility tree.**

## Overview

Playwright MCP (Model Context Protocol) enables AI-assisted frontend testing by exposing browser interactions through structured data instead of screenshots. This makes tests fast, deterministic, and LLM-friendly without requiring vision models.

## When to Use This Skill

- Testing web application user interfaces
- End-to-end testing with real browsers
- Cross-browser compatibility testing
- Testing interactive features (forms, buttons, navigation)
- Accessibility testing
- Visual regression testing
- Integration testing with real browser state

## Why Playwright MCP?

**Traditional Approach (Screenshots):**
- ❌ Slow (large image processing)
- ❌ Non-deterministic (OCR, vision models)
- ❌ Expensive (vision model costs)
- ❌ Brittle (pixel-based matching)

**Playwright MCP Approach (Accessibility Tree):**
- ✅ Fast (structured data)
- ✅ Deterministic (semantic interactions)
- ✅ Lightweight (no vision models)
- ✅ LLM-friendly (text-based)
- ✅ Accessibility-first (follows a11y best practices)

## Installation & Setup

### Step 1: Install Playwright MCP

**For MCP-compatible tools (Claude Desktop, VS Code, Cursor):**

Add to MCP configuration file:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

**Configuration file locations:**
- **Claude Desktop**: `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac)
- **VS Code**: `.vscode/settings.json` (project) or user settings
- **Cursor**: Similar to VS Code

### Step 2: Configure Browser Options

**Headless mode** (CI/CD):
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--headless",
        "--browser", "chromium"
      ]
    }
  }
}
```

**Headed mode** (development, debugging):
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--browser", "chromium",
        "--viewport-size", "1280x720"
      ]
    }
  }
}
```

**Persistent profile** (keep login state):
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--user-data-dir", "./playwright-profile"
      ]
    }
  }
}
```

**Isolated sessions** (fresh each time):
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--isolated"
      ]
    }
  }
}
```

### Step 3: Install Playwright in Project

```bash
# For Node.js projects
npm install --save-dev @playwright/test

# For Python projects
pip install playwright
playwright install

# For other languages
# See: https://playwright.dev/docs/intro
```

### Step 4: Initialize Playwright Tests

```bash
# Node.js
npx playwright install
npx playwright test --init

# Creates:
# - playwright.config.ts
# - tests/ directory
# - example.spec.ts
```

## Core Playwright MCP Capabilities

### 1. Browser Navigation

```typescript
// Navigate to URL
await page.goto('https://example.com');

// Go back/forward
await page.goBack();
await page.goForward();

// Reload page
await page.reload();
```

### 2. Element Interactions

**AI-assisted clicking** (via MCP):
```
Ask AI: "Click the login button"
→ AI uses accessibility tree to find button
→ Clicks correct element
```

**Programmatic clicking**:
```typescript
// Click by text
await page.click('text=Login');

// Click by role
await page.click('role=button[name="Login"]');

// Click by test ID
await page.click('[data-testid="login-btn"]');
```

### 3. Form Filling

```typescript
// Fill input
await page.fill('input[name="email"]', 'user@example.com');
await page.fill('input[name="password"]', 'password123');

// Select dropdown
await page.selectOption('select[name="country"]', 'USA');

// Check checkbox
await page.check('input[type="checkbox"][name="terms"]');

// Upload file
await page.setInputFiles('input[type="file"]', 'path/to/file.pdf');
```

### 4. Assertions

```typescript
// Element visible
await expect(page.locator('text=Welcome')).toBeVisible();

// Text content
await expect(page.locator('h1')).toHaveText('Dashboard');

// Count elements
await expect(page.locator('.todo-item')).toHaveCount(5);

// URL
await expect(page).toHaveURL('https://example.com/dashboard');

// Screenshot comparison
await expect(page).toHaveScreenshot();
```

### 5. Accessibility Tree

**Get page snapshot** (MCP capability):
```
Ask AI: "Get accessibility snapshot of the page"
→ Returns structured accessibility tree
→ Shows all interactive elements
→ Includes roles, labels, states
```

**Programmatic access**:
```typescript
const snapshot = await page.accessibility.snapshot();
console.log(JSON.stringify(snapshot, null, 2));
```

## Writing Effective Playwright Tests

### Test Structure (AAA Pattern)

```typescript
import { test, expect } from '@playwright/test';

test('user can login successfully', async ({ page }) => {
  // Arrange: Navigate and setup
  await page.goto('https://example.com/login');

  // Act: Perform actions
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Assert: Verify outcomes
  await expect(page).toHaveURL('https://example.com/dashboard');
  await expect(page.locator('text=Welcome back')).toBeVisible();
});
```

### Best Practices

#### 1. Use Semantic Selectors

```typescript
// ✅ Good: Semantic, accessible
await page.click('role=button[name="Submit"]');
await page.click('text=Login');
await page.click('[data-testid="submit-btn"]');

// ❌ Bad: Brittle, implementation details
await page.click('.btn-primary.submit-button');
await page.click('#form > div > button:nth-child(3)');
```

#### 2. Wait for Conditions (Not Timeouts)

```typescript
// ✅ Good: Wait for specific condition
await page.waitForSelector('text=Success', { state: 'visible' });

// ❌ Bad: Arbitrary timeout
await page.waitForTimeout(2000);
```

**Note**: This integrates with `condition-based-waiting` skill!

#### 3. Use Test IDs for Dynamic Content

```typescript
// HTML
<button data-testid="submit-btn">Submit</button>

// Test
await page.click('[data-testid="submit-btn"]');
```

#### 4. Isolate Tests

```typescript
// ✅ Good: Each test is independent
test.beforeEach(async ({ page }) => {
  // Setup fresh state
  await page.goto('https://example.com');
});

// ❌ Bad: Tests depend on each other
// Test 1 creates user
// Test 2 assumes user exists
```

#### 5. Handle Network Conditions

```typescript
// Wait for API calls
await page.waitForResponse('**/api/users');

// Mock API responses
await page.route('**/api/users', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ users: [] })
  });
});

// Simulate slow network
await page.route('**/*', route => {
  setTimeout(() => route.continue(), 1000);
});
```

## AI-Assisted Testing with MCP

### Workflow

1. **AI analyzes page accessibility tree**
2. **AI identifies interactive elements**
3. **AI performs actions semantically**
4. **AI verifies outcomes**

### Example Session

```
You: "Test the login flow on example.com"

AI: "I'm using the playwright-frontend-testing skill to test the login flow.

Step 1: Navigate to login page
[Uses MCP browser_navigate]

Step 2: Get page accessibility snapshot
[Uses MCP to understand page structure]

Found:
- Email input (role: textbox, name: 'Email')
- Password input (role: textbox, name: 'Password')
- Submit button (role: button, name: 'Sign In')

Step 3: Fill credentials
[Uses MCP browser_fill]

Step 4: Click submit
[Uses MCP browser_click]

Step 5: Verify redirect
[Checks URL changed to /dashboard]

Step 6: Verify success message
[Finds 'Welcome' text in accessibility tree]

✅ Login flow test passed"
```

## Configuration File (playwright.config.ts)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests',

  // Timeout per test
  timeout: 30000,

  // Retry failed tests
  retries: process.env.CI ? 2 : 0,

  // Run tests in parallel
  workers: process.env.CI ? 1 : undefined,

  // Reporter
  reporter: [
    ['html'],
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],

  // Shared settings
  use: {
    // Base URL
    baseURL: 'http://localhost:3000',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Trace on failure
    trace: 'on-first-retry',
  },

  // Browser projects
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  // Web server (optional)
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

## Common Testing Patterns

### Pattern 1: Login Helper

```typescript
// tests/helpers/auth.ts
export async function login(page, email, password) {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
}

// tests/dashboard.spec.ts
import { test } from '@playwright/test';
import { login } from './helpers/auth';

test('user can access dashboard', async ({ page }) => {
  await login(page, 'user@example.com', 'password123');
  // Test dashboard...
});
```

### Pattern 2: Page Object Model

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  async getErrorMessage() {
    return this.page.locator('.error-message').textContent();
  }
}

// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('shows error for invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('invalid@example.com', 'wrong');

  const error = await loginPage.getErrorMessage();
  expect(error).toBe('Invalid email or password');
});
```

### Pattern 3: API Mocking

```typescript
test('handles API errors gracefully', async ({ page }) => {
  // Mock API to return error
  await page.route('**/api/login', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Server error' })
    });
  });

  await page.goto('/login');
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Verify error message shown
  await expect(page.locator('.error-message')).toContainText('Server error');
});
```

### Pattern 4: Visual Regression

```typescript
test('homepage looks correct', async ({ page }) => {
  await page.goto('/');

  // Take screenshot and compare
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    maxDiffPixels: 100
  });
});
```

### Pattern 5: Accessibility Testing

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('page has no accessibility violations', async ({ page }) => {
  await page.goto('/');

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## Running Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/login.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run in specific browser
npx playwright test --project=chromium

# Run with UI mode (interactive)
npx playwright test --ui

# Debug mode
npx playwright test --debug

# Generate code (record actions)
npx playwright codegen https://example.com
```

## Integration with Database Backup Skill

**CRITICAL**: When testing involves database operations:

```typescript
import { test } from '@playwright/test';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

test.beforeEach(async () => {
  // Use database-backup skill before tests
  await execAsync('./scripts/backup-database.sh');
});

test('user registration', async ({ page }) => {
  // Test that modifies database
  await page.goto('/register');
  // ... registration flow
});
```

## Integration with TDD Skill

**Follow RED-GREEN-REFACTOR:**

```typescript
// 🔴 RED: Write failing test first
test('user can add todo item', async ({ page }) => {
  await page.goto('/todos');
  await page.fill('input[name="todo"]', 'Buy groceries');
  await page.click('button[type="submit"]');

  await expect(page.locator('.todo-item')).toContainText('Buy groceries');
});

// Run test: ❌ FAILS (feature doesn't exist yet)

// 🟢 GREEN: Implement minimal code to pass
// [Implement todo addition feature]

// Run test: ✅ PASSES

// 🔵 REFACTOR: Improve code while keeping test green
// [Refactor todo code]

// Run test: ✅ STILL PASSES
```

## Docker Support

```dockerfile
# Dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npx", "playwright", "test"]
```

```bash
# Build and run
docker build -t my-playwright-tests .
docker run my-playwright-tests
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Backup database (if needed)
        run: ./scripts/backup-database.sh

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### GitLab CI

```yaml
# .gitlab-ci.yml
playwright:
  image: mcr.microsoft.com/playwright:v1.40.0-focal
  script:
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths:
      - playwright-report/
    reports:
      junit: test-results/junit.xml
```

## Common Mistakes

### Mistake 1: Not Waiting for Elements

```typescript
// ❌ Bad: Clicking before element is ready
await page.click('button');

// ✅ Good: Playwright auto-waits
await page.click('button'); // Actually waits automatically

// ✅ Better: Explicit wait if needed
await page.waitForSelector('button', { state: 'visible' });
await page.click('button');
```

### Mistake 2: Using Brittle Selectors

```typescript
// ❌ Bad: Implementation details
await page.click('.MuiButton-root.MuiButton-containedPrimary');

// ✅ Good: Semantic selectors
await page.click('role=button[name="Submit"]');
await page.click('[data-testid="submit-btn"]');
```

### Mistake 3: No Test Isolation

```typescript
// ❌ Bad: Tests depend on each other
test('create user', async ({ page }) => {
  // Creates user...
});

test('login user', async ({ page }) => {
  // Assumes user from previous test exists
});

// ✅ Good: Each test is independent
test('login user', async ({ page }) => {
  // Create user in this test or use fixtures
  await createTestUser();
  // Login...
});
```

### Mistake 4: Ignoring Network State

```typescript
// ❌ Bad: Not waiting for API
await page.click('button');
// Immediately check result (API might not have returned)

// ✅ Good: Wait for network
await Promise.all([
  page.waitForResponse('**/api/submit'),
  page.click('button')
]);
```

## Integration with Other Skills

**Use with:**
- `test-driven-development` - Write Playwright tests first (RED-GREEN-REFACTOR)
- `condition-based-waiting` - Wait for conditions, not arbitrary timeouts
- `database-backup` - ALWAYS backup before tests that modify database
- `systematic-debugging` - Debug failing Playwright tests methodically
- `code-review` - Review test code for quality and coverage

**Complements:**
- `testing-anti-patterns` - Avoid common testing mistakes
- `verification-before-completion` - Verify all tests pass before declaring done

## Checklist

Before running Playwright tests:
- [ ] Playwright MCP configured (if using AI assistance)
- [ ] Playwright installed in project
- [ ] Tests use semantic selectors
- [ ] Tests are isolated (no dependencies)
- [ ] Database backup before tests (if DB involved)
- [ ] Tests wait for conditions (not timeouts)
- [ ] Tests handle network/async properly

## Authority

**This skill is based on:**
- Playwright official documentation
- Microsoft's Playwright MCP implementation
- Frontend testing best practices
- Accessibility-first testing approach
- Model Context Protocol standard

**Social Proof**: Playwright is used by Microsoft, Google, and thousands of companies for reliable frontend testing.

## Your Commitment

When writing Playwright tests:
- [ ] I will use semantic, accessible selectors
- [ ] I will wait for conditions, not timeouts
- [ ] I will keep tests isolated and independent
- [ ] I will backup database before tests (if applicable)
- [ ] I will follow TDD: test first, then implement
- [ ] I will use Playwright MCP for AI-assisted testing

---

**Bottom Line**: Playwright with MCP enables fast, deterministic, AI-assisted frontend testing through accessibility trees. Use semantic selectors, wait for conditions, keep tests isolated, and always backup database before tests that modify data.
