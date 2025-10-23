# Memoize Solution - Step-by-Step Explanation

## Overview

This solution implements a **memoization** utility that caches function results to avoid redundant computations. Memoization is an optimization technique where expensive function calls are cached based on their input arguments. The key challenges include generating appropriate cache keys, managing the cache with utility methods, and supporting custom cache key resolution.

## Implementation Strategy

### **Core Approach: Cache with Flexible Key Generation**

The solution uses:

1. **Map for caching** → Store results with fast O(1) lookup
2. **Flexible key generation** → Support default JSON stringification or custom resolver
3. **Closure pattern** → Maintain private cache accessible by returned function
4. **Method attachment** → Add clear, delete, and has methods to memoized function
5. **Rest parameters** → Handle variable number of arguments

This approach provides efficient caching while maintaining flexibility for different use cases.

---

## Step-by-Step Breakdown

### **1. Cache Initialization**

```javascript
/**
 * Creates a memoized version of a callback function
 * Caches results based on arguments to avoid redundant computations
 * @param {Function} callback - The function to memoize
 * @param {Function} resolver - Optional custom cache key resolver
 * @returns {Function} Memoized function with cache methods
 */
function memoize(callback, resolver) {
  // Initialize cache as a Map for efficient key-value storage
  // Map is preferred over plain objects because:
  // - Keys can be any type (not just strings)
  // - Better performance for frequent additions/deletions
  // - Has built-in size property
  // - No prototype pollution issues
  let cache = new Map();
```

**Purpose:** Set up the cache data structure.

**Why Map instead of Object:**

```javascript
// Map advantages:
const map = new Map();
map.set({ a: 1 }, "value"); // Objects as keys ✓
map.set(123, "value"); // Numbers as keys ✓
map.size; // Built-in size property ✓
map.clear(); // Built-in clear method ✓

// Object limitations:
const obj = {};
obj[{ a: 1 }] = "value"; // Becomes "[object Object]" ❌
obj[123] = "value"; // Converted to "123" string ❌
Object.keys(obj).length; // Manual size calculation ❌
```

**Example Cache State:**

```javascript
// After some calls:
cache = Map {
  "[123]" => 123,
  "[123,\"abc\"]" => [123, "abc"],
  "custom-key" => result
}
```

---

### **2. Cache Key Generator Function**

```javascript
// Define helper function to generate cache keys
// This function determines how arguments are converted to cache keys
// Uses resolver if provided, otherwise defaults to JSON.stringify
const getCacheKey = (...args) => {
  // Check if custom resolver function was provided
  // != null checks for both undefined and null
  return resolver != null
    ? resolver(...args) // Custom key generation
    : JSON.stringify(args); // Default: stringify arguments array
};
```

**Purpose:** Generate cache keys from function arguments.

**Two Key Generation Strategies:**

**Strategy 1: Default (JSON.stringify)**

```javascript
// When resolver is not provided
getCacheKey(123); // "[123]"
getCacheKey(123, "abc"); // "[123,\"abc\"]"
getCacheKey({ a: 1 }); // "[{\"a\":1}]"

// How it works:
JSON.stringify([123]); // "[123]"
JSON.stringify([123, "abc"]); // "[123,\"abc\"]"
```

**Strategy 2: Custom Resolver**

```javascript
// When custom resolver is provided
const resolver = (args) => args[0]; // Use first argument only

getCacheKey(123, "abc"); // 123 (first arg)
getCacheKey("abc", 123); // 'abc' (first arg)

// Different resolver examples:
const resolver1 = (args) => args.join("-");
getCacheKey(1, 2, 3); // "1-2-3"

const resolver2 = (args) => args.reduce((a, b) => a + b);
getCacheKey(1, 2, 3); // 6
```

**Why != null instead of !== undefined:**

```javascript
resolver != null; // Checks for both undefined and null
// true if resolver is defined
// false if resolver is undefined or null

resolver !== undefined; // Only checks undefined
// Doesn't handle null case
```

---

### **3. Memoized Function Implementation**

```javascript
// Create the memoized function that will be returned
// This function wraps the original callback with caching logic
// Uses rest parameters to accept any number of arguments
function memoisedFunction(...args) {
  // Step 1: Generate cache key from arguments
  // This key is used to check if result is already cached
  const cacheKey = getCacheKey(...args);

  // Step 2: Check if result is already in cache
  // cache.has() checks if key exists in Map
  if (cache.has(cacheKey)) {
    // Cache hit! Return cached value without calling callback
    // This is the optimization - we skip expensive computation
    return cache.get(cacheKey);
  }

  // Step 3: Cache miss - compute result
  // Call the original callback with all arguments
  // Spread operator passes arguments individually
  const result = callback(...args);

  // Step 4: Store result in cache for future calls
  // cache.set(key, value) adds entry to Map
  cache.set(cacheKey, result);

  // Step 5: Return the computed result
  return result;
}
```

**Purpose:** Main memoized function that implements caching logic.

**Algorithm:**

1. Generate cache key from arguments
2. Check if key exists in cache
   - If yes: Return cached value (cache hit)
   - If no: Continue
3. Call original callback function
4. Store result in cache
5. Return result

**Flow Diagram:**

```
memoisedFunction(123) called
        ↓
Generate cache key: "[123]"
        ↓
Check cache: cache.has("[123]")?
        ↓
    YES → Return cache.get("[123]") (FAST PATH)
        ↓
    NO → Call callback(123)
        ↓
    Store: cache.set("[123]", result)
        ↓
    Return result
```

**Example Execution:**

```javascript
const callback = (...args) => {
  console.log("Computing...");
  return args;
};
const memoized = memoize(callback);

// First call:
memoized(123);
// Generate key: "[123]"
// cache.has("[123]")? false
// Call callback(123) → logs "Computing..."
// cache.set("[123]", 123)
// Return 123

// Second call (same arguments):
memoized(123);
// Generate key: "[123]"
// cache.has("[123]")? true ✓
// Return cache.get("[123]") → 123 (no log!)

// Third call (different arguments):
memoized(456);
// Generate key: "[456]"
// cache.has("[456]")? false
// Call callback(456) → logs "Computing..."
// cache.set("[456]", 456)
// Return 456
```

**Key Points:**

- First call with new arguments: Cache miss, compute result
- Subsequent calls with same arguments: Cache hit, return instantly
- Different arguments: Different cache key, compute again

---

### **4. Clear Method**

```javascript
// Add clear method to memoized function
// This method completely empties the cache
// Useful for resetting memoization or freeing memory
memoisedFunction.clear = () => {
  // Map.clear() removes all entries from the Map
  // After this, all subsequent calls will recompute
  cache.clear();
};
```

**Purpose:** Remove all entries from the cache.

**How it works:**

```javascript
const memoized = memoize(callback);

// Build up cache:
memoized(1); // cache: Map { "[1]" => 1 }
memoized(2); // cache: Map { "[1]" => 1, "[2]" => 2 }
memoized(3); // cache: Map { "[1]" => 1, "[2]" => 2, "[3]" => 3 }

// Clear cache:
memoized.clear();
// cache: Map {} (empty)

// Next call recomputes:
memoized(1); // Calls callback again, cache: Map { "[1]" => 1 }
```

**Use Cases:**

- Memory management (clear old cached results)
- Reset memoization state
- Testing (start with clean state)

---

### **5. Delete Method**

```javascript
// Add delete method to memoized function
// This method removes a specific cache entry
// Takes same arguments as memoized function
memoisedFunction.delete = (...otherArgs) => {
  // Step 1: Generate cache key from arguments
  // Uses same getCacheKey function for consistency
  const cacheKey = getCacheKey(...otherArgs);

  // Step 2: Check if entry exists and delete it
  // cache.has() checks existence
  // cache.delete() removes the entry
  if (cache.has(cacheKey)) {
    cache.delete(cacheKey);
  }
};
```

**Purpose:** Remove a specific cache entry for given arguments.

**Algorithm:**

1. Generate cache key from arguments
2. Check if key exists in cache
3. If exists, delete the entry

**Example Usage:**

```javascript
const memoized = memoize(callback);

memoized(123); // cache: { "[123]" => 123 }
memoized(456); // cache: { "[123]" => 123, "[456]" => 456 }

memoized.delete(123); // Remove entry for 123
// cache: { "[456]" => 456 }

memoized(123); // Recomputes (not in cache anymore)
// cache: { "[456]" => 456, "[123]" => 123 }
```

**Why check before delete:**

```javascript
// With check (current implementation):
if (cache.has(cacheKey)) {
  cache.delete(cacheKey);
}
// Safe, won't error if key doesn't exist

// Without check (also works):
cache.delete(cacheKey);
// Map.delete() returns false if key not found (no error)
// But doesn't handle any potential side effects

// The check is defensive programming
```

---

### **6. Has Method**

```javascript
// Add has method to memoized function
// This method checks if a cache entry exists for given arguments
// Returns boolean indicating presence in cache
memoisedFunction.has = (...otherArgs) => {
  // Step 1: Generate cache key from arguments
  const cacheKey = getCacheKey(...otherArgs);

  // Step 2: Check and return boolean
  // cache.has() returns true if key exists, false otherwise
  return cache.has(cacheKey);
};
```

**Purpose:** Check if a cache entry exists for given arguments.

**Why this implementation:**

```javascript
// Current implementation:
memoisedFunction.has = (...otherArgs) => {
  const cacheKey = getCacheKey(...otherArgs);
  return cache.has(cacheKey);
};

// Simplified version (better):
memoisedFunction.has = (...otherArgs) => {
  return cache.has(getCacheKey(...otherArgs));
};

// Even simpler (best):
memoisedFunction.has = (...args) => cache.has(getCacheKey(...args));
```

**Example Usage:**

```javascript
const memoized = memoize(callback);

console.log(memoized.has(123)); // false (not called yet)

memoized(123); // Call function

console.log(memoized.has(123)); // true (now cached)
console.log(memoized.has(456)); // false (not called with 456)
```

---

### **7. Return Memoized Function**

```javascript
  // Return the memoized function with attached methods
  // This function can be called like the original callback
  // But with added caching behavior and utility methods
  return memoisedFunction;
}
```

**Purpose:** Return the memoized function to the caller.

**What gets returned:**

```javascript
// The returned function has:
memoisedFunction(...args); // Main function (with caching)
memoisedFunction.clear(); // Method to clear cache
memoisedFunction.delete(args); // Method to delete specific entry
memoisedFunction.has(args); // Method to check if entry exists
```

---

## Key Concepts Explained

### **1. Memoization Pattern**

Memoization trades **memory for speed**:

```
Without Memoization:
fibonacci(40) → Computes ~2 billion operations
fibonacci(40) → Computes ~2 billion operations again ❌

With Memoization:
fibonacci(40) → Computes ~2 billion operations, caches result
fibonacci(40) → Returns cached result instantly ✓

Trade-off:
+ Faster execution (cached results)
- More memory (storing results)
```

**When to use memoization:**

- ✓ Pure functions (same input → same output)
- ✓ Expensive computations
- ✓ Repeated calls with same arguments
- ✗ Functions with side effects
- ✗ Rarely repeated arguments

---

### **2. Cache Key Generation Strategies**

**Default Strategy (JSON.stringify):**

```javascript
JSON.stringify([1, 2, 3])           // "[1,2,3]"
JSON.stringify([{a: 1}, {b: 2}])    // "[{\"a\":1},{\"b\":2}]"

// Pros:
+ Simple, no extra function needed
+ Works for most primitives and simple objects
+ Deterministic (same args → same key)

// Cons:
- Slow for large/complex objects
- Object property order matters: {a:1, b:2} ≠ {b:2, a:1}
- Circular references cause errors
- Functions become "null"
```

**Custom Resolver:**

```javascript
// Use only first argument:
const resolver = args => args[0];
memoize(fn, resolver);

// Use specific property:
const resolver = args => args[0].id;
memoize(fn, resolver);

// Combine multiple args:
const resolver = args => `${args[0]}-${args[1]}`;
memoize(fn, resolver);

// Pros:
+ Flexible cache key generation
+ Can ignore irrelevant arguments
+ Better performance (simpler keys)

// Cons:
- Must write custom function
- Wrong resolver → incorrect caching
```

---

### **3. Closure and Private Variables**

The `cache` variable is **private** due to closure:

```javascript
function memoize(callback, resolver) {
  let cache = new Map(); // Private variable

  function memoisedFunction(...args) {
    // Can access cache (closure)
    cache.set(key, value);
  }

  return memoisedFunction;
}

const memoized = memoize(fn);
// Cannot access cache directly from outside
console.log(memoized.cache); // undefined ❌

// Can only interact via methods:
memoized.clear(); // ✓
memoized.has(123); // ✓
```

**Benefits of closure pattern:**

- ✓ Encapsulation (cache is private)
- ✓ Data hiding (cannot directly manipulate cache)
- ✓ Clean API (only exposed methods)

---

### **4. Method Attachment to Functions**

Functions are objects in JavaScript, so we can attach properties:

```javascript
function myFunc() {
  return "hello";
}

// Attach methods:
myFunc.clear = () => console.log("cleared");
myFunc.version = "1.0";

// Use function and methods:
myFunc(); // "hello"
myFunc.clear(); // "cleared"
myFunc.version; // "1.0"

// In our memoize:
memoisedFunction.clear = () => cache.clear();
// Now: memoized() calls function, memoized.clear() clears cache
```

---

### **5. Rest Parameters (...args)**

Rest parameters collect all arguments into an array:

```javascript
function example(...args) {
  console.log(args); // Array of all arguments
}

example(1, 2, 3); // [1, 2, 3]
example("a", "b"); // ['a', 'b']
example(); // []

// In memoize:
function memoisedFunction(...args) {
  // args is array of all arguments
  const result = callback(...args); // Spread back out
}

// Equivalent without rest:
function memoisedFunction() {
  const args = Array.from(arguments);
  const result = callback.apply(null, args);
}
```

---

## Complete Usage Examples

### **Example 1: Basic Memoization**

```javascript
// Expensive function
const fibonacci = (n) => {
  console.log(`Computing fib(${n})`);
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

const memoizedFib = memoize(fibonacci);

memoizedFib(5);
// Logs: Computing fib(5), fib(4), fib(3), fib(2), fib(1), fib(0)...
// Returns: 5

memoizedFib(5);
// No logs (cached!)
// Returns: 5 instantly

memoizedFib(6);
// Logs: Computing fib(6) (reuses cached fib(5))
// Returns: 8
```

---

### **Example 2: Custom Resolver**

```javascript
// Function that fetches user data
const getUserData = (userId, options) => {
  console.log(`Fetching user ${userId}`);
  return { id: userId, name: `User${userId}` };
};

// Memoize based on userId only (ignore options)
const memoizedGetUser = memoize(
  getUserData,
  (userId, options) => userId // Only cache by userId
);

memoizedGetUser(1, { detailed: true });
// Logs: Fetching user 1
// Returns: { id: 1, name: "User1" }

memoizedGetUser(1, { detailed: false });
// No log (cached!)
// Returns: { id: 1, name: "User1" }
// Even though options are different, userId is same
```

---

### **Example 3: Using Cache Methods**

```javascript
const callback = (...args) => args.reduce((a, b) => a + b);
const memoized = memoize(callback);

// Build up cache:
memoized(1, 2); // 3 (computed)
memoized(3, 4); // 7 (computed)
memoized(1, 2); // 3 (cached)

// Check cache:
console.log(memoized.has(1, 2)); // true
console.log(memoized.has(5, 6)); // false

// Delete specific entry:
memoized.delete(1, 2);
console.log(memoized.has(1, 2)); // false
memoized(1, 2); // 3 (recomputed)

// Clear entire cache:
memoized.clear();
console.log(memoized.has(3, 4)); // false
```

---

## Performance Analysis

### **Time Complexity**

**Cache Hit (cached result exists):**

- `O(1)` - Map lookup is constant time
- No callback execution

**Cache Miss (computing new result):**

- `O(f)` where f = time to execute callback
- Plus `O(1)` for Map insertion

**Key Generation:**

- Default (JSON.stringify): `O(n)` where n = size of arguments
- Custom resolver: Depends on resolver complexity

---

### **Space Complexity**

**Cache Storage:**

- `O(k × v)` where:
  - k = number of unique argument combinations called
  - v = average size of cached results

**Memory Considerations:**

```javascript
// Problem: Unbounded cache growth
const memoized = memoize(expensiveFunction);

for (let i = 0; i < 1000000; i++) {
  memoized(i); // Caches 1 million results!
}

// Solution 1: Periodic clearing
setInterval(() => memoized.clear(), 60000); // Clear every minute

// Solution 2: LRU cache (not implemented here)
// Evict least recently used entries when cache is full
```

---

## Bug Fix: Original Solution Issues

The provided solution has bugs. Here's the corrected version:

### **Issues in Original:**

```javascript
// Issue 1: Missing cache.has() check
if (cacheKey) {
  // ❌ Wrong! cacheKey is always truthy
  return cache.get(cacheKey);
}

// Issue 2: Not storing result
const result = callback(...args);
return result; // ❌ Never cached!

// Issue 3: has() returns undefined for false case
if (cache.get(cacheKey)) {
  // ❌ Wrong check
  return true;
}
// Returns undefined instead of false
```

### **Corrected Solution:**

```javascript
function memoize(callback, resolver) {
  let cache = new Map();

  const getCacheKey = (...args) => {
    return resolver != null ? resolver(...args) : JSON.stringify(args);
  };

  function memoisedFunction(...args) {
    const cacheKey = getCacheKey(...args);

    // FIX 1: Check if key exists in cache
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    // FIX 2: Store result in cache
    const result = callback(...args);
    cache.set(cacheKey, result);
    return result;
  }

  memoisedFunction.clear = () => {
    cache.clear();
  };

  memoisedFunction.delete = (...otherArgs) => {
    const cacheKey = getCacheKey(...otherArgs);
    cache.delete(cacheKey); // Simplified
  };

  memoisedFunction.has = (...otherArgs) => {
    const cacheKey = getCacheKey(...otherArgs);
    return cache.has(cacheKey); // FIX 3: Return boolean
  };

  return memoisedFunction;
}
```

---

## Summary

The Memoize solution demonstrates:

1. **Caching Pattern:** Store expensive computation results
2. **Closure:** Private cache accessible by returned function
3. **Flexible Key Generation:** Default JSON or custom resolver
4. **Method Attachment:** Add utility methods to functions
5. **Rest/Spread Operators:** Handle variable arguments
6. **Map Data Structure:** Efficient key-value storage

This creates a reusable memoization utility that can optimize any pure function by caching its results, with configurable cache key generation and management methods.
