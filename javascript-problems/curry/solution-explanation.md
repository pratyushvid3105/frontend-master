# Curry Solution - Step-by-Step Explanation

## Overview

This solution implements function currying by accumulating arguments across multiple function calls, returning new functions until no arguments are provided, at which point the callback executes with all accumulated arguments.

## What is Currying?

### **Traditional Function Call**

```javascript
function add(a, b, c) {
  return a + b + c;
}
add(1, 2, 3); // 6
```

### **Curried Function**

```javascript
const curriedAdd = curry(add);
curriedAdd(1)(2)(3); // 6
curriedAdd(1, 2)(3); // 6
curriedAdd(1)(2, 3); // 6
```

**Key Benefit:** Partial application - build functions with pre-filled arguments

## Core Strategy

### **Argument Accumulation**

Collect arguments across multiple function calls, combining them into a single array, then pass to callback when signaled.

### **Termination Signal**

Calling with zero arguments (`()`) signals completion and triggers the callback.

## Step-by-Step Breakdown

### 1. **Main Curry Function**

```javascript
function curry(callback) {
```

**Input:** Any function, regardless of arity (number of parameters)

**Output:** Curried version that accumulates and combines arguments

---

### 2. **Curried Function Definition**

```javascript
function curriedFunc(...args) {
```

**Rest Parameters:** Captures all arguments passed in current call

**Key Points:**

- Called multiple times
- Each call receives new arguments
- Arguments accumulate via closure

---

### 3. **Check if Arguments Provided**

```javascript
if (args.length > 0) {
```

**Two Paths:**

- **Path 1 (args.length > 0):** Return new function for more arguments
- **Path 2 (args.length === 0):** Execute callback with all accumulated arguments

---

### 4. **Return Function for Continuation**

```javascript
return function (...otherArgs) {
```

**Purpose:** Accept more arguments on next call

**Parameters:**

- `...otherArgs`: Arguments from the next function call

---

### 5. **Recursion Terminator - Check for Empty Call**

```javascript
if (otherArgs.length === 0) {
  return callback(...args);
}
```

**Condition:** No arguments passed (user called with `()`)

**Action:** Execute callback with accumulated args

**Why This Works:**

```javascript
curriedSum(1, 2)(3)(); // Last () has length 0
// Triggers callback execution
```

---

### 6. **Recursive Accumulation**

```javascript
return curriedFunc(...args, ...otherArgs);
```

**Purpose:** Combine old and new arguments, return curried function

**Mechanism:**

- Spreads previous args
- Adds new args
- Passes combined args to curriedFunc recursively
- Curried function repeats the process

**Effect:** Arguments accumulate across calls

---

### 7. **Base Case - No Arguments on First Call**

```javascript
if (args.length > 0) {
  // ... (above logic)
} else {
  return callback();
}
```

**Handles:** `curriedSum()` called with no arguments

**Action:** Immediately calls callback with no arguments

## Execution Flow Examples

### **Example 1: curriedSum(1)(2)(3)()**

```
Call 1: curriedSum(1)
─────────────────────
- args = [1]
- args.length > 0 → true
- Returns: function(...otherArgs) { ... }

Call 2: (2)
──────────
- otherArgs = [2]
- otherArgs.length === 0 → false
- Returns: curriedFunc(1, 2)

Call 3: (3)
──────────
- args = [1, 2]
- otherArgs = [3]
- otherArgs.length === 0 → false
- Returns: curriedFunc(1, 2, 3)

Call 4: ()
──────────
- args = [1, 2, 3]
- otherArgs = []
- otherArgs.length === 0 → true
- Executes: callback(1, 2, 3)
- Result: 6
```

### **Example 2: curriedSum(1, 2)(3, 4)()**

```
Call 1: curriedSum(1, 2)
─────────────────────────
- args = [1, 2]
- args.length > 0 → true
- Returns: function(...otherArgs) { ... }

Call 2: (3, 4)
──────────────
- otherArgs = [3, 4]
- otherArgs.length === 0 → false
- Returns: curriedFunc(1, 2, 3, 4)

Call 3: ()
──────────
- args = [1, 2, 3, 4]
- otherArgs = []
- otherArgs.length === 0 → true
- Executes: callback(1, 2, 3, 4)
- Result: 10
```

### **Example 3: curriedSum()**

```
Call 1: curriedSum()
────────────────────
- args = []
- args.length > 0 → false
- Executes: callback()
- Result: 0 (sum of no numbers)
```

### **Example 4: curriedSum(5) - Returns Function**

```
Call 1: curriedSum(5)
──────────────────────
- args = [5]
- args.length > 0 → true
- Returns: function(...otherArgs) { ... }
- No further calls
- Result: [Function]
```

## Key Design Decisions

### **1. Recursion Instead of Loop**

```javascript
// This solution uses recursion:
return curriedFunc(...args, ...otherArgs);

// Could use loop, but recursion is cleaner
// and naturally matches the problem structure
```

### **2. Two Separate Functions**

```javascript
function curry(callback) {
  function curriedFunc(...args) {
    return function(...otherArgs) { ... }
  }
  return curriedFunc;
}
```

**Why Two Functions?**

- `curry`: Sets up the closure with callback reference
- `curriedFunc`: Handles accumulation and recursion
- Allows proper closure scope

### **3. Empty Array Termination**

```javascript
if (otherArgs.length === 0) {
  return callback(...args);
}
```

**Why Check otherArgs, Not args?**

- `otherArgs` represents the current call
- If current call has zero args → user signaled completion
- Even `curriedFunc(1, 2)()` has args=[1,2], otherArgs=[]

### **4. Spread Operators for Combining**

```javascript
return curriedFunc(...args, ...otherArgs);
```

**Why Spread?**

- Merges arrays into flat argument list
- Creates new call with combined arguments
- Maintains proper argument order

## Closure and State Management

```javascript
const curriedSum = curry(sum);

// closure captures: sum, curriedFunc
// Each call maintains reference to original callback

curriedSum(1)(2)(3)();
// (1)(2)(3)(): curriedFunc still has access to sum
// through closure chain
```

## Comparison with Traditional Function

### **Without Currying**

```javascript
sum(1, 2, 3, 4, 5); // Must provide all args at once
```

### **With Currying**

```javascript
const add1 = curriedSum(1);
const add1_2 = add1(2);
const add1_2_3 = add1_2(3);
const result = add1_2_3(4)(5)();
```

**Benefits:**

- Partial application
- Function composition
- Reduced repetition

## Real-World Applications

### **Partial Application**

```javascript
const curriedMultiply = curry((a, b, c) => a * b * c);
const double = curriedMultiply(2);
const result = double(3)(4); // (or double(3, 4))
```

### **Function Composition**

```javascript
const curriedPipe = curry(
  (...fns) =>
    (x) =>
      fns.reduce((acc, fn) => fn(acc), x)
);
```

### **Configuration Functions**

```javascript
const curriedFetch = curry((method, url, options) =>
  fetch(url, { ...options, method })
);
const postRequest = curriedFetch("POST");
const apiCall = postRequest("/api/data");
```

## Edge Cases Handled

### **1. No Arguments Initially**

```javascript
curriedSum(); // Calls callback() → 0
```

### **2. Multiple Arguments Per Call**

```javascript
curriedSum(1, 2)(3, 4)(5)(); // Works perfectly
```

### **3. Mixed Single and Multiple**

```javascript
curriedSum(1)(2, 3)(4, 5, 6)(); // All combinations work
```

### **4. Returning Intermediate Function**

```javascript
curriedSum(1); // Returns function, can store
const partial = curriedSum(1, 2);
partial(3)(); // Call later
```

This implementation demonstrates mastery of closures, recursion, and functional programming patterns in JavaScript.
