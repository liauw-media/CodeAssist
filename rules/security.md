# Security Rules

**These rules are ALWAYS enforced. No exceptions.**

## Secrets & Credentials

- **NEVER hardcode secrets** - Use environment variables or secret managers
- **NEVER commit** `.env`, `credentials.json`, API keys, or tokens
- **NEVER log** passwords, tokens, or sensitive data
- **ALWAYS use** `.env.example` with placeholder values

## Input Validation

- **ALWAYS sanitize** user input before use
- **ALWAYS parameterize** SQL queries - no string concatenation
- **ALWAYS escape** output to prevent XSS
- **ALWAYS validate** file uploads (type, size, content)

## Authentication & Authorization

- **ALWAYS hash** passwords (bcrypt/argon2, never MD5/SHA1)
- **ALWAYS use** HTTPS for sensitive operations
- **ALWAYS implement** rate limiting on auth endpoints
- **ALWAYS check** permissions before data access

## Dependencies

- **NEVER use** known vulnerable package versions
- **ALWAYS audit** dependencies before adding
- **ALWAYS keep** dependencies updated

## Code Patterns to REJECT

```python
# REJECT: Hardcoded secrets
api_key = "sk-1234567890"              # WRONG
api_key = environ.get("API_KEY")       # CORRECT

# REJECT: SQL injection risk
query = f"SELECT * FROM users WHERE id = {user_id}"   # WRONG
query = "SELECT * FROM users WHERE id = %s"            # CORRECT

# REJECT: Command injection risk
# Never pass user input to shell commands
# Use subprocess with explicit argument lists instead

# REJECT: Weak crypto
hashlib.md5(password)                  # WRONG - weak hash
bcrypt.hashpw(password, salt)          # CORRECT - strong hash
```

## When Violations Are Found

1. **STOP** the current operation
2. **REPORT** the security issue immediately
3. **FIX** before proceeding
4. **NEVER** commit insecure code "to fix later"
