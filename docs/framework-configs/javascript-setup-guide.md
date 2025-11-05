# JavaScript/TypeScript Project Setup Guide

*Framework-specific configuration for Next.js, Express, and React projects*

---

## Overview

This guide covers JavaScript/TypeScript setup for modern web applications including Next.js, Express, and React.

**Related Documents**:
- [Project Use-Case Scenarios](../project-use-case-scenarios.md#javascripttypescript-projects)
- [Development Tooling Guide](../development-tooling-guide.md)

---

## Framework Selection

**Agent Question**:
> "Select JavaScript framework:"

**Options**:
```
□ Next.js (full-stack React framework)
□ Express.js (Node.js API framework)
□ React + Vite (SPA)
□ Vue.js + Vite
```

---

## Next.js Configuration

### Project Setup

```bash
npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app
```

### Authentication

**Options**:
- NextAuth.js (recommended)
- Clerk
- Auth0
- Custom JWT

**NextAuth.js Installation**:
```bash
npm install next-auth
```

**Configuration** (`app/api/auth/[...nextauth]/route.ts`):
```typescript
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
})

export { handler as GET, handler as POST }
```

### Database (Prisma ORM)

```bash
npm install @prisma/client
npm install -D prisma

npx prisma init
```

**Configuration** (`prisma/schema.prisma`):
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

### Testing

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
```

---

## Express.js Configuration

### Project Setup

```bash
mkdir my-api && cd my-api
npm init -y
npm install express
npm install typescript @types/node @types/express -D
npx tsc --init
```

### Authentication (JWT)

```bash
npm install jsonwebtoken bcrypt
npm install @types/jsonwebtoken @types/bcrypt -D
```

**Example** (`auth.ts`):
```typescript
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### Database (Sequelize or TypeORM)

```bash
npm install sequelize pg pg-hstore
npm install @types/sequelize -D
```

### API Documentation (Swagger)

```bash
npm install swagger-jsdoc swagger-ui-express
npm install @types/swagger-jsdoc @types/swagger-ui-express -D
```

---

## Package Recommendations

### All JavaScript Projects

```bash
# Code quality
npm install -D eslint prettier
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Testing
npm install -D jest @types/jest
npm install -D @testing-library/react @testing-library/jest-dom

# Environment
npm install dotenv

# Pre-commit
npm install -D husky lint-staged
npx husky install
```

---

## Configuration Summary

```markdown
## 🔧 JavaScript Project Configuration

### Framework
- **Type**: [Next.js/Express/React/Vue]
- **TypeScript**: [Yes/No]

### Authentication
- **Method**: [NextAuth/JWT/Clerk/Auth0]
- **Social Login**: [Google/GitHub/etc.]

### Database
- **Type**: [PostgreSQL/MySQL/MongoDB/Supabase]
- **ORM**: [Prisma/Sequelize/TypeORM]

### Testing
- **Unit**: Jest
- **Integration**: Jest + Supertest
- **E2E**: Playwright

### Code Quality
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript
```

---

## Next Steps

1. ✅ Proceed to [Git Repository Setup](../phases/git-repository-setup.md)
2. ✅ Configure [Pre-commit Hooks](../phases/pre-commit-hooks-setup.md)
3. ✅ Initialize [Task Management](../phases/task-management-setup.md)

---

*See [Project Use-Case Scenarios](../project-use-case-scenarios.md) for detailed configurations.*
