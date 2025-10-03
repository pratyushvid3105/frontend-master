# Array Methods Solution - Step-by-Step Explanation

## Overview

This solution implements three fundamental array methods by directly adding them to the Array prototype. Each method uses a basic for loop to iterate through the array and applies callback logic without relying on native higher-order array methods.

## Implementation Strategy

### **Prototype Extension Pattern**

All three methods are added to `Array.prototype`, making them available on all array instances:

```javascript
Array.prototype.myMap = function(callback) { ... }
```

The `this` keyword inside these methods refers to the array instance they're called on.

## Step-by-Step Breakdown

### 1. **myMap Implementation**

```javascript
Array.prototype.myMap = function (callback) {
  const newArr = [];
  for (let i = 0; i < this.length; i++) {
    newArr.push(callback(this[i], i, this));
  }
  return newArr;
};
```

**Purpose:** Transform each element and return new array with results

**Algorithm:**

1. Create empty result array
2. Loop through original array (`this`)
3. Call callback with: current value, index, entire array
4. Push callback result to new array
5. Return transformed array

**Example Execution:**

```javascript
[1, 2, 3].myMap(item => item * 2)

i=0: callback(1, 0, [1,2,3]) → 2 → newArr = [2]
i=1: callback(2, 1, [1,2,3]) → 4 → newArr = [2, 4]
i=2: callback(3, 2, [1,2,3]) → 6 → newArr = [2, 4, 6]
return [2, 4, 6]
```

**Key Points:**

- Creates new array (no mutation)
- Always returns array same length as original
- Callback return value becomes element in new array

### 2. **myFilter Implementation**

```javascript
Array.prototype.myFilter = function (callback) {
  const newArr = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this) === true) {
      newArr.push(this[i]);
    }
  }
  return newArr;
};
```

**Purpose:** Keep only elements that pass callback test

**Algorithm:**

1. Create empty result array
2. Loop through original array
3. Call callback with: current value, index, entire array
4. If callback returns `true`, add **original value** to result
5. Return filtered array

**Example Execution:**

```javascript
[1, 2, 3].myFilter(item => item > 2)

i=0: callback(1, 0, [1,2,3]) → false → skip
i=1: callback(2, 1, [1,2,3]) → false → skip
i=2: callback(3, 2, [1,2,3]) → true → newArr = [3]
return [3]
```

**Key Points:**

- Only adds elements where callback returns `true`
- Pushes **original values**, not callback results
- Result array typically shorter than original
- Uses strict equality check (`=== true`)

### 3. **myReduce Implementation**

```javascript
Array.prototype.myReduce = function (callback, initialValue) {
  if (this.length === 0) {
    return initialValue;
  }
  let accumulator = initialValue;
  let startingIndex = 0;
  if (accumulator == null) {
    accumulator = this[0];
    startingIndex = 1;
  }
  for (let i = startingIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }
  return accumulator;
};
```

**Purpose:** Reduce array to single value through iterative callback application

**Algorithm:**

1. **Empty array check:** If array has no elements, return initialValue
2. **Accumulator setup:**
   - If initialValue provided: use it, start at index 0
   - If initialValue is undefined/null: use first element, start at index 1
3. **Loop and accumulate:**
   - Call callback with: accumulator, current value, index, array
   - Store callback result back into accumulator
4. Return final accumulator value

**Example Execution with initialValue:**

```javascript
[1, 2, 3].myReduce((acc, item) => acc + item, 0)

Setup: accumulator = 0, startingIndex = 0
i=0: callback(0, 1, 0, [1,2,3]) → 1 → accumulator = 1
i=1: callback(1, 2, 1, [1,2,3]) → 3 → accumulator = 3
i=2: callback(3, 3, 2, [1,2,3]) → 6 → accumulator = 6
return 6
```

**Example Execution without initialValue:**

```javascript
[1, 2, 3].myReduce((acc, item) => acc + item)

Setup: accumulator = 1 (first element), startingIndex = 1
i=1: callback(1, 2, 1, [1,2,3]) → 3 → accumulator = 3
i=2: callback(3, 3, 2, [1,2,3]) → 6 → accumulator = 6
return 6
```

**Key Points:**

- Most complex of the three methods
- Special handling for undefined initialValue
- Uses loose equality (`== null`) to catch both null and undefined
- Empty array returns initialValue (differs slightly from native reduce)
- Accumulator is updated with each callback result

## Critical Implementation Details

### **The `this` Keyword**

In prototype methods, `this` refers to the array instance:

```javascript
[1, 2, 3].myMap(...)  // this = [1, 2, 3]
```

### **Callback Parameter Patterns**

All methods pass similar parameters to callbacks:

- **value**: Current element being processed
- **index**: Current position in array
- **array**: The entire array (allows callbacks to reference other elements)

### **No Mutation**

All methods create and return new arrays/values without modifying `this`:

```javascript
const original = [1, 2, 3];
const mapped = original.myMap((x) => x * 2);
// original is still [1, 2, 3]
```

### **Loop Simplicity**

Using basic for loops (not forEach) as required:

- Direct index access: `this[i]`
- Manual iteration control
- Explicit length checking

## Comparison with Native Methods

| Aspect      | Implementation                    | Native Equivalent                |
| ----------- | --------------------------------- | -------------------------------- |
| Map         | Returns array of callback results | Array.prototype.map()            |
| Filter      | Returns array of passing elements | Array.prototype.filter()         |
| Reduce      | Returns single accumulated value  | Array.prototype.reduce()         |
| Empty Array | myReduce returns initialValue     | Native throws if no initialValue |

## Edge Cases Handled

### **myMap & myFilter:**

- Empty arrays: Returns empty array `[]`
- Callback never called on empty arrays

### **myReduce:**

- Empty array with initialValue: Returns initialValue
- Empty array without initialValue: Returns undefined
- Single element with no initialValue: Returns that element without calling callback
- Null vs undefined initialValue: Both treated as "not provided"

This implementation provides a solid understanding of how array iteration methods work under the hood, using only basic JavaScript control flow.
