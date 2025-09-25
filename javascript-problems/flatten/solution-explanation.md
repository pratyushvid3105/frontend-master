# Flatten Function Solution - Step-by-Step Explanation

## Overview

This solution implements a recursive flattening function that handles primitives, nested arrays, and nested objects according to the problem specifications. The approach uses three specialized functions, each handling a specific data type.

## Architecture Design

### **Function Separation Strategy**

The solution uses a **divide-and-conquer** approach with three functions:

- `flatten()`: Entry point that determines the data type
- `flattenArray()`: Handles array flattening logic
- `flattenPlainObject()`: Handles object flattening logic

This separation provides clear responsibility boundaries and easier debugging.

## Step-by-Step Breakdown

### 1. **Entry Point Function**

```javascript
function flatten(value) {
  if (value !== Object(value)) {
    return value;
  } else if (Array.isArray(value)) {
    return flattenArray(value);
  } else {
    return flattenPlainObject(value);
  }
}
```

**Type Detection Logic:**

- `value !== Object(value)`: Detects primitives (numbers, strings, booleans, null, undefined)
- `Array.isArray(value)`: Identifies arrays specifically
- **Else case**: Assumes remaining values are plain objects

**Key Insight:** `Object(primitive)` returns a wrapped object, so `primitive !== Object(primitive)` is true for all primitives.

### 2. **Array Flattening Function**

```javascript
function flattenArray(value) {
  let flatArray = [];
  value.forEach((el) => {
    if (el !== Object(el)) {
      flatArray.push(el);
    } else if (Array.isArray(el)) {
      flatArray.push(...flattenArray(el));
    } else {
      flatArray.push(flattenPlainObject(el));
    }
  });
  return flatArray;
}
```

**Processing Logic:**

1. **Primitives**: Added directly to result array
2. **Nested Arrays**: Recursively flattened using spread operator
3. **Objects**: Flattened using object function, then added as single element

**Example Flow:**
`[1, [2, {a: 3}]]` → `[1, 2, {a: 3}]`

### 3. **Object Flattening Function**

```javascript
function flattenPlainObject(value) {
  let flatObject = {};
  for (const [objKey, objectValue] of Object.entries(value)) {
    if (objectValue !== Object(objectValue)) {
      flatObject[objKey] = objectValue;
    } else if (Array.isArray(objectValue)) {
      flatObject[objKey] = flattenArray(objectValue);
    } else {
      const flatChildObject = flattenPlainObject(objectValue);
      for (const [ck, cv] of Object.entries(flatChildObject)) {
        flatObject[ck] = cv;
      }
    }
  }
  return flatObject;
}
```

**Key Operations:**

1. **Primitive Values**: Copied directly with same key
2. **Array Values**: Flattened and assigned to same key
3. **Object Values**: Recursively flattened, then keys merged into parent

**Key Merging Process:**

- Child object keys are "promoted" to parent level
- Original nested keys are discarded
- Handles key collisions by last-value-wins

## Data Type Identification

### **Primitive Detection: `value !== Object(value)`**

**How it works:**

- `Object(5)` returns `Number {5}` (wrapped object)
- `5 !== Number {5}` is `true`
- Works for: numbers, strings, booleans, null, undefined

**Examples:**

```javascript
5 !== Object(5)           // true (primitive)
"hi" !== Object("hi")     // true (primitive)
true !== Object(true)     // true (primitive)
[] !== Object([])         // false (object)
{} !== Object({})         // false (object)
```

### **Array vs Object Distinction**

Uses `Array.isArray()` after confirming it's an object to distinguish arrays from plain objects.

## Recursion Strategy

### **Mutual Recursion Pattern**

- `flattenArray()` calls `flattenPlainObject()` for object elements
- `flattenPlainObject()` calls `flattenArray()` for array values
- Both can call themselves for nested structures of same type

### **Base Cases**

- **Primitives**: Returned unchanged (no recursion)
- **Empty Arrays/Objects**: Return empty result
- **Single-level nesting**: Processed without deeper recursion

## Example Walkthrough

### **Complex Input:**

```javascript
{
  a: 1,
  b: {
    c: [2, {d: 3}],
    e: {f: 4}
  }
}
```

### **Processing Steps:**

1. **Entry**: `flatten()` detects object → calls `flattenPlainObject()`
2. **Key 'a'**: Value `1` is primitive → `flatObject['a'] = 1`
3. **Key 'b'**: Value is object → recursive call
4. **Nested 'c'**: Value `[2, {d: 3}]` is array → calls `flattenArray()`
5. **Array processing**: `2` stays, `{d: 3}` becomes `{d: 3}`
6. **Nested 'e'**: Value `{f: 4}` flattened to `{f: 4}`
7. **Key merging**: `c` and `f` promoted to top level
8. **Result**: `{a: 1, c: [2, {d: 3}], f: 4}`

## Algorithm Complexity

### **Time Complexity**

- **O(n)** where n is total number of elements/properties across all nesting levels
- Each element/property visited exactly once

### **Space Complexity**

- **O(d)** for recursion stack depth d
- **O(n)** for result storage
- Additional space for intermediate objects during processing

## Edge Cases Handled

### **Key Collisions**

```javascript
{a: 1, b: {a: 2}} → {a: 2}  // Last value wins
```

### **Empty Structures**

```javascript
[]     → []
{}     → {}
[[]]   → []
{a: {}} → {}
```

### **Mixed Nesting**

```javascript
{a: [1, {b: 2}]} → {a: [1, {b: 2}]}  // Array flattened, object inside preserved
```

This solution correctly implements all the flattening rules while maintaining clean separation of concerns and efficient recursive processing.
