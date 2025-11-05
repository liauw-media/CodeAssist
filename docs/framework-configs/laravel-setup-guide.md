# Laravel/PHP Project Setup Guide

*Framework-specific configuration for Laravel projects*

---

## Overview

This guide covers Laravel-specific setup including API-first architecture, authentication methods, database choices, parallel testing with Paratest, and API documentation tools.

**Related Documents**:
- [Project Use-Case Scenarios](../project-use-case-scenarios.md)
- [Development Tooling Guide](../development-tooling-guide.md)
- [Database Backup Strategy](../database-backup-strategy.md)

---

## Laravel Project Configuration

### Step 1: API Architecture

**Agent Question**:
> "This project will use **API-first architecture** for better documentation and multi-client support. Confirm? (yes/no)"

**Default**: Yes (recommended for all Laravel projects)

**Benefits**:
- OpenAPI/Swagger documentation
- Clear API contracts
- Easier testing
- Multi-client support (web, mobile, desktop)
- Better separation of concerns

**Setup**:
```bash
# Create Laravel project in API mode
composer create-project laravel/laravel your-project
cd your-project

# Install API support
php artisan install:api
```

---

### Step 2: Testing Framework

**Agent Question**:
> "Include **Paratest** for parallel test execution? (yes/no)"

**Default**: Yes

**Benefits**:
- Significantly faster test suites (2-10x speedup)
- Auto-detects available CPU cores
- Works with existing PHPUnit tests
- Ideal for projects with 100+ tests

**Installation**:
```bash
composer require --dev brianium/paratest
```

**Configuration** (`.paratest.yml`):
```yaml
processes: auto
functional: true
runner: WrapperRunner
```

**Usage**:
```bash
# Add to composer.json scripts
{
    "scripts": {
        "test": "paratest --processes=auto",
        "test:unit": "paratest --testsuite=Unit",
        "test:feature": "paratest --testsuite=Feature",
        "test:coverage": "paratest --coverage-html coverage"
    }
}

# Run tests
composer test
```

---

### Step 3: Authentication System

**Agent Question**:
> "Select authentication method(s) (multiple allowed):"

**Options**:
```
□ Laravel Sanctum (API tokens, SPA authentication)
□ Laravel Passport (Full OAuth2 server with personal access tokens)
□ Clerk (Social OAuth providers: Google, GitHub, etc.)
□ Custom/Manual setup
```

#### Option A: Laravel Sanctum (Recommended for most projects)

**Best For**:
- API-only applications
- Mobile app backends
- Single-page applications (SPA)
- Simple token authentication

**Installation**:
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

**Configuration** (`config/sanctum.php`):
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000')),
'expiration' => null, // Token expiration (null = never)
```

**Usage**:
```php
// Generate token
$token = $user->createToken('mobile-app')->plainTextToken;

// Protect routes
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('posts', PostController::class);
});
```

---

#### Option B: Laravel Passport (OAuth2 Server)

**Best For**:
- OAuth2 provider for third-party apps
- Complex permission scopes
- Enterprise applications
- When you need full OAuth2 capabilities

**Installation**:
```bash
composer require laravel/passport
php artisan migrate
php artisan passport:install
```

**Configuration**:
```php
// app/Models/User.php
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;
}
```

**Usage**:
```php
// Protect routes with scopes
Route::middleware(['auth:api', 'scope:read-posts'])->get('/posts', function () {
    // ...
});
```

---

#### Option C: Clerk (Social OAuth)

**Best For**:
- Quick social login integration
- SaaS MVPs
- Projects needing multiple OAuth providers
- When you want managed authentication UI

**Installation**:
```bash
composer require clerk/clerk-sdk-php
```

**Configuration** (`.env`):
```env
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx
```

**Usage**:
```php
// Verify Clerk JWT
use Clerk\Backend\Client;

$clerk = new Client(env('CLERK_SECRET_KEY'));
$user = $clerk->users->getUser($userId);
```

**Note**: All auth/RBAC logic stays in Laravel. Clerk only provides OAuth and user management UI.

---

#### Combined Approach: Sanctum + Clerk

**Best Setup for SaaS**:
- **Clerk**: Social login (Google, GitHub, etc.) + user management UI
- **Sanctum**: API token management + authorization logic in Laravel

**Flow**:
1. User logs in via Clerk (social OAuth)
2. Laravel receives Clerk user data
3. Laravel creates/updates user in local database
4. Laravel issues Sanctum token for API access
5. All RBAC/permissions handled by Laravel

---

### Step 4: Database Choice

**Agent Question**:
> "Select database (choose one):"

**Options**:
```
□ PostgreSQL (local or self-hosted)
□ MySQL/MariaDB (local or self-hosted)
□ Supabase (managed PostgreSQL with instant HA/scalability)
□ SQLite (development/testing only)
```

#### Recommendations by Use Case

| Use Case | Database | Reason |
|----------|----------|--------|
| **Production SaaS** | Supabase or PostgreSQL | HA, scalability, managed |
| **Enterprise self-hosted** | PostgreSQL | Full control, ACID compliance |
| **Legacy/Existing infra** | MySQL/MariaDB | Compatibility |
| **Quick dev/prototyping** | SQLite | Zero config, fast setup |

---

#### Configuration: Supabase (Managed PostgreSQL)

**Benefits**:
- Instant high availability
- Auto-scaling
- Built-in backups
- Real-time capabilities (optional)
- Free tier available

**Setup**:

1. Create Supabase project at https://supabase.com
2. Get connection details from project settings
3. Configure `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-password

# Optional: Supabase API (for real-time features)
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_KEY=your-supabase-anon-key
```

**Laravel Configuration**:
```php
// config/database.php - already configured for PostgreSQL
'pgsql' => [
    'driver' => 'pgsql',
    'url' => env('DATABASE_URL'),
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '5432'),
    'database' => env('DB_DATABASE', 'forge'),
    'username' => env('DB_USERNAME', 'forge'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => 'utf8',
    'prefix' => '',
    'prefix_indexes' => true,
    'search_path' => 'public',
    'sslmode' => 'prefer',
],
```

**Note**: Use Supabase ONLY as database hosting. All ORM logic stays in Laravel (Eloquent).

---

#### Configuration: PostgreSQL (Local/Self-hosted)

**Setup** (Docker Compose):
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - postgres
    environment:
      DB_HOST: postgres
      DB_DATABASE: laravel
      DB_USERNAME: laravel
      DB_PASSWORD: secret

  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: laravel
      POSTGRES_USER: laravel
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

#### Configuration: MySQL/MariaDB

**Setup** (Docker Compose):
```yaml
services:
  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_DATABASE: laravel
      MYSQL_USER: laravel
      MYSQL_PASSWORD: secret
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

**.env**:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=secret
```

---

### Step 5: API Documentation

**Agent Question** (if API-first is enabled):
> "Select API documentation tool:"

**Options**:
```
□ Scramble (Laravel OpenAPI generator - recommended)
□ L5-Swagger (Swagger/OpenAPI integration)
□ Scribe (API documentation generator)
```

#### Option A: Scramble (Recommended)

**Benefits**:
- Best Laravel integration
- Auto-generates OpenAPI from routes
- Interactive API playground
- Type-safe with PHP 8+ attributes

**Installation**:
```bash
composer require dedoc/scramble
```

**Configuration**:
```php
// config/scramble.php (publish with: php artisan vendor:publish --tag=scramble-config)
return [
    'info' => [
        'title' => 'My API',
        'version' => '1.0.0',
    ],
    'servers' => [
        ['url' => config('app.url')],
    ],
];
```

**Usage**:
```php
// Automatic generation from routes and controllers
// Access at: /docs/api

// Add descriptions with attributes
use Scramble\Attributes\Response;

class PostController extends Controller
{
    #[Response(status: 200, description: 'List of posts', content: Post::class)]
    public function index()
    {
        return Post::paginate();
    }
}
```

---

#### Option B: L5-Swagger

**Installation**:
```bash
composer require darkaonline/l5-swagger
php artisan vendor:publish --provider="L5Swagger\L5SwaggerServiceProvider"
```

**Usage**:
```php
// Annotate controllers with Swagger annotations
/**
 * @OA\Get(
 *     path="/api/posts",
 *     summary="Get list of posts",
 *     @OA\Response(response=200, description="Successful operation")
 * )
 */
public function index() { }
```

---

#### Mermaid Diagram Generation

**For workflow documentation**, generate Mermaid diagrams from OpenAPI specs:

**Installation**:
```bash
npm install -g openapi-to-mermaid
```

**Generate Diagrams**:
```bash
# Generate OpenAPI spec (Scramble)
php artisan scramble:generate

# Convert to Mermaid
openapi-to-mermaid storage/api-docs/openapi.json -o docs/api-diagram.md
```

**Custom Script** (`scripts/generate-api-docs.sh`):
```bash
#!/bin/bash
set -e

echo "Generating OpenAPI specification..."
php artisan scramble:generate

echo "Converting to Mermaid diagrams..."
npx openapi-to-mermaid storage/api-docs/openapi.json -o docs/api-workflow.md

echo "API documentation generated:"
echo "  - OpenAPI: storage/api-docs/openapi.json"
echo "  - Mermaid: docs/api-workflow.md"
echo "  - Interactive: $(php artisan route:list | grep docs/api)"
```

---

## Configuration Summary Template

After gathering all responses, display:

```markdown
## 🔧 Laravel Project Configuration

### Architecture
- **API-first**: [Yes/No]
- **Documentation**: [Scramble/L5-Swagger/Scribe]
- **Mermaid Diagrams**: [Yes/No]

### Testing
- **Framework**: PHPUnit
- **Parallel Testing**: Paratest (--processes=auto)
- **Coverage**: Enabled

### Authentication
- **Method**: [Sanctum/Passport/Clerk]
- **Social Login**: [Clerk/Socialite/None]
- **RBAC**: [Spatie Laravel Permission/Custom]

### Database
- **Type**: [PostgreSQL/MySQL/Supabase/SQLite]
- **Connection**: [Local/Managed/Supabase]
- **Migrations**: Enabled
- **Seeders**: Enabled

### Additional Packages
- PHPStan (static analysis)
- PHP CS Fixer (code formatting)
- Larastan (Laravel-specific PHPStan rules)
- Laravel IDE Helper (better IDE support)
- Laravel Debugbar (development)
```

---

## Installation Script

**Agent Action**: Create `scripts/setup-laravel.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Setting up Laravel project..."

# Install dependencies
composer install
npm install

# Environment setup
if [ ! -f .env ]; then
    cp .env.example .env
    php artisan key:generate
fi

# Database setup
echo "Running migrations..."
php artisan migrate

# Install configured packages
echo "Installing additional packages..."

# Sanctum (if selected)
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Scramble (if selected)
# Already installed via composer

# IDE Helper
composer require --dev barryvdh/laravel-ide-helper
php artisan ide-helper:generate
php artisan ide-helper:models --nowrite

# Debugbar (development)
composer require --dev barryvdh/laravel-debugbar

# Static analysis
composer require --dev phpstan/phpstan
composer require --dev larastan/larastan
composer require --dev friendsofphp/php-cs-fixer

# Testing
composer require --dev brianium/paratest

# Permissions (if RBAC needed)
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"

echo "✅ Laravel project setup complete!"
echo ""
echo "Next steps:"
echo "  1. Configure .env file with database credentials"
echo "  2. Run: php artisan migrate"
echo "  3. Run: composer test (with Paratest)"
echo "  4. Visit: /docs/api (for API documentation)"
```

---

## Quick Reference: Common Scenarios

See [Project Use-Case Scenarios](../project-use-case-scenarios.md#laravelphp-projects) for detailed configurations:

| Scenario | Auth | Database | Best For |
|----------|------|----------|----------|
| **Hobby Project** | Sanctum | SQLite/Supabase | Quick MVP, low maintenance |
| **SaaS MVP** | Sanctum + Clerk | Supabase | Fast launch, social auth |
| **Enterprise API** | Passport | PostgreSQL | Full OAuth2, self-hosted |
| **Mobile Backend** | Sanctum | PostgreSQL/Supabase | API tokens, scalable |
| **Traditional Web** | Breeze/Jetstream | MySQL/PostgreSQL | Server-rendered |

---

## Next Steps

After Laravel configuration:
1. ✅ Proceed to [Git Repository Setup](../phases/git-repository-setup.md)
2. ✅ Configure [Pre-commit Hooks](../phases/pre-commit-hooks-setup.md)
3. ✅ Set up [Database Safety Wrappers](../database-backup-strategy.md)
4. ✅ Initialize [Task Management](../phases/task-management-setup.md)

---

*Keep this guide updated with Laravel best practices!*
