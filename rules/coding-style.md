# Coding Style Rules

**These rules are ALWAYS enforced. No exceptions.**

## General Principles

- **Readability over cleverness** - Code is read more than written
- **Consistency** - Follow existing patterns in the codebase
- **Simplicity** - Minimal complexity for the task
- **DRY** - Don't Repeat Yourself (but don't over-abstract)

## Naming Conventions

```
# Variables: descriptive, camelCase or snake_case (match project)
userEmail        # ✅ Clear
ue               # ❌ Cryptic

# Functions: verb + noun, describes action
getUserById()    # ✅ Clear
getData()        # ❌ Too vague
process()        # ❌ What does it process?

# Booleans: is/has/can/should prefix
isActive         # ✅ Clear it's boolean
active           # ❌ Could be anything

# Constants: UPPER_SNAKE_CASE
MAX_RETRY_COUNT  # ✅
maxRetries       # ❌
```

## Code Organization

```
# File structure
1. Imports/dependencies
2. Constants/configuration
3. Types/interfaces
4. Main class/function
5. Helper functions
6. Exports

# Function length
- Under 20 lines preferred
- Under 50 lines maximum
- If longer, extract methods

# Class length
- Under 200 lines preferred
- Under 400 lines maximum
- If longer, extract classes
```

## Immutability & Pure Functions

```javascript
// ✅ PREFER: Pure functions
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ AVOID: Side effects
function calculateTotal(items) {
  let total = 0;
  items.forEach(item => {
    total += item.price;
    item.processed = true;  // Side effect!
  });
  return total;
}

// ✅ PREFER: Immutable updates
const newUser = { ...user, name: 'New Name' };

// ❌ AVOID: Mutations
user.name = 'New Name';
```

## Error Handling

```
// ✅ ALWAYS: Specific error handling
try {
  await saveUser(user);
} catch (error) {
  if (error instanceof ValidationError) {
    return { status: 400, message: error.message };
  }
  if (error instanceof DatabaseError) {
    logger.error('Database error', error);
    return { status: 500, message: 'Internal error' };
  }
  throw error;  // Re-throw unknown errors
}

// ❌ NEVER: Swallowing errors
try {
  await saveUser(user);
} catch (error) {
  // Silent failure
}
```

## Comments

```
// ✅ GOOD: Explain WHY, not WHAT
// Using retry with backoff because the API has rate limits
await retryWithBackoff(() => callApi());

// ❌ BAD: Obvious comments
// Loop through users
users.forEach(user => {

// ❌ BAD: Commented-out code (delete it)
// const oldImplementation = () => { ... }
```

## Code Smells to AVOID

| Smell | Fix |
|-------|-----|
| Magic numbers | Use named constants |
| Deep nesting | Early returns, extract functions |
| Long parameter lists | Use parameter objects |
| Duplicate code | Extract shared functions |
| Dead code | Delete it |
| Global state | Use dependency injection |
