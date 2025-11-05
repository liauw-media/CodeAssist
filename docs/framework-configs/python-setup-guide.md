# Python Project Setup Guide

*Framework-specific configuration for Python/Django/FastAPI projects*

---

## Overview

This guide covers Python-specific setup for Django and FastAPI projects, including authentication, database choices, testing, and API documentation.

**Related Documents**:
- [Project Use-Case Scenarios](../project-use-case-scenarios.md#python-projects)
- [Development Tooling Guide](../development-tooling-guide.md)

---

## Framework Selection

**Agent Question**:
> "Select Python framework:"

**Options**:
```
□ Django (full-featured web framework, admin panel, ORM)
□ FastAPI (modern, fast API framework with auto-docs)
□ Flask (lightweight, flexible microframework)
```

---

## Django Configuration

### Authentication

**Options**:
- Django Auth (built-in, session-based)
- Django-allauth (social authentication)
- Django REST Framework + JWT
- django-rest-auth

**Installation**:
```bash
pip install django psycopg2-binary
pip install django-allauth
pip install djangorestframework djangorestframework-simplejwt
```

### Database

**Configuration** (`settings.py`):
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mydb',
        'USER': 'myuser',
        'PASSWORD': 'mypassword',
        'HOST': 'localhost',  # or Supabase host
        'PORT': '5432',
    }
}
```

### Testing

```bash
pip install pytest pytest-django pytest-cov
```

**Configuration** (`pytest.ini`):
```ini
[pytest]
DJANGO_SETTINGS_MODULE = myproject.settings
python_files = test_*.py *_test.py
addopts = --cov=myapp --cov-report=html
```

---

## FastAPI Configuration

### Project Setup

```bash
pip install fastapi uvicorn[standard]
pip install sqlalchemy psycopg2-binary
pip install python-jose[cryptography] passlib[bcrypt]
pip install pytest pytest-asyncio
```

### Authentication (JWT)

```python
# auth.py
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from jose import JWTError, jwt

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### API Documentation

**Built-in**: FastAPI auto-generates OpenAPI/Swagger docs

**Access**:
- Swagger UI: `/docs`
- ReDoc: `/redoc`
- OpenAPI JSON: `/openapi.json`

---

## Package Recommendations

### All Python Projects

```bash
# Code quality
pip install black flake8 mypy
pip install pylint

# Testing
pip install pytest pytest-cov

# Environment
pip install python-dotenv

# Pre-commit
pip install pre-commit
```

---

## Configuration Summary

```markdown
## 🔧 Python Project Configuration

### Framework
- **Type**: [Django/FastAPI/Flask]
- **Version**: [Latest stable]

### Authentication
- **Method**: [Django Auth/JWT/OAuth]
- **Social Login**: [django-allauth/OAuth]

### Database
- **Type**: [PostgreSQL/MySQL/SQLite]
- **ORM**: [Django ORM/SQLAlchemy]

### Testing
- **Framework**: pytest
- **Coverage**: pytest-cov
- **Async**: pytest-asyncio (FastAPI)

### Code Quality
- **Linting**: flake8, pylint
- **Formatting**: black
- **Type Checking**: mypy
```

---

## Next Steps

1. ✅ Proceed to [Git Repository Setup](../phases/git-repository-setup.md)
2. ✅ Configure [Pre-commit Hooks](../phases/pre-commit-hooks-setup.md)
3. ✅ Initialize [Task Management](../phases/task-management-setup.md)

---

*See [Project Use-Case Scenarios](../project-use-case-scenarios.md) for detailed configurations.*
