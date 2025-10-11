# Promise Methods Solution - Step-by-Step Explanation

## Overview

This solution implements four Promise utility functions that combine or monitor multiple Promises. Each has distinct logic for when to resolve/reject based on different settlement patterns.

## Key Concepts

### **Promise Settlement**

A Promise settles when it either:

- **Resolves**: Completes successfully with a value
- **Rejects**: Fails with an error

### **First vs All vs Any**

- **Race**: First to settle (resolve OR reject)
- **Any**: First to resolve (ignores rejections)
- **All**: All to resolve (stops on first rejection)
- **AllSettled**: All to settle (waits for all, regardless of outcome)

## Step-by-Step Breakdown

### 1. **myRace Implementation**

```javascript
Promise.myRace = function (promises) {
  return new Promise((res, rej) => {
    promises.forEach((promise) => {
      promise.then(res).catch(rej);
    });
  });
};
```

**Logic:**

- Attach handlers to every Promise
- First to settle (resolve or reject) wins
- Returns immediately upon first settlement

**How it works:**

```javascript
myRace([
  delay(500), // Settles at 500ms
  delay(1000), // Settles at 1000ms
]);
// Returns first settling Promise's result at 500ms
```

**Key Point:** No deduplication needed - first settlement automatically resolves/rejects the returned Promise

---

### 2. **myAny Implementation**

```javascript
Promise.myAny = function (promises) {
  return new Promise((res, rej) => {
    promises.forEach((promise, index) => {
      promise.then(res).catch((err) => {
        if (index === promises.length - 1) {
          rej("all promises rejected");
        }
      });
    });
  });
};
```

**Logic:**

- First resolution wins (reject handlers don't resolve)
- Only reject if ALL Promises reject

**Key Differences from myRace:**

- `.then(res)` resolves (same as myRace)
- `.catch()` checks if this was the LAST rejection
- Only rejects if no Promise resolved

**Example:**

```javascript
myAny([
  Promise.reject(1), // Rejected
  Promise.reject(2), // Rejected
  Promise.resolve(3), // Resolved → triggers res(3)
]);
// Returns 3 (doesn't care about rejections)
```

---

### 3. **myAll Implementation**

```javascript
Promise.myAll = function (promises) {
  return new Promise((res, rej) => {
    let resolvedValues = new Array(promises.length);
    let resolvedCount = 0;
    promises.forEach((promise, index) => {
      promise.then((val) => {
        resolvedValues[index] = val;
        resolvedCount += 1;
        if (resolvedCount === promises.length) {
          res(resolvedValues);
        }
      }, rej);
    });
  });
};
```

**Core Strategy:**

1. Create array to hold values in order
2. Track count of resolved Promises
3. Resolve only when ALL have resolved

**Key Features:**

- `resolvedValues[index] = val`: Preserves order (not settlement order)
- `resolvedCount` tracks progress
- Second parameter to `.then()` is rejection handler
- Any rejection immediately rejects

**Example:**

```javascript
myAll([
  delay(500, 0), // Resolves at 500ms
  Promise.resolve(5), // Resolves immediately
  delay(1000, 10), // Resolves at 1000ms
]);
// Returns [0, 5, 10] at 1000ms (waits for all)
// Order is input order, not resolution order
```

---

### 4. **myAllSettled Implementation**

```javascript
Promise.myAllSettled = function (promises) {
  return new Promise((res, _) => {
    const resolvedValues = [];
    let resolvedCount = 0;
    promises.forEach((promise, index) => {
      promise
        .then((val) => {
          resolvedValues[index] = { status: "fulfilled", value: val };
        })
        .catch((err) => {
          resolvedValues[index] = { status: "rejected", error: err };
        })
        .finally(() => {
          resolvedCount += 1;
          if (resolvedCount === promises.length) {
            res(resolvedValues);
          }
        });
    });
  });
};
```

**Core Strategy:**

1. Wait for ALL Promises to settle
2. Capture both fulfillment and rejection
3. Return status objects for each

**Key Features:**

- `.finally()` runs regardless of outcome
- Creates object with `status` and value/error
- Never rejects (always resolves with array)
- Second parameter `_` indicates rejection is ignored

**Example:**

```javascript
myAllSettled([Promise.resolve(0), Promise.reject(5), Promise.resolve(10)])[
  // Returns:
  ({ status: "fulfilled", value: 0 },
  { status: "rejected", error: 5 },
  { status: "fulfilled", value: 10 })
];
```

## Comparison Table

| Method       | Resolves on   | Rejects on   | Returns              |
| ------------ | ------------- | ------------ | -------------------- |
| myRace       | First settle  | First settle | Settled value        |
| myAny        | First resolve | All reject   | First value          |
| myAll        | All resolve   | First reject | All values array     |
| myAllSettled | All settle    | Never        | Status objects array |

## Execution Timing

### **myRace Example**

```
Promise 1: settles at 500ms
Promise 2: settles at 1000ms
Result: Returns at 500ms (first settler)
```

### **myAll Example**

```
Promise 1: settles at 500ms
Promise 2: settles immediately
Promise 3: settles at 1000ms
Result: Returns at 1000ms (waits for all)
```

### **myAny Example**

```
Promise 1: rejects at 500ms
Promise 2: resolves at 1000ms
Result: Returns at 1000ms (first resolution, ignores rejection)
```

### **myAllSettled Example**

```
Promise 1: settles at 500ms
Promise 2: settles at 200ms
Promise 3: settles at 1000ms
Result: Returns at 1000ms (waits for all)
Array order: [result of promise 1, result of promise 2, result of promise 3]
```

## Key Implementation Details

### **1. Preserving Order**

All methods preserve the original array order, not settlement order:

```javascript
resolvedValues[index] = val; // Store at original index
```

### **2. Early Rejection**

myAll rejects immediately on first rejection:

```javascript
promise.then((val) => { ... }, rej); // rej is rejection handler
```

### **3. Finally Handler**

myAllSettled uses `.finally()` to detect completion:

```javascript
.finally(() => {
  resolvedCount += 1;
  // Runs for both resolution and rejection
})
```

### **4. Rejection Handling**

- **myRace**: Propagates first rejection
- **myAny**: Ignores rejections until all are rejected
- **myAll**: Propagates first rejection immediately
- **myAllSettled**: Never rejects, captures rejections as status

## Real-World Use Cases

### **myRace**: First to finish wins

```javascript
Promise.race([fetchFromServer1(), fetchFromServer2(), fetchFromServer3()]);
// Uses fastest server response
```

### **myAny**: Find first successful

```javascript
Promise.any([tryDNS1(), tryDNS2(), tryDNS3()]);
// Uses first working DNS
```

### **myAll**: Parallel dependencies

```javascript
Promise.all([loadCSS(), loadJS(), loadImages()]);
// Starts all in parallel, waits for all
```

### **myAllSettled**: Monitor all outcomes

```javascript
Promise.allSettled([sendEmail1(), sendEmail2(), sendEmail3()]);
// Know which emails succeeded/failed
```

This implementation demonstrates deep understanding of Promise mechanics, timing, and state management.
