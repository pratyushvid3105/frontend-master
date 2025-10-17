# Promises Solution - Step-by-Step Explanation

## Overview

This solution implements a custom Promise class that mimics JavaScript's native Promise behavior. The key challenges include managing asynchronous state transitions, maintaining callback queues, implementing chainable methods, and ensuring callbacks execute as microtasks. This implementation uses private class fields and the `queueMicrotask()` API to achieve Promise-like behavior.

## Implementation Strategy

### **Core Approach: State Machine with Callback Queues**

The solution uses:

1. **State management** → Track promise state (pending, fulfilled, rejected)
2. **Callback queues** → Store callbacks waiting for state resolution
3. **Microtask scheduling** → Ensure callbacks run asynchronously
4. **Method chaining** → Return new promises from `then` and `catch`
5. **Error handling** → Catch and propagate errors through the chain

This approach replicates native Promise behavior while maintaining clean, understandable code.

---

## Part 1: State Constants and Private Fields

### **1.1 State Constants**

```javascript
// Define all possible promise states as constants
// This prevents typos and makes code more maintainable
const STATE = {
  PENDING: "pending", // Initial state, not yet settled
  FULFILLED: "fulfilled", // Successfully resolved
  REJECTED: "rejected", // Rejected with an error/value
};
```

**Purpose:** Define the three possible states a promise can be in.

**Why use constants:**

- Prevents typos (e.g., "fullfilled" vs "fulfilled")
- Centralized state management
- Easy to refactor if needed
- Better IDE autocomplete

---

### **1.2 Private Class Fields**

```javascript
class MyPromise {
  // Private field: stores the resolved/rejected value
  // Initially null for pending promises
  #value = null;

  // Private field: tracks current promise state
  // Starts as pending, transitions to fulfilled or rejected
  #state = STATE.PENDING;

  // Private field: queue of callbacks to run when promise fulfills
  // Each entry is a function to execute when resolve() is called
  #fulfilledCallbacks = [];

  // Private field: queue of callbacks to run when promise rejects
  // Each entry is a function to execute when reject() is called
  #rejectedCallbacks = [];
```

**Purpose:** Store internal promise state using private fields.

**Private Fields (# syntax):**

- Cannot be accessed outside the class
- Ensures encapsulation
- Prevents external code from manipulating internal state

**Field Explanations:**

- **`#value`**: The final value of the promise (result or error)
- **`#state`**: Current state (pending → fulfilled/rejected)
- **`#fulfilledCallbacks`**: Functions waiting for success
- **`#rejectedCallbacks`**: Functions waiting for failure

**Example State Evolution:**

```javascript
// Initial state
#value = null
#state = "pending"
#fulfilledCallbacks = []
#rejectedCallbacks = []

// After resolve(42)
#value = 42
#state = "fulfilled"
#fulfilledCallbacks = [] // Emptied after execution

// After reject("error")
#value = "error"
#state = "rejected"
#rejectedCallbacks = [] // Emptied after execution
```

---

## Part 2: Private Resolution Methods

### **2.1 Resolve Method**

```javascript
/**
 * Private method to resolve the promise
 * Sets the value, updates state, and executes all queued fulfilled callbacks
 * @param {*} value - The value to resolve the promise with
 */
#resolve(value) {
  // Step 1: Store the resolved value
  // This will be accessible via the .value getter
  this.#value = value;

  // Step 2: Update state to fulfilled
  // Promise is now settled and can never change state again
  this.#state = STATE.FULFILLED;

  // Step 3: Execute all queued fulfilled callbacks
  // forEach calls each callback function in the array
  // These callbacks were registered by .then() calls
  this.#fulfilledCallbacks.forEach((callback) => callback());
}
```

**Purpose:** Transition promise from pending to fulfilled state.

**Algorithm:**

1. Store the resolution value
2. Change state to "fulfilled"
3. Execute all callbacks waiting for fulfillment

**Example Execution:**

```javascript
// Promise created
const p = new MyPromise((resolve, reject) => {
  setTimeout(() => resolve(42), 1000);
});

// .then() called while still pending
p.then(val => console.log(val));
// Callback added to #fulfilledCallbacks queue

// After 1 second, resolve(42) called:
#resolve(42)
  ↓
#value = 42
#state = "fulfilled"
#fulfilledCallbacks.forEach(cb => cb())
  ↓
Callback executes: console.log(42)
```

**Key Points:**

- Callbacks execute immediately upon resolution
- Callbacks are removed from queue after execution
- State transition is irreversible

---

### **2.2 Reject Method**

```javascript
/**
 * Private method to reject the promise
 * Sets the error value, updates state, and executes all queued rejected callbacks
 * @param {*} value - The error/reason to reject the promise with
 */
#reject(value) {
  // Step 1: Store the rejection value (error or any value)
  // This will be accessible via the .value getter
  this.#value = value;

  // Step 2: Update state to rejected
  // Promise is now settled and can never change state again
  this.#state = STATE.REJECTED;

  // Step 3: Execute all queued rejected callbacks
  // forEach calls each callback function in the array
  // These callbacks were registered by .then() or .catch() calls
  this.#rejectedCallbacks.forEach((callback) => callback());
}
```

**Purpose:** Transition promise from pending to rejected state.

**Algorithm:**

1. Store the rejection value
2. Change state to "rejected"
3. Execute all callbacks waiting for rejection

**Example Execution:**

```javascript
const p = new MyPromise((resolve, reject) => {
  setTimeout(() => reject("Network error"), 1000);
});

p.catch(err => console.log("Error:", err));
// Callback added to #rejectedCallbacks queue

// After 1 second, reject("Network error") called:
#reject("Network error")
  ↓
#value = "Network error"
#state = "rejected"
#rejectedCallbacks.forEach(cb => cb())
  ↓
Callback executes: console.log("Error:", "Network error")
```

---

## Part 3: Constructor

```javascript
/**
 * Constructor that creates a new MyPromise
 * Executes the provided function immediately with resolve/reject callbacks
 * @param {Function} executorFunc - Function that receives (resolve, reject)
 */
constructor(executorFunc) {
  // Wrap executor in try-catch to handle errors
  // If executor throws, promise should be automatically rejected
  try {
    // Execute the provided function immediately (synchronously)
    // Pass two callback functions as arguments:
    // 1. (val) => this.#resolve(val) - for resolving the promise
    // 2. (val) => this.#reject(val) - for rejecting the promise
    executorFunc(
      (val) => this.#resolve(val),  // resolve callback
      (val) => this.#reject(val)    // reject callback
    );
  } catch (error) {
    // If executor throws an error, automatically reject the promise
    // This mimics native Promise behavior
    this.#reject(error);
  }
}
```

**Purpose:** Initialize the promise and execute the executor function.

**Algorithm:**

1. Wrap executor in try-catch
2. Call executor with resolve and reject callbacks
3. If executor throws, automatically reject promise

**Flow Diagram:**

```
new MyPromise((res, rej) => {...})
        ↓
constructor(executorFunc)
        ↓
try {
  executorFunc(
    (val) => this.#resolve(val),
    (val) => this.#reject(val)
  )
}
        ↓
    Executor runs immediately
        ↓
    ├─ res(value) called → #resolve(value)
    ├─ rej(error) called → #reject(error)
    └─ throws error → catch block → #reject(error)
```

**Example Scenarios:**

```javascript
// Scenario 1: Immediate resolve
new MyPromise((resolve, reject) => {
  resolve(42);
});
// resolve(42) → #resolve(42) → state = "fulfilled", value = 42

// Scenario 2: Immediate reject
new MyPromise((resolve, reject) => {
  reject("error");
});
// reject("error") → #reject("error") → state = "rejected", value = "error"

// Scenario 3: Async resolve
new MyPromise((resolve, reject) => {
  setTimeout(() => resolve(100), 1000);
});
// Constructor completes, promise remains pending
// After 1 second: resolve(100) → #resolve(100)

// Scenario 4: Executor throws error
new MyPromise((resolve, reject) => {
  throw new Error("Oops!");
});
// Error thrown → catch block → #reject(Error("Oops!"))
```

**Key Points:**

- Executor runs synchronously (immediately)
- Callbacks passed to executor are bound to the promise instance
- Errors in executor automatically reject the promise
- Promise state cannot change after first resolution/rejection

---

## Part 4: The `then` Method

### **4.1 Method Signature and Return Value**

```javascript
/**
 * Registers callbacks for fulfilled and/or rejected states
 * Returns a new MyPromise for chaining
 * @param {Function} onFulfilled - Callback for fulfilled state
 * @param {Function} onRejected - Callback for rejected state
 * @returns {MyPromise} New promise resolving to callback's return value
 */
then(onFulfilled, onRejected) {
  // Return a new MyPromise for chaining
  // This new promise will resolve/reject based on the callbacks
  return new MyPromise((resolve, reject) => {
```

**Purpose:** Register callbacks and return new promise for chaining.

**Why return new promise:**

- Enables chaining: `.then().then().catch()`
- Each step can transform the value
- Errors can propagate down the chain

---

### **4.2 Fulfilled Handler**

```javascript
// Define handler for when promise is fulfilled
// This function will be called when #resolve() is called
const handleOnFullfill = () => {
  // If no fulfilled callback provided, pass value to next promise
  // This allows chaining like: promise.then().then(val => ...)
  if (!onFulfilled) {
    return resolve(this.#value);
  }

  // Use queueMicrotask to run callback asynchronously
  // This ensures callbacks run after current call stack completes
  // Mimics native Promise microtask behavior
  queueMicrotask(() => {
    try {
      // Call the fulfilled callback with the promise value
      // Resolve the new promise with the callback's return value
      resolve(onFulfilled(this.#value));
    } catch (error) {
      // If callback throws, reject the new promise with the error
      // This allows errors to propagate down the chain
      reject(error);
    }
  });
};
```

**Purpose:** Handle fulfilled state, call onFulfilled callback, manage return value.

**Algorithm:**

1. Check if onFulfilled exists
   - If not: resolve new promise with current value
   - If yes: continue
2. Queue callback as microtask
3. Execute callback with current value
4. Resolve new promise with callback's return value
5. If callback throws, reject new promise

**Example Execution:**

```javascript
promise.then(val => val * 2)

// When promise resolves with 10:
handleOnFullfill()
  ↓
onFulfilled exists? Yes
  ↓
queueMicrotask(() => {
  onFulfilled(10)  // Returns 20
  resolve(20)      // New promise resolves with 20
})
```

**Microtask Behavior:**

```javascript
console.log("1");
promise.then((val) => console.log("3"));
console.log("2");

// Output:
// 1
// 2
// 3  ← Runs after current stack completes
```

---

### **4.3 Rejected Handler**

```javascript
// Define handler for when promise is rejected
// This function will be called when #reject() is called
const handleOnRejected = () => {
  // If no rejected callback provided, reject next promise with same value
  // This allows errors to propagate: promise.then().catch(err => ...)
  if (!onRejected) {
    return reject(this.#value);
  }

  // Use queueMicrotask to run callback asynchronously
  // This ensures callbacks run after current call stack completes
  queueMicrotask(() => {
    try {
      // Call the rejected callback with the error value
      // NOTE: Resolve (not reject) the new promise with callback's return
      // This allows recovery from errors in the chain
      resolve(onRejected(this.#value));
    } catch (error) {
      // If callback throws, reject the new promise with the new error
      reject(error);
    }
  });
};
```

**Purpose:** Handle rejected state, call onRejected callback, manage error recovery.

**Key Difference from handleOnFullfill:**

- Successful onRejected execution **resolves** the new promise
- This allows error recovery in promise chains

**Example: Error Recovery**

```javascript
promise
  .then((val) => {
    throw "Error!"; // Rejects promise
  })
  .then(
    (val) => console.log("Won't run"),
    (err) => {
      console.log("Caught:", err);
      return "Recovered"; // Resolves promise with "Recovered"
    }
  )
  .then((val) => console.log(val)); // Logs: "Recovered"
```

---

### **4.4 State-Based Execution**

```javascript
    // Determine what to do based on current promise state
    switch (this.#state) {
      case "pending":
        // Promise not yet settled
        // Add handlers to queues to be called when promise settles
        this.#fulfilledCallbacks.push(handleOnFullfill);
        this.#rejectedCallbacks.push(handleOnRejected);
        break;

      case "fulfilled":
        // Promise already fulfilled
        // Execute fulfilled handler immediately
        handleOnFullfill();
        break;

      case "rejected":
        // Promise already rejected
        // Execute rejected handler immediately
        handleOnRejected();
        break;

      default:
        // Should never happen, but good practice to handle
        throw new Error("Unexpected Promise State");
    }
  });  // End of new MyPromise
}  // End of then method
```

**Purpose:** Execute callbacks immediately if settled, or queue them if pending.

**State Decision Logic:**

```
.then() called
    ↓
Check promise state
    ↓
  ├─ PENDING → Add to queues (will execute when resolved)
  ├─ FULFILLED → Execute handleOnFullfill immediately
  └─ REJECTED → Execute handleOnRejected immediately
```

**Example Scenarios:**

```javascript
// Scenario 1: .then() called on pending promise
const p = new MyPromise((res) => {
  setTimeout(() => res(10), 1000);
});
p.then((val) => console.log(val));
// State: pending → Add to #fulfilledCallbacks queue
// After 1 second: resolve(10) → callbacks execute

// Scenario 2: .then() called on fulfilled promise
const p2 = new MyPromise((res) => res(20));
p2.then((val) => console.log(val));
// State: fulfilled → Execute handleOnFullfill immediately

// Scenario 3: Multiple .then() calls
const p3 = new MyPromise((res) => res(30));
p3.then((val) => console.log(val + 1));
p3.then((val) => console.log(val + 2));
// Both handlers execute in order: 31, 32
```

---

## Part 5: The `catch` Method

```javascript
/**
 * Registers callback for rejected state only
 * Shorthand for .then(null, onRejected)
 * @param {Function} onRejected - Callback for rejected state
 * @returns {MyPromise} New promise resolving to callback's return value
 */
catch(onRejected) {
  // Delegate to .then() with null as the fulfilled handler
  // This is exactly how native Promise.catch() works
  return this.then(null, onRejected);
}
```

**Purpose:** Provide syntactic sugar for handling rejections.

**How it works:**

```javascript
promise.catch((err) => console.log(err));

// Is equivalent to:
promise.then(null, (err) => console.log(err));
```

**Example Usage:**

```javascript
promise
  .then((val) => {
    if (val < 0) throw "Negative!";
    return val;
  })
  .catch((err) => {
    console.log("Error:", err);
    return 0; // Recover with default value
  })
  .then((val) => console.log("Final:", val));
```

---

## Part 6: Getter Methods

```javascript
/**
 * Public getter for promise state
 * Allows external code to check if promise is pending/fulfilled/rejected
 * @returns {string} Current state ("pending", "fulfilled", or "rejected")
 */
get state() {
  return this.#state;
}

/**
 * Public getter for promise value
 * Returns the resolved/rejected value, or null if pending
 * @returns {*} The promise value
 */
get value() {
  return this.#value;
}
```

**Purpose:** Provide read-only access to internal state and value.

**Usage Examples:**

```javascript
const p = new MyPromise((res) => {
  setTimeout(() => res(42), 1000);
});

console.log(p.state); // "pending"
console.log(p.value); // null

// After 1 second:
console.log(p.state); // "fulfilled"
console.log(p.value); // 42
```

## Key Concepts Explained

### **1. Microtask Queue**

Promises use the microtask queue, not the regular task queue:

```javascript
console.log("1");

new MyPromise((res) => res()).then(() => console.log("3"));

console.log("2");

// Output: 1, 2, 3
// Microtasks run after current stack, before next task
```
