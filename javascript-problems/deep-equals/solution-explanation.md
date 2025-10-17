# Deep Equals Solution - Step-by-Step Explanation

## Overview

This solution implements a recursive deep equality checker that compares two values of any type. The key challenge is handling JavaScript's complex type system, including primitives, arrays, objects, and special values like `NaN`, `null`, and `undefined`. The algorithm uses type checking and recursion to traverse nested structures.

## Implementation Strategy

### **Core Approach: Recursive Type-Based Comparison**

The solution uses a cascading series of checks:

1. **Type validation** → Ensure both values have the same type
2. **Primitive comparison** → Handle simple values (numbers, strings, booleans)
3. **Special value handling** → Deal with `NaN`, `null`, `undefined`
4. **Array comparison** → Recursively compare array elements
5. **Object comparison** → Recursively compare object keys and values

This approach handles all JavaScript value types while maintaining correctness for edge cases.

---

## Step-by-Step Breakdown

### **1. Type Checking (Guard Clause)**

```javascript
/**
 * First check: Ensure both values have the same type
 * If types differ, they cannot be equal
 */
if (typeof valueOne !== typeof valueTwo) {
  return false;
}
```

**Purpose:** Quickly reject values of different types.

**How `typeof` works:**

```javascript
typeof 42; // "number"
typeof "hello"; // "string"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof null; // "object" (JavaScript quirk!)
typeof []; // "object"
typeof {}; // "object"
typeof function () {}; // "function"
```

**Example Scenarios:**

```javascript
// Scenario 1: Different primitive types
deepEquals(1, '1')
typeof 1 !== typeof '1'  // "number" !== "string"
→ return false ✓

// Scenario 2: Number vs object
deepEquals(42, {value: 42})
typeof 42 !== typeof {}  // "number" !== "object"
→ return false ✓

// Scenario 3: Same types (continue to next checks)
deepEquals(5, 10)
typeof 5 === typeof 10  // "number" === "number"
→ Continue to next check
```

**Key Point:** This early return prevents unnecessary processing for obviously unequal values.

---

### **2. Primitive Value Comparison**

```javascript
/**
 * Second check: Handle non-object types (primitives)
 * Objects, arrays, and null are all typeof "object", so this handles:
 * - numbers, strings, booleans, undefined, functions
 */
if (typeof valueOne !== "object") {
  // Special case: NaN is not equal to itself using ===
  // Number.isNaN() checks if a value is actually NaN
  if (Number.isNaN(valueOne) && Number.isNaN(valueTwo)) {
    return true;
  }

  // For all other primitives, use strict equality
  return valueOne === valueTwo;
}
```

**Purpose:** Compare primitive values and handle the special `NaN` case.

**Why `NaN` needs special handling:**

```javascript
// JavaScript quirk: NaN is not equal to itself
NaN === NaN; // false ❌

// Our function should treat NaN as equal to NaN
deepEquals(NaN, NaN); // true ✓

// Number.isNaN() correctly identifies NaN
Number.isNaN(NaN); // true
Number.isNaN(5); // false
Number.isNaN("hello"); // false (doesn't coerce like isNaN())
```

**Example Scenarios:**

```javascript
// Scenario 1: NaN comparison
deepEquals(NaN, NaN)
typeof NaN === typeof NaN  // "number" === "number" ✓
typeof NaN !== "object"    // true (it's a number)
Number.isNaN(NaN) && Number.isNaN(NaN)  // true && true
→ return true ✓

// Scenario 2: Regular numbers
deepEquals(42, 42)
typeof 42 !== "object"  // true
Number.isNaN(42) && Number.isNaN(42)  // false (not NaN)
42 === 42  // true
→ return true ✓

// Scenario 3: Different numbers
deepEquals(5, 10)
typeof 5 !== "object"  // true
5 === 10  // false
→ return false ✓

// Scenario 4: Strings
deepEquals("hello", "hello")
typeof "hello" !== "object"  // true
"hello" === "hello"  // true
→ return true ✓
```

**Key Points:**

- `Number.isNaN()` is used instead of `isNaN()` because it doesn't coerce
- For other primitives, strict equality (`===`) works correctly

---

### **3. Null Handling**

```javascript
/**
 * Third check: Handle null values
 * typeof null === "object" (JavaScript quirk), so we need special handling
 * null is only equal to null
 */
if (valueOne === null || valueTwo === null) {
  return valueOne === valueTwo;
}
```

**Purpose:** Handle `null` before processing objects/arrays.

**Why this is necessary:**

```javascript
typeof null; // "object" ⚠️ JavaScript quirk!

// Without this check, null would be processed as an object
// which would cause errors when trying to access properties
```

**Example Scenarios:**

```javascript
// Scenario 1: Both null
deepEquals(null, null)
valueOne === null || valueTwo === null  // true
valueOne === valueTwo  // null === null → true
→ return true ✓

// Scenario 2: null vs undefined
deepEquals(null, undefined)
valueOne === null || valueTwo === null  // true
valueOne === valueTwo  // null === undefined → false
→ return false ✓

// Scenario 3: null vs object
deepEquals(null, {})
valueOne === null || valueTwo === null  // true
valueOne === valueTwo  // null === {} → false
→ return false ✓

// Scenario 4: Neither is null (continue)
deepEquals({a: 1}, {a: 1})
valueOne === null || valueTwo === null  // false
→ Continue to next check
```

---

### **4. Reference Equality Check**

```javascript
/**
 * Fourth check: Check if values are the exact same reference
 * If they point to the same object in memory, they're equal
 * This is an optimization that avoids deep comparison when unnecessary
 */
if (valueOne === valueTwo) {
  return true;
}
```

**Purpose:** Optimization for when both values reference the same object.

**How reference equality works:**

```javascript
const obj = { a: 1, b: 2 };
const ref1 = obj;
const ref2 = obj;
const obj2 = { a: 1, b: 2 };

ref1 === ref2; // true (same reference)
obj === obj2; // false (different objects, even with same content)
```

**Example Scenarios:**

```javascript
// Scenario 1: Same object reference
const myObj = {name: "Alice"};
deepEquals(myObj, myObj)
valueOne === valueTwo  // true (same reference)
→ return true ✓ (skip deep comparison)

// Scenario 2: Different objects (continue to deep comparison)
deepEquals({a: 1}, {a: 1})
valueOne === valueTwo  // false (different objects)
→ Continue to next check

// Scenario 3: Same array reference
const myArr = [1, 2, 3];
deepEquals(myArr, myArr)
valueOne === valueTwo  // true
→ return true ✓
```

**Key Point:** This optimization saves time by avoiding deep comparison when we already know the values are equal.

---

### **5. Array Comparison**

```javascript
/**
 * Fifth check: Handle arrays
 * Arrays are objects in JavaScript, so we need to check if both are arrays
 * If both are arrays, compare length and recursively compare each element
 */
if (Array.isArray(valueOne) && Array.isArray(valueTwo)) {
  // Arrays must have the same length to be equal
  if (valueOne.length !== valueTwo.length) {
    return false;
  }

  // Recursively compare each element
  // Elements must be deeply equal in the same order
  for (let i = 0; i < valueOne.length; i++) {
    if (!deepEquals(valueOne[i], valueTwo[i])) {
      return false;
    }
  }

  // All elements are equal
  return true;
}
```

**Purpose:** Recursively compare array elements.

**Algorithm:**

1. Check if both are arrays
2. Compare lengths (quick rejection if different)
3. Loop through each index
4. Recursively call `deepEquals()` on each pair of elements
5. If any pair is not equal, return false
6. If all pairs are equal, return true

**Example Scenarios:**

```javascript
// Scenario 1: Simple arrays
deepEquals([1, 2, 3], [1, 2, 3])
Array.isArray(valueOne) && Array.isArray(valueTwo)  // true
valueOne.length === valueTwo.length  // 3 === 3 ✓

Loop:
i=0: deepEquals(1, 1) → true ✓
i=1: deepEquals(2, 2) → true ✓
i=2: deepEquals(3, 3) → true ✓

→ return true ✓

// Scenario 2: Different lengths
deepEquals([1, 2], [1, 2, 3])
Array.isArray(both)  // true
valueOne.length !== valueTwo.length  // 2 !== 3
→ return false ✓

// Scenario 3: Nested arrays
deepEquals([1, [2, 3]], [1, [2, 3]])
Array.isArray(both)  // true
Length check: 2 === 2 ✓

Loop:
i=0: deepEquals(1, 1) → true ✓
i=1: deepEquals([2, 3], [2, 3])
       ↓ Recursive call
       Array check: true
       Length: 2 === 2 ✓
       Loop:
         i=0: deepEquals(2, 2) → true ✓
         i=1: deepEquals(3, 3) → true ✓
       → return true
     → true ✓

→ return true ✓

// Scenario 4: Nested with difference
deepEquals([1, [2, 3]], [1, [2, 4]])
Loop:
i=0: deepEquals(1, 1) → true ✓
i=1: deepEquals([2, 3], [2, 4])
       ↓ Recursive call
       Loop:
         i=1: deepEquals(3, 4) → false ✗
       → return false
     → false

→ return false ✓
```

**Recursion Tree Example:**

```
deepEquals([1, [2, [3, 4]]], [1, [2, [3, 4]]])
│
├─ i=0: deepEquals(1, 1)
│       → true (primitive)
│
└─ i=1: deepEquals([2, [3, 4]], [2, [3, 4]])
        │
        ├─ i=0: deepEquals(2, 2)
        │       → true (primitive)
        │
        └─ i=1: deepEquals([3, 4], [3, 4])
                │
                ├─ i=0: deepEquals(3, 3)
                │       → true (primitive)
                │
                └─ i=1: deepEquals(4, 4)
                        → true (primitive)
                → true
        → true
→ true
```

---

### **6. Array/Object Type Mismatch Check**

```javascript
/**
 * Sixth check: Ensure we don't compare array to non-array object
 * At this point, at most one value is an array
 * If either is an array, they can't be equal (one is array, one is object)
 */
if (Array.isArray(valueOne) || Array.isArray(valueTwo)) {
  return false;
}
```

**Purpose:** Prevent comparing an array to a plain object.

**Why this check is needed:**

```javascript
// Arrays are objects in JavaScript
typeof []; // "object"
typeof {}; // "object"

// But they should not be considered equal
Array.isArray([]); // true
Array.isArray({}); // false
```

**Logic Flow:**

```
At this point in the code:
- Both values have typeof "object"
- Neither is null
- They're not the same reference

If we reach this check:
- Either both are arrays (handled above)
- Or both are plain objects (will handle next)
- Or one is array, one is plain object (THIS CHECK)
```

**Example Scenarios:**

```javascript
// Scenario 1: Array vs object
deepEquals([1, 2], {0: 1, 1: 2})
Array.isArray([1, 2]) || Array.isArray({0: 1, 1: 2})
true || false → true
→ return false ✓

// Scenario 2: Both arrays (already handled)
deepEquals([1, 2], [1, 2])
// Previous array check handles this

// Scenario 3: Both objects (continue)
deepEquals({a: 1}, {a: 1})
Array.isArray({a: 1}) || Array.isArray({a: 1})
false || false → false
→ Continue to object comparison
```

---

### **7. Object Comparison**

```javascript
/**
 * Final check: Handle plain objects
 * At this point, both values are plain objects (not arrays, not null)
 * Compare their keys and recursively compare their values
 */

// Get all keys from both objects
const valueOneKeys = Object.keys(valueOne);
const valueTwoKeys = Object.keys(valueTwo);

// Objects must have the same number of keys
if (valueOneKeys.length !== valueTwoKeys.length) {
  return false;
}

// Check that all keys exist in both objects and values are equal
for (const key of valueOneKeys) {
  // Check if the key exists in the second object
  if (!valueTwoKeys.includes(key)) {
    return false;
  }

  // Recursively compare the values for this key
  if (!deepEquals(valueOne[key], valueTwo[key])) {
    return false;
  }
}

// All keys and values match
return true;
```

**Purpose:** Recursively compare object keys and values.

**Algorithm:**

1. Extract all keys from both objects
2. Compare key counts (quick rejection)
3. For each key in object 1:
   - Check if it exists in object 2
   - Recursively compare the values
4. If all keys and values match, return true

**How `Object.keys()` works:**

```javascript
Object.keys({ a: 1, b: 2, c: 3 }); // ["a", "b", "c"]
Object.keys({}); // []
Object.keys({ name: "Alice", age: 30 }); // ["name", "age"]
```

**Example Scenarios:**

```javascript
// Scenario 1: Simple objects
deepEquals({a: 1, b: 2}, {a: 1, b: 2})

valueOneKeys = ["a", "b"]
valueTwoKeys = ["a", "b"]
Length check: 2 === 2 ✓

Loop:
key="a": valueTwoKeys.includes("a") → true ✓
         deepEquals(1, 1) → true ✓
key="b": valueTwoKeys.includes("b") → true ✓
         deepEquals(2, 2) → true ✓

→ return true ✓

// Scenario 2: Different key counts
deepEquals({a: 1, b: 2}, {a: 1})

valueOneKeys.length !== valueTwoKeys.length  // 2 !== 1
→ return false ✓

// Scenario 3: Missing key
deepEquals({a: 1, b: 2}, {a: 1, c: 2})

Length check: 2 === 2 ✓

Loop:
key="a": valueTwoKeys.includes("a") → true ✓
         deepEquals(1, 1) → true ✓
key="b": valueTwoKeys.includes("b") → false ✗
→ return false ✓

// Scenario 4: Different values
deepEquals({a: 1, b: 2}, {a: 1, b: 3})

Loop:
key="a": deepEquals(1, 1) → true ✓
key="b": deepEquals(2, 3) → false ✗
→ return false ✓

// Scenario 5: Different key order (should still be equal)
deepEquals({a: 1, b: 2}, {b: 2, a: 1})

valueOneKeys = ["a", "b"]
valueTwoKeys = ["b", "a"]
Length: 2 === 2 ✓

Loop:
key="a": valueTwoKeys.includes("a") → true ✓
         deepEquals(1, 1) → true ✓
key="b": valueTwoKeys.includes("b") → true ✓
         deepEquals(2, 2) → true ✓

→ return true ✓ (order doesn't matter!)
```

**Nested Object Example:**

```javascript
deepEquals(
  {a: 1, b: {c: 2, d: 3}},
  {a: 1, b: {c: 2, d: 3}}
)

Loop:
key="a": deepEquals(1, 1) → true ✓

key="b": deepEquals({c: 2, d: 3}, {c: 2, d: 3})
           ↓ Recursive call
           valueOneKeys = ["c", "d"]
           valueTwoKeys = ["c", "d"]
           Length: 2 === 2 ✓

           Loop:
           key="c": deepEquals(2, 2) → true ✓
           key="d": deepEquals(3, 3) → true ✓

           → return true
         → true ✓

→ return true ✓
```

## Key Concepts Explained

### **1. Cascading Checks (Early Returns)**

The function uses a series of checks that return early when possible:

```
Start
  ↓
Different types? → return false
  ↓
Primitive? → compare with === (handle NaN special case)
  ↓
Null? → compare with ===
  ↓
Same reference? → return true
  ↓
Both arrays? → recursively compare elements
  ↓
Array vs object? → return false
  ↓
Both objects → recursively compare keys/values
```

**Benefits:**

- ✓ Faster execution (avoids unnecessary checks)
- ✓ Clearer logic flow
- ✓ Handles edge cases early

---

### **2. Recursion for Nested Structures**

The function calls itself to handle nested arrays and objects:

```javascript
// Example: Deeply nested structure
deepEquals(
  {a: [1, {b: [2, 3]}]},
  {a: [1, {b: [2, 3]}]}
)

// Call stack:
deepEquals(obj1, obj2)                    // Level 1: Objects
  → deepEquals([1, {b: [2, 3]}], [...])   // Level 2: Arrays
    → deepEquals(1, 1)                    // Level 3: Primitives
    → deepEquals({b: [2, 3]}, {...})      // Level 3: Objects
      → deepEquals([2, 3], [2, 3])        // Level 4: Arrays
        → deepEquals(2, 2)                // Level 5: Primitives
        → deepEquals(3, 3)                // Level 5: Primitives
```

---

### **3. JavaScript Type System Quirks**

The solution carefully handles JavaScript's unusual type system:

```javascript
// Quirk 1: typeof null
typeof null; // "object" ❌ (should be "null")

// Quirk 2: typeof array
typeof []; // "object" (arrays are objects)

// Quirk 3: NaN equality
NaN === NaN; // false ❌ (only value not equal to itself)

// Quirk 4: Number coercion
isNaN("hello"); // true (coerces to NaN)
Number.isNaN("hello"); // false (doesn't coerce) ✓
```

---

### **4. Array vs Object Distinction**

Why we need `Array.isArray()`:

```javascript
typeof []; // "object"
typeof {}; // "object"

// Can't distinguish with typeof alone!

Array.isArray([]); // true
Array.isArray({}); // false

// Also checks for array-like objects
Array.isArray({ 0: "a", 1: "b", length: 2 }); // false (not a real array)
Array.isArray(["a", "b"]); // true
```

---

### **5. Object Key Order Irrelevance**

Objects are equal regardless of key order:

```javascript
deepEquals({ a: 1, b: 2 }, { b: 2, a: 1 }); // true ✓

// This works because we check for key existence:
valueOneKeys = ["a", "b"];
for (key of ["a", "b"]) {
  valueTwoKeys.includes(key); // Checks if key exists (order doesn't matter)
}
```

---

## Edge Cases Handled

### **Edge Case 1: NaN Comparison**

```javascript
deepEquals(NaN, NaN); // true ✓
deepEquals(NaN, 5); // false ✓

// Without special handling:
NaN === NaN; // false ❌
```

---

### **Edge Case 2: null vs undefined**

```javascript
deepEquals(null, null); // true ✓
deepEquals(undefined, undefined); // true ✓
deepEquals(null, undefined); // false ✓
```

---

### **Edge Case 3: Empty Arrays and Objects**

```javascript
deepEquals([], []); // true ✓
deepEquals({}, {}); // true ✓
deepEquals([], {}); // false ✓
```

---

### **Edge Case 4: Nested Structures**

```javascript
deepEquals([1, 2, [3, { a: 4 }]], [1, 2, [3, { a: 4 }]]); // true ✓

deepEquals({ a: { b: { c: { d: 1 } } } }, { a: { b: { c: { d: 1 } } } }); // true ✓
```

---

### **Edge Case 5: Different Types with Same Values**

```javascript
deepEquals(1, "1"); // false ✓ (number vs string)
deepEquals(true, 1); // false ✓ (boolean vs number)
deepEquals([1], { 0: 1 }); // false ✓ (array vs object)
```

---

## Performance Considerations

### **Time Complexity**

```
Best case: O(1)
- Different types or primitives

Average/Worst case: O(n)
- n = total number of values to compare (including nested)

For objects/arrays:
- Must visit every key/element
- Recursive calls for nested structures
```

### **Space Complexity**

```
O(d)
```
