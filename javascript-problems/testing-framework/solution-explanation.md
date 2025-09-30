# Testing Framework Solution - Step-by-Step Explanation

## Overview

This solution implements a basic testing framework using nested try-catch blocks and custom error objects to propagate failure information up through the test hierarchy (describe → it → expect).

## Architecture Design

### **Error Propagation Strategy**

The solution uses a **two-tier error handling** approach:

1. **expect functions**: Throw error message strings
2. **it function**: Catches strings, wraps in object with testCaseName, re-throws
3. **describe function**: Catches enriched error object, logs complete failure message

### **Execution Flow**

- Normal flow: Each level logs success after child completes
- Error flow: Exception bubbles up, stopping execution at each level
- Only first failure is reported (execution stops immediately)

## Step-by-Step Breakdown

### 1. **Test Suite Function (describe)**

```javascript
function describe(testSuiteName, func) {
  console.log(`beginning test suite ${testSuiteName}`);
  try {
    func();
    console.log(`successfully completed test suite ${testSuiteName}`);
  } catch (error) {
    console.error(
      `failed running test suite ${testSuiteName} on test case ${error.testCaseName} with error message ${error.errorMessage}`
    );
  }
}
```

**Responsibilities:**

- Logs suite start message
- Executes callback containing it() calls
- Catches enriched error object from it()
- Logs either success or detailed failure message
- Stops execution on first failure (no further it() calls run)

**Error Object Structure:**

```javascript
{
  testCaseName: "Failing Test Case",
  errorMessage: "expected true to be false"
}
```

### 2. **Test Case Function (it)**

```javascript
function it(testCaseName, func) {
  console.log(`beginning test case ${testCaseName}`);
  try {
    func();
    console.log(`successfully completed test case ${testCaseName}`);
  } catch (errorMessage) {
    throw { testCaseName, errorMessage };
  }
}
```

**Responsibilities:**

- Logs test case start message
- Executes callback containing expect() calls
- Catches error message string from expect()
- **Enriches error** by adding testCaseName
- Re-throws as object for describe() to catch
- Stops execution on first failed expectation

**Error Transformation:**

- **Input**: String like `"expected true to be false"`
- **Output**: Object `{testCaseName: "...", errorMessage: "..."}`

### 3. **Assertion Function (expect)**

```javascript
function expect(actual) {
  const toExist = () => {
    if (actual == null) {
      throw `expected value to exist but got ${JSON.stringify(actual)}`;
    }
  };

  const toBe = (expected) => {
    if (actual !== expected) {
      throw `expected ${JSON.stringify(actual)} to be ${JSON.stringify(
        expected
      )}`;
    }
  };

  const toBeType = (type) => {
    const typeOfActual = typeof actual;
    if (typeOfActual !== type) {
      throw `expected ${JSON.stringify(
        actual
      )} to be of type ${type} but got ${typeOfActual}`;
    }
  };

  return { toExist, toBe, toBeType };
}
```

**Design Pattern: Closure-based API**

- `actual` captured in closure, available to all assertion methods
- Returns object with three assertion functions
- Each function throws formatted error string on failure
- Uses `JSON.stringify()` to format values in messages

**Assertion Methods:**

#### **toExist()**

- Checks: `actual == null` (catches both null and undefined)
- Throws: `"expected value to exist but got null"` or `"got undefined"`

#### **toBe(expected)**

- Checks: `actual !== expected` (strict inequality)
- Throws: `"expected {actual} to be {expected}"`
- Both values stringified for consistent formatting

#### **toBeType(type)**

- Checks: `typeof actual !== type`
- Throws: `"expected {actual} to be of type {type} but got {actualType}"`
- Captures actual type for informative error message

## Execution Flow Examples

### **Passing Test Suite**

```
describe starts → logs "beginning test suite..."
  ↓
it("Test #1") starts → logs "beginning test case..."
  ↓
expect("foo").toExist() → check passes, no throw
  ↓
expect(1+1).toBe(2) → check passes, no throw
  ↓
it("Test #1") completes → logs "successfully completed test case..."
  ↓
it("Test #2") starts → logs "beginning test case..."
  ↓
expect({}).toBeType('object') → check passes
  ↓
it("Test #2") completes → logs success
  ↓
describe completes → logs "successfully completed test suite..."
```

### **Failing Test Suite**

```
describe starts → logs "beginning test suite..."
  ↓
it("Passing Test Case") → all checks pass → logs success
  ↓
it("Failing Test Case") starts → logs "beginning test case..."
  ↓
expect(true).toBe(true) → passes
  ↓
expect(true).toBe(false) → FAILS
  ↓
throws "expected true to be false"
  ↓
it catches string, wraps it: {testCaseName: "Failing Test Case", errorMessage: "..."}
  ↓
it re-throws object
  ↓
describe catches object
  ↓
describe logs: "failed running test suite... on test case Failing Test Case with error message..."
  ↓
EXECUTION STOPS (Unreachable Test Case never runs)
```

## Key Implementation Details

### **Error Message Formatting**

- All lowercase except testSuiteName/testCaseName
- Values stringified with `JSON.stringify()`
- No punctuation in messages
- Exact format matching required for tests

### **Null Checking Strategy**

Uses `actual == null` instead of `actual === null || actual === undefined`:

```javascript
null == null; // true
undefined == null; // true (loose equality)
0 == null; // false
"" == null; // false
false == null; // false
```

### **Type Checking**

- Uses `typeof` operator
- Stores result before comparison for error message
- Handles all JavaScript types (string, number, object, function, etc.)

### **Execution Stopping**

- Exceptions naturally stop execution flow
- No need for manual flags or state tracking
- Try-catch blocks at each level handle their responsibilities

## Design Patterns Used

### **Nested Try-Catch Hierarchy**

- Each level has specific responsibility
- Errors enriched as they bubble up
- Clean separation of concerns

### **Closure for State Capture**

- `actual` value captured in expect() closure
- Available to all returned assertion methods
- Enables clean API: `expect(value).toBe(other)`

### **Factory Function Pattern**

- `expect()` returns object with methods
- Each call creates fresh closure
- Enables method chaining style

This solution elegantly handles test execution, error propagation, and formatted output using JavaScript's exception handling and closure mechanics.
