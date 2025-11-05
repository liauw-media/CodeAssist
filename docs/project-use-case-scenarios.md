# Project Use-Case Scenarios Guide

*Comprehensive guide to common project configurations and technology stack recommendations*

---

## Overview

This document provides pre-configured technology stack recommendations for common project types. Use these as starting points for project initialization with the AI agent.

**Related Documents**:
- [AI Agent Project Initialization](./ai-agent-project-initialization-prompt.md)
- [Development Tooling Guide](./development-tooling-guide.md)
- [Database Backup Strategy](./database-backup-strategy.md)

---

## Table of Contents

1. [Laravel/PHP Projects](#laravelphp-projects)
2. [Python Projects](#python-projects)
3. [JavaScript/TypeScript Projects](#javascripttypescript-projects)
4. [Mobile Applications](#mobile-applications)
5. [Go Projects](#go-projects)
6. [Cross-Stack Comparison](#cross-stack-comparison)

---

## Laravel/PHP Projects

### 1. Hobby/Side Project

**Profile**: Quick MVP, minimal maintenance, low cost

**Configuration**:
```yaml
Framework: Laravel 11
Architecture: API-first (optional)
Authentication: Laravel Sanctum
Database: SQLite (dev) → Supabase (production)
Testing: PHPUnit + Paratest
Documentation: Scramble (OpenAPI)
Hosting: Shared hosting / Vercel / Fly.io
```

**Package Installation**:
```bash
composer require laravel/sanctum
composer require --dev brianium/paratest
composer require --dev dedoc/scramble
```

**Best For**:
- Personal projects
- Learning/experimentation
- Quick prototypes
- Low-traffic apps (<1K users)

**Pros**:
- Zero infrastructure management with Supabase
- Fast development cycle
- Low/no cost
- Easy deployment

**Cons**:
- Limited customization
- Vendor lock-in risk (Supabase)
- SQLite limitations for production

---

### 2. SaaS MVP

**Profile**: Fast launch, social auth, minimal DevOps, scalable

**Configuration**:
```yaml
Framework: Laravel 11
Architecture: API-first ✓
Authentication: Sanctum + Clerk (social OAuth)
Database: Supabase (managed PostgreSQL)
Testing: PHPUnit + Paratest
Documentation: Scramble + Mermaid diagrams
Frontend: Vue.js/React + Inertia.js or separate SPA
Cache: Redis (Upstash/Supabase)
Queue: Redis/Database
Hosting: Laravel Vapor / Fly.io / Railway
```

**Package Installation**:
```bash
# Core
composer require laravel/sanctum
composer create-project laravel/laravel your-project

# Testing
composer require --dev brianium/paratest
composer require --dev phpunit/phpunit

# API Documentation
composer require dedoc/scramble

# Clerk Integration (custom or package)
# Install Clerk PHP SDK
composer require clerk/clerk-sdk-php

# Frontend (if using Inertia)
composer require inertiajs/inertia-laravel
npm install @inertiajs/vue3 # or react
```

**Environment Setup** (`.env`):
```env
# Supabase Database
DB_CONNECTION=pgsql
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-password

# Clerk
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# Redis (optional - Upstash)
REDIS_HOST=your-redis-host.upstash.io
REDIS_PASSWORD=your-redis-password
REDIS_PORT=6379
```

**Best For**:
- SaaS applications
- Multi-tenant apps
- B2B/B2C products
- MVPs needing quick validation

**Pros**:
- Instant HA/scalability (Supabase)
- Social login out-of-the-box (Clerk)
- All auth/RBAC logic in Laravel
- Clear API contracts (OpenAPI)
- Fast parallel tests (Paratest)

**Cons**:
- Monthly costs (Clerk free tier: 5K MAUs)
- External dependencies
- Learning curve for multiple services

---

### 3. Enterprise API

**Profile**: Full control, OAuth2 provider, self-hosted, complex permissions

**Configuration**:
```yaml
Framework: Laravel 11
Architecture: API-first ✓ (mandatory)
Authentication: Laravel Passport (OAuth2 server)
Database: PostgreSQL (self-hosted or AWS RDS)
Testing: PHPUnit + Paratest + Pest
Documentation: Scramble + L5-Swagger + Mermaid
Cache: Redis (self-hosted or ElastiCache)
Queue: Redis + Horizon
Search: Meilisearch / Elasticsearch
Hosting: AWS ECS / Kubernetes / self-hosted VPS
```

**Package Installation**:
```bash
# Core
composer require laravel/passport
composer require spatie/laravel-permission

# Testing
composer require --dev brianium/paratest
composer require --dev pestphp/pest
composer require --dev pestphp/pest-plugin-laravel

# Static Analysis
composer require --dev phpstan/phpstan
composer require --dev larastan/larastan
composer require --dev nunomaduro/phpinsights

# Documentation
composer require dedoc/scramble
composer require darkaonline/l5-swagger

# Queue Management
composer require laravel/horizon

# API Rate Limiting
composer require mll-lab/laravel-graphql-playground
```

**Best For**:
- Enterprise software
- Internal APIs
- OAuth2 provider for third-party apps
- High-security requirements
- Complex RBAC needs

**Pros**:
- Full control over infrastructure
- No external auth dependencies
- OAuth2 server capabilities
- Advanced permission systems
- Complete data sovereignty

**Cons**:
- Higher infrastructure costs
- Requires DevOps expertise
- More maintenance overhead
- Slower initial development

---

### 4. Mobile App Backend

**Profile**: API-only, token authentication, high performance

**Configuration**:
```yaml
Framework: Laravel 11 (API-only mode)
Architecture: API-first ✓ (mandatory)
Authentication: Sanctum (API tokens)
Database: PostgreSQL or Supabase
Testing: PHPUnit + Paratest + API tests
Documentation: Scramble + Postman collections
Cache: Redis
Queue: Redis + Horizon
Storage: S3 / Cloudinary (images)
Push Notifications: FCM / OneSignal
Hosting: AWS / DigitalOcean / Fly.io
```

**Package Installation**:
```bash
# Laravel API setup
composer create-project laravel/laravel your-api --prefer-dist
php artisan install:api

# Authentication
composer require laravel/sanctum

# Testing
composer require --dev brianium/paratest

# API Resources & Documentation
composer require dedoc/scramble

# Image handling
composer require intervention/image
composer require league/flysystem-aws-s3-v3

# Push notifications
composer require laravel-notification-channels/fcm
```

**API Design**:
```php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('posts', PostController::class);
    Route::apiResource('users', UserController::class);
    Route::post('logout', [AuthController::class, 'logout']);
});

// Sanctum token creation
$token = $user->createToken('mobile-app')->plainTextToken;
```

**Best For**:
- Mobile app backends (iOS/Android)
- React Native / Flutter apps
- Single-page applications (SPA)
- Third-party integrations

**Pros**:
- Lightweight (no Blade templates)
- Fast response times
- Clear API documentation
- Easy token management
- Scalable architecture

**Cons**:
- No built-in admin panel
- Requires separate frontend
- More boilerplate for CRUD

---

### 5. Traditional Web Application

**Profile**: Server-rendered, session-based auth, monolithic

**Configuration**:
```yaml
Framework: Laravel 11
Architecture: Traditional MVC (Blade templates)
Authentication: Laravel Breeze or Jetstream
Database: MySQL/PostgreSQL
Testing: PHPUnit + Paratest + Dusk (browser tests)
Frontend: Blade + Livewire or Blade + Alpine.js
Cache: Redis
Queue: Database or Redis
Hosting: Shared hosting / VPS / Laravel Forge
```

**Package Installation**:
```bash
# Authentication scaffold
composer require laravel/breeze --dev
php artisan breeze:install blade
# or
composer require laravel/jetstream
php artisan jetstream:install livewire

# Testing
composer require --dev brianium/paratest
composer require --dev laravel/dusk

# Livewire (if not using Jetstream)
composer require livewire/livewire

# Additional UI components
npm install alpinejs
```

**Best For**:
- Content management systems (CMS)
- Admin dashboards
- Internal tools
- Traditional CRUD apps
- SEO-critical websites

**Pros**:
- Simple deployment
- SEO-friendly (server-rendered)
- Fast development (Blade templates)
- Built-in authentication (Breeze/Jetstream)
- Livewire for reactive UI without JavaScript

**Cons**:
- Harder to separate frontend/backend later
- Limited for mobile apps
- Less flexible than API-first

---

## Python Projects

### 1. Data Science / ML Project

**Profile**: Jupyter notebooks, data analysis, model training

**Configuration**:
```yaml
Framework: FastAPI (API) + Jupyter (notebooks)
Architecture: Microservices
Authentication: JWT tokens
Database: PostgreSQL (structured) + MongoDB (unstructured)
Testing: pytest + pytest-asyncio
Documentation: Swagger (auto-generated)
ML Stack: scikit-learn / TensorFlow / PyTorch
Hosting: AWS SageMaker / Google Cloud AI Platform
```

**Package Installation**:
```bash
pip install fastapi uvicorn[standard]
pip install sqlalchemy psycopg2-binary
pip install pytest pytest-asyncio pytest-cov
pip install scikit-learn pandas numpy
pip install jupyter notebook
pip install python-dotenv
```

**Best For**:
- Machine learning APIs
- Data analysis pipelines
- Scientific computing
- Research projects

---

### 2. Django Web Application

**Profile**: Full-featured web app, admin panel, ORM

**Configuration**:
```yaml
Framework: Django 5.x
Architecture: Traditional MVC
Authentication: Django Auth + django-allauth
Database: PostgreSQL
Testing: pytest-django
Documentation: Sphinx + MkDocs
Frontend: Django templates + HTMX or React
Cache: Redis
Queue: Celery + Redis
Hosting: Heroku / AWS Elastic Beanstalk / Railway
```

**Package Installation**:
```bash
pip install django psycopg2-binary
pip install django-allauth
pip install pytest-django
pip install celery redis
pip install django-redis
pip install django-debug-toolbar
```

**Best For**:
- Content-heavy websites
- Admin-heavy applications
- Rapid prototyping
- Monolithic applications

---

## JavaScript/TypeScript Projects

### 1. Next.js Full-Stack Application

**Profile**: Server-rendered React, API routes, modern stack

**Configuration**:
```yaml
Framework: Next.js 14 (App Router)
Architecture: Full-stack monorepo
Authentication: NextAuth.js or Clerk
Database: PostgreSQL (Prisma ORM) or Supabase
Testing: Jest + React Testing Library + Playwright
Documentation: Storybook + TypeDoc
Styling: Tailwind CSS
Hosting: Vercel / Netlify / AWS Amplify
```

**Package Installation**:
```bash
npx create-next-app@latest my-app --typescript --tailwind --app
npm install next-auth
npm install @prisma/client
npm install -D prisma
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
```

**Best For**:
- Modern web applications
- E-commerce sites
- SaaS products
- SEO-critical apps

---

### 2. Express.js API

**Profile**: Lightweight Node.js API, microservices

**Configuration**:
```yaml
Framework: Express.js
Architecture: API-first
Authentication: JWT (jsonwebtoken)
Database: PostgreSQL (Sequelize) or MongoDB (Mongoose)
Testing: Jest + Supertest
Documentation: Swagger (swagger-jsdoc)
Type Safety: TypeScript
Hosting: AWS Lambda / Google Cloud Run / Fly.io
```

**Package Installation**:
```bash
npm init -y
npm install express
npm install typescript @types/node @types/express
npm install jsonwebtoken bcrypt
npm install sequelize pg pg-hstore
npm install -D jest supertest @types/jest
npm install swagger-jsdoc swagger-ui-express
```

**Best For**:
- Microservices
- RESTful APIs
- Real-time applications (with Socket.io)
- Serverless functions

---

## Mobile Applications

### Decision: PWA vs React Native

**See**: [Mobile App Development Guide](./framework-configs/mobile-app-guide.md) for complete setup

| Criteria | PWA (Next.js) | React Native (Expo) |
|----------|---------------|---------------------|
| **Time to Market** | ⚡ Fast (web + mobile) | Medium (native builds) |
| **Cost** | 💰 Low (single codebase) | Medium (requires testing devices) |
| **Performance** | Good (web-based) | ⚡ Excellent (native) |
| **Offline Support** | ✅ Service Workers | ✅ AsyncStorage |
| **Push Notifications** | ✅ Web Push | ✅ Native Push |
| **App Store** | ❌ Not required | ✅ iOS/Android stores |
| **Native Features** | ⚠️ Limited | ✅ Full access |
| **SEO** | ✅ Full support | ❌ Not applicable |
| **Updates** | ⚡ Instant | Medium (app store review) |

---

### 1. PWA (Progressive Web App) with Next.js

**Profile**: Web-first with installable mobile experience

**Configuration**:
```yaml
Framework: Next.js 14 (App Router)
PWA Plugin: next-pwa
Backend: Laravel/Express/FastAPI (API)
Authentication: NextAuth or JWT
Database: PostgreSQL/Supabase (via API)
State Management: React Query + Zustand
Testing: Jest + Playwright
Hosting: Vercel / Netlify / AWS Amplify
```

**Package Installation**:
```bash
npx create-next-app@latest my-pwa --typescript --tailwind --app
cd my-pwa
npm install next-pwa
npm install @tanstack/react-query zustand
npm install -D @playwright/test
```

**Best For**:
- Multi-platform (web + mobile from single codebase)
- Budget-conscious projects
- When SEO is important
- Quick MVP/prototyping
- Android-primary audience (better PWA support)

**Pros**:
- Single codebase (web + mobile)
- Instant updates (no app store)
- Lower development cost
- SEO benefits
- No app store approval needed

**Cons**:
- Limited native features
- iOS PWA support is basic
- Can't compete with native performance
- No app store presence/discoverability

---

### 2. React Native with Expo

**Profile**: True native mobile apps for iOS/Android

**Configuration**:
```yaml
Framework: React Native with Expo
Router: Expo Router (file-based routing)
Backend: Laravel/Express/FastAPI (API)
Authentication: JWT + AsyncStorage
Database: PostgreSQL/Supabase (via API)
State Management: Zustand
Testing: Jest + React Native Testing Library
Deployment: EAS Build + App Store + Google Play
```

**Package Installation**:
```bash
npx create-expo-app my-native-app --template tabs
cd my-native-app
npx expo install expo-router react-native-safe-area-context
npm install zustand @react-native-async-storage/async-storage
npm install -D jest @testing-library/react-native
```

**Best For**:
- Mobile-first or mobile-only apps
- Need native performance
- Require native device features (camera, Bluetooth, etc.)
- iOS and Android target audience
- App store presence important

**Pros**:
- True native performance
- Full access to native APIs
- Better user experience
- App store distribution
- Works great offline

**Cons**:
- Longer development time
- Requires iOS/Android testing
- App store approval process
- Larger team/budget needed
- Separate from web codebase

---

### 3. Hybrid: PWA + React Native (Same Backend)

**Profile**: Best of both worlds with shared API

**Architecture**:
```
┌─────────────────────────────────────┐
│      Backend API (Laravel)          │
│      - Sanctum Authentication       │
│      - RESTful API (OpenAPI)        │
│      - PostgreSQL/Supabase DB       │
└─────────────────────────────────────┘
           │
    ┌──────┴──────┐
    │             │
┌───▼────┐   ┌───▼────────┐
│  PWA   │   │   React    │
│(Next.js)│   │   Native   │
│        │   │   (Expo)   │
└────────┘   └────────────┘
  Web +         iOS +
 Android       Android
(Installed)   (App Store)
```

**Package Installation**:

**Backend** (Laravel):
```bash
composer create-project laravel/laravel my-api
composer require laravel/sanctum
composer require dedoc/scramble
```

**PWA** (Next.js):
```bash
npx create-next-app@latest my-pwa --typescript --tailwind --app
npm install next-pwa
```

**Native** (React Native):
```bash
npx create-expo-app my-native-app --template tabs
```

**Best For**:
- Startups wanting maximum reach
- Different experiences for web vs mobile
- When budget allows both
- Apps needing SEO + app store presence

**Pros**:
- Maximum platform coverage
- Shared backend (single API)
- Best experience per platform
- Flexibility in features

**Cons**:
- Higher development cost
- Two codebases to maintain
- Requires larger team
- More complex testing

---

### 4. Backend API for Mobile (Laravel)

**Optimized for mobile clients**:

**Configuration**:
```yaml
Framework: Laravel 11 (API-only)
Architecture: API-first (mandatory)
Authentication: Laravel Sanctum (token-based)
Database: PostgreSQL or Supabase
API Docs: Scramble (OpenAPI)
Testing: PHPUnit + Paratest
CORS: Configured for mobile origins
Rate Limiting: Per-user limits
Hosting: AWS / DigitalOcean / Fly.io
```

**Package Installation**:
```bash
composer create-project laravel/laravel mobile-api
php artisan install:api
composer require laravel/sanctum
composer require dedoc/scramble
composer require --dev brianium/paratest
```

**Mobile-Optimized Routes** (`routes/api.php`):
```php
// Public
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Mobile-specific
    Route::post('/push/register', [PushController::class, 'register']);
    Route::apiResource('posts', PostController::class);
});
```

**Best For**:
- Mobile app backends
- Microservices architecture
- API-first development
- When mobile is primary client

---

## Go Projects

### 1. High-Performance API

**Profile**: Fast, compiled, concurrent, microservices

**Configuration**:
```yaml
Framework: Gin or Fiber
Architecture: Microservices / API-first
Authentication: JWT
Database: PostgreSQL (pgx/sqlx)
Testing: Go test + Testify
Documentation: Swagger (swaggo)
Container: Docker + Kubernetes
Hosting: AWS ECS / GCP Cloud Run / Kubernetes
```

**Package Installation**:
```bash
go mod init myproject
go get -u github.com/gin-gonic/gin
go get -u github.com/golang-jwt/jwt/v5
go get -u github.com/jackc/pgx/v5
go get -u github.com/stretchr/testify
go get -u github.com/swaggo/swag/cmd/swag
go get -u github.com/swaggo/gin-swagger
```

**Best For**:
- High-performance APIs
- Microservices architecture
- CLI tools
- System-level applications

---

## Cross-Stack Comparison

### Authentication Methods

| Method | Laravel | Python | JavaScript | Go | Best For |
|--------|---------|--------|------------|-----|----------|
| **Session-based** | Breeze/Jetstream | Django Auth | Passport.js | Gorilla Sessions | Traditional web apps |
| **JWT** | JWT-Auth | PyJWT | jsonwebtoken | golang-jwt | SPAs, Mobile apps |
| **OAuth2 Server** | Passport | Authlib | OAuth2orize | go-oauth2 | API provider |
| **API Tokens** | Sanctum | DRF Tokens | Custom | Custom | Simple API auth |
| **Social OAuth** | Socialite/Clerk | django-allauth | NextAuth/Clerk | goth | Social login |

---

### Database Recommendations

| Use Case | Recommended DB | Alternative | Rationale |
|----------|---------------|-------------|-----------|
| **SaaS/Startup** | Supabase | PostgreSQL (RDS) | Instant HA, no DevOps |
| **Enterprise** | PostgreSQL | Oracle/SQL Server | ACID, mature, scalable |
| **Content/CMS** | MySQL/PostgreSQL | MongoDB | Relational data |
| **Real-time** | MongoDB | Firebase | Flexible schema |
| **Analytics** | ClickHouse | TimescaleDB | Time-series data |
| **Cache** | Redis | Memcached | Key-value, fast |
| **Search** | Meilisearch | Elasticsearch | Full-text search |

---

### Testing Framework Comparison

| Language | Unit Testing | Integration | E2E | Parallel | Coverage |
|----------|-------------|-------------|-----|----------|----------|
| **PHP** | PHPUnit | PHPUnit | Dusk | **Paratest** | PHPUnit |
| **Python** | pytest | pytest | Playwright | pytest-xdist | pytest-cov |
| **JavaScript** | Jest | Jest | Playwright | Jest (--maxWorkers) | Jest |
| **Go** | go test | go test | Playwright | go test -parallel | go test -cover |

---

### API Documentation

| Stack | Tool | Auto-Gen | Interactive | OpenAPI | Mermaid |
|-------|------|----------|-------------|---------|---------|
| **Laravel** | Scramble ✓ | ✓ | ✓ | ✓ | Via custom script |
| | L5-Swagger | ✓ | ✓ | ✓ | Via custom script |
| | Scribe | ✓ | ✓ | Partial | ✓ |
| **Python** | FastAPI | ✓ | ✓ | ✓ | Via openapi2mermaid |
| | DRF Spectacular | ✓ | ✓ | ✓ | Via openapi2mermaid |
| **JavaScript** | Swagger UI | Manual | ✓ | ✓ | Via custom script |
| | TypeDoc | ✓ | ✗ | ✗ | ✗ |
| **Go** | swaggo | ✓ | ✓ | ✓ | Via custom script |

---

## Mermaid Diagram Generation

For API-first projects, auto-generate workflow diagrams from OpenAPI specs:

### Laravel (Scramble + Mermaid)

**Installation**:
```bash
composer require dedoc/scramble
npm install -g openapi-to-mermaid
```

**Generate Diagrams**:
```bash
# Generate OpenAPI spec
php artisan scramble:generate

# Convert to Mermaid
openapi-to-mermaid storage/api-docs/openapi.json -o docs/api-diagram.md
```

### Custom Script (All Stacks)

**Create** `scripts/generate-mermaid-docs.sh`:
```bash
#!/bin/bash
# Generate OpenAPI spec (framework-specific)
# Laravel: php artisan scramble:generate
# FastAPI: openapi-spec-exporter
# Express: swagger-cli

# Convert to Mermaid
npx openapi-to-mermaid api-spec.json -o docs/api-workflow.md

echo "Mermaid diagrams generated in docs/"
```

---

## Decision Matrix

### Choose Your Stack

Answer these questions to find your best stack:

1. **What are you building?**
   - Web app with admin → Laravel + Breeze/Jetstream
   - API for mobile/SPA → Laravel API + Sanctum or FastAPI
   - Data science/ML → Python + FastAPI + Jupyter
   - Microservices → Go + Gin or Node.js + Express
   - Full-stack modern web → Next.js

2. **Team expertise?**
   - PHP developers → Laravel
   - Python developers → Django/FastAPI
   - JavaScript developers → Next.js/Express
   - Performance-critical → Go

3. **Time to market?**
   - Fast (<1 month) → Laravel/Django (batteries included)
   - Medium (1-3 months) → Next.js/FastAPI
   - Flexible → Any stack

4. **Hosting preference?**
   - Minimal DevOps → Vercel/Netlify (Next.js), Railway/Fly.io (Laravel), Supabase (DB)
   - Full control → AWS/GCP/Azure with Kubernetes
   - Shared hosting → Laravel (traditional) or PHP

5. **Scalability needs?**
   - <10K users → Any stack, simple hosting
   - 10K-100K users → Laravel/Django with caching (Redis), managed DB
   - 100K-1M users → Microservices (Go/Node), Kubernetes, CDN
   - 1M+ users → Distributed architecture, message queues, specialized stack

---

## Quick Start Commands

### Laravel (SaaS MVP with Supabase + Clerk)

```bash
# Create project
composer create-project laravel/laravel my-saas
cd my-saas

# Install packages
composer require laravel/sanctum
composer require --dev brianium/paratest
composer require dedoc/scramble
composer require clerk/clerk-sdk-php

# Configure
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate

# Test with Paratest
./vendor/bin/paratest --processes=auto
```

### Next.js (Full-stack with Clerk + Supabase)

```bash
# Create project
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app

# Install packages
npm install @clerk/nextjs @supabase/supabase-js
npm install -D @testing-library/react @testing-library/jest-dom jest

# Configure Clerk + Supabase
# Add to .env.local:
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
# CLERK_SECRET_KEY=...
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

npm run dev
```

### FastAPI (Python API with JWT)

```bash
# Create project
mkdir my-api && cd my-api
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\activate on Windows

# Install packages
pip install fastapi uvicorn[standard] sqlalchemy psycopg2-binary
pip install python-jose[cryptography] passlib[bcrypt]
pip install pytest pytest-asyncio

# Run
uvicorn main:app --reload
```

---

## Additional Resources

- **Laravel**: https://laravel.com/docs
- **Supabase**: https://supabase.com/docs
- **Clerk**: https://clerk.com/docs
- **Paratest**: https://github.com/paratestphp/paratest
- **Scramble**: https://scramble.dedoc.co
- **OpenAPI to Mermaid**: https://github.com/nlepage/openapi-to-mermaid

---

*Keep this document updated as new patterns and best practices emerge!*
